import React from 'react';
import Header from '@/components/ui/Header';
import Link from 'next/link';

export default function About() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-green-700 mb-6">About AI Recipe Master</h1>
          
          <div className="prose max-w-none text-gray-800">
            <p className="mb-4">
              AI Recipe Master is a web application that helps you create delicious recipes based on the ingredients you have available and your dietary preferences.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">How It Works</h2>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>Enter the ingredients you have available</li>
              <li>Specify any dietary restrictions or preferences</li>
              <li>Choose a meal type (breakfast, lunch, dinner, etc.)</li>
              <li>Our AI will generate a custom recipe for you</li>
              <li>Save your favorite recipes for later</li>
            </ol>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">Technology</h2>
            <p className="mb-4">
              This application is built using Next.js, a React framework, and leverages AI technology to generate unique recipes based on your input.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">Creator</h2>
            <p className="mb-4">
              AI Recipe Master was created as a portfolio project to demonstrate web development and AI integration skills.
            </p>
            
            <div className="mt-8">
              <Link
                href="/"
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
              >
                Start Generating Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
