import React, { useState, useEffect } from 'react';
import type { ExternalRoute } from '../../types';

interface RouteFormProps {
    route: ExternalRoute | null;
    onSave: (route: Omit<ExternalRoute, 'id'> & { id?: number }) => void;
    onClose: () => void;
}

const RouteForm: React.FC<RouteFormProps> = ({ route, onSave, onClose }) => {
    const [name, setName] = useState('');
    const [timings, setTimings] = useState('');
    const [waitingPoint, setWaitingPoint] = useState('');

    useEffect(() => {
        if (route) {
            setName(route.name);
            setTimings(route.timings.join(', '));
            setWaitingPoint(route.waitingPoint);
        } else {
            setName('');
            setTimings('');
            setWaitingPoint('');
        }
    }, [route]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: route?.id, name, timings: timings.split(',').map(t => t.trim()), waitingPoint });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">اسم المسار</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2"/>
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">المواعيد (مفصولة بفاصلة)</label>
                <input type="text" value={timings} onChange={e => setTimings(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2"/>
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">نقطة الانتظار</label>
                <input type="text" value={waitingPoint} onChange={e => setWaitingPoint(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2"/>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button>
            </div>
        </form>
    );
};

export default RouteForm;