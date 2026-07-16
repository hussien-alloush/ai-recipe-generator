import express from 'express';
const router = express.Router();
import * as mealPlanController from '../controllers/mealPlanController.js';
import authMiddleware from '../middleware/auth.js';


//routes protected by auth middleware
router.use(authMiddleware);

router.get('/weekly', mealPlanController.getWeeklyMealPlan);
router.get('/upcoming', mealPlanController.getUpcomingMeals);
router.get('/stats', mealPlanController.getMealPlanStats);
router.post('/', mealPlanController.addToMealPlan);
router.delete('/:id', mealPlanController.deleteMealPlanEntry);

export default router;
