import express from 'express';
const router = express.Router();

import * as shoppingListController from '../controllers/shoppingListController.js';
import authMiddleware from '../middleware/auth.js';

router.use(authMiddleware);

router.get('/', shoppingListController.getShoppingList);

router.post('/generate', shoppingListController.generateFromMealPlan);

router.post('/', shoppingListController.addItem);

router.put('/:id', shoppingListController.updateItem);

router.put('/:id/toggle', shoppingListController.toggleItemChecked);

router.delete('/:id', shoppingListController.deleteItem);

router.delete('/clear/checked', shoppingListController.clearCheckedItems);

router.delete('/clear/all', shoppingListController.clearAllItems);

router.post('/add-to-pantry', shoppingListController.addCheckedItemsToPantry);
export default router;