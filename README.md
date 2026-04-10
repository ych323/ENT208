# ENT208 - Reachable & Eco-System

> **Reachable**: An intelligent career assistant ecosystem combining AI-driven career planning, professional product design, and IoT environmental monitoring.

## 📋 Project Overview

This repository represents a multi-disciplinary approach to professional development and technical integration. It consists of three core pillars:
1.  **Reachable (AI Platform)**: A smart career assistant using Next.js and RAG (Retrieval-Augmentation Generation) to bridge the gap between student skills and job requirements.
2.  **Product Design (PRD)**: A structured Product Requirements Document detailing the vision for a Student Career Prep Platform.
3.  **Hardware Monitoring (IoT)**: An environmental monitoring and alarm system built on M5Stack to demonstrate hardware-software synergy.

---

## 📂 Repository Structure

```text
.
├── projects/                # Core Reachable AI platform code (Next.js + AI)
├── documentary_evident/     # PRD and project validation documents
├── m5/                      # M5Stack IoT system files and explanations
└── README.md                # (Current) Global project introduction
```

---

## 🚀 Core Modules

### 1. Reachable - AI Career Assistant (`/projects`)
A modern web application built with **Next.js 16 and React 19**:
* **Conversational Profiling**: Generates 6-dimensional ability profiles (Technical, Experience, Communication, etc.) through natural dialogue.
* **RAG Job Matching**: Uses vector database semantic search to match users with 20+ real-world positions from top tech firms.
* **Tech Stack**: Built using TypeScript, Tailwind CSS 4, Supabase (PostgreSQL), and Zhipu GLM-5.
* **Community**: Features a Career Forum for interview sharing and a Learning Library for curated resources.

### 2. Student Career Prep Platform PRD (`/documentary_evident`)
A comprehensive guide to solving the fragmented information problem for internship applicants:
* **Vision**: A centralized hub for discovering opportunities, reading interview experiences, and accessing question banks.
* **Target Users**: Specifically designed for undergraduate students facing the stress of first-time applications.
* **Success Metrics**: Focuses on user efficiency in finding relevant roles and organized preparation.

### 3. M5Stack Alarm System (`/m5`)
A practical IoT application developed using **UIFlow 2.0**:
* **Real-time Monitoring**: Continuously detects temperature, humidity, and air pressure.
* **Logic Engine**: Triggers an alarm (buzzer, RGB lights, or on-screen warnings) when any value exceeds a preset threshold.
* **Visual Feedback**: Displays all environmental data directly on the M5Stack screen for intuitive observation.

---

## 🛠️ Getting Started

### Software Development (Reachable)
```bash
cd projects
pnpm install
# Configure your ZHIPU_API_KEY in .env.local
pnpm dev
```
For detailed environment variables, see [projects/README.md](./projects/README.md).

### Hardware Setup (M5Stack)
* **Environment**: UIFlow 2.0.
* **Hardware**: M5Stack device + Environmental Sensors.
* For logic details, refer to [m5/M5_explanation.md](./m5/M5_explanation.md).

---

## 🎓 Learning Outcomes

Through this project, we have demonstrated expertise across the full technical spectrum:
* **Embedded Systems**: Reading sensor data and implementing hardware logic.
* **Product Management**: Defining MVP scope and technical architecture for complex problems.
* **Full-Stack AI Development**: Implementing RAG technology and streaming conversations in a modern web framework.

---

## 📄 License
The software portion of this project is licensed under the [MIT License](./projects/README.md#license).
