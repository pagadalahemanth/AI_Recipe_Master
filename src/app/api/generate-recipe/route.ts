import { NextResponse } from 'next/server';

// For demo purposes, we'll use OpenAI API
// You'll need to provide your own API key when deploying
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ingredients, dietaryPreferences, mealType } = body;

    if (!ingredients) {
      return NextResponse.json(
        { error: 'Ingredients are required' },
        { status: 400 }
      );
    }

    // Construct prompt for AI
    const prompt = `
      Create a detailed recipe using these ingredients: ${ingredients}.
      ${dietaryPreferences ? `Dietary preferences: ${dietaryPreferences}.` : ''}
      ${mealType !== 'any' ? `Meal type: ${mealType}.` : ''}
      
      Format the response as a JSON object with the following structure:
      {
        "title": "Recipe Title",
        "ingredients": ["ingredient 1", "ingredient 2", ...],
        "instructions": ["step 1", "step 2", ...],
        "cookingTime": "30 minutes",
        "servings": 4
      }
    `;

    // If you haven't set up an API key yet, return mock data
    if (!OPENAI_API_KEY) {
      console.log('No API key found. Returning mock data.');
      
      // Mock response for development
      const mockRecipe = {
        title: "Creamy Vegetable Pasta",
        ingredients: [
          "8 oz pasta",
          "1 tbsp olive oil",
          "2 cloves garlic, minced",
          "1 onion, diced",
          "1 bell pepper, sliced",
          "1 cup heavy cream",
          "1/4 cup grated Parmesan cheese",
          "Salt and pepper to taste",
          "Fresh basil for garnish"
        ],
        instructions: [
          "Bring a large pot of salted water to a boil. Add pasta and cook according to package instructions until al dente.",
          "While pasta is cooking, heat olive oil in a large skillet over medium heat.",
          "Add garlic and onion, sauté until fragrant and translucent, about 3 minutes.",
          "Add bell pepper and cook for another 2-3 minutes until slightly softened.",
          "Pour in the heavy cream and bring to a gentle simmer. Cook for 3-4 minutes until slightly thickened.",
          "Stir in the Parmesan cheese until melted and smooth.",
          "Drain pasta and add it to the sauce, tossing to coat evenly.",
          "Season with salt and pepper to taste.",
          "Serve hot, garnished with fresh basil leaves."
        ],
        cookingTime: "25 minutes",
        servings: 4
      };

      return NextResponse.json({ recipe: mockRecipe });
    }

    // Using fetch to call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional chef who creates delicious recipes. Always respond with a valid JSON object."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      throw new Error('Failed to generate recipe');
    }

    const data = await response.json();
    
    // Parse the response to extract the JSON
    let recipeData;
    try {
      const content = data.choices[0].message.content;
      // Extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      recipeData = JSON.parse(jsonString);
    } catch (err) {
      console.error('Error parsing AI response:', err);
      throw new Error('Failed to parse recipe data');
    }

    return NextResponse.json({ recipe: recipeData });
  } catch (error: any) {
    console.error('Error in generate-recipe route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate recipe' },
      { status: 500 }
    );
  }
}