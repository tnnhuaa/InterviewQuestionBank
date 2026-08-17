export function createDashboardService({ pool }) {
  async function getStudentDashboard(studentId) {
    const [summary, nextActions, upcomingBooking, recentFeedback] = await Promise.all([
      pool.query(
        `SELECT
           count(*) FILTER (WHERE pp.status = 'NOT_STARTED')::int AS "notStarted",
           count(*) FILTER (WHERE pp.status = 'PRACTICING')::int AS "practicing",
           count(*) FILTER (WHERE pp.status = 'COMPLETED')::int AS "completed",
           count(*) FILTER (WHERE pp.status = 'REVISIT')::int AS "revisit",
           count(*) FILTER (WHERE pp.bookmarked)::int AS "bookmarked",
           (SELECT count(*)::int FROM preparation_plans p WHERE p.student_id = $1 AND p.status = 'ACTIVE') AS "activePlans",
           (SELECT count(*)::int FROM job_descriptions jd WHERE jd.student_id = $1 AND jd.status <> 'ARCHIVED') AS "jobDescriptions",
           (SELECT count(*)::int FROM bookings b WHERE b.student_id = $1 AND b.state IN ('PENDING','CONFIRMED','RESCHEDULE_PROPOSED')) AS "upcomingBookings"
         FROM practice_progress pp WHERE pp.student_id = $1`,
        [studentId],
      ),
      pool.query(
        `SELECT pi.id, pi.plan_id AS "planId", pi.priority, pi.practice_status AS "practiceStatus",
                pi.mentor_next_action AS "mentorNextAction", q.id AS "questionId", q.title AS "questionTitle",
                t.name AS topic, pi.updated_at AS "updatedAt"
         FROM preparation_plan_items pi
         JOIN preparation_plans p ON p.id = pi.plan_id
         LEFT JOIN questions q ON q.id = pi.question_id
         LEFT JOIN topics t ON t.id = pi.topic_id
         WHERE p.student_id = $1 AND p.status = 'ACTIVE'
           AND pi.practice_status <> 'COMPLETED'
         ORDER BY
           CASE pi.practice_status WHEN 'REVISIT' THEN 1 WHEN 'NOT_STARTED' THEN 2 ELSE 3 END,
           CASE pi.priority WHEN 'MUST' THEN 1 WHEN 'SHOULD' THEN 2 ELSE 3 END,
           pi.updated_at, pi.id
         LIMIT 12`,
        [studentId],
      ),
      pool.query(
        `SELECT b.id, b.state AS status, b.starts_at AS "startsAt", b.ends_at AS "endsAt",
                b.source_timezone AS timezone, u.display_name AS "mentorName"
         FROM bookings b
         JOIN mentor_profiles mp ON mp.id = b.mentor_id
         JOIN users u ON u.id = mp.user_id
         WHERE b.student_id = $1 AND b.state IN ('CONFIRMED','RESCHEDULE_PROPOSED')
           AND b.ends_at > now()
         ORDER BY b.starts_at, b.id LIMIT 1`,
        [studentId],
      ),
      pool.query(
        `SELECT f.id, f.booking_id AS "bookingId", f.strengths, f.weaknesses,
                f.created_at AS "createdAt", u.display_name AS "mentorName"
         FROM feedback f
         JOIN bookings b ON b.id = f.booking_id
         JOIN mentor_profiles mp ON mp.id = f.mentor_id
         JOIN users u ON u.id = mp.user_id
         WHERE b.student_id = $1
         ORDER BY f.created_at DESC, f.id LIMIT 5`,
        [studentId],
      ),
    ]);

    const row = summary.rows[0] ?? {};
    return {
      summary: {
        practice: {
          notStarted: row.notStarted ?? 0,
          practicing: row.practicing ?? 0,
          completed: row.completed ?? 0,
          revisit: row.revisit ?? 0,
        },
        bookmarked: row.bookmarked ?? 0,
        activePlans: row.activePlans ?? 0,
        jobDescriptions: row.jobDescriptions ?? 0,
        upcomingBookings: row.upcomingBookings ?? 0,
      },
      nextActions: nextActions.rows,
      upcomingBooking: upcomingBooking.rows[0] ?? null,
      recentFeedback: recentFeedback.rows,
    };
  }

  return { getStudentDashboard };
}
