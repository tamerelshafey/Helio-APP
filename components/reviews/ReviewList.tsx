import React, { useState, useMemo, useEffect } from 'react';
import type { Review, Service } from '../../types';
import Rating from '../common/Rating';
import Pagination from '../common/Pagination';
import { MagnifyingGlassIcon, ChatBubbleLeftRightIcon, PencilSquareIcon, TrashIcon } from '../common/Icons';

const ITEMS_PER_PAGE = 10;

interface ReviewListProps {
    reviews: (Review & { serviceId: number; serviceName: string; })[];
    services: Service[];
    canManage: boolean;
    onEdit: (review: Review & { serviceId: number; }) => void;
    onReply: (review: Review & { serviceId: number; }) => void;
    onDelete: (serviceId: number, reviewId: number) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, services, canManage, onEdit, onReply, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState<number>(0);
    const [serviceFilter, setServiceFilter] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    
    const filteredReviews = useMemo(() => (
        reviews.filter(review => {
            const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  review.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  review.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRating = ratingFilter === 0 || Math.round(review.rating) === ratingFilter;
            const matchesService = serviceFilter === 0 || review.serviceId === serviceFilter;
            return matchesSearch && matchesRating && matchesService;
        })
    ), [reviews, searchTerm, ratingFilter, serviceFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, ratingFilter, serviceFilter]);
    
    const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);

    const paginatedReviews = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredReviews, currentPage]);

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                    <input type="text" placeholder="بحث بالخدمة, المستخدم, أو التعليق..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/>
                </div>
                 <select value={serviceFilter} onChange={(e) => setServiceFilter(Number(e.target.value))} className="w-full sm:w-56 bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition">
                    <option value="0">كل الخدمات</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select value={ratingFilter} onChange={(e) => setRatingFilter(Number(e.target.value))} className="w-full sm:w-48 bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition">
                    <option value="0">كل التقييمات</option>
                    <option value="1">1 نجمة</option>
                    <option value="2">2 نجوم</option>
                    <option value="3">3 نجوم</option>
                    <option value="4">4 نجوم</option>
                    <option value="5">5 نجوم</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">المستخدم</th>
                            <th scope="col" className="px-6 py-3">التقييم والتعليق</th>
                            <th scope="col" className="px-6 py-3">الخدمة</th>
                            <th scope="col" className="px-6 py-3">التاريخ</th>
                            {canManage && <th scope="col" className="px-6 py-3">إجراءات</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedReviews.map(review => (
                            <tr key={`${review.serviceId}-${review.id}`} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={review.avatar} alt={review.username} className="w-10 h-10 rounded-full object-cover" loading="lazy"/>
                                        <span className="font-semibold text-gray-900 dark:text-white">{review.username}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 max-w-sm">
                                    <Rating rating={review.rating} />
                                    <p className="text-gray-600 dark:text-gray-300 mt-1 truncate">{review.comment}</p>
                                    {review.adminReply && <p className="mt-2 text-xs text-cyan-600 dark:text-cyan-400 truncate"><strong>رد المدير:</strong> {review.adminReply}</p>}
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">{review.serviceName}</td>
                                <td className="px-6 py-4">{review.date}</td>
                                {canManage && (
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => onReply(review)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-900/50 rounded-md" title="الرد"><ChatBubbleLeftRightIcon className="w-5 h-5" /></button>
                                            <button onClick={() => onEdit(review)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md" title="تعديل"><PencilSquareIcon className="w-5 h-5" /></button>
                                            <button onClick={() => onDelete(review.serviceId, review.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md" title="حذف"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredReviews.length > 0 && (
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </>
    );
};

export default ReviewList;
