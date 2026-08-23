# Contributing to TOPIKPath 🌸

Thank you for your interest in contributing to **TOPIKPath** — the all-in-one TOPIK I & II preparation platform!

---

## 🛠️ How to Contribute

### 1. Reporting Bugs & Proposing Features
- Search existing issues to ensure your bug or feature request isn't already logged.
- Open an Issue with a clear title, description, and steps to reproduce (or proposed design mockups).

### 2. Developing Locally
1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/your-username/topikpath.git
   cd topikpath
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Setup environment & Prisma DB**:
   ```bash
   cp .env.example .env
   npx prisma db push
   ```
4. **Run the local dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

### 3. Code Standards & Guidelines
- **TypeScript**: Strict type checking. Avoid `any` where possible.
- **Styling**: Modern Tailwind CSS utility classes following our dark aesthetic palette.
- **Aesthetics & Performance**: Ensure responsive layout on both mobile and desktop viewports.
- **Commit Messages**: Write meaningful commit messages (e.g. `feat: add 96th TOPIK answer key parser`, `fix: sm-2 interval calculation`).

---

## 📄 License
By contributing to TOPIKPath, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
