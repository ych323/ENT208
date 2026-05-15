export type ResourceType = 'books' | 'courses' | 'practice';
export type ResourceTrack =
  | 'frontend'
  | 'backend'
  | 'algorithm'
  | 'data'
  | 'product'
  | 'operation'
  | 'design'
  | 'devops'
  | 'mobile'
  | 'qa';

export type ResourceRecord = {
  id: string;
  title: string;
  description: string;
  url: string;
  tracks: ResourceTrack[];
  type: ResourceType;
  level: string;
  provider: string;
  language: 'en' | 'zh' | 'mixed';
  free: boolean;
};

export const resourceCatalog: ResourceRecord[] = [
  { id: 'mdn-learn', title: 'MDN Learn Web Development', description: 'HTML, CSS, JS, accessibility, and browser fundamentals.', url: 'https://developer.mozilla.org/en-US/docs/Learn', tracks: ['frontend'], type: 'courses', level: 'Beginner', provider: 'MDN', language: 'en', free: true },
  { id: 'javascript-info', title: 'JavaScript.info', description: 'A structured JavaScript curriculum for product-grade engineering.', url: 'https://javascript.info/', tracks: ['frontend', 'backend'], type: 'books', level: 'Beginner', provider: 'JavaScript.info', language: 'en', free: true },
  { id: 'react-learn', title: 'React Learn', description: 'Official React learning path for state, effects, and rendering.', url: 'https://react.dev/learn', tracks: ['frontend'], type: 'courses', level: 'Intermediate', provider: 'React', language: 'en', free: true },
  { id: 'nextjs-learn', title: 'Next.js Learn', description: 'Routing, rendering, and data fetching for modern web apps.', url: 'https://nextjs.org/learn', tracks: ['frontend'], type: 'courses', level: 'Intermediate', provider: 'Vercel', language: 'en', free: true },
  { id: 'ts-handbook', title: 'TypeScript Handbook', description: 'Types, narrowing, generics, and large-codebase safety.', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', tracks: ['frontend', 'backend'], type: 'books', level: 'Intermediate', provider: 'Microsoft', language: 'en', free: true },
  { id: 'learn-css', title: 'web.dev Learn CSS', description: 'Modern CSS, layout, responsive design, and forms.', url: 'https://web.dev/learn/css', tracks: ['frontend', 'design'], type: 'courses', level: 'Beginner', provider: 'Google', language: 'en', free: true },
  { id: 'fcc-responsive', title: 'freeCodeCamp Responsive Web Design', description: 'Project-based responsive frontend practice.', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', tracks: ['frontend'], type: 'practice', level: 'Beginner', provider: 'freeCodeCamp', language: 'en', free: true },
  { id: 'frontend-mentor', title: 'Frontend Mentor', description: 'Real UI challenges for responsive implementation and portfolios.', url: 'https://www.frontendmentor.io/challenges', tracks: ['frontend', 'design'], type: 'practice', level: 'Practice', provider: 'Frontend Mentor', language: 'en', free: true },
  { id: 'cssbattle', title: 'CSSBattle', description: 'Fast layout precision drills for CSS fluency.', url: 'https://cssbattle.dev/', tracks: ['frontend'], type: 'practice', level: 'Practice', provider: 'CSSBattle', language: 'en', free: true },
  { id: 'javascript30', title: 'JavaScript30', description: '30 short browser projects for DOM and API practice.', url: 'https://javascript30.com/', tracks: ['frontend'], type: 'practice', level: 'Beginner', provider: 'Wes Bos', language: 'en', free: true },
  { id: 'patterns-dev', title: 'Patterns.dev', description: 'Frontend architecture and rendering pattern reference.', url: 'https://www.patterns.dev/', tracks: ['frontend', 'backend'], type: 'books', level: 'Advanced', provider: 'Patterns.dev', language: 'en', free: true },
  { id: 'node-learn', title: 'Node.js Learn', description: 'Official Node.js path for runtime, modules, and streams.', url: 'https://nodejs.org/en/learn', tracks: ['backend'], type: 'courses', level: 'Beginner', provider: 'Node.js', language: 'en', free: true },
  { id: 'express-guide', title: 'Express Guide', description: 'Routing, middleware, and service delivery basics.', url: 'https://expressjs.com/en/guide/routing.html', tracks: ['backend'], type: 'courses', level: 'Beginner', provider: 'Express', language: 'en', free: true },
  { id: 'fastapi-tutorial', title: 'FastAPI Tutorial', description: 'API design, validation, and async backend handlers.', url: 'https://fastapi.tiangolo.com/tutorial/', tracks: ['backend'], type: 'courses', level: 'Intermediate', provider: 'FastAPI', language: 'en', free: true },
  { id: 'gobyexample', title: 'Go by Example', description: 'Service and concurrency basics through short code examples.', url: 'https://gobyexample.com/', tracks: ['backend', 'devops'], type: 'courses', level: 'Beginner', provider: 'Go by Example', language: 'en', free: true },
  { id: 'postgres-tutorial', title: 'PostgreSQL Tutorial', description: 'SQL, joins, indexing, and relational modeling.', url: 'https://www.postgresql.org/docs/current/tutorial.html', tracks: ['backend', 'data'], type: 'courses', level: 'Intermediate', provider: 'PostgreSQL', language: 'en', free: true },
  { id: 'redis-university', title: 'Redis University', description: 'Caching, data structures, and Redis usage courses.', url: 'https://university.redis.com/', tracks: ['backend', 'devops'], type: 'courses', level: 'Intermediate', provider: 'Redis', language: 'en', free: true },
  { id: 'system-design-primer', title: 'System Design Primer', description: 'Scalability, tradeoffs, and architecture interview reference.', url: 'https://github.com/donnemartin/system-design-primer', tracks: ['backend', 'devops'], type: 'books', level: 'Advanced', provider: 'GitHub', language: 'en', free: true },
  { id: 'ddia', title: 'Designing Data-Intensive Applications', description: 'The best book for distributed systems and data architecture.', url: 'https://dataintensive.net/', tracks: ['backend', 'data', 'devops'], type: 'books', level: 'Advanced', provider: 'DDIA', language: 'en', free: false },
  { id: 'roadmap-backend', title: 'roadmap.sh Backend', description: 'A clear backend learning map when your path feels scattered.', url: 'https://roadmap.sh/backend', tracks: ['backend'], type: 'practice', level: 'Beginner', provider: 'roadmap.sh', language: 'en', free: true },
  { id: 'kubernetes-basics', title: 'Kubernetes Basics', description: 'Pods, deployments, services, and cluster basics.', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', tracks: ['devops', 'backend'], type: 'courses', level: 'Intermediate', provider: 'Kubernetes', language: 'en', free: true },
  { id: 'docker-start', title: 'Docker Get Started', description: 'Container images, compose, and local orchestration.', url: 'https://docs.docker.com/get-started/', tracks: ['devops', 'backend'], type: 'courses', level: 'Beginner', provider: 'Docker', language: 'en', free: true },
  { id: 'github-actions', title: 'GitHub Actions Docs', description: 'CI/CD automation and release workflow basics.', url: 'https://docs.github.com/actions', tracks: ['devops', 'qa'], type: 'courses', level: 'Intermediate', provider: 'GitHub', language: 'en', free: true },
  { id: 'terraform-tutorials', title: 'Terraform Tutorials', description: 'Infrastructure as code for repeatable environments.', url: 'https://developer.hashicorp.com/terraform/tutorials', tracks: ['devops'], type: 'courses', level: 'Intermediate', provider: 'HashiCorp', language: 'en', free: true },
  { id: 'linux-journey', title: 'Linux Journey', description: 'Linux CLI grounding for platform and backend roles.', url: 'https://linuxjourney.com/', tracks: ['devops', 'backend'], type: 'courses', level: 'Beginner', provider: 'Linux Journey', language: 'en', free: true },
  { id: 'prometheus-start', title: 'Prometheus Getting Started', description: 'Metrics, alerts, and monitoring basics.', url: 'https://prometheus.io/docs/tutorials/getting_started/', tracks: ['devops', 'qa'], type: 'courses', level: 'Intermediate', provider: 'Prometheus', language: 'en', free: true },
  { id: 'huggingface-course', title: 'Hugging Face Course', description: 'Transformers and NLP workflows with practical code.', url: 'https://huggingface.co/learn/nlp-course/chapter1/1', tracks: ['algorithm', 'data'], type: 'courses', level: 'Intermediate', provider: 'Hugging Face', language: 'en', free: true },
  { id: 'pytorch-tutorials', title: 'PyTorch Tutorials', description: 'Tensors, autograd, training loops, and deployment basics.', url: 'https://pytorch.org/tutorials/', tracks: ['algorithm', 'data'], type: 'courses', level: 'Intermediate', provider: 'PyTorch', language: 'en', free: true },
  { id: 'kaggle-learn', title: 'Kaggle Learn', description: 'Practical Python, pandas, ML, and feature engineering modules.', url: 'https://www.kaggle.com/learn', tracks: ['algorithm', 'data'], type: 'courses', level: 'Beginner', provider: 'Kaggle', language: 'en', free: true },
  { id: 'fsdl', title: 'Full Stack Deep Learning', description: 'Bridge model training to deployment and monitoring.', url: 'https://fullstackdeeplearning.com/', tracks: ['algorithm', 'data', 'backend'], type: 'courses', level: 'Advanced', provider: 'FSDL', language: 'en', free: true },
  { id: 'mit-6006', title: 'MIT 6.006 Algorithms', description: 'A strong algorithms course for interviews and modeling.', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/', tracks: ['algorithm'], type: 'courses', level: 'Advanced', provider: 'MIT OCW', language: 'en', free: true },
  { id: 'cs50-ai', title: 'CS50 AI with Python', description: 'Search, uncertainty, optimization, and learning.', url: 'https://cs50.harvard.edu/ai/', tracks: ['algorithm'], type: 'courses', level: 'Intermediate', provider: 'Harvard', language: 'en', free: true },
  { id: 'deep-learning-book', title: 'Deep Learning Book', description: 'The classic free online deep learning text.', url: 'https://www.deeplearningbook.org/', tracks: ['algorithm'], type: 'books', level: 'Advanced', provider: 'Deep Learning Book', language: 'en', free: true },
  { id: 'stanford-cs229', title: 'CS229 Lecture Notes', description: 'Machine learning math and theory notes.', url: 'https://cs229.stanford.edu/materials.html-full', tracks: ['algorithm', 'data'], type: 'books', level: 'Advanced', provider: 'Stanford', language: 'en', free: true },
  { id: 'leetcode-150', title: 'LeetCode Top Interview 150', description: 'Focused DSA interview drills across common patterns.', url: 'https://leetcode.com/studyplan/top-interview-150/', tracks: ['algorithm', 'backend', 'mobile'], type: 'practice', level: 'Interview', provider: 'LeetCode', language: 'en', free: true },
  { id: 'neetcode-roadmap', title: 'NeetCode Roadmap', description: 'A cleaner problem order for algorithm interview prep.', url: 'https://neetcode.io/roadmap', tracks: ['algorithm', 'backend', 'mobile'], type: 'practice', level: 'Interview', provider: 'NeetCode', language: 'en', free: true },
  { id: 'sqlbolt', title: 'SQLBolt', description: 'Interactive SQL lessons for analysis and backend work.', url: 'https://sqlbolt.com/', tracks: ['data', 'backend'], type: 'practice', level: 'Beginner', provider: 'SQLBolt', language: 'en', free: true },
  { id: 'mode-sql', title: 'Mode SQL Tutorial', description: 'Business-facing SQL examples and reporting basics.', url: 'https://mode.com/sql-tutorial/', tracks: ['data'], type: 'courses', level: 'Beginner', provider: 'Mode', language: 'en', free: true },
  { id: 'dbt-fundamentals', title: 'dbt Fundamentals', description: 'Analytics engineering, testing, and data modeling.', url: 'https://learn.getdbt.com/learn/course/dbt-fundamentals', tracks: ['data'], type: 'courses', level: 'Intermediate', provider: 'dbt Labs', language: 'en', free: true },
  { id: 'de-zoomcamp', title: 'Data Engineering Zoomcamp', description: 'Pipelines, orchestration, and warehousing program.', url: 'https://github.com/DataTalksClub/data-engineering-zoomcamp', tracks: ['data', 'backend'], type: 'courses', level: 'Intermediate', provider: 'DataTalksClub', language: 'en', free: true },
  { id: 'duckdb-docs', title: 'DuckDB Documentation', description: 'Modern local analytics and ad hoc SQL workflows.', url: 'https://duckdb.org/docs/', tracks: ['data'], type: 'books', level: 'Intermediate', provider: 'DuckDB', language: 'en', free: true },
  { id: 'observable-plot', title: 'Observable Plot', description: 'A fast route to clean exploratory visualizations.', url: 'https://observablehq.com/plot/', tracks: ['data', 'design'], type: 'practice', level: 'Practice', provider: 'Observable', language: 'en', free: true },
  { id: 'inspired', title: 'Inspired', description: 'A core product book for discovery and delivery.', url: 'https://www.svpg.com/books/inspired-how-to-create-tech-products-customers-love/', tracks: ['product'], type: 'books', level: 'Beginner', provider: 'SVPG', language: 'en', free: false },
  { id: 'svpg-articles', title: 'SVPG Articles', description: 'Product essays on discovery, strategy, and execution.', url: 'https://www.svpg.com/articles/', tracks: ['product'], type: 'books', level: 'Intermediate', provider: 'SVPG', language: 'en', free: true },
  { id: 'nn-group', title: 'Nielsen Norman Group Articles', description: 'UX research and interface decision guidance.', url: 'https://www.nngroup.com/articles/', tracks: ['product', 'design'], type: 'books', level: 'Intermediate', provider: 'NN/g', language: 'en', free: true },
  { id: 'mind-the-product', title: 'Mind the Product', description: 'Interviews, essays, and frameworks for PM growth.', url: 'https://www.mindtheproduct.com/', tracks: ['product'], type: 'courses', level: 'Intermediate', provider: 'Mind the Product', language: 'en', free: true },
  { id: 'figma-community', title: 'Figma Community', description: 'Flows, kits, and examples for PMs and designers.', url: 'https://www.figma.com/community', tracks: ['product', 'design'], type: 'practice', level: 'Practice', provider: 'Figma', language: 'en', free: true },
  { id: 'amplitude-playbook', title: 'Amplitude Product Analytics Playbook', description: 'Funnels, retention, events, and growth analysis.', url: 'https://amplitude.com/product-analytics-playbook', tracks: ['product', 'operation', 'data'], type: 'books', level: 'Intermediate', provider: 'Amplitude', language: 'en', free: true },
  { id: 'hubspot-academy', title: 'HubSpot Academy', description: 'Free operations and marketing coursework.', url: 'https://academy.hubspot.com/', tracks: ['operation'], type: 'courses', level: 'Beginner', provider: 'HubSpot', language: 'en', free: true },
  { id: 'ga-academy', title: 'Google Analytics Academy', description: 'Measurement and analytics basics for growth roles.', url: 'https://analytics.google.com/analytics/academy/', tracks: ['operation', 'data'], type: 'courses', level: 'Beginner', provider: 'Google', language: 'en', free: true },
  { id: 'skillshop', title: 'Google Skillshop', description: 'Free platform courses for ads and campaign tooling.', url: 'https://skillshop.withgoogle.com/', tracks: ['operation'], type: 'courses', level: 'Intermediate', provider: 'Google', language: 'en', free: true },
  { id: 'meta-blueprint', title: 'Meta Blueprint', description: 'Channel and campaign learning for growth operations.', url: 'https://www.facebook.com/business/learn', tracks: ['operation'], type: 'courses', level: 'Intermediate', provider: 'Meta', language: 'en', free: true },
  { id: 'semrush-academy', title: 'Semrush Academy', description: 'SEO and content operations coursework.', url: 'https://www.semrush.com/academy/', tracks: ['operation'], type: 'courses', level: 'Intermediate', provider: 'Semrush', language: 'en', free: true },
  { id: 'ahrefs-blog', title: 'Ahrefs Blog', description: 'Tactical SEO and content growth articles.', url: 'https://ahrefs.com/blog/', tracks: ['operation'], type: 'books', level: 'Intermediate', provider: 'Ahrefs', language: 'en', free: true },
  { id: 'material-design', title: 'Material Design', description: 'Interface systems, motion, and component guidance.', url: 'https://m3.material.io/', tracks: ['design', 'frontend'], type: 'books', level: 'Intermediate', provider: 'Google', language: 'en', free: true },
  { id: 'laws-of-ux', title: 'Laws of UX', description: 'Fast-reference UX principles for design and product interviews.', url: 'https://lawsofux.com/', tracks: ['design', 'product'], type: 'books', level: 'Beginner', provider: 'Laws of UX', language: 'en', free: true },
  { id: 'adobe-color', title: 'Adobe Color', description: 'Color system exploration for interface and brand design.', url: 'https://color.adobe.com/', tracks: ['design'], type: 'practice', level: 'Practice', provider: 'Adobe', language: 'en', free: true },
  { id: 'android-compose', title: 'Android Basics with Compose', description: 'Official Android path for Kotlin and Compose.', url: 'https://developer.android.com/courses/android-basics-compose/course', tracks: ['mobile'], type: 'courses', level: 'Beginner', provider: 'Android Developers', language: 'en', free: true },
  { id: 'swift-tutorials', title: 'Develop in Swift Tutorials', description: 'Apple path for Swift and SwiftUI basics.', url: 'https://developer.apple.com/tutorials/develop-in-swift', tracks: ['mobile'], type: 'courses', level: 'Beginner', provider: 'Apple', language: 'en', free: true },
  { id: 'react-native-docs', title: 'React Native Docs', description: 'Cross-platform mobile fundamentals with JS/TS.', url: 'https://reactnative.dev/docs/getting-started', tracks: ['mobile', 'frontend'], type: 'courses', level: 'Intermediate', provider: 'React Native', language: 'en', free: true },
  { id: 'playwright-docs', title: 'Playwright Documentation', description: 'Browser automation and end-to-end testing workflows.', url: 'https://playwright.dev/docs/intro', tracks: ['qa', 'frontend'], type: 'courses', level: 'Intermediate', provider: 'Playwright', language: 'en', free: true },
  { id: 'cypress-docs', title: 'Cypress Documentation', description: 'Practical UI and API test automation patterns.', url: 'https://docs.cypress.io/guides/overview/why-cypress', tracks: ['qa', 'frontend'], type: 'courses', level: 'Intermediate', provider: 'Cypress', language: 'en', free: true },
  { id: 'postman-learning', title: 'Postman Learning Center', description: 'API collections, testing, and debugging basics.', url: 'https://learning.postman.com/', tracks: ['qa', 'backend'], type: 'courses', level: 'Beginner', provider: 'Postman', language: 'en', free: true },
];

export function normalizeTrackValue(value?: string | null): ResourceTrack | 'all' {
  if (!value) return 'all';

  const validTracks: Array<ResourceTrack | 'all'> = ['all', 'frontend', 'backend', 'algorithm', 'data', 'product', 'operation', 'design', 'devops', 'mobile', 'qa'];
  return validTracks.includes(value as ResourceTrack | 'all') ? (value as ResourceTrack | 'all') : 'all';
}
