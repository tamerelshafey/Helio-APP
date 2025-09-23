import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon, 
    ChevronDownIcon, DocumentDuplicateIcon 
} from '../components/common/Icons';
import type { ServiceGuide } from '../types';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/common/Modal';

const GuideForm: React.FC<{
    onSave: (guide: Omit<ServiceGuide, 'id'> & { id?: number }) => void;
    onClose: () => void;
    guide: (Omit<ServiceGuide, 'id'> & { id?: number }) | null;
}> = ({ onSave, onClose, guide }) => {
    const [title, setTitle] = useState('');
    const [steps, setSteps] = useState('');
    const [documents, setDocuments] = useState('');

    useEffect(() => {
        if (guide) {
            setTitle(guide.title || '');
            setSteps(guide.steps?.join('\n') || '');
            setDocuments(guide.documents?.join('\n') || '');
        } else {
            setTitle('');
            setSteps('');
            setDocuments('');
        }
    }, [guide]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const stepsArray = steps.split('\n').filter(line => line.trim() !== '');
        const documentsArray = documents.split('\n').filter(line => line.trim() !== '');
        onSave({ id: guide?.id, title, steps: stepsArray, documents: documentsArray });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان الخدمة</label>
                <input
                    type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required
                    className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="steps" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">خطوات التقديم (كل خطوة في سطر)</label>
                <textarea
                    id="steps" value={steps} onChange={(e) => setSteps(e.target.value)} required rows={5}
                    className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                ></textarea>
            </div>
            <div className="mb-6">
                <label htmlFor="documents" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الأوراق المطلوبة (كل مستند في سطر)</label>
                <textarea
                    id="documents" value={documents} onChange={(e) => setDocuments(e.target.value)} required rows={5}
                    className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                ></textarea>
            </div>
            <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ</button>
            </div>
        </form>
    );
};


const CityServicesGuidePage: React.FC = () => {
    const navigate = useNavigate();
    const { serviceGuides, handleSaveServiceGuide, handleDeleteServiceGuide } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuide, setEditingGuide] = useState<ServiceGuide | null>(null);
    const [openGuideId, setOpenGuideId] = useState<number | null>(1);

    const handleToggleGuide = (id: number) => {
        setOpenGuideId(openGuideId === id ? null : id);
    };

    const handleAddClick = () => {
        setEditingGuide(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (guide: ServiceGuide) => {
        setEditingGuide(guide);
        setIsModalOpen(true);
    };
    
    return (
        <div className="animate-fade-in">
             <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>

            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <DocumentDuplicateIcon className="w-8 h-8 text-cyan-500" />
                        دليل خدمات المدينة
                    </h1>
                    <button onClick={handleAddClick} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                        <PlusIcon className="w-5 h-5" />
                        <span>إضافة دليل جديد</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {serviceGuides.map(guide => (
                        <div key={guide.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            <button onClick={() => handleToggleGuide(guide.id)} className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-right">
                                <span className="font-semibold text-lg text-gray-800 dark:text-white">{guide.title}</span>
                                <div className="flex items-center gap-2">
                                     <button onClick={(e) => { e.stopPropagation(); handleEditClick(guide); }} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md"><PencilSquareIcon className="w-5 h-5" /></button>
                                     <button onClick={(e) => { e.stopPropagation(); handleDeleteServiceGuide(guide.id); }} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md"><TrashIcon className="w-5 h-5" /></button>
                                    <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${openGuideId === guide.id ? 'rotate-180' : ''}`} />
                                </div>
                            </button>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openGuideId === guide.id ? 'max-h-[1000px]' : 'max-h-0'}`}>
                                <div className="p-6 bg-white dark:bg-slate-800 grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-md font-bold mb-3 text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500/30 pb-2">خطوات التقديم</h3>
                                        <ul className="space-y-2 list-decimal list-inside text-gray-600 dark:text-gray-300">
                                            {guide.steps.map((step, i) => <li key={i}>{step}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-md font-bold mb-3 text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500/30 pb-2">الأوراق المطلوبة</h3>
                                        <ul className="space-y-2 list-decimal list-inside text-gray-600 dark:text-gray-300">
                                            {guide.documents.map((doc, i) => <li key={i}>{doc}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingGuide ? 'تعديل الدليل' : 'إضافة دليل جديد'}
            >
                <GuideForm 
                    onSave={handleSaveServiceGuide}
                    onClose={() => setIsModalOpen(false)}
                    guide={editingGuide}
                />
            </Modal>
        </div>
    );
};

export default CityServicesGuidePage;