import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import recipeRoutes from './routes/recipes.js';
import shoppingListRoutes from './routes/shoppingList.js';
import pantryRoutes from './routes/pantry.js';
import mealPlanRoutes from './routes/mealPlans.js';

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get('/', (req, res) => {
  res.json({ message: 'AI recipe generator app' });
});

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/meal-plans', mealPlanRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});