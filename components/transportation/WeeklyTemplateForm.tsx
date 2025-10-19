import React, { useState } from 'react';
import type { WeeklyScheduleItem, Driver, ScheduleDriver } from '../../types';
import { useTransportationContext } from '../../context/TransportationContext';

interface WeeklyTemplateFormProps {
    onSave: (schedule: WeeklyScheduleItem[]) => void;
    onClose: () => void;
    drivers: Driver[];
}

const DayScheduleEditor: React.FC<{
    day: string;
    allDrivers: Driver[];
    selectedDrivers: ScheduleDriver[];
    onSelectionChange: (day: string, drivers: ScheduleDriver[]) => void;
}> = ({ day, allDrivers, selectedDrivers, onSelectionChange }) => {
    
    const handleDriverToggle = (driver: Driver) => {
        const isSelected = selectedDrivers.some(d => d.name === driver.name);
        const newSelection = isSelected 
            ? selectedDrivers.filter(d => d.name !== driver.name)
            : [...selectedDrivers, { name: driver.name, phone: driver.phone }];
        onSelectionChange(day, newSelection);
    };

    return (
        <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <p className="font-semibold mb-2">{day}</p>
            <div className="flex flex-wrap gap-2">
                {allDrivers.map(driver => (
                    <label key={driver.id} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm transition-colors ${selectedDrivers.some(d => d.name === driver.name) ? 'bg-cyan-100 dark:bg-cyan-900' : 'bg-slate-100 dark:bg-slate-700'}`}>
                        <input
                            type="checkbox"
                            checked={selectedDrivers.some(d => d.name === driver.name)}
                            onChange={() => handleDriverToggle(driver)}
                            className="form-checkbox h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500"
                        />
                        <span>{driver.name}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};


const WeeklyTemplateForm: React.FC<WeeklyTemplateFormProps> = ({ onSave, onClose, drivers }) => {
    const { transportation } = useTransportationContext();
    const [schedule, setSchedule] = useState<WeeklyScheduleItem[]>(transportation.weeklySchedule);

    const handleDayChange = (day: string, selectedDrivers: ScheduleDriver[]) => {
        setSchedule(prev => {
            const dayIndex = prev.findIndex(d => d.day === day);
            if (dayIndex > -1) {
                const newSchedule = [...prev];
                newSchedule[dayIndex] = { ...newSchedule[dayIndex], drivers: selectedDrivers };
                return newSchedule;
            }
            // Should not happen if initialized correctly
            return [...prev, { day, drivers: selectedDrivers }];
        });
    };

    const daysOfWeek = ['الجمعة', 'السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

    return (
        <div className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto">
                {daysOfWeek.map(day => (
                    <DayScheduleEditor 
                        key={day}
                        day={day}
                        allDrivers={drivers}
                        selectedDrivers={schedule.find(s => s.day === day)?.drivers || []}
                        onSelectionChange={handleDayChange}
                    />
                ))}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="button" onClick={() => onSave(schedule)} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ القالب</button>
            </div>
        </div>
    );
};

export default WeeklyTemplateForm;