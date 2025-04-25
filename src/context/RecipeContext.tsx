'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingTime?: string;
  servings?: number;
  cuisine?: string;
}

interface RecipeContextType {
  currentRecipe: Recipe | null;
  savedRecipes: Recipe[];
  setCurrentRecipe: (recipe: Recipe | null) => void;
  saveRecipe: (recipe: Recipe) => void;
  removeSavedRecipe: (index: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved recipes from localStorage on component mount
  useEffect(() => {
    const storedRecipes = localStorage.getItem('savedRecipes');
    if (storedRecipes) {
      try {
        setSavedRecipes(JSON.parse(storedRecipes));
      } catch (err) {
        console.error('Error parsing saved recipes:', err);
      }
    }
  }, []);

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    if (savedRecipes.length > 0) {
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    }
  }, [savedRecipes]);

  const saveRecipe = (recipe: Recipe) => {
    setSavedRecipes(prev => {
      // Check if recipe already exists
      const exists = prev.some(r => r.title === recipe.title);
      if (exists) {
        return prev;
      }
      return [...prev, recipe];
    });
  };

  const removeSavedRecipe = (index: number) => {
    setSavedRecipes(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      
      // If array is empty, clear localStorage
      if (updated.length === 0) {
        localStorage.removeItem('savedRecipes');
      }
      
      return updated;
    });
  };

  const value = {
    currentRecipe,
    savedRecipes,
    setCurrentRecipe,
    saveRecipe,
    removeSavedRecipe,
    loading,
    setLoading,
    error,
    setError
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};
