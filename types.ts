export interface Memo {
  id: string;
  content: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime: Date; // The "Start" of the bucket
  endTime?: Date; // Optional "End" of the bucket
  isCompleted: boolean;
  memos: Memo[]; // The "Basket" contents
}

export enum ViewMode {
  TIMELINE = 'TIMELINE',
  FOCUSED = 'FOCUSED'
}
