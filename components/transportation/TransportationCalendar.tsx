import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../common/Icons';
import type { WeeklyScheduleItem, ScheduleOverride } from '../../types';

interface TransportationCalendarProps {
    weeklySchedule: WeeklyScheduleItem[];
    scheduleOverrides: ScheduleOverride[];
    onDayClick?: (date: string) => void;
}

const TransportationCalendar: React.FC<TransportationCalendarProps> = ({ weeklySchedule, scheduleOverrides, onDayClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const headerDaysOfWeek = ['الجمعة', 'السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
    const lookupDaysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    const getDriversForDate = (date: Date): { drivers: { name: string }[], isOverride: boolean } => {
        const dateString = date.toISOString().split('T')[0];
        const override = scheduleOverrides.find(o => o.date === dateString);
        if (override) {
            return { drivers: override.drivers, isOverride: true };
        }
        const dayName = lookupDaysOfWeek[date.getDay()];
        const scheduleDay = weeklySchedule.find(d => d.day === dayName);
        return { drivers: scheduleDay?.drivers || [], isOverride: false };
    };

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        
        const days = [];
        // Add blank days for the start of the month
        const blankDaysCount = (firstDayOfMonth.getDay() + 2) % 7;
        for (let i = 0; i < blankDaysCount; i++) {
            days.push(<div key={`blank-start-${i}`} className="border-t border-r border-slate-200 dark:border-slate-700"></div>);
        }

        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const date = new Date(year, month, day);
            const { drivers, isOverride } = getDriversForDate(date);
            const isToday = new Date().toDateString() === date.toDateString();

            days.push(
                <div 
                    key={day} 
                    onClick={() => onDayClick && onDayClick(date.toISOString().split('T')[0])}
                    className={`p-2 border-t border-r border-slate-200 dark:border-slate-700 min-h-[100px] flex flex-col relative
                        ${onDayClick ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700' : ''}
                        ${isOverride ? 'bg-cyan-50 dark:bg-cyan-900/30' : ''}`}
                >
                    <div className={`font-bold ${isToday ? 'text-cyan-500' : 'text-gray-700 dark:text-gray-300'}`}>{day}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex-grow">
                        {drivers.map(d => (
                            <div key={d.name} className="truncate" title={d.name}>{d.name}</div>
                        ))}
                    </div>
                </div>
            );
        }
        
         // Add blank days for the end of the month to fill the grid
        const totalDays = blankDaysCount + lastDayOfMonth.getDate();
        const remaining = (7 - (totalDays % 7)) % 7;
        for (let i = 0; i < remaining; i++) {
            days.push(<div key={`blank-end-${i}`} className="border-t border-r border-slate-200 dark:border-slate-700"></div>);
        }

        return days;
    };

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    return (
        <div>
            <div className="flex items-center justify-between mb-4 px-2">
                <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><ChevronRightIcon className="w-5 h-5"/></button>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {currentDate.toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><ChevronLeftIcon className="w-5 h-5"/></button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-slate-200 dark:border-slate-700">
                {headerDaysOfWeek.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 grid-flow-row border-l border-b border-slate-200 dark:border-slate-700">
                {generateCalendarDays()}
            </div>
        </div>
    );
};

export default TransportationCalendar;