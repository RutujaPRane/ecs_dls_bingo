import React, { useState } from 'react';
import BingoBoard from './components/BingoBoard';
import ModeratorDashboard from './components/ModeratorDashboard';
import UserLogin from './components/UserLogin';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <UserLogin onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white">
              Welcome, {user.name}!
            </div>
            <button
              onClick={() => setUser(null)}
              className="text-white hover:text-orange-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
          {user.isModerator ? (
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <ShieldCheck className="w-8 h-8 text-orange-500" />
              Moderator Dashboard
              <ShieldCheck className="w-8 h-8 text-orange-500" />
            </h1>
          ) : (
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-orange-500" />
              Diversity & Leadership Summit
              <Sparkles className="w-8 h-8 text-orange-500" />
            </h1>
          )}
          {!user.isModerator && (
            <p className="text-blue-200 text-lg">
              Complete tasks to win at Conference Bingo!
            </p>
          )}
        </header>
        
        {user.isModerator ? (
          <ModeratorDashboard />
        ) : (
          <>
            <BingoBoard user={user} />
            <footer className="mt-8 text-center text-blue-200">
              <p>Click on any cell to submit your proof and mark it as complete!</p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export default App;