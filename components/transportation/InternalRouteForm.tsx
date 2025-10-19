import React, { useState, useEffect } from 'react';
import type { InternalRoute } from '../../types';
import { InputField, TextareaField } from '../common/FormControls';

interface InternalRouteFormProps {
    route: InternalRoute | null;
    onSave: (route: Omit<InternalRoute, 'id'> & { id?: number }) => void;
    onClose: () => void;
}

const InternalRouteForm: React.FC<InternalRouteFormProps> = ({ route, onSave, onClose }) => {
    const [name, setName] = useState('');
    const [stops, setStops] = useState('');
    const [timings, setTimings] = useState('');

    useEffect(() => {
        if (route) {
            setName(route.name);
            setStops(route.stops.join('\n'));
            setTimings(route.timings.join('\n'));
        } else {
            setName('');
            setStops('');
            setTimings('');
        }
    }, [route]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ 
            id: route?.id, 
            name, 
            stops: stops.split('\n').filter(s => s.trim()), 
            timings: timings.split('\n').filter(t => t.trim()) 
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField name="name" label="اسم المسار" value={name} onChange={e => setName(e.target.value)} required />
            <TextareaField name="stops" label="المحطات (كل محطة في سطر)" value={stops} onChange={e => setStops(e.target.value)} required rows={4} />
            <TextareaField name="timings" label="المواعيد (كل موعد في سطر)" value={timings} onChange={e => setTimings(e.target.value)} required rows={4} />
            
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button>
            </div>
        </form>
    );
};

export default InternalRouteForm;
