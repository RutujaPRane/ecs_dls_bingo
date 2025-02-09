import React, { useState, useEffect } from 'react';
import { BingoTask } from '../types';
import { bingoTasks } from '../data/tasks';
import { Upload, Camera, Type, Image } from 'lucide-react';

interface BingoCellProps {
  task: BingoTask;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const BingoCell: React.FC<BingoCellProps> = ({ task, isSelected, onSelect, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [proof, setProof] = useState<string>('');

  const handleSubmitProof = () => {
    if (proof) {
      onSelect();
      setIsModalOpen(false);
    }
  };

  const getProofIcon = () => {
    switch (task.proofType) {
      case 'photo':
        return <Camera className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'text':
        return <Type className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'screenshot':
        return <Image className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative p-1 sm:p-2 md:p-3 border border-blue-900 bg-white hover:bg-blue-50 cursor-pointer transition-all min-h-[60px] sm:min-h-[80px] md:min-h-[100px] flex items-center justify-center group ${
          isSelected ? 'bg-orange-100' : ''
        }`}
      >
        {!isHovered ? (
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900">
            {index + 1}
          </span>
        ) : (
          <>
            <div className="absolute top-1 right-1">{getProofIcon()}</div>
            <p className="text-[10px] sm:text-xs md:text-sm font-medium text-blue-900 text-center px-1">
              {task.task}
            </p>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-blue-900">Task #{index + 1}</h3>
              <div className="text-sm text-blue-600">{task.task}</div>
            </div>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">{task.description}</p>
            
            {task.proofType === 'photo' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProof(e.target.files?.[0]?.name || '')}
                  className="w-full text-sm"
                />
              </div>
            )}
            
            {(task.proofType === 'text' || task.proofType === 'screenshot') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {task.proofType === 'text' ? 'Your Answer' : 'Upload Screenshot'}
                </label>
                {task.proofType === 'text' ? (
                  <textarea
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                    rows={3}
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProof(e.target.files?.[0]?.name || '')}
                    className="w-full text-sm"
                  />
                )}
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProof}
                disabled={!proof}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const BingoBoard: React.FC = () => {
  const [board, setBoard] = useState<BingoTask[]>([]);
  const [selectedCells, setSelectedCells] = useState<boolean[]>(Array(25).fill(false));

  useEffect(() => {
    const shuffledTasks = [...bingoTasks]
      .sort(() => Math.random() - 0.5)
      .slice(0, 24);
    
    // Insert free space in the middle
    const withFreeSpace = [
      ...shuffledTasks.slice(0, 12),
      {
        id: -1,
        task: "FREE SPACE",
        proofType: "text",
        description: "Free space - already completed!",
        completed: true
      },
      ...shuffledTasks.slice(12)
    ];
    
    setBoard(withFreeSpace);
    setSelectedCells(prev => {
      const newSelected = [...prev];
      newSelected[12] = true; // Mark free space as selected
      return newSelected;
    });
  }, []);

  const handleCellSelect = (index: number) => {
    setSelectedCells(prev => {
      const newSelected = [...prev];
      newSelected[index] = true;
      return newSelected;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      <div className="grid grid-cols-5 gap-0.5 sm:gap-1 bg-blue-900 p-0.5 sm:p-1 rounded-lg shadow-xl">
        {board.map((task, index) => (
          <BingoCell
            key={task.id}
            task={task}
            isSelected={selectedCells[index]}
            onSelect={() => handleCellSelect(index)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export default BingoBoard;