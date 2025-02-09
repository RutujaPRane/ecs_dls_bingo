import React, { useState, useEffect } from 'react';
import { BingoTask, CompletedTask, BingoLine } from '../types';
import { bingoTasks } from '../data/tasks';
import { Upload, Camera, Type, Image, CheckCircle2, XCircle, Clock } from 'lucide-react';


// this is the bingo card component
interface BingoCellProps {
  task: BingoTask;
  isSelected: boolean;
  onSubmitProof: (proof: string) => void;
  index: number;
  completedTask?: CompletedTask;
  isPartOfBingo: boolean;
}

const BingoCell: React.FC<BingoCellProps> = ({ 
  task, 
  isSelected, 
  onSubmitProof, 
  index,
  completedTask,
  isPartOfBingo
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [proof, setProof] = useState<string>('');

  const handleSubmitProof = () => {
    if (proof) {
      onSubmitProof(proof);
      setIsModalOpen(false);
      setProof('');
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

  const getStatusColor = () => {
    if (!completedTask) return 'bg-white';
    switch (completedTask.status) {
      case 'approved':
        return isPartOfBingo ? 'bg-orange-400' : 'bg-orange-100';
      case 'pending':
        return 'bg-yellow-50';
      case 'rejected':
        return 'bg-red-50';
      default:
        return 'bg-white';
    }
  };

  const getStatusIcon = () => {
    if (!completedTask) return null;
    switch (completedTask.status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div
        onClick={() => !completedTask && setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative p-1 sm:p-2 md:p-3 border border-blue-900 ${getStatusColor()} 
          hover:bg-blue-50 cursor-pointer transition-all min-h-[60px] sm:min-h-[80px] 
          md:min-h-[100px] flex items-center justify-center group`}
      >
        {!isHovered ? (
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900">
              {index + 1}
            </span>
            {getStatusIcon()}
          </div>
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
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-orange-500 text-white rounded 
                  hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed`}
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
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [bingoLines, setBingoLines] = useState<BingoLine[]>([]);

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
    setCompletedTasks([{
      taskId: -1,
      proof: "Free space",
      timestamp: Date.now(),
      status: 'approved'
    }]);
  }, []);

  const checkForBingo = () => {
    const approvedTasks = completedTasks.filter(task => task.status === 'approved');
    const approvedIndices = new Set(
      approvedTasks.map(task => board.findIndex(t => t.id === task.taskId))
    );
    
    const newBingoLines: BingoLine[] = [];

    // Check rows
    for (let i = 0; i < 5; i++) {
      const rowStart = i * 5;
      if ([0, 1, 2, 3, 4].every(j => approvedIndices.has(rowStart + j))) {
        newBingoLines.push({ type: 'row', index: i });
      }
    }

    // Check columns
    for (let i = 0; i < 5; i++) {
      if ([0, 1, 2, 3, 4].every(j => approvedIndices.has(i + j * 5))) {
        newBingoLines.push({ type: 'column', index: i });
      }
    }

    // Check diagonals
    if ([0, 6, 12, 18, 24].every(i => approvedIndices.has(i))) {
      newBingoLines.push({ type: 'diagonal', direction: 'left' });
    }
    if ([4, 8, 12, 16, 20].every(i => approvedIndices.has(i))) {
      newBingoLines.push({ type: 'diagonal', direction: 'right' });
    }

    setBingoLines(newBingoLines);
  };

  useEffect(() => {
    checkForBingo();
  }, [completedTasks]);

  const handleSubmitProof = (index: number, proof: string) => {
    const task = board[index];
    setCompletedTasks(prev => [
      ...prev,
      {
        taskId: task.id,
        proof,
        timestamp: Date.now(),
        status: 'approved' // In a real app, this would be 'pending' until reviewed
      }
    ]);
  };

  const isPartOfBingo = (index: number): boolean => {
    return bingoLines.some(line => {
      if (line.type === 'row') {
        const rowStart = line.index! * 5;
        return index >= rowStart && index < rowStart + 5;
      }
      if (line.type === 'column') {
        return index % 5 === line.index;
      }
      if (line.type === 'diagonal') {
        if (line.direction === 'left') {
          return index % 6 === 0;
        }
        return index % 4 === 0 && index > 0 && index < 24;
      }
      return false;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      <div className="grid grid-cols-5 gap-0.5 sm:gap-1 bg-blue-900 p-0.5 sm:p-1 rounded-lg shadow-xl">
        {board.map((task, index) => (
          <BingoCell
            key={task.id}
            task={task}
            isSelected={completedTasks.some(t => t.taskId === task.id)}
            onSubmitProof={(proof) => handleSubmitProof(index, proof)}
            index={index}
            completedTask={completedTasks.find(t => t.taskId === task.id)}
            isPartOfBingo={isPartOfBingo(index)}
          />
        ))}
      </div>
      {bingoLines.length > 0 && (
        <div className="mt-4 p-4 bg-orange-100 rounded-lg text-center">
          <h3 className="text-xl font-bold text-orange-600">
            BINGO! {bingoLines.length > 1 ? `(${bingoLines.length} lines)` : ''}
          </h3>
        </div>
      )}
    </div>
  );
}

export default BingoBoard;