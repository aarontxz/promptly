# Promptly API

A FastAPI backend service for the Promptly application with PostgreSQL database support.

## Quick Start

### 1. Database Setup (Neon PostgreSQL)

First, set up your Neon PostgreSQL database:
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project/database
3. Copy your connection string
4. Update the `.env` file with your database URL:

```bash
DATABASE_URL=postgresql://username:password@hostname/database_name
```

### 2. Start the Development Server

```bash
# From the api directory
cd apps/api
python run_dev.py
```

Or run directly:
```bash
/Users/tengxinzhuan/promptly/.venv/bin/python main.py
```

The database tables will be created automatically on first run.

## API Documentation

Once the server is running, you can access:
- API documentation: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc
- Health check: http://localhost:8000/health

## Development

### Using Turbo (from root directory)
```bash
# Start all services including the API
npm run dev

# Or start just the API
cd apps/api && npm run dev
```

### Direct Python execution
```bash
cd apps/api
/Users/tengxinzhuan/promptly/.venv/bin/python main.py
```

### Database Management
```bash
# Initialize database manually (optional, done automatically)
python init_db.py
```

## Environment Variables

Update your `.env` file with:
```
PORT=8000
ENVIRONMENT=development

# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@hostname/database_name
```

## API Endpoints

- `GET /` - Root health check
- `GET /health` - Detailed health status with database connectivity check
- `GET /items` - Get all items (supports pagination with ?skip=0&limit=100)
- `POST /items` - Create new item
- `GET /items/{id}` - Get item by ID
- `PUT /items/{id}` - Update item by ID
- `DELETE /items/{id}` - Delete item by ID (soft delete)

## Project Structure

```
apps/api/
├── main.py              # FastAPI application entry point
├── requirements.txt     # Python dependencies
├── run_dev.py          # Development server runner
├── init_db.py          # Database initialization script
├── app/
│   ├── __init__.py
│   ├── database.py     # Database configuration
│   ├── db_models.py    # SQLAlchemy models
│   ├── models.py       # Pydantic models
│   ├── crud.py         # Database operations
│   └── routers/
│       ├── __init__.py
│       └── items.py    # API routes
├── .env                # Environment variables (includes DATABASE_URL)
└── README.md          # This file
```

## Database Schema

### Items Table
```sql
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);
```
