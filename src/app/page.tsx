'use client';

import Header from '@/components/ui/Header';
import RecipeForm from '@/components/recipe/RecipeForm';
import RecipeDisplay from '@/components/recipe/RecipeDisplay';
import { useRecipes } from '@/context/RecipeContext';

interface FormData {
  ingredients: string;
  dietaryPreferences: string;
  mealType: string;
}

export default function Home() {
  const { 
    currentRecipe, 
    setCurrentRecipe, 
    saveRecipe, 
    loading, 
    setLoading, 
    error, 
    setError 
  } = useRecipes();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }
      
      const data = await response.json();
      setCurrentRecipe(data.recipe);
    } catch (err: any) {
      console.error('Error generating recipe:', err);
      setError(err.message || 'Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = () => {
    if (currentRecipe) {
      saveRecipe(currentRecipe);
      alert('Recipe saved successfully!');
    }
  };

  return (
    <main>
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <RecipeForm onSubmit={handleSubmit} isLoading={loading} />
            
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </div>
          
          {currentRecipe && (
            <div>
              <RecipeDisplay recipe={currentRecipe} onSave={handleSaveRecipe} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
