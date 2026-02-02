import React from 'react';
import { Task } from '../types';
import { Check, Clock } from 'lucide-react';
import { MemoBasket } from './MemoBasket';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onAddMemo: (taskId: string, content: string) => void;
  onRemoveMemo: (taskId: string, memoId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onToggleComplete, 
  onAddMemo, 
  onRemoveMemo 
}) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    <div className={`
      relative pl-8 pb-10 transition-all duration-500
      ${task.isCompleted 
        ? 'border-l border-slate-100' // Faint, thin line (1px) for completed history
        : 'border-l-[3px] border-indigo-100' // Thicker, highlighted line (3px) for current/future path
      }
    `}>
      {/* Timeline Dot */}
      <div className={`
        absolute top-[2px] w-4 h-4 rounded-full border-2 bg-white transition-all duration-500 z-10
        ${task.isCompleted 
          ? '-left-[8.5px] border-slate-200 bg-slate-50' // Center on 1px border
          : '-left-[9.5px] border-indigo-500 ring-4 ring-indigo-50/60 scale-110' // Center on 3px border + Glow effect
        }
      `} />

      {/* Time Label */}
      <div className={`
        flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-300
        ${task.isCompleted ? 'text-slate-300' : 'text-indigo-600/80'}
      `}>
        <Clock size={12} className={task.isCompleted ? "" : "text-indigo-500"} />
        <span>{formatTime(task.startTime)}</span>
        {task.endTime && (
          <>
            <span className="opacity-50">-</span>
            <span>{formatTime(task.endTime)}</span>
          </>
        )}
      </div>

      {/* Card Content */}
      <div 
        className={`
          group rounded-2xl p-5 transition-all duration-300 border
          ${task.isCompleted 
            ? 'bg-slate-50/40 border-slate-100/50' // Just faint background, no opacity filter on content
            : 'bg-white shadow-sm border-slate-100 hover:shadow-md hover:border-indigo-50'}
        `}
      >
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`
              flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 mt-0.5
              ${task.isCompleted 
                ? 'bg-slate-200 border-slate-200 text-slate-500' 
                : 'bg-transparent border-slate-300 text-transparent hover:border-indigo-500 hover:text-indigo-500/20'}
            `}
          >
            <Check size={14} strokeWidth={3} />
          </button>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`
              text-lg font-medium leading-tight transition-all duration-300
              ${task.isCompleted ? 'text-slate-400 line-through decoration-slate-300/80' : 'text-slate-800'}
            `}>
              {task.title}
            </h3>
            
            {/* The Basket Interaction */}
            <MemoBasket 
              memos={task.memos}
              isTaskCompleted={task.isCompleted}
              onAddMemo={(content) => onAddMemo(task.id, content)}
              onRemoveMemo={(memoId) => onRemoveMemo(task.id, memoId)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};