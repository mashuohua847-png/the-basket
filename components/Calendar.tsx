import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const DAYS = ['日', '一', '二', '三', '四', '五', '六'];

export const Calendar: React.FC<CalendarProps> = ({ isOpen, onClose, selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  // Reset to selected date when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentMonth(new Date(selectedDate));
    }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentMonth);
  // Ensure we have enough rows for any month configuration (max 6 rows usually)
  const totalSlots = Array.from({ length: 42 }); 

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const isToday = (d: Date) => isSameDay(d, new Date());

  const handleDayClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onSelectDate(newDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 p-6 flex flex-col">
        
        {/* Header - Fixed layout to prevent overlap */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight ml-1">
            {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
          </h2>
          
          <div className="flex items-center gap-3">
             {/* Navigation Group */}
            <div className="flex bg-slate-100/80 rounded-lg p-1 gap-1">
              <button 
                onClick={handlePrevMonth} 
                className="p-1 hover:bg-white rounded-md text-slate-500 hover:text-indigo-600 hover:shadow-sm transition-all"
                aria-label="Previous Month"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={handleNextMonth} 
                className="p-1 hover:bg-white rounded-md text-slate-500 hover:text-indigo-600 hover:shadow-sm transition-all"
                aria-label="Next Month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 mb-3">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-2 gap-x-1">
          {totalSlots.map((_, index) => {
            const dayNumber = index - firstDay + 1;
            const isValidDay = dayNumber > 0 && dayNumber <= days;
            
            if (!isValidDay) return <div key={index} className="h-10 w-10" />;

            const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber);
            const isSelected = isSameDay(dateToCheck, selectedDate);
            const today = isToday(dateToCheck);

            return (
              <button
                key={index}
                onClick={() => handleDayClick(dayNumber)}
                className={`
                  h-10 w-10 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all relative
                  ${isSelected 
                    ? 'bg-slate-900 text-white shadow-md scale-105 z-10' 
                    : 'text-slate-700 hover:bg-slate-100'}
                  ${!isSelected && today ? 'text-indigo-600 font-bold bg-indigo-50/50 ring-1 ring-inset ring-indigo-100' : ''}
                `}
              >
                {dayNumber}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
            <button 
                onClick={() => {
                    const today = new Date();
                    onSelectDate(today);
                    // Also update view to today's month if different
                    setCurrentMonth(today);
                    onClose();
                }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 px-4 py-2 hover:bg-indigo-50 rounded-lg transition-colors"
            >
                回到今天
            </button>
        </div>
      </div>
    </div>
  );
};