import React from 'react';
import { FaUtensils } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="bg-green-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaUtensils className="text-2xl" />
          <h1 className="text-2xl font-bold">AI Recipe Master</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Saved Recipes</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;