import { NextResponse } from 'next/server';

// API Keys and configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const API_PROVIDER = process.env.API_PROVIDER || 'mock';
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

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
      
      Only return the JSON object with no additional text.
    `;

    // Mock response for development or if USE_MOCK_DATA is true
    if (USE_MOCK_DATA || API_PROVIDER === 'mock') {
      console.log('Using mock data for recipe generation.');
      
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

    let recipeData;

    // Google Gemini API
    if (API_PROVIDER === 'gemini' && GOOGLE_GEMINI_API_KEY) {
      console.log('Using Google Gemini API for recipe generation.');
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a professional chef. ${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error('Failed to generate recipe using Gemini API');
      }

      const data = await response.json();
      try {
        // Extract content from Gemini response
        const content = data.candidates[0].content.parts[0].text;
        // Extract JSON if it's wrapped in markdown code blocks
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```([\s\S]*?)```/);
        const jsonString = jsonMatch ? jsonMatch[1] : content;
        recipeData = JSON.parse(jsonString);
      } catch (err) {
        console.error('Error parsing Gemini response:', err);
        throw new Error('Failed to parse recipe data from Gemini');
      }
    }
    // OpenAI API
    else if (API_PROVIDER === 'openai' && OPENAI_API_KEY) {
      console.log('Using OpenAI API for recipe generation.');
      
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
        console.error('OpenAI API error:', errorData);
        throw new Error('Failed to generate recipe using OpenAI');
      }

      const data = await response.json();
      try {
        const content = data.choices[0].message.content;
        // Extract JSON if it's wrapped in markdown code blocks
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```([\s\S]*?)```/);
        const jsonString = jsonMatch ? jsonMatch[1] : content;
        recipeData = JSON.parse(jsonString);
      } catch (err) {
        console.error('Error parsing OpenAI response:', err);
        throw new Error('Failed to parse recipe data from OpenAI');
      }
    }
    // Hugging Face API
    else if (API_PROVIDER === 'huggingface' && HUGGINGFACE_API_KEY) {
      console.log('Using Hugging Face API for recipe generation.');
      
      const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`
        },
        body: JSON.stringify({
          inputs: `<s>[INST] You are a professional chef.
${prompt} [/INST]`,
          parameters: {
            temperature: 0.7,
            max_new_tokens: 1024
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Hugging Face API error:', errorData);
        throw new Error('Failed to generate recipe using Hugging Face');
      }

      const data = await response.json();
      try {
        // Hugging Face response format varies by model
        const content = typeof data === 'string' ? data : 
                       Array.isArray(data) ? data[0].generated_text : 
                       data.generated_text;
        
        // Extract JSON if it's wrapped in markdown code blocks
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```([\s\S]*?)```/);
        const jsonString = jsonMatch ? jsonMatch[1] : content;
        recipeData = JSON.parse(jsonString);
      } catch (err) {
        console.error('Error parsing Hugging Face response:', err);
        throw new Error('Failed to parse recipe data from Hugging Face');
      }
    }
    // Fallback to mock data if API provider is not configured
    else {
      console.log('No valid API configuration found. Returning mock data.');
      
      recipeData = {
        title: "Fallback Recipe (API Not Configured)",
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