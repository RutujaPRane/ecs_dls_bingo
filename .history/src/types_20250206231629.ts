export interface BingoTask {
  id: number;
  task: string;
  proofType: 'photo' | 'text' | 'screenshot';
  description: string;
  completed: boolean;
  proof?: string;
}

export interface BingoCell {
  task: BingoTask;
  isSelected: boolean;
}