AntsShop — README

Overview
AntsShop lets users:

Register & log in — authentication stored as an HTTP cookie so the browser can make authenticated requests.

Browse products & categories — responsive index and category pages; click a product to view details.

Search with hybrid search — semantic vectors (Chroma) + Postgres keyword matching; results are merged and ranked for relevance.

Add to cart & checkout — view subtotal, tax, and total; pay via PayPal (sandbox).

View orders — orders page lists past orders and lets users expand each order to see itemized details and timestamps.

Admin panel — protected admin routes for product/category CRUD; admins are granted via the database.

Highlights & UX
Cookie‑based auth: login/register set an HTTP cookie; frontend includes credentials: "include" for protected API calls.

Hybrid search pipeline: semantic embedding → Chroma vector search → Postgres keyword search → merge & dedupe. Semantic matches are preserved in order; exact keyword matches follow.

Cart totals: clear display of totals with and without taxes so users can review charges before paying.

PayPal sandbox: integrated for safe testing of the full checkout flow and redirect/capture flow.

Orders UX: inline expandable order details appear directly under each order for quick inspection.

Admin tools: add, update, remove products and categories from a protected admin area.

Architecture & design
Domain‑Driven Design (DDD)  
The backend is organized around domain models, repositories, and use cases. Business logic lives in use case classes, keeping controllers thin and behavior explicit and testable.

Event‑Driven Architecture (in progress)  
The project is being migrated toward an event‑driven approach. Domain events (for example, payment completed, order created, cart cleared) are published so other parts of the system can react asynchronously. This enables future features like inventory updates, email notifications, analytics, and microservices integration without coupling them to the synchronous request flow.

Separation of concerns  
Frontend and backend are separate apps. The frontend consumes the backend API and uses cookie authentication for protected endpoints. This separation makes it easy to deploy the frontend as a static site and scale the backend independently.

Running locally (quick start)
Prerequisites

Python 3.10+ (backend)

Node 16+/18+ (frontend)

PostgreSQL database

Chroma vector store (persistent folder)

PayPal sandbox account (client id & secret)

Environment variables (example)  
Set your DB, Chroma path, and PayPal sandbox credentials in your environment or .env:

Code
DATABASE_URL=postgresql://user:pass@localhost:5432/antsshop
CHROMA_PERSIST_DIR=./chroma_db
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_secret
FRONTEND_URL=http://localhost:3000
Start the backend

Create and activate a virtual environment, install dependencies.

Run migrations (if present).

Start the API server.

Example commands:

bash
python -m venv venv
source venv/bin/activate        # or venv\Scripts\activate on Windows
pip install -r requirements.txt
alembic upgrade head            # if using Alembic migrations
uvicorn src.main:app --reload
Start the frontend

bash
cd frontend
npm install
npm run dev
Notes

The frontend talks to the backend API and includes cookies on authenticated requests.

If you change embedding models (different vector dimension), delete the Chroma persistence folder and reindex products so the collection is recreated with the correct dimension.

Admin, maintenance & quick admin SQL
Grant admin access

To make a user an admin quickly, run this SQL in your Postgres instance:

sql
UPDATE users SET is_admin = true WHERE id = 1;
Reindexing & Chroma

If you switch embedding models (different vector dimension), recreate the Chroma collection by deleting the Chroma persistence folder and re‑running your reindex script or re‑creating product embeddings.

A reindex script should iterate all products and write embeddings to the vector store so search remains accurate.

Event pipeline

The backend publishes domain events (payment completed, order created) so background workers can process inventory updates, emails, analytics, and other async tasks. The event‑driven pipeline is in progress and designed to be durable and extensible.