import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

interface TimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (time: string) => void;
  initialValue?: string; // "HH:MM" 24h format
  title?: string;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export const TimePicker: React.FC<TimePickerProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialValue = "09:00",
  title = "选择时间"
}) => {
  const [hours, setHours] = useState(9);
  const [minutes, setMinutes] = useState(0);
  
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  // Initialize state
  useEffect(() => {
    if (isOpen) {
      const [h, m] = (initialValue || "09:00").split(':').map(Number);
      setHours(h);
      setMinutes(m);
      
      // Scroll to position after render
      setTimeout(() => {
        if (hourRef.current) {
            hourRef.current.scrollTop = h * ITEM_HEIGHT;
        }
        if (minuteRef.current) {
            minuteRef.current.scrollTop = m * ITEM_HEIGHT;
        }
      }, 10);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    onConfirm(timeString);
    onClose();
  };

  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);

  const handleScroll = (
    e: React.UIEvent<HTMLDivElement>, 
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    // Simple snap calculation
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    setter(index);
  };

  // Helper to smooth scroll to index
  const scrollTo = (ref: React.RefObject<HTMLDivElement>, index: number) => {
    if (ref.current) {
      ref.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-xs bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 text-center">
          <span className="text-sm font-semibold text-slate-500">{title}</span>
        </div>

        {/* Labels */}
        <div className="grid grid-cols-2 text-center pt-4 pb-2 text-xs font-medium text-slate-400 uppercase tracking-wider bg-white">
            <div>时</div>
            <div>分</div>
        </div>

        {/* Scrolling Area */}
        <div className="relative bg-white group select-none" style={{ height: CONTAINER_HEIGHT }}>
          {/* Highlight Bar - Absolute Center */}
          <div 
            className="absolute left-4 right-4 bg-slate-100 rounded-lg pointer-events-none" 
            style={{ 
                height: ITEM_HEIGHT, 
                top: (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2 
            }}
          />

          <div className="flex h-full relative">
              {/* Hours Column */}
              <div 
                ref={hourRef}
                className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory relative z-10"
                style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    paddingTop: (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2,
                    paddingBottom: (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2
                }}
                onScroll={(e) => handleScroll(e, setHours)}
              >
                {hoursArray.map((h) => (
                  <div
                    key={h}
                    onClick={() => scrollTo(hourRef, h)}
                    className={`
                      w-full flex items-center justify-center snap-center cursor-pointer transition-all duration-150
                      ${hours === h ? 'text-slate-900 font-bold scale-110' : 'text-slate-400 opacity-40'}
                    `}
                    style={{ height: ITEM_HEIGHT }}
                  >
                    {String(h).padStart(2, '0')}
                  </div>
                ))}
              </div>

              {/* Separator */}
              <div className="flex flex-col justify-center h-full z-10 pointer-events-none">
                 <div className="text-slate-300 font-light text-xl pb-1 px-2 mb-[2px]">:</div>
              </div>

              {/* Minutes Column */}
              <div 
                ref={minuteRef}
                className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory relative z-10"
                style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    paddingTop: (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2,
                    paddingBottom: (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2
                }}
                onScroll={(e) => handleScroll(e, setMinutes)}
              >
                {minutesArray.map((m) => (
                  <div
                    key={m}
                    onClick={() => scrollTo(minuteRef, m)}
                    className={`
                      w-full flex items-center justify-center snap-center cursor-pointer transition-all duration-150
                      ${minutes === m ? 'text-slate-900 font-bold scale-110' : 'text-slate-400 opacity-40'}
                    `}
                    style={{ height: ITEM_HEIGHT }}
                  >
                    {String(m).padStart(2, '0')}
                  </div>
                ))}
              </div>
          </div>
          
          {/* Gradient Overlays for depth */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-20" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-20" />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t border-slate-50 gap-3 relative z-30 bg-white">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={16} />
            确认
          </button>
        </div>
      </div>
    </div>
  );
};