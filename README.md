<div align="center">

# 🌸 TOPIKPath — Study • Practice • Master

**The "LeetCode for TOPIK" — Your Complete Personalized TOPIK I & II Preparation Operating System.**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-7.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

[Live Demo](http://localhost:3000) • [Features](#-core-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 🎯 Vision

**TOPIKPath** transforms Korean language test preparation from unstructured memorization into a data-driven, motivating, and gamified mastery journey.

Whether you are targeting **TOPIK I (Level 1–2)** or **TOPIK II (Level 3–6)**, TOPIKPath equips you with:
- **4,333 Official Vocabulary Words** with serial ordering, native audio, romanization, and example sentences.
- **SM-2 Spaced Repetition System** for durable long-term retention.
- **Real Past Papers (PYQs) & Timed Mock Tests** with external practice links to [TOPIK GUIDE](https://www.topikguide.com/) and in-app score analytics.
- **Automated Weak Area Diagnosis** with instant actionable practice missions.
- **Writing Lab for Tasks 51–54** with scoring rubrics and structural templates.
- **Rich Gamification** with XP ranks, daily streaks, achievements, and personal best celebrations.

---

## ✨ Core Features

### 1. 📚 4,333 Official Vocabulary Bank
- **1,671 TOPIK I Words** & **2,662 TOPIK II Words** extracted from official test syllabi.
- Filter by Category, Level, Difficulty, and Part of Speech.
- Text-to-Speech (TTS) Korean audio pronunciation & Hangul breakdown.
- Live search across Korean, English, and Romanization.

### 2. 🎴 SM-2 Spaced Repetition Flashcards Studio
- Adaptive algorithm that calculates optimal review intervals based on card recall difficulty (*Again*, *Hard*, *Good*, *Easy*).
- Flip-card UI with Korean Hangul, romanization, English meaning, and contextual example sentences.

### 3. 📝 Official PYQs & Timed Mock Tests Hub
- Practice with official past examination sets (**96th, 91st, 83rd, 64th, 60th, 52nd, 47th, 41st, 37th, 35th**).
- **External Practice Redirection**: Seamlessly opens tests on trusted providers like [TOPIK GUIDE](https://www.topikguide.com/previous-papers/) in timed mode.
- **Score Logging Engine**: Record Listening, Reading, and Writing scores with automatic total score calculations.
- **Attempt History & Retake Mode**: Track multiple attempts (*Attempt #1, #2, #3*) without overwriting past data.
- **Personal Best Celebrations**: Real-time score comparisons and XP bonus rewards.

### 4. 🧠 Weak Area Diagnosis & Smart Recommendations
- Section diagnostics categorized into 🟢 **Strong ($\ge 80\%$)**, 🟡 **Developing ($60\% - 79\%$)**, and 🔴 **Weak ($< 60\%$)**.
- Dynamic study missions generated automatically after every test (e.g., *"Reading score dropped $\rightarrow$ Complete 20 reading questions + review 15 vocabulary words"*).

### 5. ✍️ TOPIK II Writing Lab (Tasks 51–54)
- **Task 51 & 52**: Short cloze sentence completion practice.
- **Task 53**: Data interpretation and trend graph essay writing with visual charts.
- **Task 54**: 700-character argument essay with real-time character counter and scoring criteria.

### 6. 📊 Score Progression Graph & Growth Hub
- Interactive SVG Score Trend chart showing historical trajectory, averages, and best scores.
- **TOPIK Readiness Indicator**: Estimated exam score vs. rank threshold with target gap analysis.
- **Personal Records Showcase**: Highest mock scores, longest study sessions, and peak streaks.
- **Periodic Reports**: Weekly and monthly study digests.

### 7. 🏆 Gamification & Retention
- **XP Ranks**: From *Hangul Novice* to *TOPIK Grandmaster (Level 6)*.
- **Daily Streak Flame**: Visual motivator to ensure consistent daily practice.
- **Mistake Notebook**: Automatic logging of incorrectly answered questions for targeted re-drills.
- **Study Planner**: Weekly task planner and exam countdown tracker.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) with Custom Dark Theme & Glassmorphism |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database & ORM** | [Prisma 7](https://www.prisma.io/) + [SQLite](https://www.sqlite.org/) (PostgreSQL ready) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) & Tailwind CSS Keyframes |
| **Algorithms** | SuperMemo SM-2 Spaced Repetition Engine |

---

## 🚀 Quick Start

### Prerequisites
- Node.js `v18.18+` or `v20+`
- npm, yarn, or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/topikpath.git
cd topikpath
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment & Database
```bash
cp .env.example .env
npx prisma db push
```

### 4. Run the Local Development Server
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to experience TOPIKPath!

---

## 📂 Project Structure

```
topikpath/
├── prisma/
│   └── schema.prisma              # Data models (Users, Vocab, Grammar, Attempts, Resources)
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root app layout & fonts
│   │   ├── page.tsx               # Main application controller & state orchestrator
│   │   └── globals.css            # Custom glassmorphism utilities & scrollbars
│   ├── components/
│   │   ├── analytics/             # Interactive SVG Score Trend Charts
│   │   ├── auth/                  # Landing page & Login / Signup modal
│   │   ├── brand/                 # MascotLogo & HeroSection
│   │   ├── dashboard/             # Command Center view & live metric widgets
│   │   ├── gamification/          # Achievements modal & XP level tier badges
│   │   ├── grammar/               # Grammar patterns explorer & rule cards
│   │   ├── mock/                  # In-app mock test center & PBT simulation
│   │   ├── navigation/            # Sidebar, TopBar, and Mobile BottomNav
│   │   ├── planner/               # Weekly study planner & exam countdown
│   │   ├── practice/              # MCQ Quiz Engine & SM-2 Flashcards Studio
│   │   ├── profile/               # Redesigned Profile & Growth Hub
│   │   ├── pyq/                   # PYQ & Mock Test Hub, Log Modal, Start Modal
│   │   ├── review/                # Mistake Notebook & targeted re-drill
│   │   └── writing/               # Writing Lab (Tasks 51, 52, 53, 54)
│   ├── data/
│   │   ├── external-resources.ts  # Official TOPIK past papers & mock test data
│   │   ├── topik-i-vocabulary.ts  # 1,671 TOPIK I vocabulary words
│   │   └── topik-ii-vocabulary.ts # 2,662 TOPIK II vocabulary words
│   └── lib/
│       ├── db.ts                  # Prisma client singleton
│       ├── pyq-analytics.ts       # Scoring, weak area & recommendation algorithms
│       └── xp.ts                  # XP level calculation & rank progression
├── public/                        # Static assets & icons
├── .env.example                   # Environment configuration template
├── CONTRIBUTING.md                # Contribution guidelines
├── LICENSE                        # MIT License
└── package.json                   # Dependencies & scripts
```

---

## ⚖️ Legal & Educational Disclaimer

- **TOPIKPath** is an independent preparation platform designed for educational purposes.
- External practice papers and online mock links are referenced from trusted third-party resources such as [TOPIK GUIDE](https://www.topikguide.com/). TOPIKPath does not claim ownership or host copyrighted test assets.
- TOPIK is an official examination administered by the National Institute for International Education (NIIED) of South Korea.

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) to get started with bug fixes, feature requests, or improvements.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

<div align="center">
  <sub>Built with 💖 for Korean language learners worldwide 🌸</sub>
</div>
