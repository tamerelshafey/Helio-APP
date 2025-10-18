import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PhoneIcon, PencilSquareIcon, TrashIcon, PlusIcon } from '../components/common/Icons';
import type { EmergencyContact } from '../types';
import { useAppContext } from '../context/AppContext';
import { useUIContext } from '../context/UIContext';
import { useHasPermission } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import TabButton from '../components/common/TabButton';

const EmergencyCard: React.FC<{ contact: EmergencyContact; onEdit: (contact: EmergencyContact) => void; onDelete: (id: number) => void; }> = ({ contact, onEdit, onDelete }) => {
    const canManage = useHasPermission(['مسؤول ادارة الخدمات']);
    
    return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg border border-transparent dark:border-slate-700 transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
        {contact.type === 'city' && (
            <span className="absolute top-2 right-2 text-xs bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300 px-2 py-1 rounded-full font-semibold">خدمة خاصة بالمدينة</span>
        )}
        {canManage && (
            <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(contact)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50" title="تعديل الرقم">
                    <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(contact.id)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" title="حذف الرقم">
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        )}
        
        <div className="mb-2">
            <PhoneIcon className="w-10 h-10 text-cyan-400 mx-auto"/>
        </div>
        <h3 className="text-base font-bold mb-2 h-12 flex items-center justify-center text-gray-800 dark:text-white">{contact.title}</h3>
        <p className="text-2xl font-mono tracking-widest text-gray-700 dark:text-gray-300">{contact.number}</p>
        <a href={`tel:${contact.number}`} className="mt-4 inline-block w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
            اتصال مباشر
        </a>
    </div>
)};


const EmergencyForm: React.FC<{
    onSave: (contact: Omit<EmergencyContact, 'id' | 'type'> & { id?: number }) => void;
    onClose: () => void;
    contact: (Omit<EmergencyContact, 'id' | 'type'> & { id?: number }) | null;
}> = ({ onSave, onClose, contact }) => {
    const [title, setTitle] = useState('');
    const [number, setNumber] = useState('');

    useEffect(() => {
        if (contact) {
            setTitle(contact.title || '');
            setNumber(contact.number || '');
        } else {
            setTitle('');
            setNumber('');
        }
    }, [contact]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: contact?.id, title, number });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم الخدمة</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
            </div>
            <div className="mb-6">
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الرقم</label>
                <input
                    type="text"
                    id="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    required
                    className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
            </div>
            <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">
                    إلغاء
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">
                    حفظ
                </button>
            </div>
        </form>
    );
};

const EmergencyPage: React.FC = () => {
    const navigate = useNavigate();
    const { emergencyContacts, handleSaveEmergencyContact, handleDeleteEmergencyContact } = useAppContext();
    const { showToast } = useUIContext();
    const canManage = useHasPermission(['مسؤول ادارة الخدمات']);
    
    const [activeTab, setActiveTab] = useState<'city' | 'national'>('city');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

    const displayedContacts = useMemo(() => 
        emergencyContacts.filter(c => c.type === activeTab), 
    [emergencyContacts, activeTab]);

    const handleAddClick = () => {
        setEditingContact(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (contact: EmergencyContact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };

    const handleSaveAndClose = (contactData: Omit<EmergencyContact, 'id' | 'type'> & { id?: number }) => {
        handleSaveEmergencyContact(contactData, activeTab);
        setIsModalOpen(false);
        showToast(contactData.id ? 'تم تعديل الرقم بنجاح' : 'تم إضافة الرقم بنجاح');
    };

    const confirmDelete = (id: number) => {
        if(window.confirm('هل أنت متأكد من حذف هذا الرقم؟')) {
            handleDeleteEmergencyContact(id);
            showToast('تم حذف الرقم بنجاح');
        }
    };

    return (
        <div className="min-h-full animate-fade-in">
             <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>
            <div className="bg-white dark:bg-slate-900/70 rounded-2xl p-6 md:p-8 shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">
                        إدارة أرقام الطوارئ
                    </h1>
                    {canManage && (
                        <button onClick={handleAddClick} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                            <PlusIcon className="w-5 h-5" />
                            <span>إضافة رقم جديد</span>
                        </button>
                    )}
                </div>
                
                <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                    <TabButton active={activeTab === 'city'} onClick={() => setActiveTab('city')}>أرقام خاصة بالمدينة</TabButton>
                    <TabButton active={activeTab === 'national'} onClick={() => setActiveTab('national')}>أرقام قومية</TabButton>
                </div>

                {displayedContacts.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayedContacts.map((contact) => (
                            <EmergencyCard key={contact.id} contact={contact} onEdit={handleEditClick} onDelete={confirmDelete} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                        <h3 className="text-xl font-semibold">لا توجد أرقام في هذا القسم</h3>
                        <p className="mt-2">انقر على "إضافة رقم جديد" لإضافة أول رقم.</p>
                    </div>
                )}
            </div>
            
            <Modal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingContact 
                    ? 'تعديل الرقم' 
                    : `إضافة رقم ${activeTab === 'city' ? 'خاص بالمدينة' : 'قومي'}`
                }
            >
                <EmergencyForm 
                    onSave={handleSaveAndClose}
                    onClose={() => setIsModalOpen(false)}
                    contact={editingContact}
                />
            </Modal>
        </div>
    );
};

export default EmergencyPage;