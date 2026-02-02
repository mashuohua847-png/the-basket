import React, { useState, useRef, useEffect } from 'react';
import { Memo } from '../types';
import { Plus, X } from 'lucide-react';

interface MemoBasketProps {
  memos: Memo[];
  onAddMemo: (content: string) => void;
  onRemoveMemo: (id: string) => void;
  isTaskCompleted: boolean;
}

export const MemoBasket: React.FC<MemoBasketProps> = ({ 
  memos, 
  onAddMemo, 
  onRemoveMemo, 
  isTaskCompleted 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when expanding
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onAddMemo(inputValue.trim());
      setInputValue('');
      // Keep expanded to allow rapid fire entry
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAddMemo(inputValue.trim());
      setInputValue('');
      setIsExpanded(false);
    } else {
      setIsExpanded(false);
    }
  };

  return (
    <div className="mt-3">
      {/* Existing Memos List */}
      {memos.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {memos.map((memo) => (
            <div 
              key={memo.id}
              className={`
                group relative flex items-center px-3 py-1.5 text-sm rounded-lg border transition-all duration-200
                ${isTaskCompleted 
                  ? 'bg-indigo-50/50 text-indigo-900/80 border-indigo-100/50' // Highlighted 'collected' style
                  : 'bg-white text-slate-600 border-slate-200 shadow-sm'}
              `}
            >
              <span>{memo.content}</span>
              {!isTaskCompleted && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveMemo(memo.id);
                  }}
                  className="ml-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-opacity"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input Area (The "Throw into basket" interaction) */}
      <div className="relative">
        {isExpanded ? (
          <div className="flex items-center animate-in fade-in zoom-in-95 duration-200">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSubmit}
              placeholder="输入任务或想法..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        ) : (
          !isTaskCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors px-1 py-1 rounded"
            >
              <Plus size={14} />
              <span>随手记</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};