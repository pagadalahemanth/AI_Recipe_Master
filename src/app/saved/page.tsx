'use client';

import React, { useState } from 'react';
import Header from '@/components/ui/Header';
import { useRecipes } from '@/context/RecipeContext';
import { FaTrash, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

export default function SavedRecipes() {
  const { savedRecipes, removeSavedRecipe } = useRecipes();
  const [selectedRecipe, setSelectedRecipe]  = useState<any>(null);

  const openRecipeDetail = (recipe:any) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeDetail = () => {
    setSelectedRecipe(null);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Saved Recipes</h1>
          <Link 
            href="/" 
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
          >
            Back to Recipe Generator
          </Link>
        </div>

        {savedRecipes.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Saved Recipes</h2>
            <p className="text-gray-600 mb-4">Generate and save recipes to see them here.</p>
            <Link 
              href="/" 
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
            >
              Generate Recipes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map((recipe, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-green-700">{recipe.title}</h3>
                    <button 
                      onClick={() => removeSavedRecipe(index)} 
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete recipe"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {recipe.cookingTime && <span>{recipe.cookingTime} • </span>}
                    {recipe.servings && <span>{recipe.servings} servings</span>}
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium mb-1">Ingredients:</h4>
                    <p className="text-gray-700 text-sm">
                      {recipe.ingredients.slice(0, 3).join(', ')}
                      {recipe.ingredients.length > 3 && '...'}
                    </p>
                  </div>
                  
                  <button 
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded transition-colors text-sm"
                    onClick={() => openRecipeDetail(recipe)}
                  >
                    View Full Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <button 
                    onClick={closeRecipeDetail}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Close"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  {selectedRecipe.cookingTime && (
                    <div className="mr-4">
                      <span className="font-medium">Cooking Time:</span> {selectedRecipe.cookingTime}
                    </div>
                  )}
                  {selectedRecipe.servings && (
                    <div>
                      <span className="font-medium">Servings:</span> {selectedRecipe.servings}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Ingredients</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedRecipe.ingredients.map((ingredient: any, idx: any) => (
                      <li key={idx} className="text-gray-700">{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Instructions</h3>
                  <ol className="list-decimal pl-5 space-y-3">
                    {selectedRecipe.instructions.map((step: any, idx: any) => (
                      <li key={idx} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={closeRecipeDetail}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}