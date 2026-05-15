# Product Requirements Document (PRD)

## 1. Product Overview

**Product Name:** Student Career Prep Platform  

**Product Vision:**  
The Student Career Prep Platform is designed to support university students, especially first-time internship applicants, by bringing together internship opportunities, interview experiences, and preparation resources in one place. The platform aims to reduce the difficulty caused by fragmented information and help students prepare for applications more efficiently and confidently.

## 2. Problem Statement

Many students face difficulties during internship preparation because useful information is scattered across multiple channels, such as job websites, social media platforms, student group chats, and informal peer networks. As a result, students often spend too much time searching for opportunities and lack access to structured, practical interview preparation support. This creates stress, confusion, and lower confidence during the application process.

## 3. Target Users

The primary target users are undergraduate students, especially second- and third-year students, who are preparing for internships and have limited access to reliable guidance, senior advice, or organized preparation resources.

## 4. Product Goal

The main goal of the platform is to provide students with a simple, practical, and student-friendly space where they can:  
- discover internship opportunities,  
- learn from real interview experiences,  
- access interview questions by role or company, and  
- save useful resources for future preparation.

## 5. User Stories

1. **As a first-time internship applicant, I want to browse relevant internship opportunities, so that I can find suitable openings without searching across multiple platforms.**

2. **As a student preparing for interviews, I want to read real interview experiences shared by other students, so that I can better understand the application and interview process.**

3. **As a student applicant, I want to search interview questions by role or company, so that I can prepare for likely questions in a more focused way.**

4. **As a user, I want to save useful jobs, posts, and interview questions, so that I can return to them later during my preparation.**

5. **As a student who feels unsure about the process, I want to ask questions in a peer discussion space, so that I can get practical advice from others with relevant experience.**

6. **As a new user, I want the platform content to be clearly organized, so that I can quickly find the most useful information and take action.**

## 6. Core Features

| User Story | Related Feature | Description |
|---|---|---|
| 1 | Internship Opportunities Feed | A simple feed showing internship opportunities relevant to students, with filters such as role, company, and deadline. |
| 2 | Interview Experience Section | A section where students can read interview experiences shared by peers, including company, role, interview stages, and advice. |
| 3 | Searchable Interview Question Bank | A database of interview questions that users can search by company, role, or keyword. |
| 4 | Save / Bookmark Function | Users can save jobs, interview posts, and interview questions to a personal saved-items page. |
| 5 | Peer Discussion / Q&A | A basic discussion space where users can ask questions and reply to others. |
| 6 | Clear Homepage and Navigation | A structured homepage with clear categories, search bar, and easy access to main sections. |

## 7. MVP Scope

For the first version, the product should remain simple and practical. The MVP will include:  
- internship opportunities feed,  
- interview experience sharing section,  
- interview question bank,  
- save/bookmark feature,  
- basic Q&A discussion function.  

More advanced features such as AI recommendations, direct messaging, or personalized dashboards should be considered only in later stages.

## 8. Initial Technical Architecture

### Front-end
- **Technology:** React or Next.js  
- **Purpose:** Build a responsive web interface that is easy for students to access on both laptop and mobile browsers  
- **Main Pages:** Home, Jobs, Interview Experiences, Question Bank, Saved Items, Q&A

### Back-end
- **Technology:** Node.js with Express or Next.js API routes  
- **Purpose:** Handle requests for retrieving content, saving items, searching questions, and posting discussion content  
- **Functions:**  
  - fetch internship opportunities  
  - fetch interview experience posts  
  - search interview questions  
  - save bookmarks  
  - submit questions and replies

### Data Storage
- **Technology:** PostgreSQL or Supabase  
- **Purpose:** Store user and content data in a structured way  
- **Core Tables:**  
  - `users`  
  - `jobs`  
  - `interview_experiences`  
  - `interview_questions`  
  - `saved_items`  
  - `discussion_posts`  
  - `discussion_replies`

### Deployment
- **Suggested tools:** Vercel for front-end deployment, Supabase for database and authentication  
- This setup is practical for a student project because it is low-cost, simple to manage, and fast to prototype.

## 9. Success Metrics

The initial success of the MVP can be evaluated through simple and realistic measures:  
- users can find one relevant internship opportunity within 2 minutes,  
- users can find one useful interview experience or interview question within 2 minutes,  
- users save at least one useful item during testing,  
- users report that the platform makes internship preparation feel more organized and easier to begin.

## 10. Conclusion

This product focuses on solving a practical student problem: the difficulty of preparing for internships when useful information is fragmented and hard to access. By keeping the first version focused on a few core features, the platform can provide immediate value to students while remaining realistic and achievable as a student project.
