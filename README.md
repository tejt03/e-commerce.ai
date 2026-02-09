🛒 E-Commerce AI Shopping Assistant

- A modern full-stack e-commerce application enhanced with AI features.
- Users can create an account, browse products, view personalized recommendations, manage a cart, and ask for suggestions using an AI chatbot assistant.
- Admins can modify product descriptions with a single prompt through an AI-powered description generator, making content updates fast and efficient.

This project demonstrates how AI can be integrated into real product workflows, not just demos.

🚀 Live Demo
👉 Production URL: https://e-commerceai.vercel.app

✨ Key Features:-

🧠 AI Chatbot Shopping Assistant:-

- Conversational chatbot fixed to the bottom-right of the site.

- Understands categories, budgets, and intent.

- Strictly recommends products only from the database.

- Gracefully responds to questions and provides suggestions.

🛍️ E-Commerce Core:-

- Product listing & detail pages.

- Add to cart, remove, update quantity.

- Cart badge updates in real time.

- Checkout flow with order summary, and an order success page.

🔐 Authentication & Admin.

- User authentication via Supabase.

- Admin-only dashboard.

- AI-generated product descriptions (stored in DB).

- Role-based access using Row Level Security (RLS).

🧰 Tech Stack:- 

Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS

Backend

- Supabase (PostgreSQL + Auth + RLS)
- Server Components & API routes

AI

- Groq API (LLaMA-based models)
- Constraint-aware recommendation logic
- Deterministic filtering before AI selection

Deployment

- Vercel (production)

🧩 Architecture Highlights:-

- Server-side rendering for SEO and performance.

- Event-based cart badge updates.

- AI constrained by database results (no hallucinated products).

- Clean separation of client and server logic.