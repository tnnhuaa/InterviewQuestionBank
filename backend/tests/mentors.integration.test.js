import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app.js";

function createMockStorage() {
  return {
    put: vi.fn(async () => "storage-key-1"),
    get: vi.fn(async () => Buffer.from("fake-pdf")),
    delete: vi.fn(async () => {}),
  };
}

const CSRF_HASH = "53bb00ed24849cb15d5702b2a62a0fcbf971b604f326dd7f54c0759ea3481ab1";

function createSessionQueryMock(userId, roles = ["MENTOR"]) {
  return vi.fn(async (sql) => {
    if (typeof sql === "string" && sql.includes("SELECT s.id AS session_id")) {
      return {
        rowCount: 1,
        rows: [{
          session_id: "sess-1",
          csrf_secret_hash: CSRF_HASH,
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          id: userId,
          email: `${userId}@test.com`,
          display_name: "Test User",
          status: "ACTIVE",
          roles,
        }],
      };
    }
    if (typeof sql === "string" && sql.includes("UPDATE sessions SET last_seen_at")) {
      return { rowCount: 1 };
    }
    return { rowCount: 0, rows: [] };
  });
}

const environment = {
  frontendOrigin: "http://frontend.test",
  nodeEnv: "test",
  port: 3000,
  sessionSecret: "test-secret-for-hmac-signing-000000000000000000000000",
  sessionCookieSecure: false,
  sessionTtlHours: 168,
};

function makeSessionCookie(userId) {
  return `prepvi_session=test-token-${userId}`;
}

function authHeaders(userId) {
  return {
    Cookie: makeSessionCookie(userId),
    Origin: environment.frontendOrigin,
    "X-CSRF-Token": "test-csrf-token",
  };
}

describe("Mentor onboarding verification", () => {
  describe("authorization", () => {
    it("denies Student calling GET /mentor-profile", async () => {
      const pool = { query: createSessionQueryMock("student-1", ["STUDENT"]), connect: vi.fn() };
      const app = createApp({ environment, pool, storage: createMockStorage() });
      const response = await request(app)
        .get("/api/v1/mentor-profile")
        .set("Cookie", makeSessionCookie("student-1"));
      expect(response.status).toBe(404);
    });

    it("denies unauthenticated calling GET /mentor-profile", async () => {
      const pool = { query: createSessionQueryMock("anon"), connect: vi.fn() };
      const app = createApp({ environment, pool, storage: createMockStorage() });
      const response = await request(app).get("/api/v1/mentor-profile");
      expect(response.status).toBe(401);
    });
  });

  describe("profile save", () => {
    it("rejects empty topicIds", async () => {
      const pool = { query: createSessionQueryMock("mentor-1"), connect: vi.fn() };
      const app = createApp({ environment, pool, storage: createMockStorage() });
      const response = await request(app)
        .put("/api/v1/mentor-profile")
        .set(authHeaders("mentor-1"))
        .send({ headline: "Test Headline", bio: "This is a test bio with enough length", timezone: "UTC", topicIds: [], positionIds: ["00000000-0000-0000-0000-000000000001"] });
      expect(response.status).toBe(422);
    });

    it("rejects duplicate topicIds", async () => {
      const pool = { query: createSessionQueryMock("mentor-1"), connect: vi.fn() };
      const app = createApp({ environment, pool, storage: createMockStorage() });
      const id = "00000000-0000-0000-0000-000000000001";
      const response = await request(app)
        .put("/api/v1/mentor-profile")
        .set(authHeaders("mentor-1"))
        .send({ headline: "Test Headline", bio: "This is a test bio with enough length", timezone: "UTC", topicIds: [id, id], positionIds: ["00000000-0000-0000-0000-000000000002"] });
      expect(response.status).toBe(422);
    });

    it("rejects short headline", async () => {
      const pool = { query: createSessionQueryMock("mentor-1"), connect: vi.fn() };
      const app = createApp({ environment, pool, storage: createMockStorage() });
      const response = await request(app)
        .put("/api/v1/mentor-profile")
        .set(authHeaders("mentor-1"))
        .send({ headline: "Hi", bio: "This is a test bio with enough length for validation", timezone: "UTC", topicIds: ["00000000-0000-0000-0000-000000000001"], positionIds: ["00000000-0000-0000-0000-000000000002"] });
      expect(response.status).toBe(422);
    });
  });

  describe("verification submission", () => {
    it("rejects missing consent", async () => {
      const pool = { query: createSessionQueryMock("mentor-1"), connect: vi.fn() };
      const app = createApp({ environment, pool, storage: createMockStorage() });
      const response = await request(app)
        .post("/api/v1/mentor-verifications")
        .set(authHeaders("mentor-1"))
        .field("profileVersion", "1")
        .attach("evidence", Buffer.from("%PDF-1.4 fake content"), "test.pdf", { contentType: "application/pdf" });
      expect(response.status).toBe(422);
    });

    it("rejects missing profileVersion", async () => {
      const pool = { query: createSessionQueryMock("mentor-1"), connect: vi.fn() };
      const app = createApp({ environment, pool, storage: createMockStorage() });
      const response = await request(app)
        .post("/api/v1/mentor-verifications")
        .set(authHeaders("mentor-1"))
        .field("consent", "true")
        .attach("evidence", Buffer.from("%PDF-1.4 fake content"), "test.pdf", { contentType: "application/pdf" });
      expect(response.status).toBe(422);
    });

    it("rejects Student calling POST /mentor-verifications", async () => {
      const pool = { query: createSessionQueryMock("student-1", ["STUDENT"]), connect: vi.fn() };
      const app = createApp({ environment, pool, storage: createMockStorage() });
      const response = await request(app)
        .post("/api/v1/mentor-verifications")
        .set(authHeaders("student-1"))
        .field("consent", "true")
        .field("profileVersion", "1")
        .attach("evidence", Buffer.from("%PDF-1.4 fake content"), "test.pdf", { contentType: "application/pdf" });
      expect(response.status).toBe(404);
    });
  });

  describe("privacy", () => {
    it("owner profile does not expose evidenceRef", async () => {
      const queryMock = vi.fn(async (sql) => {
        if (typeof sql === "string" && sql.includes("SELECT s.id AS session_id")) {
          return { rowCount: 1, rows: [{ session_id: "s1", csrf_secret_hash: CSRF_HASH, expires_at: new Date(Date.now() + 3600000).toISOString(), id: "mentor-1", email: "m@test.com", display_name: "Mentor", status: "ACTIVE", roles: ["MENTOR"] }] };
        }
        if (typeof sql === "string" && sql.includes("UPDATE sessions")) return { rowCount: 1 };
        if (typeof sql === "string" && sql.includes("SELECT mp.*")) {
          return { rowCount: 1, rows: [{ id: "p1", user_id: "mentor-1", display_name: "Mentor", headline: "Headline", bio: "Bio", timezone: "UTC", verification_status: "DRAFT", public_rating: null, expertise: [], position_expertise: [], topic_ids: [], position_ids: [], next_slots: [], reviews: [], version: 1, latest_verification: null }] };
        }
        return { rowCount: 0, rows: [] };
      });
      const pool = { query: queryMock, connect: vi.fn() };
      const app = createApp({ environment, pool, storage: createMockStorage() });
      const response = await request(app)
        .get("/api/v1/mentor-profile")
        .set("Cookie", makeSessionCookie("mentor-1"));
      expect(response.status).toBe(200);
      expect(response.body).not.toHaveProperty("evidenceRef");
      expect(response.body).not.toHaveProperty("evidence_ref");
      expect(response.body).not.toHaveProperty("evidenceMimeType");
    });
  });

  describe("DRAFT profile has latestVerification null", () => {
    it("returns null latestVerification for new mentor", async () => {
      const queryMock = vi.fn(async (sql) => {
        if (typeof sql === "string" && sql.includes("SELECT s.id AS session_id")) {
          return { rowCount: 1, rows: [{ session_id: "s1", csrf_secret_hash: CSRF_HASH, expires_at: new Date(Date.now() + 3600000).toISOString(), id: "mentor-1", email: "m@test.com", display_name: "Mentor", status: "ACTIVE", roles: ["MENTOR"] }] };
        }
        if (typeof sql === "string" && sql.includes("UPDATE sessions")) return { rowCount: 1 };
        if (typeof sql === "string" && sql.includes("SELECT mp.*")) {
          return { rowCount: 1, rows: [{ id: "p1", user_id: "mentor-1", display_name: "Mentor", headline: "Headline", bio: "Bio bio bio bio bio", timezone: "UTC", verification_status: "DRAFT", public_rating: null, expertise: ["React"], position_expertise: ["Frontend"], topic_ids: ["t1"], position_ids: ["p1"], next_slots: [], reviews: [], version: 1, latest_verification: null }] };
        }
        return { rowCount: 0, rows: [] };
      });
      const pool = { query: queryMock, connect: vi.fn() };
      const app = createApp({ environment, pool, storage: createMockStorage() });
      const response = await request(app)
        .get("/api/v1/mentor-profile")
        .set("Cookie", makeSessionCookie("mentor-1"));
      expect(response.status).toBe(200);
      expect(response.body.latestVerification).toBeNull();
      expect(response.body.verificationStatus).toBe("DRAFT");
    });
  });

  describe("REJECTED profile shows decisionReason", () => {
    it("returns latestVerification with reason", async () => {
      const queryMock = vi.fn(async (sql) => {
        if (typeof sql === "string" && sql.includes("SELECT s.id AS session_id")) {
          return { rowCount: 1, rows: [{ session_id: "s1", csrf_secret_hash: CSRF_HASH, expires_at: new Date(Date.now() + 3600000).toISOString(), id: "mentor-1", email: "m@test.com", display_name: "Mentor", status: "ACTIVE", roles: ["MENTOR"] }] };
        }
        if (typeof sql === "string" && sql.includes("UPDATE sessions")) return { rowCount: 1 };
        if (typeof sql === "string" && sql.includes("SELECT mp.*")) {
          return { rowCount: 1, rows: [{ id: "p1", user_id: "mentor-1", display_name: "Mentor", headline: "Headline", bio: "Bio bio bio bio bio", timezone: "UTC", verification_status: "REJECTED", public_rating: null, expertise: ["React"], position_expertise: ["Frontend"], topic_ids: ["t1"], position_ids: ["p1"], next_slots: [], reviews: [], version: 1, latest_verification: { id: "v1", status: "REJECTED", submittedAt: "2026-08-19T10:00:00Z", decidedAt: "2026-08-19T12:00:00Z", decisionReason: "Bang chung khong ro net", version: 1 } }] };
        }
        return { rowCount: 0, rows: [] };
      });
      const pool = { query: queryMock, connect: vi.fn() };
      const app = createApp({ environment, pool, storage: createMockStorage() });
      const response = await request(app)
        .get("/api/v1/mentor-profile")
        .set("Cookie", makeSessionCookie("mentor-1"));
      expect(response.status).toBe(200);
      expect(response.body.verificationStatus).toBe("REJECTED");
      expect(response.body.latestVerification).not.toBeNull();
      expect(response.body.latestVerification.status).toBe("REJECTED");
      expect(response.body.latestVerification.decisionReason).toBe("Bang chung khong ro net");
    });
  });
});
