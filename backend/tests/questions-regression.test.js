import { randomUUID } from "node:crypto";
import pg from "pg";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { getEnvironment } from "../src/config/environment.js";
import { hashToken } from "../src/platform/security/tokens.js";

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ?? "postgresql://prepvi:prepvi@localhost:5432/prepvi";
const ORIGIN = "http://localhost:5173";
const RUN_ID = randomUUID().slice(0, 8);

describe("questions regression (real PostgreSQL)", () => {
  let pool;
  let app;
  const studentUserId = randomUUID();
  const adminUserId = randomUUID();
  const topicId = randomUUID();
  const positionId = randomUUID();
  const questionId = randomUUID();
  const jobDescriptionId = randomUUID();
  const planId = randomUUID();
  const planItemId = randomUUID();
  let studentToken;
  let studentCsrf;
  let adminToken;
  let adminCsrf;

  beforeAll(async () => {
    pool = new pg.Pool({ connectionString: TEST_DATABASE_URL, ssl: false });
    const environment = getEnvironment({
      ...process.env,
      DATABASE_URL: TEST_DATABASE_URL,
      DATABASE_SSL: "false",
      NODE_ENV: "test",
      OPENAPI_VALIDATION: "false",
      AI_ENABLED: "false",
      FRONTEND_ORIGIN: ORIGIN,
    });
    app = createApp({ environment, pool });

    const fixtureSql = [
      {
        sql: `INSERT INTO users (id, email, password_hash, display_name, status, email_verified_at)
              VALUES ($1, $2, 'fixture', 'QA Student', 'ACTIVE', now())`,
        params: [studentUserId, `qa.student.${RUN_ID}@prepvi.invalid`],
      },
      {
        sql: `INSERT INTO users (id, email, password_hash, display_name, status, email_verified_at)
              VALUES ($1, $2, 'fixture', 'QA Admin', 'ACTIVE', now())`,
        params: [adminUserId, `qa.admin.${RUN_ID}@prepvi.invalid`],
      },
      { sql: `INSERT INTO user_roles (user_id, role_code) VALUES ($1, 'STUDENT')`, params: [studentUserId] },
      { sql: `INSERT INTO user_roles (user_id, role_code) VALUES ($1, 'ADMIN')`, params: [adminUserId] },
      { sql: `INSERT INTO topics (id, slug, name, status, priority) VALUES ($1, $2, 'QA Topic', 'ACTIVE', 1)`, params: [topicId, `qa-topic-${topicId.slice(0, 8)}`] },
      { sql: `INSERT INTO positions (id, slug, name, status, priority) VALUES ($1, $2, 'QA Position', 'ACTIVE', 1)`, params: [positionId, `qa-pos-${positionId.slice(0, 8)}`] },
      {
        sql: `INSERT INTO questions (
                 id, slug, title, content, answer_criteria, difficulty, lifecycle_status,
                 source_name, source_url, provenance_note, created_by, published_at, normalized_content_hash
               ) VALUES ($1, $2, 'QA Published', 'QA published content for regression fixtures.',
                 '[]'::jsonb, 'EASY', 'PUBLISHED', 'QA Source', 'https://qa.local', 'QA provenance',
                 $3, now(), $4)`,
        params: [questionId, `qa-question-${questionId.slice(0, 8)}`, adminUserId, hashToken(`qa-content-${questionId}`)],
      },
      { sql: "INSERT INTO question_topics (question_id, topic_id) VALUES ($1, $2)", params: [questionId, topicId] },
      { sql: "INSERT INTO question_positions (question_id, position_id) VALUES ($1, $2)", params: [questionId, positionId] },
      {
        sql: `INSERT INTO job_descriptions (id, student_id, source_type, status, corrected_version, extraction_method)
              VALUES ($1, $2, 'PASTED_TEXT', 'ANALYZED', 1, 'PASTED_TEXT')`,
        params: [jobDescriptionId, studentUserId],
      },
      {
        sql: `INSERT INTO preparation_plans (id, student_id, job_description_id, matching_version)
              VALUES ($1, $2, $3, 'rules-frontend-v1')`,
        params: [planId, studentUserId, jobDescriptionId],
      },
      {
        sql: `INSERT INTO preparation_plan_items (id, plan_id, topic_id, question_id, priority, practice_status)
              VALUES ($1, $2, $3, $4, 'MUST', 'NOT_STARTED')`,
        params: [planItemId, planId, topicId, questionId],
      },
    ];
    for (const { sql, params } of fixtureSql) {
      await pool.query(sql, params);
    }

    studentToken = randomUUID().replace(/-/g, "");
    studentCsrf = randomUUID().replace(/-/g, "");
    await pool.query(
      `INSERT INTO sessions (id, user_id, token_hash, csrf_secret_hash, expires_at)
       VALUES ($1, $2, $3, $4, now() + interval '1 hour')`,
      [randomUUID(), studentUserId, hashToken(studentToken), hashToken(studentCsrf)],
    );

    adminToken = randomUUID().replace(/-/g, "");
    adminCsrf = randomUUID().replace(/-/g, "");
    await pool.query(
      `INSERT INTO sessions (id, user_id, token_hash, csrf_secret_hash, expires_at)
       VALUES ($1, $2, $3, $4, now() + interval '1 hour')`,
      [randomUUID(), adminUserId, hashToken(adminToken), hashToken(adminCsrf)],
    );
  });

  afterAll(async () => {
    if (pool) {
      await pool.query(
        `DELETE FROM preparation_plan_items WHERE plan_id = $1`,
        [planId],
      );
      await pool.query("DELETE FROM preparation_plans WHERE id = $1", [planId]);
      await pool.query("DELETE FROM job_descriptions WHERE id = $1", [jobDescriptionId]);
      await pool.query(
        `DELETE FROM questions WHERE id = $1 OR slug LIKE 'qa-regress-%'`,
        [questionId],
      );
      await pool.query("DELETE FROM topics WHERE id = $1", [topicId]);
      await pool.query("DELETE FROM positions WHERE id = $1", [positionId]);
      await pool.query(
        `DELETE FROM audit_logs WHERE actor_id = ANY($1::uuid[]) OR target_id IN ($2::uuid, $3::uuid)`,
        [[studentUserId, adminUserId], questionId, questionId],
      );
      await pool.query("DELETE FROM users WHERE id = ANY($1::uuid[])", [[studentUserId, adminUserId]]);
      await pool.end();
    }
  });

  function agentHeaders(csrf, token) {
    const headers = { Origin: ORIGIN, Cookie: `prepvi_session=${token}` };
    if (csrf) headers["X-CSRF-Token"] = csrf;
    return headers;
  }

  it("updates practice progress for a published question (no ambiguous version error)", async () => {
    const response = await request(app)
      .put(`/api/v1/practice-progress/${questionId}`)
      .set(agentHeaders(studentCsrf, studentToken))
      .send({ bookmarked: true, status: "PRACTICING" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      questionId,
      bookmarked: true,
      status: "PRACTICING",
    });
  });

  it("rejects duplicate question content on create with a clean 409", async () => {
    const body = {
      slug: `qa-regress-${randomUUID().slice(0, 8)}`,
      title: "Regression duplicate content question",
      content: `identical duplicate content ${Date.now()}`,
      answerCriteria: ["regression"],
      difficulty: "EASY",
      sourceName: "QA Source",
      sourceUrl: "https://qa.local",
      provenanceNote: "QA provenance",
      topicIds: [topicId],
      positionIds: [positionId],
      lifecycleStatus: "DRAFT",
      moderationReason: "regression fixture",
    };

    const first = await request(app)
      .post("/api/v1/admin/questions")
      .set(agentHeaders(adminCsrf, adminToken))
      .send(body);
    expect(first.status).toBe(201);

    const duplicate = await request(app)
      .post("/api/v1/admin/questions")
      .set(agentHeaders(adminCsrf, adminToken))
      .send({ ...body, slug: `qa-regress-${randomUUID().slice(0, 8)}` });
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.code).toBe("DUPLICATE_QUESTION_CONTENT");
  });

  it("rejects duplicate question content on update with a clean 409", async () => {
    const contentA = `unique content A ${Date.now()}`;
    const contentB = `unique content B ${Date.now()}`;

    const createA = await request(app)
      .post("/api/v1/admin/questions")
      .set(agentHeaders(adminCsrf, adminToken))
      .send({
        slug: `qa-regress-a-${randomUUID().slice(0, 8)}`,
        title: "Regression content A",
        content: contentA,
        answerCriteria: ["regression"],
        difficulty: "EASY",
        sourceName: "QA Source",
        provenanceNote: "QA provenance",
        topicIds: [topicId],
        positionIds: [positionId],
        lifecycleStatus: "DRAFT",
        moderationReason: "regression fixture",
      });
    expect(createA.status).toBe(201);

    const createB = await request(app)
      .post("/api/v1/admin/questions")
      .set(agentHeaders(adminCsrf, adminToken))
      .send({
        slug: `qa-regress-b-${randomUUID().slice(0, 8)}`,
        title: "Regression content B",
        content: contentB,
        answerCriteria: ["regression"],
        difficulty: "EASY",
        sourceName: "QA Source",
        provenanceNote: "QA provenance",
        topicIds: [topicId],
        positionIds: [positionId],
        lifecycleStatus: "DRAFT",
        moderationReason: "regression fixture",
      });
    expect(createB.status).toBe(201);

    const conflict = await request(app)
      .put(`/api/v1/admin/questions/${createB.body.id}`)
      .set(agentHeaders(adminCsrf, adminToken))
      .send({
        slug: createB.body.slug,
        title: "Regression content B updated",
        content: contentA,
        answerCriteria: ["regression"],
        difficulty: "EASY",
        sourceName: "QA Source",
        provenanceNote: "QA provenance",
        topicIds: [topicId],
        positionIds: [positionId],
        version: createB.body.version,
        reason: "regression fixture",
      });
    expect(conflict.status).toBe(409);
    expect(conflict.body.code).toBe("DUPLICATE_QUESTION_CONTENT");
  });
});