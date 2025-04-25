import React from 'react';
import { FaHeart, FaClock, FaUtensils } from 'react-icons/fa';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingTime?: string;
  servings?: number;
}

interface RecipeDisplayProps {
  recipe: Recipe | null;
  onSave?: () => void;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, onSave }) => {
  if (!recipe) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-green-700">{recipe.title}</h2>
        <button 
          onClick={onSave} 
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Save recipe"
        >
          <FaHeart size={24} />
        </button>
      </div>

      <div className="flex space-x-4 text-sm text-gray-600 mb-4">
        {recipe.cookingTime && (
          <div className="flex items-center">
            <FaClock className="mr-1" />
            <span>{recipe.cookingTime}</span>
          </div>
        )}
        {recipe.servings && (
          <div className="flex items-center">
            <FaUtensils className="mr-1" />
            <span>{recipe.servings} servings</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
        <ul className="list-disc pl-5 space-y-1">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-700">{ingredient}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
        <ol className="list-decimal pl-5 space-y-3">
          {recipe.instructions.map((step, index) => (
            <li key={index} className="text-gray-700">{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeDisplay;