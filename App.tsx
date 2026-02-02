import React, { useState, useEffect } from 'react';
import { Task, Memo } from './types';
import { TaskCard } from './components/TaskCard';
import { TimePicker } from './components/TimePicker';
import { Calendar } from './components/Calendar';
import { Plus, Coffee, Clock, ArrowRight, Calendar as CalendarIcon } from 'lucide-react';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: '早起阅读',
    startTime: new Date(new Date().setHours(7, 30, 0, 0)),
    endTime: new Date(new Date().setHours(8, 30, 0, 0)),
    isCompleted: true,
    memos: [
      { id: 'm1', content: '那本书的第三章很有意思', createdAt: new Date() }
    ]
  },
  {
    id: '2',
    title: '深度工作',
    startTime: new Date(new Date().setHours(9, 30, 0, 0)),
    endTime: new Date(new Date().setHours(11, 30, 0, 0)),
    isCompleted: false,
    memos: []
  },
  {
    id: '3',
    title: '运动时间',
    startTime: new Date(new Date().setHours(18, 0, 0, 0)),
    endTime: new Date(new Date().setHours(19, 0, 0, 0)),
    isCompleted: false,
    memos: []
  }
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  // Date State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Time Inputs State
  const [startTimeInput, setStartTimeInput] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [endTimeInput, setEndTimeInput] = useState('');

  // Time Picker Modal State
  const [activeTimePicker, setActiveTimePicker] = useState<'start' | 'end' | null>(null);

  // Helper to check same day
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const isToday = isSameDay(selectedDate, new Date());

  // Filter tasks for selected date
  const todaysTasks = tasks.filter(task => isSameDay(task.startTime, selectedDate));

  // Quick Add Task with Time Range
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !startTimeInput) return;

    // Create start date based on Selected Date
    const [startHours, startMinutes] = startTimeInput.split(':').map(Number);
    const startDate = new Date(selectedDate);
    startDate.setHours(startHours, startMinutes, 0, 0);

    // Create end date if provided
    let endDate: Date | undefined = undefined;
    if (endTimeInput) {
      const [endHours, endMinutes] = endTimeInput.split(':').map(Number);
      endDate = new Date(selectedDate);
      
      // Handle overnight tasks (end time is smaller than start time) - usually assumes next day, 
      // but for simplicity in this view, let's keep it same day unless we want complex logic.
      // Or simply:
      endDate.setHours(endHours, endMinutes, 0, 0);
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      startTime: startDate,
      endTime: endDate,
      isCompleted: false,
      memos: []
    };

    // Add to list and sort by time automatically
    setTasks(prev => [...prev, newTask].sort((a, b) => a.startTime.getTime() - b.startTime.getTime()));
    setNewTaskTitle('');
    
    // Reset inputs
    const now = new Date();
    setStartTimeInput(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    setEndTimeInput(''); 
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    ));
  };

  // Memo Logic
  const addMemo = (taskId: string, content: string) => {
    const newMemo: Memo = {
      id: Date.now().toString(),
      content,
      createdAt: new Date()
    };
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, memos: [...t.memos, newMemo] } : t
    ));
  };

  const removeMemo = (taskId: string, memoId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, memos: t.memos.filter(m => m.id !== memoId) } : t
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-40">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 transition-all">
              {isToday ? '今日' : `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`}
            </h1>
            <p className="text-sm text-slate-500 capitalize">
              {new Intl.DateTimeFormat('zh-CN', { weekday: 'long' }).format(selectedDate)}
              {!isToday && ` · ${selectedDate.getFullYear()}`}
            </p>
          </div>
          <button 
            onClick={() => setIsCalendarOpen(true)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all active:scale-95"
          >
            <CalendarIcon size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        
        {todaysTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Coffee size={48} strokeWidth={1.5} className="mb-4 text-slate-300" />
            <p className="text-lg font-medium">这个“筐”是空的</p>
            <p className="text-sm">享受当下的宁静，或在下方开启新事项。</p>
          </div>
        ) : (
          <div className="pl-4">
            {todaysTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleComplete={toggleTaskComplete}
                onAddMemo={addMemo}
                onRemoveMemo={removeMemo}
              />
            ))}
          </div>
        )}

      </main>

      {/* Floating Add Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-30">
        <div className="max-w-2xl mx-auto">
          <form 
            onSubmit={handleAddTask}
            className="group shadow-lg shadow-slate-200/50 rounded-2xl bg-white transition-all focus-within:ring-2 focus-within:ring-indigo-100 flex flex-col sm:flex-row items-end sm:items-center p-2 gap-2"
          >
            {/* Time Input Trigger Container with Label */}
            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">选择时间段</span>
                
                <div className="relative flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 gap-2 sm:w-auto min-w-[140px] h-[48px]">
                    <Clock size={16} className="text-slate-400 flex-shrink-0" />
                    
                    {/* Start Time Trigger */}
                    <button
                        type="button"
                        onClick={() => setActiveTimePicker('start')}
                        className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none hover:text-indigo-600 transition-colors cursor-pointer text-center min-w-[40px]"
                    >
                    {startTimeInput}
                    </button>
                    
                    <ArrowRight size={12} className="text-slate-300 flex-shrink-0" />
                    
                    {/* End Time Trigger */}
                    <button
                        type="button"
                        onClick={() => setActiveTimePicker('end')}
                        className={`bg-transparent text-sm font-medium focus:outline-none hover:text-indigo-600 transition-colors cursor-pointer text-center min-w-[40px] ${!endTimeInput ? 'text-slate-300' : 'text-slate-600'}`}
                    >
                        {endTimeInput || "--:--"}
                    </button>
                </div>
            </div>

            {/* Title Input */}
            <div className="flex-1 w-full min-w-0">
                 {/* Invisible spacer to match height of label above */}
                <span className="text-[10px] opacity-0 block mb-1.5">Label</span>
                <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={isToday ? "创建一个新任务..." : `在 ${selectedDate.getMonth()+1}/${selectedDate.getDate()} 创建计划...`}
                className="w-full bg-transparent py-3 px-4 sm:px-2 text-slate-800 placeholder:text-slate-400 focus:outline-none text-base h-[48px]"
                />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col justify-end h-full">
                 {/* Invisible spacer to match height of label above */}
                <span className="text-[10px] opacity-0 block mb-1.5">Label</span>
                <button 
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="flex-shrink-0 w-12 h-[48px] bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors"
                >
                <Plus size={20} />
                </button>
            </div>
          </form>
        </div>
      </div>

      {/* Time Picker Modal */}
      <TimePicker 
        isOpen={activeTimePicker !== null}
        onClose={() => setActiveTimePicker(null)}
        initialValue={activeTimePicker === 'start' ? startTimeInput : (endTimeInput || startTimeInput)}
        title={activeTimePicker === 'start' ? "开始时间" : "结束时间"}
        onConfirm={(time) => {
          if (activeTimePicker === 'start') {
            setStartTimeInput(time);
            // Auto-set end time to 1 hour later if not specified
            if (!endTimeInput) {
              const [h, m] = time.split(':').map(Number);
              const nextHour = (h + 1) % 24;
              const nextTimeStr = `${String(nextHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
              setEndTimeInput(nextTimeStr);
            }
          } else {
            setEndTimeInput(time);
          }
        }}
      />

      {/* Calendar Modal */}
      <Calendar 
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
    </div>
  );
}