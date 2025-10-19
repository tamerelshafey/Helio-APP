import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserManagementContext } from '../context/UserManagementContext';
import { useServicesContext } from '../context/ServicesContext';
import type { AppUser, AdminUser, UserStatus, AdminUserRole } from '../types';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import StatusBadge, { AccountTypeBadge } from '../components/ServicePage';
import TabButton from '../components/common/TabButton';
import Pagination from '../components/common/Pagination';
import { 
    ArrowLeftIcon, MagnifyingGlassIcon, UserPlusIcon, PencilSquareIcon, TrashIcon, 
    UserGroupIcon, UserCircleIcon, WrenchScrewdriverIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon 
} from '../components/common/Icons';

const ITEMS_PER_PAGE = 10;

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
            accountType: user?.accountType || 'user',
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
    
    const allAdminRoles: AdminUserRole[] = ['مدير عام', 'مسؤول ادارة الخدمات', 'مسؤول العقارات', 'مسؤول المحتوى', 'مسؤول النقل', 'مسؤول المجتمع'];

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

const RegularUsersTab: React.FC<{ onAdd: () => void; onEdit: (user: AppUser) => void; }> = ({ onAdd, onEdit }) => {
    const { users, handleDeleteUser, handleSetUserAccountType } = useUserManagementContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const isRegularUser = user.accountType === 'user';
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = statusFilter === 'all' || user.status === statusFilter;
            return isRegularUser && matchesSearch && matchesFilter;
        });
    }, [users, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

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
                        {paginatedUsers.map(user => (
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
                                        <button onClick={() => handleSetUserAccountType(user.id, 'service_provider')} className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md" title="ترقية إلى مقدم خدمة"><ArrowTrendingUpIcon className="w-5 h-5"/></button>
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
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    )
};

const ServiceProvidersTab: React.FC = () => {
    const { users, handleSetUserAccountType } = useUserManagementContext();
    const { services } = useServicesContext();

    const providers = useMemo(() => users.filter(u => u.accountType === 'service_provider'), [users]);

    return (
        <div className="animate-fade-in overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">مقدم الخدمة</th>
                        <th scope="col" className="px-6 py-3">الخدمات المرتبطة</th>
                        <th scope="col" className="px-6 py-3">إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {providers.map(provider => {
                        const linkedServices = services.filter(s => s.providerId === provider.id);
                        return (
                            <tr key={provider.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={provider.avatar} alt={provider.name} className="w-10 h-10 rounded-full object-cover" loading="lazy"/>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">{provider.name}</div>
                                            <div className="text-xs">{provider.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {linkedServices.length > 0 ? (
                                        <ul className="text-xs space-y-1">
                                            {linkedServices.map(s => <li key={s.id}>- {s.name}</li>)}
                                        </ul>
                                    ) : <span className="text-xs text-gray-400">لا يوجد</span>}
                                </td>
                                <td className="px-6 py-4">
                                     <button onClick={() => handleSetUserAccountType(provider.id, 'user')} className="p-2 text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/50 rounded-md" title="إلغاء الترقية إلى مستخدم عادي"><ArrowTrendingDownIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {providers.length === 0 && <p className="text-center py-8">لا يوجد مقدمو خدمات بعد.</p>}
        </div>
    );
};


const AdminUsersTab: React.FC<{ onAdd: () => void; onEdit: (admin: AdminUser) => void; }> = ({ onAdd, onEdit }) => {
    const { admins, handleDeleteAdmin } = useUserManagementContext();
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
                                    <div className="flex flex-wrap gap-1">
                                        {admin.roles.map(role => (
                                            <span key={role} className="px-2 py-1 text-xs font-medium rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300">{role}</span>
                                        ))}
                                    </div>
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
    const { handleSaveUser, handleSaveAdmin } = useUserManagementContext();
    const [activeTab, setActiveTab] = useState<'users' | 'providers' | 'admins'>('users');
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
            case 'providers':
                return <ServiceProvidersTab />;
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
                    <TabButton active={activeTab === 'providers'} onClick={() => setActiveTab('providers')} icon={<WrenchScrewdriverIcon className="w-5 h-5" />}>مقدمو الخدمات</TabButton>
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