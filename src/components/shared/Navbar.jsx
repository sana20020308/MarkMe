import React from 'react';
import { LogOut, User } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">MarkMe</h1>
            <span className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              {user.role === 'admin' ? 'Admin' : 'Student'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User size={20} className="text-gray-600" />
              <span className="text-gray-700 font-medium">
                {user.role === 'admin' ? 'Administrator' : user.name}
              </span>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;