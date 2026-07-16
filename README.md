# 🍳 AI Recipe Generator

An AI-powered recipe generator that helps users discover, create, and manage recipes based on their preferences, pantry items, and dietary needs. Includes meal planning, a shopping list, and a personal recipe collection.

## ✨ Features

- **AI Recipe Generation** – Generate custom recipes using AI based on ingredients, cuisine, or dietary preferences
- **Dashboard** – Overview of saved recipes, pantry stats, and quick actions
- **My Recipes** – Save, view, and manage your personal recipe collection
- **Meal Planner** – Plan meals across the week
- **Shopping List** – Auto-generate and manage shopping lists from planned meals
- **Pantry Tracker** – Keep track of ingredients you have on hand
- **User Accounts** – Sign up, log in, manage profile and preferences

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- React Router
- Context API for state management

**Backend**
- Node.js / Express
- PostgreSQL (PL/pgSQL)


## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone https://github.com/hussien-alloush/ai-recipe-generator.git
cd ai-recipe-generator
```

2. Install backend dependencies
```bash
cd Backend
npm install
```

3. Install frontend dependencies
```bash
cd ../Frontend/ai-recipe-generator-ui-boilerplate-code
npm install
```

4. Set up environment variables
- Copy `.env.example` to `.env` in the relevant folders
- Fill in your database credentials and any API keys

5. Run the backend
```bash
cd Backend
npm start
```

6. Run the frontend
```bash
cd Frontend/ai-recipe-generator-ui-boilerplate-code
npm run dev
```

7. Open the app at `http://localhost:5173` (or the port Vite shows in your terminal)

## 📁 Project Structure

```
ai-recipe-generator/
├── Backend/            # Express API + PostgreSQL
├── Frontend/           # React app (Vite)
│   └── ai-recipe-generator-ui-boilerplate-code/
│       └── src/
│           ├── pages/       # Dashboard, RecipeGenerator, MyRecipes, MealPlanner, etc.
│           ├── components/  # Navbar, ProtectedRoute, etc.
│           ├── context/     # Auth/app context providers
│           └── services/    # API layer
└── screenshots/         # App screenshots for this README
```

