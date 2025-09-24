import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon } from './Icons';
import type { News } from '../types';
import Modal from './Modal';
import ImageUploader from './ImageUploader';
// FIX: Import useContentContext to access news data and handlers.
import { useContentContext } from '../context/ContentContext';

const NewsForm: React.FC<{
    onSave: (newsItem: Omit<News, 'id' | 'date' | 'author' | 'views'> & { id?: number }) => void;
    onClose: () => void;
    newsItem: Omit<News, 'id' | 'date' | 'author'> & { id?: number } | null;
}> = ({ onSave, onClose, newsItem }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [externalUrl, setExternalUrl] = useState('');

    useEffect(() => {
        if (newsItem) {
            setTitle(newsItem.title || '');
            setContent(newsItem.content || '');
            setImages(newsItem.imageUrl ? [newsItem.imageUrl] : []);
            setExternalUrl(newsItem.externalUrl || '');
        } else {
            setTitle('');
            setContent('');
            setImages([]);
            setExternalUrl('');
        }
    }, [newsItem]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ 
            id: newsItem?.id, 
            title, 
            content, 
            imageUrl: images.length > 0 ? images[0] : 'https://picsum.photos/600/400?random=10', // Fallback image
            externalUrl 
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المحتوى</label>
                    <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required rows={4} className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none"></textarea>
                </div>
                <ImageUploader 
                    initialImages={images} 
                    onImagesChange={setImages} 
                    multiple={false} 
                    label="صورة الخبر"
                />
                <div>
                    <label htmlFor="externalUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رابط المصدر (اختياري)</label>
                    <input type="url" id="externalUrl" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ</button>
            </div>
        </form>
    );
};

const NewsCard: React.FC<{ newsItem: News; onEdit: () => void; onDelete: () => void; }> = ({ newsItem, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group">
            <div className="relative">
                <img src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-48 object-cover" loading="lazy" />
                <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={onEdit} className="p-2 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50" title="تعديل الخبر"><PencilSquareIcon className="w-5 h-5" /></button>
                    <button onClick={onDelete} className="p-2 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" title="حذف الخبر"><TrashIcon className="w-5 h-5" /></button>
                </div>
            </div>
            <div className="p-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{new Date(newsItem.date).toLocaleDateString('ar-EG')} • {newsItem.author}</p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 h-14 overflow-hidden">{newsItem.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm h-20 overflow-hidden">{newsItem.content}</p>
                {newsItem.externalUrl ? 
                    <a href={newsItem.externalUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-500 dark:text-cyan-400 hover:underline font-semibold mt-4 inline-block">اقرأ المزيد...</a>
                    : <div className="mt-4 h-6"></div>
                }
            </div>
        </div>
    );
};


const NewsPage: React.FC = () => {
    const navigate = useNavigate();
    const { news, handleSaveNews, handleDeleteNews } = useContentContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<News | null>(null);

    const handleAddClick = () => {
        setEditingNews(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (newsItem: News) => {
        setEditingNews(newsItem);
        setIsModalOpen(true);
    };

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">إدارة أخبار المدينة</h1>
                <button onClick={handleAddClick} className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>إضافة خبر جديد</span>
                </button>
            </div>
            {news.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {news.map(newsItem => (
                        <NewsCard 
                            key={newsItem.id} 
                            newsItem={newsItem} 
                            onEdit={() => handleEditClick(newsItem)}
                            onDelete={() => handleDeleteNews(newsItem.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold">لا توجد أخبار حالياً</h3>
                    <p className="mt-2">انقر على "إضافة خبر جديد" لبدء النشر.</p>
                </div>
            )}
            
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingNews ? 'تعديل الخبر' : 'إضافة خبر جديد'}
            >
                <NewsForm 
                    onSave={handleSaveNews}
                    onClose={() => setIsModalOpen(false)}
                    newsItem={editingNews}
                />
            </Modal>
        </div>
    );
};

export default NewsPage;