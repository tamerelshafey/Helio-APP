import React, { useState, useEffect } from 'react';
import type { Driver } from '../../types';
import ImageUploader from '../common/ImageUploader';

interface DriverFormProps {
    driver: Driver | null;
    onSave: (driver: Omit<Driver, 'id'> & { id?: number }) => void;
    onClose: () => void;
}

const DriverForm: React.FC<DriverFormProps> = ({ driver, onSave, onClose }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState<string[]>([]);

    useEffect(() => {
        if (driver) {
            setName(driver.name);
            setPhone(driver.phone);
            setAvatar(driver.avatar ? [driver.avatar] : []);
        } else {
            setName('');
            setPhone('');
            setAvatar([]);
        }
    }, [driver]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: driver?.id, name, phone, avatar: avatar[0] || `https://picsum.photos/200/200?random=${Date.now()}` });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">اسم السائق</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2"/>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2"/>
            </div>
            <ImageUploader initialImages={avatar} onImagesChange={setAvatar} multiple={false} label="صورة السائق" />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button>
            </div>
        </form>
    );
};

export default DriverForm;
