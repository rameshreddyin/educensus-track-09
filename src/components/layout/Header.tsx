
import React from 'react';
import { Bell, MessageSquare, Search, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="flex flex-col gap-2 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input 
              type="search" 
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary" 
              placeholder="Search..." 
            />
          </div>
          
          <button className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">1</span>
          </button>
          
          <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
            <MessageSquare className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
