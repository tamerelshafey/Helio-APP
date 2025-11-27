import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../components/common/Icons';
import type { Review } from '../types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, updateReview, deleteReview, replyToReview } from '../api/servicesApi';
import { useHasPermission } from '../hooks/usePermissions';
import Modal from '../components/common/Modal';
import QueryStateWrapper from '../components/common/QueryStateWrapper';
import useDocumentTitle from '../hooks/useDocumentTitle';

// Import refactored components
import ReviewKpiSection from '../components/reviews/ReviewKpiSection';
import ReviewAiAnalysis from '../components/reviews/ReviewAiAnalysis';
import ReviewList from '../components/reviews/ReviewList';
import { ReplyForm, EditReviewForm } from '../components/reviews/ReviewModals';

const ReviewsPage: React.FC = () => {
    useDocumentTitle('إدارة التقييمات | Helio');
    const navigate = useNavigate();
    const canManage = useHasPermission(['مسؤول ادارة الخدمات']);
    const queryClient = useQueryClient();
    const servicesQuery = useQuery({ queryKey: ['services'], queryFn: getServices });
    const { data: services = [] } = servicesQuery;

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isReplyModalOpen, setReplyModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<(Review & { serviceId: number }) | null>(null);

    const allReviews = useMemo(() => (
        services.flatMap(service =>
            service.reviews.map(review => ({
                ...review,
                serviceId: service.id,
                serviceName: service.name,
            }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    ), [services]);
    
    const reviewStats = useMemo(() => {
        if (allReviews.length === 0) {
            return { total: 0, averageRating: 0, newReviews: 0, pendingReplies: 0 };
        }
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newReviews = allReviews.filter(r => new Date(r.date) >= thirtyDaysAgo).length;
        const pendingReplies = allReviews.filter(r => !r.adminReply).length;
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / allReviews.length;
        
        return { total: allReviews.length, averageRating, newReviews, pendingReplies };
    }, [allReviews]);

    const updateReviewMutation = useMutation({
        mutationFn: updateReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setEditModalOpen(false);
        }
    });

    const deleteReviewMutation = useMutation({
        mutationFn: deleteReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        }
    });

    const replyToReviewMutation = useMutation({
        mutationFn: replyToReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setReplyModalOpen(false);
        }
    });

    const handleOpenEditModal = (review: Review & { serviceId: number }) => {
        setSelectedReview(review);
        setEditModalOpen(true);
    };
    
    const handleOpenReplyModal = (review: Review & { serviceId: number }) => {
        setSelectedReview(review);
        setReplyModalOpen(true);
    };

    const handleSaveReview = (comment: string) => {
        if (selectedReview) {
            updateReviewMutation.mutate({serviceId: selectedReview.serviceId, reviewId: selectedReview.id, newComment: comment});
        }
    };
    
    const handleSaveReply = (reply: string) => {
        if (selectedReview) {
            replyToReviewMutation.mutate({serviceId: selectedReview.serviceId, reviewId: selectedReview.id, reply});
        }
    };

    const handleDeleteReview = (serviceId: number, reviewId: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
            deleteReviewMutation.mutate({serviceId, reviewId});
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">إدارة التقييمات والآراء</h1>
                
                <QueryStateWrapper queries={servicesQuery}>
                    <ReviewKpiSection stats={reviewStats} />
                    
                    {canManage && <ReviewAiAnalysis services={services} allReviews={allReviews} />}

                    <ReviewList 
                        reviews={allReviews}
                        services={services}
                        canManage={canManage}
                        onEdit={handleOpenEditModal}
                        onReply={handleOpenReplyModal}
                        onDelete={handleDeleteReview}
                    />
                </QueryStateWrapper>
            </div>

            {selectedReview && (
                <>
                    <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title={`تعديل تقييم ${selectedReview.username}`}>
                        <EditReviewForm review={selectedReview} onClose={() => setEditModalOpen(false)} onSave={handleSaveReview} />
                    </Modal>
                    <Modal isOpen={isReplyModalOpen} onClose={() => setReplyModalOpen(false)} title={`الرد على تقييم ${selectedReview.username}`}>
                        <ReplyForm review={selectedReview} onClose={() => setReplyModalOpen(false)} onSave={handleSaveReply} />
                    </Modal>
                </>
            )}
        </div>
    );
};

export default ReviewsPage;