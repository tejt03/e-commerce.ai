E-Commerce AI Shopping Assistant

AI-Augmented Full-Stack E-Commerce Platform

A production-style, full-stack e-commerce application built end-to-end to demonstrate real-world backend engineering, database design, API development, and applied AI integration.

Overview:

E-Commerce AI is a working system with persistent data, server-side APIs, and AI used as a data-enrichment layer.

The application supports:

- A live product catalog backed by a relational database.
- Dynamic product detail pages.
- An internal admin dashboard.
- AI-generated product descriptions that are persisted and reused.
- Public deployment with production-style architecture.

Product Catalog

- Server-rendered product listing.
- Dynamic product detail routes.
- Data fetched directly from PostgreSQL via server components.
- Admin Dashboard.
- Internal admin interface.
- Trigger AI operations for individual products

AI-Powered Product Descriptions

- Admin selects a product ID.
- Backend fetches product metadata from the database.
- Groq LLM generates a concise, marketing-ready description.
- Generated content is stored in the database.
- Product pages automatically reflect updated content.

Data Flow:

- Products are seeded into PostgreSQL.
- Frontend renders data using server components. 
- Admin triggers AI generation for a product.
- Backend calls Groq LLM with structured prompt.
- AI output is validated and persisted.
- Updated description is reused across all views.