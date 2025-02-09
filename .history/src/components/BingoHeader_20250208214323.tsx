

import React from "";
import { Sparkles } from 'lucide-react';


const BingoHeader = () => { 
    return ( 
        <>
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
        </>
      
    )
}

export default BingoHeader;