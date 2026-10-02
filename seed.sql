-- ==============================================================
-- EduLearn E-Learning Platform - MySQL Seed Data
-- ==============================================================

USE `edulearn_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users
TRUNCATE TABLE `users`;
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `role`, `profile_photo`) VALUES
('usr_student_01', 'student@edulearn.com', '$2b$10$jfmSF5IoOuDDLvJYRxT8zugfQwKlHtWs5HRFcm.e5ydeIo69/4ESa', 'Dara Somnang', 'student', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'),
('usr_instructor_01', 'instructor@edulearn.com', '$2b$10$jfmSF5IoOuDDLvJYRxT8zugfQwKlHtWs5HRFcm.e5ydeIo69/4ESa', 'Dr. Sarah Connor', 'instructor', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'),
('usr_admin_01', 'admin@edulearn.com', '$2b$10$jfmSF5IoOuDDLvJYRxT8zugfQwKlHtWs5HRFcm.e5ydeIo69/4ESa', 'Alex Vance (SysAdmin)', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80');

-- 2. Students
TRUNCATE TABLE `students`;
INSERT INTO `students` (`id`, `student_id`, `full_name`, `gender`, `date_of_birth`, `phone_number`, `email`, `profile_photo`, `education_level`, `account_status`) VALUES
('usr_student_01', 'STU-2026-0042', 'Dara Somnang', 'Male', '2002-05-14', '+855 12 345 678', 'student@edulearn.com', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80', 'Bachelor of Computer Science (Year 3)', 'active');

-- 3. Instructors
TRUNCATE TABLE `instructors`;
INSERT INTO `instructors` (`id`, `name`, `title`, `bio`, `avatar`, `user_id`) VALUES
('inst_01', 'Dr. Sarah Connor', 'Senior Mobile Architect & Google Developer Expert', 'Over 12 years of experience crafting large-scale iOS and Flutter apps. Former lead engineer at TechCorp.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', 'usr_instructor_01'),
('inst_02', 'Michael Zhang', 'Principal Backend Engineer & Spring Champion', 'Specialized in high-throughput distributed systems, event-driven microservices, and Spring Boot.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 'usr_instructor_01'),
('inst_03', 'Elena Rostova', 'Lead AI Researcher & Data Scientist', 'PhD in Computational Intelligence. Author of foundational computer vision and deep learning curricula.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80', 'usr_instructor_01'),
('inst_04', 'David Kim', 'Staff UX Designer & Interaction Specialist', 'Former Design Lead at FinTech Global. Creator of award-winning enterprise design systems.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', 'usr_instructor_01'),
('inst_05', 'Marcus Brody', 'Chief Information Security Officer & Pen Tester', 'Certified Ethical Hacker (CEH) and CISSP. Trains cyber defense squads worldwide.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80', 'usr_instructor_01');

-- 4. Categories
TRUNCATE TABLE `categories`;
INSERT INTO `categories` (`id`, `name`, `description`, `icon_url`, `status`, `course_count`) VALUES
('cat_mobile', 'Mobile Development', 'Flutter, Android Kotlin, iOS Swift, and Cross-Platform Apps', 'https://img.icons8.com/color/96/flutter.png', 'active', 4),
('cat_web', 'Web Development', 'Full Stack, React, Next.js, and Modern Web Standards', 'https://img.icons8.com/color/96/html-5--v1.png', 'active', 4),
('cat_data', 'Data Science & AI', 'Python, Machine Learning, Deep Learning, and Analytics', 'https://img.icons8.com/color/96/python--v1.png', 'active', 3),
('cat_backend', 'Backend & Cloud', 'Spring Boot, Node.js, GraphQL, AWS, and Cloud Architecture', 'https://img.icons8.com/color/96/spring-logo.png', 'active', 3),
('cat_design', 'UI/UX Design', 'Figma, User Research, Design Systems, and Prototyping', 'https://img.icons8.com/color/96/figma--v1.png', 'active', 1),
('cat_database', 'Database Systems', 'PostgreSQL, MongoDB, SQL Optimizations, and Modeling', 'https://img.icons8.com/color/96/postgreesql.png', 'active', 1),
('cat_security', 'Cybersecurity', 'Network Defense, Ethical Hacking, and Cryptography', 'https://img.icons8.com/color/96/shield.png', 'active', 2),
('cat_devops', 'DevOps & CI/CD', 'Docker, Kubernetes, GitHub Actions, and Infrastructure', 'https://img.icons8.com/color/96/docker.png', 'active', 1),
('cat_algorithms', 'Computer Science', 'Data Structures, Algorithms, Complexity, and Discrete Math', 'https://img.icons8.com/color/96/code.png', 'active', 1),
('cat_business', 'Tech Leadership', 'Agile Management, Scrum, and Product Strategy', 'https://img.icons8.com/color/96/briefcase.png', 'active', 0);

-- 5. Courses
TRUNCATE TABLE `courses`;
INSERT INTO `courses` (`id`, `title`, `category_id`, `description`, `image_url`, `instructor_id`, `duration`, `level`, `lesson_count`, `rating`, `enrollment_count`, `status`, `price`, `is_free`) VALUES
('crs_01', 'Flutter Mobile Development: Clean Architecture & Riverpod', 'cat_mobile', 'Master Flutter and Dart with Material 3, Riverpod 2, Clean Architecture, and seamless REST API integration with real backends.', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80', 'inst_01', '32h 45m', 'Intermediate', 6, 4.9, 1420, 'published', 49.99, 0),
('crs_02', 'Full Stack Web Development: Modern Standards & React', 'cat_web', 'From HTML5/CSS3 to React 18, Node.js, Express, and modern RESTful APIs with database connectivity.', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80', 'inst_02', '45h 10m', 'Beginner', 4, 4.8, 2310, 'published', 59.99, 0),
('crs_03', 'Database Fundamentals: PostgreSQL & SQL Mastery', 'cat_database', 'Deep dive into relational database design, indexing, transactions, ACID properties, normalization, and query optimizations.', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80', 'inst_02', '18h 30m', 'All Levels', 3, 4.7, 980, 'published', 29.99, 0),
('crs_04', 'Python for Data Science & Machine Learning Foundations', 'cat_data', 'Learn NumPy, Pandas, Matplotlib, Scikit-learn, and statistical data modeling from scratch.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80', 'inst_03', '38h 00m', 'Beginner', 4, 4.9, 3450, 'published', 0, 1),
('crs_05', 'Introduction to Artificial Intelligence & Neural Networks', 'cat_data', 'Demystify deep learning, convolutional neural networks, backpropagation, and large language models.', 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80', 'inst_03', '26h 15m', 'Advanced', 3, 4.9, 1890, 'published', 69.99, 0),
('crs_06', 'UI/UX Design Fundamentals: Figma & Design Systems', 'cat_design', 'Learn visual hierarchy, wireframing, high-fidelity prototyping, accessibility, and modern component architecture in Figma.', 'https://images.unsplash.com/photo-1581291518655-9523c93269c4?w=800&auto=format&fit=crop&q=80', 'inst_04', '20h 45m', 'Beginner', 3, 4.8, 1620, 'published', 34.99, 0),
('crs_07', 'Java Programming: Core Concepts to Object-Oriented Design', 'cat_backend', 'Master Java 21 LTS features, JVM memory mechanics, generics, lambdas, concurrency, and OOP design patterns.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80', 'inst_02', '35h 20m', 'Beginner', 3, 4.6, 1240, 'published', 0, 1),
('crs_08', 'React Web Development: Hooks, Redux Toolkit & Next.js', 'cat_web', 'Build enterprise-grade single-page web applications with React 18, state management, and modern tooling.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80', 'inst_01', '28h 50m', 'Intermediate', 3, 4.8, 2150, 'published', 44.99, 0),
('crs_09', 'Cybersecurity Fundamentals: Network Security & Defense', 'cat_security', 'Understand TCP/IP security, firewall configurations, symmetric/asymmetric encryption, and vulnerability assessment.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80', 'inst_05', '22h 10m', 'Beginner', 2, 4.7, 1780, 'published', 39.99, 0),
('crs_10', 'Cloud Computing Basics: AWS Core Services & Architectures', 'cat_backend', 'Master Amazon EC2, S3, RDS, Lambda serverless, VPC networking, and cloud security architecture.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80', 'inst_02', '24h 00m', 'All Levels', 2, 4.8, 2890, 'published', 49.99, 0),
('crs_11', 'Spring Boot 3 & Microservices: Production Ready APIs', 'cat_backend', 'Build enterprise scalable microservices with Spring Boot 3, Spring Security, JWT, Eureka, API Gateway, and Docker.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', 'inst_02', '40h 15m', 'Advanced', 3, 4.9, 1650, 'published', 64.99, 0),
('crs_12', 'Next.js 14 Full Stack: Server Actions & App Router', 'cat_web', 'Production-level full-stack web applications with React Server Components, Tailwind CSS, Prisma ORM, and Stripe.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80', 'inst_01', '30h 20m', 'Intermediate', 2, 4.9, 1940, 'published', 54.99, 0),
('crs_13', 'Kotlin for Android: Jetpack Compose Modern UI', 'cat_mobile', 'Declarative Android UI with Jetpack Compose, Coroutines, StateFlow, Room DB, and MVVM architecture.', 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&auto=format&fit=crop&q=80', 'inst_01', '31h 00m', 'Intermediate', 2, 4.8, 1120, 'published', 49.99, 0),
('crs_14', 'iOS App Development: Swift 5.9 & SwiftUI 5', 'cat_mobile', 'Build native iOS, iPadOS, and watchOS applications using SwiftUI, SwiftData, and async/await concurrency.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80', 'inst_01', '36h 30m', 'Intermediate', 2, 4.9, 1540, 'published', 59.99, 0),
('crs_15', 'DevOps & Docker CI/CD: Containerization to Kubernetes', 'cat_devops', 'Automate build pipelines, create resilient Docker containers, and deploy scalable clusters onto Kubernetes.', 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80', 'inst_02', '27h 40m', 'Advanced', 2, 4.8, 1390, 'published', 54.99, 0),
('crs_16', 'Machine Learning with PyTorch: Deep Neural Architectures', 'cat_data', 'Hands-on deep learning with tensors, autograd, transfer learning, and Transformers using PyTorch.', 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80', 'inst_03', '34h 10m', 'Advanced', 2, 4.9, 1870, 'published', 69.99, 0),
('crs_17', 'Data Structures & Algorithms in Practice', 'cat_algorithms', 'Conquer coding interviews with mastery in Trees, Graphs, Dynamic Programming, and Big-O runtime analysis.', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80', 'inst_02', '42h 00m', 'All Levels', 2, 4.9, 3820, 'published', 0, 1),
('crs_18', 'GraphQL API Design with Node.js & Apollo Server', 'cat_web', 'Construct type-safe, query-efficient GraphQL APIs using Apollo Server, schema federation, and authentication.', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80', 'inst_01', '19h 30m', 'Intermediate', 2, 4.7, 940, 'published', 39.99, 0),
('crs_19', 'Ethical Hacking & Penetration Testing Bootcamp', 'cat_security', 'Hands-on penetration testing with Kali Linux, Metasploit, Wireshark, Burp Suite, and OWASP Top 10.', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80', 'inst_05', '37h 20m', 'Advanced', 2, 4.9, 2210, 'published', 74.99, 0),
('crs_20', 'Cross-Platform Mobile Architecture with Dart', 'cat_mobile', 'Deep dive into Dart language internals, asynchronous streams, isolates, and clean architecture patterns.', 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=80', 'inst_01', '21h 15m', 'Intermediate', 2, 4.8, 880, 'published', 0, 1);

-- 6. Lessons
TRUNCATE TABLE `lessons`;
INSERT INTO `lessons` (`id`, `course_id`, `title`, `description`, `lesson_order`, `video_url`, `duration`, `status`, `is_locked`) VALUES
('les_01_01', 'crs_01', 'Introduction to Modern Flutter & Dart 3', 'Overview of Flutter architecture, Dart 3 records, patterns, and development setup.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '18:45', 'published', 0),
('les_01_02', 'crs_01', 'State Management with Riverpod 2.0', 'Understanding Notifiers, AsyncNotifier, family modifiers, and reactive widget updates.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '24:12', 'published', 0),
('les_01_03', 'crs_01', 'Clean Architecture Folder Structure', 'Separating Presentation, Domain, and Data layers with dependency inversion.', 3, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '31:00', 'published', 0),
('les_01_04', 'crs_01', 'Dio Client & Error Handling', 'Configuring interceptors, auth tokens, retry logic, and clean AppException mappings.', 4, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', '26:50', 'published', 0),
('les_01_05', 'crs_01', 'GoRouter & Deep Linking Setup', 'Declarative routing, route guards, nested shell routes, and authentication redirects.', 5, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', '22:15', 'published', 0),
('les_01_06', 'crs_01', 'Connecting to Spring Boot Backend', 'Replacing fake repositories with Spring Boot REST endpoints seamlessly.', 6, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4', '35:40', 'published', 0),
('les_02_01', 'crs_02', 'Modern HTML5 & Semantic Elements', 'Semantic markup, accessibility ARIA attributes, and SEO foundation.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '20:10', 'published', 0),
('les_02_02', 'crs_02', 'CSS Grid, Flexbox & Responsive Layouts', 'Building mobile-first adaptive interfaces with modern CSS.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '28:40', 'published', 0),
('les_02_03', 'crs_02', 'Modern JavaScript (ES6+) Features', 'Arrow functions, destructuring, promises, async/await, and modules.', 3, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '33:15', 'published', 0),
('les_02_04', 'crs_02', 'Node.js & Express RESTful Server', 'Creating API endpoints, middleware, routing, and JSON request validation.', 4, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', '39:00', 'published', 0),
('les_03_01', 'crs_03', 'Relational Model & Normalization Rules', '1NF, 2NF, 3NF, BCNF, and relational integrity constraints.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '25:00', 'published', 0),
('les_03_02', 'crs_03', 'Complex Queries: Joins & Aggregations', 'INNER, LEFT, FULL OUTER joins, GROUP BY, and window functions.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '32:20', 'published', 0),
('les_03_03', 'crs_03', 'Indexes & B-Tree Performance Tuning', 'EXPLAIN ANALYZE, composite indexes, and preventing sequential scans.', 3, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '29:45', 'published', 0),
('les_04_01', 'crs_04', 'Python for Data Analysis Environment Setup', 'Jupyter Notebooks, Conda environments, and package management.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '15:20', 'published', 0),
('les_04_02', 'crs_04', 'NumPy Vectorized Arrays & Operations', 'Multi-dimensional slicing, broadcasting, and linear algebra routines.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '27:15', 'published', 0),
('les_04_03', 'crs_04', 'Pandas DataFrames: Cleaning & Filtering', 'Handling missing values, grouping, merging, and reshaping datasets.', 3, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '34:00', 'published', 0),
('les_04_04', 'crs_04', 'Scikit-Learn: Classification & Regression', 'Training Decision Trees, Logistic Regression, and evaluating with F1 score.', 4, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', '38:30', 'published', 0),
('les_05_01', 'crs_05', 'Perceptrons and Multilayer Perceptrons', 'Activation functions, loss gradients, and the feed-forward mechanism.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '22:40', 'published', 0),
('les_05_02', 'crs_05', 'Convolutional Neural Networks (CNNs)', 'Kernel filters, pooling layers, and image classification architectures.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '36:10', 'published', 0),
('les_05_03', 'crs_05', 'Transformers & Attention Mechanisms', 'Self-attention, query-key-value vectors, and the foundation of modern LLMs.', 3, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '42:00', 'published', 0),
('les_06_01', 'crs_06', 'User-Centered Design Principles', 'Empathy maps, user personas, journey mapping, and usability heuristics.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '19:30', 'published', 0),
('les_06_02', 'crs_06', 'Figma Auto-Layout & Design Tokens', 'Mastering responsive constraints, design tokens, and components in Figma.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '31:40', 'published', 0),
('les_06_03', 'crs_06', 'Interactive Prototyping & User Testing', 'Connecting screen transitions, micro-interactions, and usability testing.', 3, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '26:15', 'published', 0),
('les_07_01', 'crs_07', 'Java 21 Syntax & Virtual Threads', 'Project Loom virtual threads, pattern matching for switch, and record classes.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '28:10', 'published', 0),
('les_07_02', 'crs_07', 'Object-Oriented Design & SOLID Principles', 'Clean polymorphism, abstract contracts, and dependency injection in Java.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '33:45', 'published', 0),
('les_07_03', 'crs_07', 'Collections & Stream API', 'Map, filter, reduce, collectors, and parallel streams in practice.', 3, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '30:20', 'published', 0),
('les_08_01', 'crs_08', 'React 18 Hooks in Depth', 'useState, useEffect, useMemo, useCallback, and custom hooks.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '27:15', 'published', 0),
('les_08_02', 'crs_08', 'State Management with Redux Toolkit', 'Slices, createAsyncThunk, selectors, and store configuration.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '34:00', 'published', 0),
('les_08_03', 'crs_08', 'React Performance & Lazy Loading', 'React.memo, code splitting with React.lazy, and Profiler optimization.', 3, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '25:50', 'published', 0),
('les_09_01', 'crs_09', 'TCP/IP Architecture & Packet Sniffing', 'Packet headers, Wireshark inspection, ARP spoofing, and defense.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '29:40', 'published', 0),
('les_09_02', 'crs_09', 'Cryptography: SSL/TLS & Public Key Infrastructure', 'Asymmetric encryption, RSA, AES-256, certificates, and digital signatures.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '36:10', 'published', 0),
('les_10_01', 'crs_10', 'AWS Identity & Access Management (IAM)', 'Roles, policies, MFA enforcement, and least-privilege principles.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '23:30', 'published', 0),
('les_10_02', 'crs_10', 'Amazon EC2 & S3 Cloud Storage', 'Provisioning virtual machines, bucket lifecycle rules, and security.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '31:20', 'published', 0),
('les_11_01', 'crs_11', 'Spring Boot 3 Project Setup & Architecture', 'Spring initializr, Gradle/Maven, controller-service-repository patterns.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '24:50', 'published', 0),
('les_11_02', 'crs_11', 'Spring Security 6 with Stateless JWT', 'Custom authentication filters, token validation, and role authorization.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '38:15', 'published', 0),
('les_11_03', 'crs_11', 'Spring Data JPA & PostgreSQL Integration', 'Entities, repositories, custom JPQL queries, and database migrations with Flyway.', 3, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '35:00', 'published', 0),
('les_12_01', 'crs_12', 'Next.js App Router Architecture', 'Server vs Client components, layouts, loading states, and error boundaries.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '27:40', 'published', 0),
('les_12_02', 'crs_12', 'Server Actions & Data Mutation', 'Direct database mutation from server actions without manual API routes.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '32:10', 'published', 0),
('les_13_01', 'crs_13', 'Jetpack Compose Basics & State Hoisting', 'Composable functions, modifiers, remember, and mutableStateOf.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '26:30', 'published', 0),
('les_13_02', 'crs_13', 'Room DB & Kotlin Coroutines Flow', 'Reactive local database queries with Kotlin Flow and MVVM ViewModel.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '34:50', 'published', 0),
('les_14_01', 'crs_14', 'SwiftUI Declarative UI & NavigationStack', 'Views, ViewModifiers, @State, @Binding, and NavigationStack paths.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '29:00', 'published', 0),
('les_14_02', 'crs_14', 'SwiftData & Modern Concurrency', 'Persisting models with @Model macro and async/await task handling.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '33:20', 'published', 0),
('les_15_01', 'crs_15', 'Multi-Stage Dockerfile Optimization', 'Layer caching, minimal base images (Alpine/Distroless), and image security.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '25:15', 'published', 0),
('les_15_02', 'crs_15', 'Kubernetes Pods, Deployments & Services', 'Declarative YAML manifests, rolling updates, and cluster networking.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '39:40', 'published', 0),
('les_16_01', 'crs_16', 'PyTorch Tensors & Custom Datasets', 'DataLoader pipelines, GPU acceleration with CUDA, and tensor operations.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '31:10', 'published', 0),
('les_16_02', 'crs_16', 'Transfer Learning with ResNet & Vision Models', 'Fine-tuning pre-trained weights for specialized domain classification.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '37:50', 'published', 0),
('les_17_01', 'crs_17', 'Binary Trees, BSTs & Balancing', 'Tree traversals (inorder, preorder, postorder) and AVL balance factors.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '33:00', 'published', 0),
('les_17_02', 'crs_17', 'Graph Traversal: BFS, DFS & Dijkstra', 'Adjacency lists, shortest path algorithms, and cycle detection.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '41:20', 'published', 0),
('les_18_01', 'crs_18', 'GraphQL Schemas, Queries & Mutations', 'Type definitions, resolvers, context, and query execution pipeline.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '28:10', 'published', 0),
('les_18_02', 'crs_18', 'Solving the N+1 Query Problem with DataLoader', 'Batching and caching database requests in GraphQL resolvers.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '30:45', 'published', 0),
('les_19_01', 'crs_19', 'Reconnaissance & Port Scanning with Nmap', 'OS fingerprinting, service version detection, and vulnerability scripts.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '35:20', 'published', 0),
('les_19_02', 'crs_19', 'Web Application Exploitation: SQL Injection & XSS', 'Finding flaws with Burp Suite, SQLMap, and sanitizing user inputs.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '44:10', 'published', 0),
('les_20_01', 'crs_20', 'Dart Isolates & Multi-Threading', 'Spawning background worker threads and passing messages with ReceivePort.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '26:50', 'published', 0),
('les_20_02', 'crs_20', 'Streams & Asynchronous Generators', 'StreamController, broadcast streams, async* generators, and transformation.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '31:15', 'published', 0);

-- 7. Materials
TRUNCATE TABLE `materials`;
INSERT INTO `materials` (`id`, `lesson_id`, `title`, `type`, `file_url`, `upload_date`, `description`, `file_size`) VALUES
('mat_01_01', 'les_01_01', 'Flutter Dart 3 CheatSheet', 'pdf', 'https://example.com/materials/flutter-cheatsheet.pdf', '2026-09-01', 'Quick reference guide for Dart 3 pattern matching and records.', '1.8 MB'),
('mat_01_02', 'les_01_02', 'Riverpod 2 Architecture Diagram', 'pdf', 'https://example.com/materials/riverpod-guide.pdf', '2026-09-02', 'Visual flow from DataSource to ConsumerWidget.', '2.4 MB'),
('mat_01_03', 'les_01_03', 'Clean Architecture Boilerplate Code', 'zip', 'https://example.com/materials/clean-arch-boilerplate.zip', '2026-09-03', 'Starter project structure with contracts.', '4.2 MB');

-- 8. Quizzes
TRUNCATE TABLE `quizzes`;
INSERT INTO `quizzes` (`id`, `lesson_id`, `course_id`, `title`, `description`, `total_questions`, `time_limit_minutes`, `passing_score`, `maximum_attempts`) VALUES
('quiz_01', 'les_01_02', 'crs_01', 'Riverpod 2.0 & Clean State Management', 'Test your understanding of Riverpod providers, ref.watch, and immutability.', 5, 10, 70, 3),
('quiz_02', 'les_02_02', 'crs_02', 'CSS Grid & Flexbox Fundamentals', 'Validate your knowledge of CSS layouts, alignment, and responsiveness.', 5, 10, 70, 3),
('quiz_03', 'les_03_02', 'crs_03', 'SQL Joins & Relational Algebra', 'Verify your proficiency in joins, aggregations, and subqueries.', 5, 10, 70, 3),
('quiz_04', 'les_04_02', 'crs_04', 'Python NumPy & Data Slicing', 'Test skills on array broadcasting, vectorized operations, and performance.', 5, 10, 70, 3),
('quiz_05', 'les_05_01', 'crs_05', 'Neural Networks & Machine Learning Theory', 'Foundations of loss functions, optimization, and backpropagation.', 5, 10, 70, 3),
('quiz_06', 'les_07_01', 'crs_07', 'Java Concurrency & Virtual Threads', 'Understand Java 21 Project Loom, synchronization, and immutability.', 5, 10, 70, 3),
('quiz_07', 'les_09_01', 'crs_09', 'Network Protocols & Packet Analysis', 'Test fundamentals of IP, TCP handshake, and Wireshark filters.', 5, 10, 70, 3),
('quiz_08', 'les_11_02', 'crs_11', 'Spring Security 6 & JWT Authentication', 'Verify concepts on Spring filter chains, stateless sessions, and token verification.', 5, 10, 70, 3),
('quiz_09', 'les_15_01', 'crs_15', 'Docker Optimization & Containers', 'Assess understanding of Docker layers, volume mounts, and container life cycles.', 5, 10, 70, 3),
('quiz_10', 'les_17_01', 'crs_17', 'Binary Search Trees & Algorithmic Complexity', 'Test Big-O complexity, balance factors, and binary tree traversals.', 5, 10, 70, 3);

-- 9. Questions
TRUNCATE TABLE `questions`;
INSERT INTO `questions` (`id`, `quiz_id`, `question_text`, `type`, `options_json`, `correct_answer_index`, `explanation`, `question_order`) VALUES
('q_01_1', 'quiz_01', 'Which method should you use inside build() to reactively listen to provider changes?', 'multiple_choice', '["ref.read()","ref.watch()","ref.listen()","ref.refresh()"]', 1, 'ref.watch() subscribes the widget to updates and rebuilds it when the state changes.', 1),
('q_01_2', 'quiz_01', 'What is the primary benefit of Clean Architecture in Flutter apps?', 'multiple_choice', '["Makes the code compile faster","Decouples UI and business logic so backends can be swapped easily","Eliminates the need for any state management package","Automatically generates database schemas"]', 1, 'Clean Architecture strictly separates UI from data sources, allowing seamless backend swaps.', 2),
('q_01_3', 'quiz_01', 'Which Riverpod provider type is recommended for managing asynchronous states?', 'multiple_choice', '["StateProvider","ChangeNotifierProvider","AsyncNotifierProvider","SimpleProvider"]', 2, 'AsyncNotifierProvider handles AsyncValue (loading, data, error) cleanly and safely.', 3),
('q_01_4', 'quiz_01', 'Where should API calls and Dio requests be executed?', 'multiple_choice', '["Directly inside the build method of widgets","Inside remote DataSources","In main.dart","Inside the router guards"]', 1, 'DataSources are strictly responsible for network and database interactions.', 4),
('q_01_5', 'quiz_01', 'What does the autoDispose modifier do in Riverpod?', 'multiple_choice', '["Deletes the Flutter project cache","Automatically cancels state and releases memory when no longer listened to","Permanently saves state to local storage","Restarts the app when an error occurs"]', 1, 'autoDispose frees up resources as soon as the widget listening to the provider unmounts.', 5),
('q_02_1', 'quiz_02', 'Which CSS property defines alignment along the main axis in Flexbox?', 'multiple_choice', '["align-items","justify-content","align-content","text-align"]', 1, 'justify-content aligns items along the primary flex axis.', 1),
('q_02_2', 'quiz_02', 'What is the default flex-direction of a flex container?', 'multiple_choice', '["column","row","row-reverse","column-reverse"]', 1, 'By default, flex-direction is row.', 2),
('q_02_3', 'quiz_02', 'In CSS Grid, what unit represents a fraction of the available space?', 'multiple_choice', '["px","fr","rem","%"]', 1, 'The fr unit represents a fraction of free grid container space.', 3),
('q_02_4', 'quiz_02', 'Which property creates space between grid tracks or flex items?', 'multiple_choice', '["margin","gap","padding","border-spacing"]', 1, 'gap defines the gutter between grid rows/columns or flex items.', 4),
('q_02_5', 'quiz_02', 'What media query feature is used for mobile-first responsive breakpoints?', 'multiple_choice', '["max-width","min-width","orientation","aspect-ratio"]', 1, 'Mobile-first design utilizes min-width queries to progressively enhance larger screens.', 5),
('q_03_1', 'quiz_03', 'Which join returns only matching records from both tables?', 'multiple_choice', '["LEFT JOIN","FULL OUTER JOIN","INNER JOIN","CROSS JOIN"]', 2, 'INNER JOIN selects rows having matching values in both tables.', 1),
('q_03_2', 'quiz_03', 'Which clause filters records after grouping with GROUP BY?', 'multiple_choice', '["WHERE","HAVING","ORDER BY","LIMIT"]', 1, 'HAVING filters aggregate results produced by GROUP BY.', 2),
('q_03_3', 'quiz_03', 'What does ACID stand for in database transaction theory?', 'multiple_choice', '["Atomicity, Consistency, Isolation, Durability","Accuracy, Control, Indexing, Data","Asynchronous, Concurrency, Integrity, Distribution","Action, Commit, Integrity, Deletion"]', 0, 'ACID guarantees database reliability: Atomicity, Consistency, Isolation, Durability.', 3),
('q_03_4', 'quiz_03', 'What type of index is most commonly used in PostgreSQL for equality and range queries?', 'multiple_choice', '["Hash","B-Tree","GiST","GIN"]', 1, 'B-Tree is the default and most versatile index type in relational databases.', 4),
('q_03_5', 'quiz_03', 'Which normal form eliminates transitive functional dependencies?', 'multiple_choice', '["1NF","2NF","3NF","4NF"]', 2, 'Third Normal Form (3NF) requires 2NF and that no non-prime attribute transitively depends on the primary key.', 5),
('q_04_1', 'quiz_04', 'Why are NumPy operations significantly faster than standard Python lists?', 'multiple_choice', '["They run in the cloud","They are implemented in C with contiguous memory storage","They avoid using memory entirely","They only work with text strings"]', 1, 'NumPy stores elements contiguously and executes vectorized operations in compiled C.', 1),
('q_04_2', 'quiz_04', 'What function creates an identity matrix in NumPy?', 'multiple_choice', '["np.zeros()","np.eye()","np.ones()","np.diag()"]', 1, 'np.eye(N) returns an N x N 2-D array with ones on the diagonal and zeros elsewhere.', 2),
('q_04_3', 'quiz_04', 'What is array broadcasting in NumPy?', 'multiple_choice', '["Sending array data over a network socket","Operating on arrays of different shapes under compatible dimensions","Printing the array to stdout","Converting arrays to Pandas dataframes"]', 1, 'Broadcasting describes how NumPy treats arrays with different shapes during arithmetic operations.', 3),
('q_04_4', 'quiz_04', 'Which method returns the dimensions of an ndarray?', 'multiple_choice', '[".size",".shape",".ndim",".length"]', 1, '.shape returns a tuple of integers indicating the size of the array along each axis.', 4),
('q_04_5', 'quiz_04', 'What Pandas method drops rows with null values?', 'multiple_choice', '["df.fillna()","df.dropna()","df.isnull()","df.clean()"]', 1, 'df.dropna() removes rows containing missing or NaN values.', 5),
('q_05_1', 'quiz_05', 'What algorithm is used to compute gradients in neural networks via the chain rule?', 'multiple_choice', '["Gradient Descent","Backpropagation","QuickSort","A* Search"]', 1, 'Backpropagation computes the gradient of the loss function with respect to weights using the chain rule.', 1),
('q_05_2', 'quiz_05', 'Which activation function maps values to a probability distribution between 0 and 1 summing to 1?', 'multiple_choice', '["ReLU","Sigmoid","Softmax","Tanh"]', 2, 'Softmax turns raw logits into a normalized probability distribution over multiple classes.', 2),
('q_05_3', 'quiz_05', 'What is the purpose of a validation dataset in machine learning?', 'multiple_choice', '["To train the final weights of the model","To tune hyperparameters and detect overfitting before testing","To store backups of the model","To increase model complexity"]', 1, 'The validation set provides an unbiased evaluation while tuning model hyperparameters.', 3),
('q_05_4', 'quiz_05', 'What issue occurs when gradients become exponentially small in deep networks?', 'multiple_choice', '["Exploding gradient","Vanishing gradient","Overfitting","Underfitting"]', 1, 'Vanishing gradients prevent early layers from learning effectively in deep architectures.', 4),
('q_05_5', 'quiz_05', 'What does CNN stand for in deep learning?', 'multiple_choice', '["Centralized Neural Network","Convolutional Neural Network","Continuous Node Network","Computed Natural Network"]', 1, 'CNN stands for Convolutional Neural Network, typically used for spatial and visual recognition.', 5),
('q_06_1', 'quiz_06', 'How do Java Virtual Threads differ from traditional platform threads?', 'multiple_choice', '["They run on GPU only","They are lightweight user-mode threads managed by the JVM rather than OS threads","They do not allow network calls","They are limited to 10 threads max"]', 1, 'Virtual threads are lightweight JVM-managed threads, allowing millions of concurrent tasks with minimal overhead.', 1),
('q_06_2', 'quiz_06', 'Which keyword creates an immutable data carrier class in Java 16+?', 'multiple_choice', '["struct","record","data class","val"]', 1, 'record classes in Java are transparent holders for immutable data.', 2),
('q_06_3', 'quiz_06', 'Which collection does NOT preserve the insertion order of elements?', 'multiple_choice', '["ArrayList","HashSet","LinkedHashSet","LinkedList"]', 1, 'HashSet does not make any guarantees as to the iteration order of the elements.', 3),
('q_06_4', 'quiz_06', 'What is the purpose of the Optional<T> class in Java?', 'multiple_choice', '["To improve loop performance","To explicitly represent the presence or absence of a value, avoiding NullPointerExceptions","To format strings","To run asynchronous tasks"]', 1, 'Optional provides a clear API to handle nullable returns safely.', 4),
('q_06_5', 'quiz_06', 'Which functional interface in java.util.function takes one argument and returns a boolean?', 'multiple_choice', '["Consumer<T>","Function<T, R>","Predicate<T>","Supplier<T>"]', 2, 'Predicate<T> represents a predicate (boolean-valued function) of one argument.', 5),
('q_07_1', 'quiz_07', 'What is the correct sequence of the standard TCP three-way handshake?', 'multiple_choice', '["SYN, ACK, FIN","SYN, SYN-ACK, ACK","ACK, SYN, DATA","HELLO, READY, GO"]', 1, 'TCP establishes connections using SYN -> SYN-ACK -> ACK.', 1),
('q_07_2', 'quiz_07', 'On which OSI layer does IP (Internet Protocol) operate?', 'multiple_choice', '["Layer 2 (Data Link)","Layer 3 (Network)","Layer 4 (Transport)","Layer 7 (Application)"]', 1, 'IP is a Layer 3 Network layer protocol responsible for routing.', 2),
('q_07_3', 'quiz_07', 'Which protocol is connectionless and does NOT guarantee packet delivery or order?', 'multiple_choice', '["TCP","UDP","BGP","SSH"]', 1, 'UDP provides fast, unreliable, connectionless datagram delivery.', 3),
('q_07_4', 'quiz_07', 'What standard port does HTTPS utilize by default?', 'multiple_choice', '["80","8080","443","22"]', 2, 'Port 443 is the standard port for TLS/HTTPS encrypted web traffic.', 4),
('q_07_5', 'quiz_07', 'What type of attack floods a target with traffic to exhaust its resources?', 'multiple_choice', '["Phishing","DDoS","Man-in-the-Middle","SQL Injection"]', 1, 'Distributed Denial of Service (DDoS) overwhelms bandwidth or computational capacity.', 5),
('q_08_1', 'quiz_08', 'In a stateless REST API with JWT, what should the SessionCreationPolicy be set to in Spring Security?', 'multiple_choice', '["ALWAYS","IF_REQUIRED","NEVER","STATELESS"]', 3, 'SessionCreationPolicy.STATELESS ensures Spring does not maintain an HTTP session.', 1),
('q_08_2', 'quiz_08', 'What standard HTTP header is used to pass the Bearer JWT token in requests?', 'multiple_choice', '["Cookie","Authorization","X-Auth-Token","Authentication"]', 1, 'The Authorization header formatted as "Bearer <token>" is the standard.', 2),
('q_08_3', 'quiz_08', 'What are the three components of a JSON Web Token separated by periods?', 'multiple_choice', '["Header, Payload, Signature","Username, Password, Salt","Key, Value, Checksum","Algorithm, Body, Hash"]', 0, 'A JWT consists of Header (algorithm), Payload (claims), and Signature (cryptographic verification).', 3),
('q_08_4', 'quiz_08', 'Which Spring annotation marks a class as providing bean definitions for application context?', 'multiple_choice', '["@Service","@Repository","@Configuration","@Controller"]', 2, '@Configuration indicates that a class declares one or more @Bean methods.', 4),
('q_08_5', 'quiz_08', 'Which Spring Data interface provides built-in pagination and sorting out of the box?', 'multiple_choice', '["CrudRepository","JpaRepository","SimpleRepository","QueryRepository"]', 1, 'JpaRepository extends PagingAndSortingRepository, providing full CRUD with pagination.', 5),
('q_09_1', 'quiz_09', 'Why should package manager install commands and cache cleanups be chained in a single RUN instruction?', 'multiple_choice', '["Because Docker only supports one RUN command","To prevent leftover cache files from being committed into intermediate image layers","To speed up CPU processing during execution","To automatically encrypt the container"]', 1, 'Each RUN creates an immutable layer; cleaning caches in the same command minimizes final image size.', 1),
('q_09_2', 'quiz_09', 'What is the purpose of multi-stage Docker builds?', 'multiple_choice', '["To run multiple containers simultaneously","To separate the build environment from the lean runtime image","To publish images to multiple registries","To bypass Docker daemon permissions"]', 1, 'Multi-stage builds allow compiling in heavy build environments and copying only artifacts to minimal images.', 2),
('q_09_3', 'quiz_09', 'Which Docker directive defines the default executable to run when the container starts?', 'multiple_choice', '["RUN","ENTRYPOINT","EXPOSE","WORKDIR"]', 1, 'ENTRYPOINT specifies the command that will always be executed when the container starts.', 3),
('q_09_4', 'quiz_09', 'What is used in Docker to persist data independently of the container lifecycle?', 'multiple_choice', '["Environment variables","Docker Volumes","Image layers","Port mappings"]', 1, 'Volumes are stored on the host filesystem and persist beyond container deletion.', 4),
('q_09_5', 'quiz_09', 'What file excludes files and directories from the Docker build context?', 'multiple_choice', '[".gitignore",".dockerignore","Dockerfile.ignore","docker.conf"]', 1, '.dockerignore prevents unnecessary files from being sent to the Docker daemon.', 5),
('q_10_1', 'quiz_10', 'What is the average time complexity of searching an element in a balanced Binary Search Tree?', 'multiple_choice', '["O(1)","O(log N)","O(N)","O(N log N)"]', 1, 'Each step cuts the remaining search space in half, resulting in logarithmic O(log N) time.', 1),
('q_10_2', 'quiz_10', 'What is the worst-case search complexity in an unbalanced degenerate BST (linked list shape)?', 'multiple_choice', '["O(1)","O(log N)","O(N)","O(N^2)"]', 2, 'When a BST degenerates into a linear chain, searching takes O(N) linear time.', 2),
('q_10_3', 'quiz_10', 'Which tree traversal yields elements in sorted non-decreasing order for a BST?', 'multiple_choice', '["Preorder","Inorder","Postorder","Level-order"]', 1, 'Inorder traversal visits Left -> Root -> Right, which visits nodes in ascending order.', 3),
('q_10_4', 'quiz_10', 'What data structure is typically used to implement Breadth-First Search (BFS)?', 'multiple_choice', '["Stack","Queue","Priority Queue","HashTable"]', 1, 'BFS uses a FIFO Queue to visit all nodes level by level.', 4),
('q_10_5', 'quiz_10', 'What is the time complexity of QuickSort in the average case?', 'multiple_choice', '["O(N)","O(N log N)","O(N^2)","O(2^N)"]', 1, 'QuickSort runs in O(N log N) average time with efficient in-place partitioning.', 5);

-- 10. Quiz Attempts
TRUNCATE TABLE `quiz_attempts`;
INSERT INTO `quiz_attempts` (`id`, `quiz_id`, `student_id`, `score`, `percentage`, `correct_answers`, `incorrect_answers`, `passed`, `attempt_date`, `selected_answers_json`) VALUES
('att_01', 'quiz_01', 'usr_student_01', 50, 100, 5, 0, 1, '2026-09-30T11:39:49.149Z', '{"0":1,"1":1,"2":2,"3":1,"4":1}');

-- 11. Assignments
TRUNCATE TABLE `assignments`;
INSERT INTO `assignments` (`id`, `course_id`, `lesson_id`, `title`, `description`, `instruction`, `due_date`, `supporting_file`, `maximum_score`) VALUES
('asg_01', 'crs_01', 'les_01_03', 'Build Clean Architecture Course Repository in Flutter', 'Construct a decoupled repository layer with abstract contracts, remote data source, and entity mappers.', '1. Define CourseRepository contract with getCourses() and getCourseById().
2. Implement CourseRepositoryImpl with DataSource dependency.
3. Write unit tests for your repository using Mockito or FakeDataSource.', '2026-10-07T11:39:49.147Z', 'https://example.com/starter/clean_architecture_spec.pdf', 100),
('asg_02', 'crs_02', 'les_02_04', 'RESTful API with Node.js & Express', 'Develop a CRUD REST API for a task management application with JSON persistence.', '1. Implement GET, POST, PUT, and DELETE routes on /api/tasks.
2. Handle invalid inputs with HTTP 400 Bad Request.
3. Include a Postman collection export.', '2026-10-06T11:39:49.148Z', 'https://example.com/starter/express_api_guideline.pdf', 100),
('asg_03', 'crs_03', 'les_03_03', 'Database Schema Design & Query Optimization', 'Normalize an unnormalized e-commerce dataset into 3NF and write index-optimized queries.', '1. Produce an ER Diagram in PNG or PDF.
2. Write SQL DDL with foreign keys and cascade rules.
3. Benchmark 3 complex JOIN queries with EXPLAIN ANALYZE.', '2026-10-08T11:39:49.148Z', 'https://example.com/starter/schema_spec.sql', 100),
('asg_04', 'crs_04', 'les_04_03', 'Customer Churn Analysis with Pandas', 'Clean raw telecom datasets, handle missing values, and extract key churn indicators.', '1. Submit a completed Jupyter Notebook (.ipynb).
2. Plot correlation heatmaps and customer lifetime distribution.', '2026-10-09T11:39:49.148Z', 'https://example.com/starter/churn_data.csv', 100),
('asg_05', 'crs_05', 'les_05_02', 'Image Classifier using PyTorch / CNN', 'Train a convolutional neural network on CIFAR-10 reaching at least 75% accuracy.', '1. Submit training script with model architecture, optimizer, and loss curve graph.
2. Save model checkpoint.', '2026-10-12T11:39:49.148Z', 'https://example.com/starter/cnn_starter.py', 100),
('asg_06', 'crs_06', 'les_06_02', 'Interactive Design System Prototype in Figma', 'Create a scalable design system for a mobile e-learning app with auto-layout components.', '1. Include typography, color styles, buttons, inputs, and card components.
2. Provide public Figma preview URL.', '2026-10-05T11:39:49.148Z', 'https://example.com/starter/figma_guidelines.pdf', 100),
('asg_07', 'crs_07', 'les_07_02', 'OOP Banking System in Java with Concurrency', 'Design a thread-safe multi-account transfer engine using Java ReentrantLock or Atomic types.', '1. Implement deadlock prevention.
2. Write unit tests with 100 concurrent worker threads.
3. Package as Maven/Gradle project.', '2026-10-10T11:39:49.148Z', 'https://example.com/starter/banking_spec.pdf', 100),
('asg_08', 'crs_09', 'les_09_02', 'Network Vulnerability Audit & Report', 'Conduct a simulated port scan and TLS certificate evaluation on a target lab machine.', '1. Identify exposed ports and outdated services.
2. Document CVSS severity scores and mitigation instructions.', '2026-10-11T11:39:49.148Z', 'https://example.com/starter/audit_template.docx', 100),
('asg_09', 'crs_11', 'les_11_02', 'Spring Security 6 JWT Auth Microservice', 'Build an authentication microservice with refresh token rotation and BCrypt hashing.', '1. Implement /api/v1/auth/register, /login, and /refresh.
2. Enforce role-based access control on /api/v1/admin endpoints.', '2026-10-14T11:39:49.148Z', 'https://example.com/starter/spring_auth_spec.pdf', 100),
('asg_10', 'crs_15', 'les_15_01', 'Production Multi-Stage Dockerfile', 'Containerize a full-stack web application with minimal image size and non-root user execution.', '1. Write Dockerfile with build stage and runtime stage.
2. Provide docker-compose.yml including database healthcheck.', '2026-10-08T11:39:49.148Z', 'https://example.com/starter/docker_spec.pdf', 100);

-- 12. Assignment Submissions
TRUNCATE TABLE `assignment_submissions`;
INSERT INTO `assignment_submissions` (`id`, `assignment_id`, `student_id`, `submission_date`, `submission_file`, `text_submission`, `comment`, `status`, `score`, `grade`, `feedback`, `reviewed_date`) VALUES
('sub_01', 'asg_01', 'usr_student_01', '2026-10-01T11:39:49.149Z', 'https://example.com/submissions/clean_arch_submission.zip', 'Implemented CourseRepositoryImpl with DataSource abstraction and mock test suite. Code pushed to GitHub repository.', 'Please check the unit test coverage under test/data/repositories.', 'graded', 95, 'A', 'Excellent adherence to Clean Architecture and SOLID principles. Clear separation between domain and data.', '2026-10-02T11:39:49.149Z');

-- 13. Enrollments
TRUNCATE TABLE `enrollments`;
INSERT INTO `enrollments` (`id`, `student_id`, `course_id`, `enrollment_date`, `status`, `progress`) VALUES
('enr_01', 'usr_student_01', 'crs_01', '2026-09-18T11:39:49.149Z', 'active', 45),
('enr_02', 'usr_student_01', 'crs_04', '2026-09-02T11:39:49.149Z', 'completed', 100),
('enr_03', 'usr_student_01', 'crs_10', '2026-09-25T11:39:49.149Z', 'active', 20);

-- 14. Course Progress
TRUNCATE TABLE `course_progress`;
INSERT INTO `course_progress` (`id`, `course_id`, `student_id`, `completed_lessons`, `total_lessons`, `completed_quizzes`, `total_quizzes`, `submitted_assignments`, `total_assignments`, `percentage`, `last_activity`) VALUES
('prog_crs_01_student', 'crs_01', 'usr_student_01', 2, 6, 1, 1, 1, 1, 60, '2026-10-02T08:39:49.149Z'),
('prog_crs_04_student', 'crs_04', 'usr_student_01', 4, 4, 1, 1, 1, 1, 100, '2026-09-30T11:39:49.149Z'),
('prog_crs_10_student', 'crs_10', 'usr_student_01', 0, 2, 0, 0, 0, 0, 0, '2026-09-27T11:39:49.149Z');

-- 15. Certificates
TRUNCATE TABLE `certificates`;
INSERT INTO `certificates` (`id`, `student_id`, `student_name`, `course_id`, `course_title`, `issue_date`, `certificate_code`, `credential_url`, `instructor_name`) VALUES
('cert_01', 'usr_student_01', 'Dara Somnang', 'crs_04', 'Python for Data Science & Machine Learning Foundations', '2026-09-30T11:39:49.150Z', 'CERT-DS-2026-88192', 'https://edulearn.com/verify/CERT-DS-2026-88192', 'Elena Rostova');

-- 16. Learning Activities
TRUNCATE TABLE `learning_activities`;
INSERT INTO `learning_activities` (`id`, `user_id`, `course_id`, `course_title`, `type`, `title`, `timestamp`, `score_or_detail`) VALUES
('act_01', 'usr_student_01', 'crs_01', 'Flutter Mobile Development: Clean Architecture & Riverpod', 'assignmentSubmitted', 'Submitted Assignment: Build Clean Architecture Course Repository', '2026-10-01T11:39:49.150Z', 'Grade: A (95%)'),
('act_02', 'usr_student_01', 'crs_01', 'Flutter Mobile Development: Clean Architecture & Riverpod', 'quizAttempted', 'Completed Quiz: Riverpod 2.0 & Clean State Management', '2026-09-30T11:39:49.150Z', 'Score: 100%'),
('act_03', 'usr_student_01', 'crs_01', 'Flutter Mobile Development: Clean Architecture & Riverpod', 'lessonCompleted', 'Completed Lesson: State Management with Riverpod 2.0', '2026-09-29T11:39:49.150Z', NULL),
('act_04', 'usr_student_01', 'crs_04', 'Python for Data Science & Machine Learning Foundations', 'courseEnrolled', 'Completed Course & Received Certificate', '2026-09-30T11:39:49.150Z', 'Certificate ID: CERT-DS-2026-88192');

-- 17. Notifications
TRUNCATE TABLE `notifications`;
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `created_at`) VALUES
('notif_01', 'usr_student_01', 'Assignment Graded! 🎉', 'Your submission for "Build Clean Architecture Course Repository" received a score of 95/100 (Grade A).', 'assignmentGraded', 0, '2026-10-02T09:39:49.149Z'),
('notif_02', 'usr_student_01', 'Certificate Earned! 📜', 'Congratulations! You have earned your certificate for "Python for Data Science & Machine Learning Foundations".', 'certificateEarned', 0, '2026-09-30T11:39:49.149Z'),
('notif_03', 'usr_student_01', 'New Lesson Available', 'Lesson 6: Connecting to Spring Boot Backend has been added to Flutter Mobile Development.', 'courseUpdate', 1, '2026-09-28T11:39:49.149Z');

-- 18. User Favorites
TRUNCATE TABLE `user_favorites`;
INSERT INTO `user_favorites` (`id`, `user_id`, `course_id`) VALUES
('fav_crs_01_student', 'usr_student_01', 'crs_01'),
('fav_crs_04_student', 'usr_student_01', 'crs_04'),
('fav_crs_10_student', 'usr_student_01', 'crs_10');

SET FOREIGN_KEY_CHECKS = 1;
