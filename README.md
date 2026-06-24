# Node Hierarchy Analyzer

A complete full-stack application built for the Chitkara Full Stack Engineering Challenge to parse, validate, and analyze node hierarchies, detect cycles, and render independent tree structures in a clean responsive UI.

## Tech Stack
- **Frontend**: React (Vite, JS, HTML, Plain CSS)
- **Backend**: Node.js, Express (CORS enabled)
- **Styling**: Vanilla CSS (no Tailwind, no external libraries, no animations)

## Project Structure
```
backend/
  server.js
  routes/
    bfhl.js
  utils/
    parse.js
    tree.js
    cycle.js
frontend/
  src/
    App.jsx
    api.js
    components/
      InputBox.jsx
      ResultView.jsx
      TreeCard.jsx
    App.css
```

## Setup & Running Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### 1. Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local server:
   ```bash
   npm start
   ```
   The backend server will run on `http://localhost:5000`.

### 2. Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will run on `http://localhost:3000`.

---

## API Endpoints

### `POST /bfhl`
Processes an array of edge entries.

**Request Payload:**
```json
{
  "data": [
    "A->B",
    "A->C",
    "B->D"
  ]
}
```

**Response Format:**
```json
{
  "user_id": "GAUTAM_JAIN_24062026",
  "email_id": "gautam.jain.student@chitkara.edu.in",
  "college_roll_number": "1234567890",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": {
            "D": {}
          },
          "C": {}
        }
      },
      "depth": 3
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

---

## Deployment Links

- **Backend (Render/Railway)**: `https://your-backend-url.render.com` (Ready for deployment)
- **Frontend (Vercel)**: `https://your-frontend-url.vercel.app` (Ready for deployment)
