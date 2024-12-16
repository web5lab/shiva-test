import React from 'react';
import { Github, LogOut } from 'lucide-react';
import { logout } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  user?: {
    avatar_url: string;
    login: string;
  };
}

export default function Header({ user }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Github className="h-8 w-8 text-gray-900" />
            <span className="ml-2 text-xl font-semibold">GitHub Explorer</span>
          </div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700">{user.login}</span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}