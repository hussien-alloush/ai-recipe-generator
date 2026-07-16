import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const genai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    'GEMINI_API_KEY is not set. Falling back to a built-in recipe generator.'
  );
}

const normalizeGeneratedText = (text) => {
  let normalized = text?.trim() || '';

  normalized = normalized
    .replace(/```(?:json)?\n?/gi, '')
    .replace(/```\n?$/gi, '')
    .trim();

  if (normalized.toLowerCase().startsWith('json')) {
    normalized = normalized.replace(/^json\s*/i, '').trim();
  }

  return normalized;
};

const extractText = (response) => {
  if (!response) return '';

  if (typeof response.text === 'string') {
    return response.text;
  }

  if (response.output?.[0]?.content?.[0]?.text) {
    return response.output[0].content[0].text;
  }

  if (response.output?.[0]?.content?.text) {
    return response.output[0].content.text;
  }

  return '';
};

const buildFallbackRecipe = (
  ingredients = [],
  dietaryRestrictions = [],
  cuisineType = 'any',
  servings = 4,
  cookingTime = 'medium'
) => {
  const cleanIngredients = (ingredients || []).filter(Boolean);
  const primaryIngredient = cleanIngredients[0] || 'fresh vegetables';
  const title = cuisineType && cuisineType !== 'Any' && cuisineType !== 'any'
    ? `${cuisineType} ${primaryIngredient} Bowl`
    : `Quick ${primaryIngredient} Stir-Fry`;

  const prepTime = cookingTime === 'quick' ? 10 : cookingTime === 'long' ? 20 : 15;
  const cookTime = cookingTime === 'quick' ? 15 : cookingTime === 'long' ? 35 : 20;

  return {
    name: title,
    description: 'A simple, balanced recipe built from the ingredients you provided.',
    cuisineType: cuisineType && cuisineType !== 'Any' && cuisineType !== 'any' ? cuisineType : 'Fusion',
    servings,
    difficulty: 'easy',
    prepTime,
    cookTime,
    ingredients: cleanIngredients.slice(0, 6).map((item, index) => ({
      name: item,
      quantity: index === 0 ? 1 : 0.5,
      unit: index === 0 ? 'cup' : 'tbsp',
    })),
    instructions: [
      'Heat a pan and sauté the main ingredients until fragrant.',
      'Add seasoning and any optional aromatics, then simmer briefly.',
      'Serve warm with your preferred garnish or side.',
    ],
    dietaryTags: dietaryRestrictions.length > 0 ? dietaryRestrictions : ['home-cooked'],
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 40,
      fats: 12,
      fiber: 6,
    },
    cookingTips: [
      'Taste as you cook and adjust seasoning to your preference.',
      'If you have herbs or citrus, add them at the end for extra freshness.',
    ],
  };
};

// =======================
// Generate Recipe
// =======================
export const generateRecipe = async (
  ingredients,
  dietaryRestrictions = [],
  cuisineType = 'any',
  servings = 4,
  cookingTime = 'medium'
) => {
  const dietaryInfo =
    dietaryRestrictions.length > 0
      ? `The recipe should follow these dietary restrictions: ${dietaryRestrictions.join(
          ', '
        )}.`
      : 'There are no dietary restrictions.';

  const timeGuide = {
    quick: 'under 30 minutes',
    medium: '30-60 minutes',
    long: 'over 60 minutes',
  };

  const prompt = `
Generate a detailed recipe.

Available ingredients:
${ingredients.join(', ')}

${dietaryInfo}

Cuisine:
${cuisineType}

Servings:
${servings}

Cooking time:
${timeGuide[cookingTime] || 'any'}

Return ONLY valid JSON.

{
  "name": "",
  "description": "",
  "cuisineType": "",
  "servings": 4,
  "difficulty": "easy",
  "prepTime": 0,
  "cookTime": 0,
  "ingredients": [
    {
      "name": "",
      "quantity": 1,
      "unit": ""
    }
  ],
  "instructions": [
    "Step 1",
    "Step 2"
  ],
  "dietaryTags": [],
  "nutrition": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fats": 0,
    "fiber": 0
  },
  "cookingTips": [
    "Tip 1",
    "Tip 2"
  ]
}
`;

  if (!genai?.models?.generateContent) {
    return buildFallbackRecipe(ingredients, dietaryRestrictions, cuisineType, servings, cookingTime);
  }

  try {
    const response = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const generatedText = normalizeGeneratedText(extractText(response));

    return JSON.parse(generatedText);
  } catch (error) {
    console.error('Gemini Recipe Error:', error);
    return buildFallbackRecipe(ingredients, dietaryRestrictions, cuisineType, servings, cookingTime);
  }
};

// =======================
// Pantry Suggestions
// =======================
export const generatePantrySuggestions = async (
  pantryItems,
  expiringItems = []
) => {
  const ingredients = pantryItems.map((item) => item.name).join(', ');

  const expiringText =
    expiringItems.length > 0
      ? `Priority ingredients (expiring soon): ${expiringItems.join(', ')}`
      : '';

  const prompt = `
Available ingredients:

${ingredients}

${expiringText}

Suggest 3 creative recipe ideas.

Return ONLY a JSON array.

Example:

[
  "Recipe idea 1",
  "Recipe idea 2",
  "Recipe idea 3"
]
`;

  if (!genai?.models?.generateContent) {
    return [
      'Try a quick stir-fry with your freshest ingredients.',
      'Turn leftovers into a comforting soup or grain bowl.',
      'Mix your pantry staples into a simple pasta or curry.',
    ];
  }

  try {
    const response = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const generatedText = normalizeGeneratedText(extractText(response));

    return JSON.parse(generatedText);
  } catch (error) {
    console.error('Gemini Pantry Error:', error);
    return [
      'Try a quick stir-fry with your freshest ingredients.',
      'Turn leftovers into a comforting soup or grain bowl.',
      'Mix your pantry staples into a simple pasta or curry.',
    ];
  }
};

// =======================
// Cooking Tips
// =======================
export const generateCookingTips = async (recipe) => {
  const prompt = `
Recipe:
${recipe.name}

Ingredients:
${recipe.ingredients?.map((i) => i.name).join(', ') || 'None'}

Provide 3 practical cooking tips.

Return ONLY a JSON array.

Example:

[
  "Tip 1",
  "Tip 2",
  "Tip 3"
]
`;

  if (!genai?.models?.generateContent) {
    return [
      'Taste as you cook and adjust seasoning to your preference.',
      'Prep ingredients before you start for a smoother workflow.',
      'Finish the dish with herbs or citrus for a fresh lift.',
    ];
  }

  try {
    const response = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const generatedText = normalizeGeneratedText(extractText(response));

    return JSON.parse(generatedText);
  } catch (error) {
    console.error('Gemini Tips Error:', error);
    return [
      'Taste as you cook and adjust seasoning to your preference.',
      'Prep ingredients before you start for a smoother workflow.',
      'Finish the dish with herbs or citrus for a fresh lift.',
    ];
  }
};

export default {
  generateRecipe,
  generatePantrySuggestions,
  generateCookingTips,
};