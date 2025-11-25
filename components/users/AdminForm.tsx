import React, { useState } from 'react';
import type { AdminUser, AdminUserRole } from '../../types';
import { AdminRoles } from '../../types';
import ImageUploader from '../common/ImageUploader';

interface AdminFormProps {
    admin: AdminUser | null;
    onSave: (admin: Omit<AdminUser, 'id'> & { id?: number }) => void;
    onClose: () => void;
}

const AdminForm: React.FC<AdminFormProps> = ({ admin, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: admin?.name || '',
        email: admin?.email || '',
    });
    const [roles, setRoles] = useState<AdminUserRole[]>(admin?.roles || []);
    const [avatar, setAvatar] = useState<string[]>(admin?.avatar ? [admin.avatar] : []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (role: AdminUserRole) => {
        setRoles(prevRoles =>
            prevRoles.includes(role)
                ? prevRoles.filter(r => r !== role)
                : [...prevRoles, role]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: admin?.id,
            ...formData,
            roles,
            avatar: avatar[0] || `https://picsum.photos/200/200?random=${Date.now()}`,
        });
    };
    
    const allAdminRoles: AdminUserRole[] = Object.values(AdminRoles);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الاسم</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الأدوار</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                    {allAdminRoles.map(role => (
                        <label key={role} className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                            <input
                                type="checkbox"
                                checked={roles.includes(role)}
                                onChange={() => handleRoleChange(role)}
                                className="form-checkbox h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500"
                            />
                            <span className="text-sm">{role}</span>
                        </label>
                    ))}
                </div>
            </div>
            <ImageUploader initialImages={avatar} onImagesChange={setAvatar} multiple={false} label="الصورة الرمزية" />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ</button>
            </div>
        </form>
    );
};

export default AdminForm;