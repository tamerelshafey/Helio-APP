import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveUser, saveAdmin } from '../api/usersApi';
import { useStore } from '../store';
import type { AppUser, AdminUser } from '../types';
import Modal from '../components/common/Modal';
import TabButton from '../components/common/TabButton';
import { ArrowLeftIcon, UserGroupIcon, WrenchScrewdriverIcon, UserCircleIcon } from '../components/common/Icons';
import useDocumentTitle from '../hooks/useDocumentTitle';

// Import refactored components
import RegularUsersTab from '../components/users/RegularUsersTab';
import ServiceProvidersTab from '../components/users/ServiceProvidersTab';
import AdminUsersTab from '../components/users/AdminUsersTab';
import UserForm from '../components/users/UserForm';
import AdminForm from '../components/users/AdminForm';

const UsersPage: React.FC = () => {
    useDocumentTitle('إدارة المستخدمين | Helio');
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const showToast = useStore((state) => state.showToast);
    const [activeTab, setActiveTab] = useState<'users' | 'providers' | 'admins'>('users');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AppUser | null>(null);
    const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

    const saveUserMutation = useMutation({
        mutationFn: saveUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            handleCloseModal();
            showToast(editingUser ? 'تم تعديل المستخدم بنجاح!' : 'تم إضافة المستخدم بنجاح!');
        },
        onError: (error) => showToast(error.message, 'error')
    });

    const saveAdminMutation = useMutation({
        mutationFn: saveAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admins'] });
            handleCloseModal();
            showToast(editingAdmin ? 'تم تعديل المدير بنجاح!' : 'تم إضافة المدير بنجاح!');
        },
        onError: (error) => showToast(error.message, 'error')
    });

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
                    <UserForm user={editingUser} onSave={(data) => saveUserMutation.mutate(data)} onClose={handleCloseModal} />
                ) : (
                    <AdminForm admin={editingAdmin} onSave={(data) => saveAdminMutation.mutate(data)} onClose={handleCloseModal} />
                )}
            </Modal>
        </div>
    );
};

export default UsersPage;