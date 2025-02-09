

import React from 'react';
import BingoHeader from './components/BingoHeader';
import BingoFooter from './components/BingoFooter';
import BingoBoard from './components/BingoBoard';

import { Sparkles } from 'lucide-react';

function App() {
  return (
    // This page is a simple layout that controls the UI of the web app 
  
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800">
      <BingoHeader />

      <div className="container mx-auto px-4 py-8">

        <section>
          {/* This is the BingoBoard component*/}
          <BingoBoard />
        </section>
        


        <BingoFooter />
       
      </div>
    </div>
  );
}

export default App;