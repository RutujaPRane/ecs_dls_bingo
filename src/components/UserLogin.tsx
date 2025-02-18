import React, { useState } from 'react';
import { User } from '../types';
import { Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';

interface UserLoginProps {
  onLogin: (user: User) => void;
}

const MODERATOR_PIN = '1111'; // In a real app, this would be securely stored and hashed

const UserLogin: React.FC<UserLoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'player' | 'moderator'>('player');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (name.trim().length < 2) {
      setError('Please enter a valid name (at least 2 characters)');
      return;
    }

    if (userType === 'moderator' && pin !== MODERATOR_PIN) {
      setError('Invalid moderator PIN');
      return;
    }

    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      isModerator: userType === 'moderator'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-orange-500" />
            Conference Bingo
            <Sparkles className="w-6 h-6 text-orange-500" />
          </h1>
          <p className="text-gray-600 mt-2">Please enter your details to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setUserType('player')}
                className={`p-3 rounded-lg border-2 transition-all
                  ${userType === 'player'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'}`}
              >
                <Sparkles className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Player</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('moderator')}
                className={`p-3 rounded-lg border-2 transition-all
                  ${userType === 'moderator'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'}`}
              >
                <ShieldCheck className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Moderator</span>
              </button>
            </div>
          </div>

          {userType === 'moderator' && (
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
                Moderator PIN
              </label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                placeholder="Enter moderator PIN"
                maxLength={4}
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Start {userType === 'player' ? 'Playing' : 'Moderating'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;