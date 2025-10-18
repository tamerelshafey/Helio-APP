import React, { useState, useEffect } from 'react';
import type { ScheduleOverride, Driver, ScheduleDriver } from '../../types';
import { useTransportationContext } from '../../context/TransportationContext';

interface ScheduleOverrideFormProps {
    date: string;
    onSave: (override: ScheduleOverride) => void;
    onReset: (date: string) => void;
    onClose: () => void;
    drivers: Driver[];
}

const ScheduleOverrideForm: React.FC<ScheduleOverrideFormProps> = ({ date, onSave, onReset, onClose, drivers }) => {
    const { transportation } = useTransportationContext();
    const [selectedDrivers, setSelectedDrivers] = useState<ScheduleDriver[]>([]);
    
    useEffect(() => {
        const override = transportation.scheduleOverrides.find(o => o.date === date);
        if (override) {
            setSelectedDrivers(override.drivers);
        } else {
            const dayName = new Date(date).toLocaleString('ar-EG', { weekday: 'long' });
            const templateDrivers = transportation.weeklySchedule.find(d => d.day === dayName)?.drivers || [];
            setSelectedDrivers(templateDrivers);
        }
    }, [date, transportation]);

    const handleDriverToggle = (driver: Driver) => {
        setSelectedDrivers(prev => 
            prev.some(d => d.name === driver.name)
                ? prev.filter(d => d.name !== driver.name)
                : [...prev, { name: driver.name, phone: driver.phone }]
        );
    };

    const handleSubmit = () => onSave({ date, drivers: selectedDrivers });
    
    return (
        <div className="space-y-4">
            <p className="font-semibold">اختر السائقين المناوبين لهذا اليوم:</p>
            <div className="max-h-60 overflow-y-auto space-y-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                {drivers.map(driver => (
                    <label key={driver.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedDrivers.some(d => d.name === driver.name)}
                            onChange={() => handleDriverToggle(driver)}
                            className="form-checkbox h-5 w-5 rounded text-cyan-600 focus:ring-cyan-500"
                        />
                         <img src={driver.avatar} alt={driver.name} className="w-8 h-8 rounded-full object-cover"/>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{driver.name}</span>
                    </label>
                ))}
            </div>
             <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                     <button type="button" onClick={() => onReset(date)} className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 rounded-md">
                        إعادة للوضع الافتراضي
                    </button>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 rounded-md">إلغاء</button>
                    <button type="button" onClick={handleSubmit} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ الجدول</button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleOverrideForm;
