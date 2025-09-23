import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MagnifyingGlassIcon, UserPlusIcon, PencilSquareIcon, TrashIcon, UserGroupIcon, UserCircleIcon } from './common/Icons';
import { useAppContext } from '../context/AppContext';
import type { AppUser, AdminUser, UserStatus } from '../types';
import Modal from './Modal';
import ImageUploader from './ImageUploader';

const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
    const statusMap = {
        active: { text: 'مفعل', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
        pending: { text: 'معلق', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
        banned: { text: 'محظور', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    };
    const { text, classes } = statusMap[status];
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes}`}>{text}</span>;
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; icon: React.ReactNode }> = ({ active, onClick, children, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-md transition-colors focus:outline-none text-sm ${
            active
                ? 'bg-cyan-500 text-white shadow'
                : 'bg-slate-200/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
    >
        {icon}
        {children}
    </button>
);

const UserForm: React.FC<{
    user: AppUser | null;
    onSave: (user: Omit<AppUser, 'id' | 'joinDate'> & { id?: number }) => void;
    onClose: () => void;
}> = ({ user, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        status: user?.status || 'active',
    });
    const [avatar, setAvatar] = useState<string[]>(user?.avatar ? [user.avatar] : []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: user?.id,
            ...formData,
            status: formData.status as UserStatus,
            avatar: avatar[0] || `https://picsum.photos/200/200?random=${Date.now()}`,
        });
    };

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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحالة</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500">
                    <option value="active">مفعل</option>
                    <option value="pending">معلق</option>
                    <option value="banned">محظور</option>
                </select>
            </div>
            <ImageUploader initialImages={avatar} onImagesChange={setAvatar} multiple={false} label="الصورة الرمزية" />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ</button>
            </div>
        </form>
    );
};

const AdminForm: React.FC<{
    admin: AdminUser | null;
    onSave: (admin: Omit<AdminUser, 'id'> & { id?: number }) => void;
    onClose: () => void;
}> = ({ admin, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: admin?.name || '',
        email: admin?.email || '',
        role: admin?.role || 'مسؤول ادارة الخدمات',
    });
    const [avatar, setAvatar] = useState<string[]>(admin?.avatar ? [admin.avatar] : []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: admin?.id,
            ...formData,
            role: formData.role as AdminUser['role'],
            avatar: avatar[0] || `https://picsum.photos/200/200?random=${Date.now()}`,
        });
    };
    
    const adminRoles: AdminUser['role'][] = ['مسؤول العقارات', 'مسؤول الاخبار والاعلانات والاشعارات', 'مسؤول الباصات', 'مسؤول ادارة الخدمات'];

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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الدور</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500">
                    {adminRoles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
            </div>
            <ImageUploader initialImages={avatar} onImagesChange={setAvatar} multiple={false} label="الصورة الرمزية" />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ</button>
            </div>
        </form>
    );
};

const RegularUsersTab: React.FC<{ onAdd: () => void; onEdit: (user: AppUser) => void; }> = ({ onAdd, onEdit }) => {
    const { users, handleDeleteUser } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = statusFilter === 'all' || user.status === statusFilter;
            return matchesSearch && matchesFilter;
        });
    }, [users, searchTerm, statusFilter]);

    return (
        <div className="animate-fade-in">
             <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative flex-grow w-full sm:w-auto">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                    <input type="text" placeholder="بحث بالاسم أو البريد..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')} className="flex-grow sm:flex-grow-0 w-full sm:w-40 bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition">
                        <option value="all">كل الحالات</option>
                        <option value="active">مفعل</option>
                        <option value="pending">معلق</option>
                        <option value="banned">محظور</option>
                    </select>
                     <button onClick={onAdd} className="flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                        <UserPlusIcon className="w-5 h-5" />
                        <span>إضافة</span>
                    </button>
                </div>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">المستخدم</th>
                            <th scope="col" className="px-6 py-3">الحالة</th>
                            <th scope="col" className="px-6 py-3">تاريخ الانضمام</th>
                            <th scope="col" className="px-6 py-3">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" loading="lazy"/>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
                                            <div className="text-xs">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                                <td className="px-6 py-4">{user.joinDate}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onEdit(user)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md"><PencilSquareIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredUsers.length === 0 && <p className="text-center py-8">لا يوجد مستخدمون يطابقون البحث.</p>}
            </div>
        </div>
    )
};

const AdminUsersTab: React.FC<{ onAdd: () => void; onEdit: (admin: AdminUser) => void; }> = ({ onAdd, onEdit }) => {
    const { admins, handleDeleteAdmin } = useAppContext();
    return (
        <div className="animate-fade-in">
            <div className="flex justify-end mb-6">
                <button onClick={onAdd} className="flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                    <UserPlusIcon className="w-5 h-5" />
                    <span>إضافة مدير</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">المدير</th>
                            <th scope="col" className="px-6 py-3">الدور</th>
                            <th scope="col" className="px-6 py-3">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map(admin => (
                            <tr key={admin.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={admin.avatar} alt={admin.name} className="w-10 h-10 rounded-full object-cover" loading="lazy"/>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">{admin.name}</div>
                                            <div className="text-xs">{admin.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300">{admin.role}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onEdit(admin)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md"><PencilSquareIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleDeleteAdmin(admin.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UsersPage: React.FC = () => {
    const navigate = useNavigate();
    const { handleSaveUser, handleSaveAdmin } = useAppContext();
    const [activeTab, setActiveTab] = useState<'users' | 'admins'>('users');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AppUser | null>(null);
    const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

    const handleOpenUserModal = (user: AppUser | null) => {
        setEditingUser(user);
        setEditingAdmin(null);
        setIsModalOpen(true);
    };
    
    const handleOpenAdminModal = (admin: AdminUser | null) => {
        setEditingAdmin(admin);
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setEditingAdmin(null);
    };
    
    const handleSaveAndCloseUser = (user: Omit<AppUser, 'id' | 'joinDate'> & { id?: number }) => {
        handleSaveUser(user);
        handleCloseModal();
    };

    const handleSaveAndCloseAdmin = (admin: Omit<AdminUser, 'id'> & { id?: number }) => {
        handleSaveAdmin(admin);
        handleCloseModal();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <RegularUsersTab onAdd={() => handleOpenUserModal(null)} onEdit={handleOpenUserModal} />;
            case 'admins':
                return <AdminUsersTab onAdd={() => handleOpenAdminModal(null)} onEdit={handleOpenAdminModal} />;
            default:
                return null;
        }
    }

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">إدارة المستخدمين</h1>
                
                <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                    <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<UserGroupIcon className="w-5 h-5" />}>المستخدمون</TabButton>
                    <TabButton active={activeTab === 'admins'} onClick={() => setActiveTab('admins')} icon={<UserCircleIcon className="w-5 h-5" />}>المديرون</TabButton>
                </div>

                {renderContent()}

            </div>
            
            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                title={
                    activeTab === 'users' 
                        ? (editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد') 
                        : (editingAdmin ? 'تعديل مدير' : 'إضافة مدير جديد')
                }
            >
                {activeTab === 'users' ? (
                    <UserForm user={editingUser} onSave={handleSaveAndCloseUser} onClose={handleCloseModal} />
                ) : (
                    <AdminForm admin={editingAdmin} onSave={handleSaveAndCloseAdmin} onClose={handleCloseModal} />
                )}
            </Modal>
        </div>
    );
};

export default UsersPage;