import shoppingList from '../models/ShoppingList.js';
// Generate shopping list from meal plan
export const generateFromMealPlan = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Please provide startDate and endDate'
            });
        }

        const items = await shoppingList.generateFromMealPlan(
            req.user.id,
            startDate,
            endDate
        );

        res.json({
            success: true,
            message: 'Shopping list generated successfully',
            data: { items }
        });

    } catch (error) {
        next(error);
    }
};


// Get shopping list
export const getShoppingList = async (req, res, next) => {
    try {
        const grouped = req.query.grouped === 'true';

        const items = grouped
            ? await shoppingList.getGroupedByCategory(req.user.id)
            : await shoppingList.findByUserId(req.user.id);

        res.json({
            success: true,
            message: 'Shopping list retrieved successfully',
            data: { items }
        });

    } catch (error) {
        next(error);
    }
};


// Add item
export const addItem = async (req, res, next) => {
    try {
        const item = await shoppingList.create(
            req.user.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: 'Item added successfully',
            data: { item }
        });

    } catch (error) {
        next(error);
    }
};


// Update item
export const updateItem = async (req, res, next) => {
    try {
        const { id } = req.params;

        const item = await shoppingList.update(
            id,
            req.user.id,
            req.body
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.json({
            success: true,
            message: 'Item updated successfully',
            data: { item }
        });

    } catch (error) {
        next(error);
    }
};


// Toggle checked status
export const toggleItemChecked = async (req, res, next) => {
    try {
        const { id } = req.params;

        const item = await shoppingList.toggleChecked(
            id,
            req.user.id
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.json({
            success: true,
            message: 'Item status updated successfully',
            data: { item }
        });

    } catch (error) {
        next(error);
    }
};


// Delete single item
export const deleteItem = async (req, res, next) => {
    try {
        const { id } = req.params;

        await shoppingList.delete(
            id,
            req.user.id
        );

        res.json({
            success: true,
            message: 'Item deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};


// Clear checked items
export const clearCheckedItems = async (req, res, next) => {
    try {
        await shoppingList.clearChecked(req.user.id);

        res.json({
            success: true,
            message: 'Checked items cleared successfully'
        });

    } catch (error) {
        next(error);
    }
};


// Clear all items
export const clearAllItems = async (req, res, next) => {
    try {
        await shoppingList.clearAll(req.user.id);

        res.json({
            success: true,
            message: 'All items cleared successfully'
        });

    } catch (error) {
        next(error);
    }
};


// Add checked items to pantry
export const addCheckedItemsToPantry = async (req, res, next) => {
    try {
        const items = await shoppingList.addCheckedToPantry(
            req.user.id
        );

        res.json({
            success: true,
            message: 'Checked items added to pantry successfully',
            data: { items }
        });

    } catch (error) {
        next(error);
    }
};