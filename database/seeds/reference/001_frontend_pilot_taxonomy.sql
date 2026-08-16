INSERT INTO taxonomy_versions (id, version, status, description)
VALUES ('00000000-0000-0000-0000-000000000501', 'frontend-pilot-v1', 'ACTIVE', 'Frontend Intern and Junior Frontend pilot taxonomy')
ON CONFLICT (version) DO UPDATE SET status = EXCLUDED.status, description = EXCLUDED.description;

INSERT INTO positions (id, slug, name, priority) VALUES
  ('00000000-0000-0000-0000-000000000601', 'frontend-intern', 'Frontend Intern', 10),
  ('00000000-0000-0000-0000-000000000602', 'junior-frontend-developer', 'Junior Frontend Developer', 20)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, priority = EXCLUDED.priority, status = 'ACTIVE';

INSERT INTO topics (id, slug, name, priority) VALUES
  ('00000000-0000-0000-0000-000000000701', 'javascript', 'JavaScript', 10),
  ('00000000-0000-0000-0000-000000000702', 'typescript', 'TypeScript', 20),
  ('00000000-0000-0000-0000-000000000703', 'react', 'React', 30),
  ('00000000-0000-0000-0000-000000000704', 'html-css', 'HTML & CSS', 40),
  ('00000000-0000-0000-0000-000000000705', 'web-fundamentals', 'Web Fundamentals', 50),
  ('00000000-0000-0000-0000-000000000706', 'behavioral', 'Behavioral Interview', 60)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, priority = EXCLUDED.priority, status = 'ACTIVE';

INSERT INTO topic_aliases (id, taxonomy_version_id, topic_id, alias, normalized_alias) VALUES
  ('00000000-0000-0000-0000-000000000711', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000703', 'ReactJS', 'reactjs'),
  ('00000000-0000-0000-0000-000000000712', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000701', 'ES6', 'es6'),
  ('00000000-0000-0000-0000-000000000713', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000702', 'TS', 'ts'),
  ('00000000-0000-0000-0000-000000000714', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000704', 'CSS3', 'css3'),
  ('00000000-0000-0000-0000-000000000715', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000705', 'HTTP', 'http')
ON CONFLICT (taxonomy_version_id, normalized_alias) DO UPDATE SET topic_id = EXCLUDED.topic_id, alias = EXCLUDED.alias;

INSERT INTO matching_rule_versions (
  version, exact_topic_weight, keyword_weight, role_weight, seniority_weight,
  threshold, max_per_jd, max_per_requirement, reason_template, status
) VALUES (
  'rules-frontend-v1', 40, 30, 15, 15, 60, 10, 3,
  'Câu hỏi phù hợp với chủ đề {topic}, bao phủ {keywords} và cấp độ {difficulty}.',
  'ACTIVE'
)
ON CONFLICT (version) DO UPDATE SET
  exact_topic_weight = EXCLUDED.exact_topic_weight,
  keyword_weight = EXCLUDED.keyword_weight,
  role_weight = EXCLUDED.role_weight,
  seniority_weight = EXCLUDED.seniority_weight,
  threshold = EXCLUDED.threshold,
  max_per_jd = EXCLUDED.max_per_jd,
  max_per_requirement = EXCLUDED.max_per_requirement,
  reason_template = EXCLUDED.reason_template,
  status = EXCLUDED.status;

INSERT INTO questions (
  id, slug, title, content, answer_criteria, difficulty, lifecycle_status,
  source_name, source_url, provenance_note, published_at
) VALUES
  ('00000000-0000-0000-0000-000000000801', 'javascript-event-loop', 'JavaScript Event Loop hoạt động như thế nào?', 'Giải thích call stack, task queue, microtask queue và thứ tự thực thi.', '["Call stack", "Microtask trước macrotask", "Ví dụ Promise và setTimeout"]', 'MEDIUM', 'PUBLISHED', 'MDN Web Docs', 'https://developer.mozilla.org/docs/Web/JavaScript/Event_loop', 'Curated for frontend pilot', now()),
  ('00000000-0000-0000-0000-000000000802', 'javascript-closure', 'Closure trong JavaScript là gì?', 'Mô tả lexical scope, closure và một tình huống sử dụng thực tế.', '["Lexical scope", "Captured variables", "Practical example"]', 'EASY', 'PUBLISHED', 'MDN Web Docs', 'https://developer.mozilla.org/docs/Web/JavaScript/Closures', 'Curated for frontend pilot', now()),
  ('00000000-0000-0000-0000-000000000803', 'typescript-union-generics', 'Khi nào dùng union type và generic?', 'So sánh union type với generic trong thiết kế API TypeScript.', '["Trade-offs", "Type inference", "Reusable constraints"]', 'MEDIUM', 'PUBLISHED', 'TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/2/generics.html', 'Curated for frontend pilot', now()),
  ('00000000-0000-0000-0000-000000000804', 'react-render-cycle', 'Điều gì khiến React component render lại?', 'Giải thích state, props, context và cách tránh render không cần thiết.', '["State and props", "Context", "Measure before memoization"]', 'MEDIUM', 'PUBLISHED', 'React Documentation', 'https://react.dev/learn/render-and-commit', 'Curated for frontend pilot', now()),
  ('00000000-0000-0000-0000-000000000805', 'react-hooks-effects', 'Sử dụng useEffect đúng mục đích', 'Phân biệt synchronization với derived state và event handling.', '["External synchronization", "Dependencies", "Cleanup"]', 'MEDIUM', 'PUBLISHED', 'React Documentation', 'https://react.dev/learn/synchronizing-with-effects', 'Curated for frontend pilot', now()),
  ('00000000-0000-0000-0000-000000000806', 'semantic-html', 'Vì sao semantic HTML quan trọng?', 'Nêu tác động của semantic HTML tới accessibility, SEO và maintainability.', '["Landmarks", "Accessible names", "Native behavior"]', 'EASY', 'PUBLISHED', 'MDN Web Docs', 'https://developer.mozilla.org/docs/Glossary/Semantics', 'Curated for frontend pilot', now()),
  ('00000000-0000-0000-0000-000000000807', 'css-layout', 'So sánh Flexbox và Grid', 'Chọn layout phù hợp cho các tình huống một chiều và hai chiều.', '["One vs two dimensions", "Alignment", "Responsive example"]', 'EASY', 'PUBLISHED', 'MDN Web Docs', 'https://developer.mozilla.org/docs/Learn/CSS/CSS_layout', 'Curated for frontend pilot', now()),
  ('00000000-0000-0000-0000-000000000808', 'http-cache', 'HTTP caching hoạt động như thế nào?', 'Giải thích Cache-Control, ETag và conditional request.', '["Freshness", "Validation", "Browser/CDN distinction"]', 'HARD', 'PUBLISHED', 'MDN Web Docs', 'https://developer.mozilla.org/docs/Web/HTTP/Caching', 'Curated for frontend pilot', now()),
  ('00000000-0000-0000-0000-000000000809', 'web-security-basics', 'Các rủi ro XSS và CSRF cơ bản', 'Giải thích nguồn gốc và biện pháp phòng chống XSS/CSRF trong web app.', '["Output encoding", "CSP", "SameSite and CSRF token"]', 'HARD', 'PUBLISHED', 'OWASP', 'https://owasp.org/www-project-top-ten/', 'Curated for frontend pilot', now()),
  ('00000000-0000-0000-0000-000000000810', 'behavioral-conflict', 'Kể về một lần bạn xử lý bất đồng trong nhóm', 'Trả lời bằng cấu trúc STAR và nêu bài học cụ thể.', '["Situation", "Action ownership", "Measured result", "Learning"]', 'MEDIUM', 'PUBLISHED', 'PrepVI Editorial', null, 'Original pilot content', now())
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  answer_criteria = EXCLUDED.answer_criteria,
  difficulty = EXCLUDED.difficulty,
  lifecycle_status = EXCLUDED.lifecycle_status,
  source_name = EXCLUDED.source_name,
  source_url = EXCLUDED.source_url,
  provenance_note = EXCLUDED.provenance_note;

INSERT INTO question_topics (question_id, topic_id) VALUES
  ('00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000701'),
  ('00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000701'),
  ('00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000702'),
  ('00000000-0000-0000-0000-000000000804', '00000000-0000-0000-0000-000000000703'),
  ('00000000-0000-0000-0000-000000000805', '00000000-0000-0000-0000-000000000703'),
  ('00000000-0000-0000-0000-000000000806', '00000000-0000-0000-0000-000000000704'),
  ('00000000-0000-0000-0000-000000000807', '00000000-0000-0000-0000-000000000704'),
  ('00000000-0000-0000-0000-000000000808', '00000000-0000-0000-0000-000000000705'),
  ('00000000-0000-0000-0000-000000000809', '00000000-0000-0000-0000-000000000705'),
  ('00000000-0000-0000-0000-000000000810', '00000000-0000-0000-0000-000000000706')
ON CONFLICT DO NOTHING;

INSERT INTO question_positions (question_id, position_id)
SELECT q.id, p.id
FROM questions q
CROSS JOIN positions p
WHERE q.slug IN (
  'javascript-event-loop', 'javascript-closure', 'typescript-union-generics',
  'react-render-cycle', 'react-hooks-effects', 'semantic-html', 'css-layout',
  'http-cache', 'web-security-basics', 'behavioral-conflict'
)
AND p.slug IN ('frontend-intern', 'junior-frontend-developer')
ON CONFLICT DO NOTHING;
