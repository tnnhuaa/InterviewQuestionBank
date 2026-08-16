INSERT INTO question_bank (topic, sub_topic, question_text, sample_answer, difficulty, tags) VALUES
-- JavaScript / Frontend
('JavaScript', 'Core', 'Explain event delegation in JavaScript.', 'Event delegation is a technique where you attach a single event listener to a parent element to handle events on its children...', 'Medium', '{"frontend", "javascript", "dom"}'),
('JavaScript', 'Core', 'What are the differences between var, let, and const?', 'var is function-scoped, let and const are block-scoped. const cannot be reassigned.', 'Easy', '{"javascript", "basics"}'),
('JavaScript', 'Async', 'How does the event loop work?', 'The event loop checks the call stack and the message queue. If the call stack is empty, it pushes the first task from the queue to the stack.', 'Hard', '{"javascript", "async"}'),
('React', 'Hooks', 'What is the purpose of useEffect?', 'useEffect is used for managing side effects in functional components like fetching data, subscriptions, or manually changing the DOM.', 'Medium', '{"react", "hooks"}'),
('React', 'State', 'What is the difference between state and props?', 'Props are passed from parent to child and are immutable. State is managed within the component and can change over time.', 'Easy', '{"react", "basics"}'),
('CSS', 'Layout', 'Explain Flexbox vs Grid.', 'Flexbox is designed for 1D layouts (row or column). Grid is designed for 2D layouts (rows and columns simultaneously).', 'Medium', '{"css", "layout"}'),
('Frontend', 'Performance', 'How do you optimize a web application for performance?', 'Minify CSS/JS, lazy load images, use CDN, code splitting, reduce DOM size, optimize Critical Rendering Path.', 'Hard', '{"performance", "web"}'),

-- Backend / Node.js
('Node.js', 'Core', 'What is Node.js and how does it work?', 'Node.js is a JS runtime built on Chrome V8 engine. It uses an event-driven, non-blocking I/O model making it lightweight and efficient.', 'Medium', '{"nodejs", "backend"}'),
('Express', 'Middleware', 'What is middleware in Express.js?', 'Middleware functions are functions that have access to the request and response object, and the next middleware function in the application’s request-response cycle.', 'Easy', '{"express", "nodejs"}'),
('Node.js', 'Async', 'How do you handle asynchronous errors in Express?', 'In Express 4, you use a try-catch block and pass the error to next(err). In Express 5, async errors are handled automatically.', 'Medium', '{"express", "error-handling"}'),

-- Database
('Database', 'SQL', 'What is an INNER JOIN?', 'INNER JOIN selects records that have matching values in both tables.', 'Easy', '{"sql", "database"}'),
('Database', 'SQL', 'Explain the difference between clustered and non-clustered indexes.', 'A clustered index determines the physical order of data in a table. A non-clustered index is stored separately from the data.', 'Medium', '{"sql", "indexes"}'),
('Database', 'NoSQL', 'When would you choose NoSQL over a Relational Database?', 'When you need flexible schema, massive horizontal scalability, or are storing unstructured data.', 'Medium', '{"nosql", "architecture"}'),
('PostgreSQL', 'Features', 'What are some advanced features of PostgreSQL?', 'JSONB support, full-text search, PostGIS for geospatial data, CTEs, window functions.', 'Hard', '{"postgres", "sql"}'),

-- Architecture / System Design
('System Design', 'Scalability', 'What is the difference between horizontal and vertical scaling?', 'Vertical scaling means adding more power (CPU, RAM) to an existing machine. Horizontal scaling means adding more machines into your pool of resources.', 'Easy', '{"architecture", "scaling"}'),
('System Design', 'Caching', 'Where would you use Redis in a web application?', 'For caching database queries, session management, rate limiting, and pub/sub message queues.', 'Medium', '{"redis", "caching"}'),
('Architecture', 'Microservices', 'What are the pros and cons of microservices?', 'Pros: Independent deployment, tech diversity, scalability. Cons: Complex distributed system, network latency, data consistency.', 'Hard', '{"microservices", "architecture"}'),

-- DevOps / Deployment
('Docker', 'Basics', 'What is the difference between an image and a container?', 'An image is a read-only template with instructions. A container is a runnable instance of an image.', 'Easy', '{"docker", "devops"}'),
('CI/CD', 'Concepts', 'Explain the concept of Continuous Integration.', 'CI is the practice of merging all developer working copies to a shared mainline several times a day to detect integration errors quickly.', 'Medium', '{"cicd", "devops"}'),

-- Soft Skills / Behavioral
('Soft Skills', 'Conflict', 'Tell me about a time you had a disagreement with a team member.', 'Look for STAR format: Situation, Task, Action, Result. Emphasize communication, empathy, and professional resolution.', 'Medium', '{"behavioral", "teamwork"}'),
('Soft Skills', 'Challenges', 'Describe a challenging technical problem you solved.', 'Look for problem-solving skills, persistence, and ability to explain complex concepts clearly.', 'Hard', '{"behavioral", "problem-solving"}'),
('Soft Skills', 'Growth', 'How do you keep up with new technologies?', 'Reading blogs, attending conferences, side projects, taking courses.', 'Easy', '{"behavioral", "learning"}');
