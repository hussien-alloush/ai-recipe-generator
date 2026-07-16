import express from 'express';
const router = express.Router();

import * as recipesController from '../controllers/recipesController.js';
import authMiddleware from '../middleware/auth.js';

// routes protected by auth middleware
router.use(authMiddleware);

// AI generation
router.post('/generate', recipesController.generateRecipe);
router.get('/suggestions', recipesController.generatePantrySuggestions);

// CRUD operations
router.get('/', recipesController.getRecipes);
router.get('/stats', recipesController.getRecipeStats);
router.get('/:id', recipesController.getRecipeById);
router.post('/', recipesController.saveRecipe);
router.put('/:id', recipesController.updateRecipe);
router.delete('/:id', recipesController.deleteRecipe);

export default router;