import React from 'react';
import BingoBoard from './components/BingoBoard';
import { Sparkles } from 'lucide-react';

function App() {
  return (
    // This page is a simple layout that controls the UI of the web app 
  
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800">

      <div className="container mx-auto px-4 py-8">
        {/* This is the header you can add more styling here if you want  */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-orange-500" />
            Diversity & Leadership Summit
            <Sparkles className="w-8 h-8 text-orange-500" />
          </h1>
          <p className="text-blue-200 text-lg">
            Complete tasks to win at Conference Bingo!
          </p>
        </header>

        <section>
          {/* This is the BingoBoard component*/}
          <BingoBoard />
        </section>
        


        {/* This is the footer you can add more styling here if you want  */}
        <footer className="mt-8 text-center text-blue-200">
          <p>Click on any cell to submit your proof and mark it as complete!</p>
        </footer>
      </div>
    </div>
  );
}

export default App;