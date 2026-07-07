# 🚀 Digital Employee AI

**Your AI-powered content team, packed into one app.** Generate polished, platform-ready content for LinkedIn, Instagram, X, Blogs, Emails, and more — then refine it instantly with AI-driven editing tools.

Built with **React**, **TypeScript**, and the blazing-fast **Groq API** (Llama models), Digital Employee AI turns a simple prompt into publish-ready copy in seconds.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama%203.3-F55036)

---

##  try here 

👉 **[ai-web-companion--sinyakumari6.replit.app](https://ai-web-companion--sinyakumari6.replit.app)**

---

## ✨ Features

### 🤖 AI Content Generation
Generate ready-to-publish content across a wide range of formats:
- LinkedIn Posts
- Instagram Captions
- X (Twitter) Posts
- Facebook Posts
- Threads
- Blog Posts
- Newsletters
- Cold Emails & Professional Emails
- Product Descriptions
- YouTube Descriptions
- Resume Summaries & Cover Letters
- Press Releases
- Customer Support Replies

### 🧠 AI Polish Actions
Fine-tune any generated (or pasted) text with one click:
- **Rewrite** — a fresh take on the same idea
- **Expand** / **Shorten** — adjust length and depth
- **Improve** — sharpen clarity and flow
- **Tone shifts** — Professional, Friendly, Funny, Persuasive
- **Add Emojis** — bring copy to life
- **Fix Grammar** — instant grammar & spelling cleanup
- **Generate Hashtags** — 5–10 relevant hashtags on demand
- **Generate CTA** — add a strong call-to-action

### 🎨 Modern UI/UX
- 🌗 Dark / Light mode
- 📱 Fully responsive design
- 📝 Markdown rendering for generated content
- 🔔 Toast notifications for real-time feedback
- 🕘 History sidebar to revisit past generations
- ⚡ Streaming responses for a fast, live-typing feel

### 🛠️ Utilities
- Word & character count
- Estimated reading time
- Export as **TXT**, **Markdown**, or **PDF**

---

## 🧩 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **AI Inference** | Groq API (Llama 3.3 70B, streaming completions) |
| **Forms & Validation** | React Hook Form, Zod |
| **Data Fetching / State** | TanStack Query |
| **Backend** | Node.js (Express-based API server) |
| **Package Management** | pnpm (monorepo workspace) |

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** ≥ 18
- **pnpm** (this project is a pnpm workspace)
- A free **Groq API key** — get one at [console.groq.com](https://console.groq.com)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/digital-employee-ai.git
cd digital-employee-ai
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Configure environment variables
Create a `.env` file in the API server directory (`artifacts/api-server`) and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

> ⚠️ Never commit your `.env` file. Make sure it's listed in `.gitignore`.

### 4. Run the development servers
```bash
pnpm run build      # type-checks and builds all workspace packages
pnpm --filter api-server run dev       # starts the backend API
pnpm --filter digital-employee-ai run dev   # starts the frontend
```

The frontend will typically be available at `http://localhost:5173`, and the API server at `http://localhost:3000` (check each package's config for exact ports).

---

## 🚀 Usage

1. **Choose a content type** — pick from LinkedIn, Instagram, Blog, Email, and more.
2. **Fill in the details** — product, audience, tone, or topic.
3. **Generate** — watch AI-crafted content stream in live.
4. **Polish** — apply Rewrite, Expand, Tone changes, Hashtags, or a CTA.
5. **Export or copy** — download as TXT, Markdown, or PDF, or copy straight to your clipboard.
6. **Revisit anytime** — previous generations are saved in the history sidebar.

---

## 👩‍💻 Author

**Sinya Kumari**
Creator & Developer of Digital Employee AI

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

If you find this project useful, consider giving it a ⭐ on GitHub!
