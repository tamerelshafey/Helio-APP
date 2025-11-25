import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Review } from '../types';
import { 
    ArrowLeftIcon, StarIcon, StarIconOutline, PencilSquareIcon, TrashIcon, ChatBubbleLeftRightIcon,
    ChevronLeftIcon, ChevronRightIcon
} from '../components/common/Icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, updateReview, deleteReview, replyToReview, toggleFavorite } from '../api/servicesApi';
import { useUIContext } from '../context/UIContext';
import { useHasPermission } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import ServiceInfoCard from '../components/common/ServiceInfoCard';
import Rating from '../components/common/Rating';
import Spinner from '../components/common/Spinner';

const ReplyForm: React.FC<{ review: Review; onSave: (reply: string) => void; onClose: () => void; }> = ({ review, onSave, onClose }) => {
    const [reply, setReply] = useState(review.adminReply || '');
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(reply); };
    return (
        <form onSubmit={handleSubmit}>
            <textarea value={reply} onChange={e => setReply(e.target.value)} required rows={5} className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none" placeholder="اكتب ردك هنا..."></textarea>
            <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ الرد</button>
            </div>
        </form>
    );
};

const EditReviewForm: React.FC<{ review: Review; onSave: (comment: string) => void; onClose: () => void; }> = ({ review, onSave, onClose }) => {
    const [comment, setComment] = useState(review.comment);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(comment); };
    return (
        <form onSubmit={handleSubmit}>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تعليق المستخدم</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} required rows={5} className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none"></textarea>
            <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ التعديل</button>
            </div>
        </form>
    );
};

const ServiceDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { serviceId: serviceIdStr } = useParams<{ serviceId: string }>();
    const serviceId = Number(serviceIdStr);
    
    const { showToast } = useUIContext();
    const canManage = useHasPermission(['مسؤول ادارة الخدمات']);
    const queryClient = useQueryClient();

    const { data: services = [], isLoading } = useQuery({ queryKey: ['services'], queryFn: getServices });
    const service = services.find(s => s.id === serviceId);

    const [isReplyModalOpen, setReplyModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    const updateReviewMutation = useMutation({
        mutationFn: updateReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setEditModalOpen(false);
            showToast('تم تعديل التقييم بنجاح!');
        },
        onError: (error: Error) => showToast(error.message, 'error')
    });
    
    const deleteReviewMutation = useMutation({
        mutationFn: deleteReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            showToast('تم حذف التقييم بنجاح!');
        },
        onError: (error: Error) => showToast(error.message, 'error')
    });

    const replyToReviewMutation = useMutation({
        mutationFn: replyToReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setReplyModalOpen(false);
            showToast('تم إضافة الرد بنجاح!');
        },
        onError: (error: Error) => showToast(error.message, 'error')
    });

    const toggleFavoriteMutation = useMutation({
        mutationFn: toggleFavorite,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
    });

    const { prevService, nextService } = useMemo(() => {
        if (!service) return { prevService: null, nextService: null };
        const servicesInSubCategory = services
            .filter(s => s.subCategoryId === service.subCategoryId)
            .sort((a,b) => a.name.localeCompare(b.name, 'ar')); // Sort alphabetically for consistent ordering
        const currentIndex = servicesInSubCategory.findIndex(s => s.id === service.id);
        const prevService = currentIndex > 0 ? servicesInSubCategory[currentIndex - 1] : null;
        const nextService = currentIndex < servicesInSubCategory.length - 1 ? servicesInSubCategory[currentIndex + 1] : null;
        return { prevService, nextService };
    }, [services, service]);
    
    const handleOpenReplyModal = (review: Review) => { setSelectedReview(review); setReplyModalOpen(true); };
    const handleOpenEditModal = (review: Review) => { setSelectedReview(review); setEditModalOpen(true); };
    const confirmDeleteReview = (serviceId: number, reviewId: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) { deleteReviewMutation.mutate({ serviceId, reviewId }); }
    };
    const handleSaveReply = (reply: string) => {
        if (selectedReview && service) { replyToReviewMutation.mutate({ serviceId: service.id, reviewId: selectedReview.id, reply }); }
    };
    const handleSaveReview = (comment: string) => {
        if (selectedReview && service) { updateReviewMutation.mutate({ serviceId: service.id, reviewId: selectedReview.id, newComment: comment }); }
    };
    
    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    if (!service) return <div className="text-center p-8">لم يتم العثور على الخدمة.</div>;
    
    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى قائمة الخدمات</span>
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Main Content */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative">
                        <img src={service.images[0]} alt={service.name} className="w-full h-48 sm:h-64 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 right-0 p-4 sm:p-6 w-full flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-bold text-white">{service.name}</h1>
                                <p className="text-gray-200">{service.address}</p>
                            </div>
                            <button onClick={() => toggleFavoriteMutation.mutate(service.id)} className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:text-yellow-300" title="إضافة للمفضلة">
                                {service.isFavorite ? <StarIcon className="w-6 h-6 text-yellow-400"/> : <StarIconOutline className="w-6 h-6"/>}
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">حول الخدمة</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{service.about}</p>
                        
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                            <ChatBubbleLeftRightIcon className="w-6 h-6"/>
                            التقييمات والآراء ({service.reviews.length})
                        </h2>
                        <div className="space-y-6">
                            {service.reviews.map(review => (
                                <div key={review.id} className="border-t border-slate-200 dark:border-slate-700 pt-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <img src={review.avatar} alt={review.username} className="w-12 h-12 rounded-full object-cover" loading="lazy"/>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{review.username}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                                                <Rating rating={review.rating} />
                                            </div>
                                        </div>
                                        {canManage && (
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => handleOpenReplyModal(review)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900/50 rounded-md" title="الرد على التقييم"><ChatBubbleLeftRightIcon className="w-5 h-5" /></button>
                                                <button onClick={() => handleOpenEditModal(review)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md" title="تعديل التقييم"><PencilSquareIcon className="w-5 h-5" /></button>
                                                <button onClick={() => confirmDeleteReview(service.id, review.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md" title="حذف التقييم"><TrashIcon className="w-5 h-5" /></button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-4 text-gray-700 dark:text-gray-300">{review.comment}</p>
                                    {review.adminReply && (
                                        <div className="mt-4 mr-10 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                            <p className="font-bold text-sm text-cyan-600 dark:text-cyan-400">رد المدير:</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{review.adminReply}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {service.reviews.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-6">لا توجد تقييمات لهذه الخدمة بعد.</p>}
                        </div>

                         {/* Navigation between services */}
                        <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
                            {prevService ? (
                                <Link to={`/dashboard/services/detail/${prevService.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-cyan-500">
                                    <ChevronRightIcon className="w-5 h-5" />
                                    <span>{prevService.name}</span>
                                </Link>
                            ) : <div></div>}
                            {nextService ? (
                                <Link to={`/dashboard/services/detail/${nextService.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-cyan-500">
                                    <span>{nextService.name}</span>
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </Link>
                            ) : <div></div>}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <ServiceInfoCard service={service} />
                </div>
            </div>

            {selectedReview && (
                <>
                    <Modal isOpen={isReplyModalOpen} onClose={() => setReplyModalOpen(false)} title={`الرد على تقييم ${selectedReview.username}`}>
                        <ReplyForm review={selectedReview} onClose={() => setReplyModalOpen(false)} onSave={handleSaveReply} />
                    </Modal>
                    <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title={`تعديل تقييم ${selectedReview.username}`}>
                        <EditReviewForm review={selectedReview} onClose={() => setEditModalOpen(false)} onSave={handleSaveReview} />
                    </Modal>
                </>
            )}
        </div>
    );
};

export default ServiceDetailPage;
