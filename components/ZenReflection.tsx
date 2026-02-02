import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface ZenReflectionProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  reflection: string | null;
}

export const ZenReflection: React.FC<ZenReflectionProps> = ({ isOpen, onClose, isLoading, reflection }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all animate-in zoom-in-95 fade-in duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles size={20} />
              <h2 className="font-semibold text-lg">每日回顾</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="min-h-[120px] text-slate-600 leading-relaxed">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-32 gap-3 text-slate-400">
                <div className="w-8 h-8 border-2 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
                <span className="text-sm">正在整理您的思绪...</span>
              </div>
            ) : (
              <div className="prose prose-slate prose-sm max-w-none">
                <p className="whitespace-pre-line">{reflection}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-slate-50 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            合上
          </button>
        </div>
      </div>
    </div>
  );
};