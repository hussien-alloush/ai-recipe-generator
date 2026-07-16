import Recipe from '../models/Recipe.js';
import PantryItem from '../models/PantryItem.js';
import { generateRecipe as generateRecipeAI, generatePantrySuggestions as generatePantrySuggestionAI } from '../utils/gemini.js';

// generate recipe using AI
export const generateRecipe = async (req, res, next) => {
  try {
    const {
      ingredients = [],
      usePantryIngredients = false,
      dietaryRestrictions = [],
      cuisineType = '',
      servings = 4,
      cookingTime = 'medium',
    } = req.body;

    let finalIngredients = [...ingredients];

    if (usePantryIngredients) {
      const pantryItems = await PantryItem.findByUserId(req.user.id);
      const pantryIngredientsNames = pantryItems.map((item) => item.name);
      finalIngredients = [...new Set([...finalIngredients, ...pantryIngredientsNames])];
    }

    if (finalIngredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one ingredient or enable pantry ingredients',
      });
    }

    const recipe = await generateRecipeAI(
      finalIngredients,
      dietaryRestrictions,
      cuisineType,
      servings,
      cookingTime
    );

    res.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

export const generatePantrySuggestions = async (req, res, next) => {
  try {
    const pantryItems = await PantryItem.findByUserId(req.user.id);
    const expiringItems = await PantryItem.getExpiringsoon(req.user.id);
    const expiringNames = expiringItems.map((item) => item.name);

    const suggestions = await generatePantrySuggestionAI(pantryItems, expiringNames);

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
};

export const saveRecipe = async (req, res, next) => {
  try {
    const normalizedRecipeData = {
      ...req.body,
      cuisine_type: req.body.cuisine_type || req.body.cuisineType,
      prep_time: req.body.prep_time ?? req.body.prepTime,
      cook_time: req.body.cook_time ?? req.body.cookTime,
      dietary_tags: req.body.dietary_tags || req.body.dietaryTags || [],
      user_notes: req.body.user_notes || req.body.userNotes,
      image_url: req.body.image_url || req.body.imageUrl,
      instructions: req.body.instructions || [],
      ingredients: req.body.ingredients || [],
      nutrition: req.body.nutrition || {},
    };

    const recipe = await Recipe.create(req.user.id, normalizedRecipeData);
    res.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipes = async (req, res, next) => {
  try {
    const {
      search,
      cuisineType,
      difficulty,
      dietary_tag,
      max_cooking_time,
      sort_by,
      sort_order,
      limit,
      offset,
    } = req.query;

    const recipes = await Recipe.findByUserId(req.user.id, {
      search,
      cuisine_type: cuisineType,
      difficulty,
      dietary_tags: dietary_tag,
      max_cook_time: max_cooking_time ? parseInt(max_cooking_time, 10) : undefined,
      sort_by,
      sort_order,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });

    res.json({
      success: true,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentRecipes = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const recipes = await Recipe.getRecent(req.user.id, limit);

    res.json({
      success: true,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id, req.user.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedRecipe = await Recipe.update(id, req.user.id, req.body);

    if (!updatedRecipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.json({
      success: true,
      data: updatedRecipe,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Recipe.delete(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.json({
      success: true,
      message: 'Recipe deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipeStats = async (req, res, next) => {
  try {
    const stats = await Recipe.getStatistics(req.user.id);
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
