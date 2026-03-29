# Builds: Bridging Ideas and Impact

![Builds Logo](/public/logo.png)

> **Builds** is an elite, AI-powered launchpad where visionaries turn coffee into code. We bridge the gap between frontier technology and human collaborative innovation, providing a high-signal platform for early-stage builders to launch, find talent, and scale with community-driven momentum.

---

## 💎 The Premium Builder Experience

Builds isn't just a directory; it's a living ecosystem designed for the modern developer and founder.

### ✨ Core Features

-   🤖 **Builds AI Assistant**: A sophisticated agentic assistant to discover startups, post jobs, and search the ecosystem registry with natural language.
-   🚀 **The Builder Portal**: Launch your MVP, gather high-signal community feedback, and find your first hires in a dedicated ecosystem.
-   🔭 **Explorer Mode**: Discover stealth startups and curated AI/Tech updates before they hit mainstream headlines.
-   ⚡ **Platform Sync**: Real-time signal tracking for agentic AI, coding assistants, and frontier tech updates (with manual/cron override).
-   🌊 **Effortless UX**: Inertial smooth scrolling powered by Lenis and motion-driven reveals for a "liquid" platform feel.

---

## 🏗️ Technical Architecture

Built for scale, speed, and aesthetics. Our stack reflects the quality of the projects we host.

| Component | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/), [Lenis](https://lenis.darkroom.engineering/) |
| **Server** | [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) |
| **Database** | [MongoDB](https://www.mongodb.com/) with native aggregation |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) (Google, GitHub, Auth0) |
| **Shaders** | [Paper Design Shaders](https://github.com/paper-design/shaders-react) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

Ensure you have [Node.js 20+](https://nodejs.org/) and a MongoDB instance ready.

### 1. Installation

```bash
git clone https://github.com/lakshaymeghlan/Builds.git
cd Builds
npm install
```

### 2. Environment Setup

Create a `.env.local` file with the following keys:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=http://localhost:3000

# Social Auth
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...

# AI Signal Sources (Optional)
AI_NEWS_RSS=...
```

### 3. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to enter the ecosystem.

---

## 🛠️ Contribution

We welcome contributions from builders! If you have a feature idea or found a bug, feel free to open a PR.

1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by <b>Lakshay Meghlan</b></p>
  <p><i>Founder & Lead Engineer</i></p>
</div>
