import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeftIcon, StarIcon, PencilSquareIcon, TrashIcon, ChatBubbleLeftRightIcon, 
    MagnifyingGlassIcon, ArrowTrendingUpIcon, ChatBubbleOvalLeftIcon, SparklesIcon,
    CheckCircleIcon, 
    XCircleIcon
} from '../components/common/Icons';
import type { Review } from '../types';
import { useServicesContext } from '../context/ServicesContext';
import { useHasPermission } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import KpiCard from '../components/common/KpiCard';
import { GoogleGenAI, Type } from "@google/genai";

// AI Analysis Types
interface AnalysisResult {
    summary: string;
    positive_points: string[];
    negative_points: string[];
    suggested_reply: string;
}

// Components copied from other files to keep changes minimal
const Rating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`w-4 h-4 ${ i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600' }`} />
        ))}
    </div>
);

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

// Main Page Component
const ReviewsPage: React.FC = () => {
    const navigate = useNavigate();
    const { services, handleUpdateReview, handleDeleteReview, handleReplyToReview } = useServicesContext();
    const canManage = useHasPermission(['مسؤول ادارة الخدمات']);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState<number>(0);
    const [serviceFilter, setServiceFilter] = useState<number>(0);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isReplyModalOpen, setReplyModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<(Review & { serviceId: number }) | null>(null);

    // AI Analysis State
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [analysisServiceId, setAnalysisServiceId] = useState<number>(0); // 0 for all

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
            return {
                total: 0,
                averageRating: 0,
                newReviews: 0,
                pendingReplies: 0,
            };
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newReviews = allReviews.filter(r => new Date(r.date) >= thirtyDaysAgo).length;
        const pendingReplies = allReviews.filter(r => !r.adminReply).length;
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / allReviews.length;
        
        return {
            total: allReviews.length,
            averageRating,
            newReviews,
            pendingReplies,
        };
    }, [allReviews]);

    const filteredReviews = useMemo(() => (
        allReviews.filter(review => {
            const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  review.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  review.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRating = ratingFilter === 0 || Math.round(review.rating) === ratingFilter;
            const matchesService = serviceFilter === 0 || review.serviceId === serviceFilter;
            return matchesSearch && matchesRating && matchesService;
        })
    ), [allReviews, searchTerm, ratingFilter, serviceFilter]);
    
    const handleAnalyzeReviews = async () => {
        setIsAnalyzing(true);
        setAnalysisError(null);
        setAnalysisResult(null);

        if (!process.env.API_KEY) {
            setAnalysisError("API Key is not configured.");
            setIsAnalyzing(false);
            return;
        }

        const reviewsToAnalyze = analysisServiceId === 0
            ? allReviews
            : allReviews.filter(r => r.serviceId === analysisServiceId);
        
        if (reviewsToAnalyze.length === 0) {
            setAnalysisError("لا توجد تقييمات لتحليلها لهذه الخدمة.");
            setIsAnalyzing(false);
            return;
        }

        const comments = reviewsToAnalyze.map(r => `- ${r.comment} (${r.rating} نجوم)`).join('\n');
        const prompt = `
            بصفتك خبيرًا في تحليل آراء العملاء، قم بتحليل قائمة التقييمات التالية لخدمة مقدمة في مدينة سكنية. 
            التقييمات هي:
            ${comments}

            مهمتك هي تقديم ملخص شامل باللغة العربية. يرجى إرجاع النتائج بتنسيق JSON حصريًا.
        `;

        const schema = {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING, description: 'ملخص عام وموجز لمشاعر العملاء في التقييمات.' },
                positive_points: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'قائمة من 3 إلى 5 نقاط إيجابية شائعة ذكرها المستخدمون.' },
                negative_points: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'قائمة من 3 إلى 5 نقاط سلبية شائعة أو مجالات للتحسين.' },
                suggested_reply: { type: Type.STRING, description: 'صياغة رد عام مقترح ومهذب يمكن للمدير استخدامه للرد على التقييمات، مع الأخذ في الاعتبار النقاط الإيجابية والسلبية.' },
            },
            required: ['summary', 'positive_points', 'negative_points', 'suggested_reply']
        };

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });
            const resultText = response.text.trim();
            const resultJson = JSON.parse(resultText) as AnalysisResult;
            setAnalysisResult(resultJson);
        } catch (error) {
            console.error("Error analyzing reviews:", error);
            setAnalysisError("حدث خطأ أثناء تحليل التقييمات. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsAnalyzing(false);
        }
    };

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
            handleUpdateReview(selectedReview.serviceId, selectedReview.id, comment);
            setEditModalOpen(false);
        }
    };
    
    const handleSaveReply = (reply: string) => {
        if (selectedReview) {
            handleReplyToReview(selectedReview.serviceId, selectedReview.id, reply);
            setReplyModalOpen(false);
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KpiCard title="إجمالي التقييمات" value={reviewStats.total.toString()} icon={<ChatBubbleOvalLeftIcon className="w-8 h-8 text-cyan-400" />} />
                    <KpiCard title="متوسط التقييم" value={reviewStats.averageRating.toFixed(1)} icon={<StarIcon className="w-8 h-8 text-amber-400" />} />
                    <KpiCard title="تقييمات جديدة (30 يوم)" value={reviewStats.newReviews.toString()} icon={<ArrowTrendingUpIcon className="w-8 h-8 text-lime-400" />} />
                    <KpiCard title="بانتظار الرد" value={reviewStats.pendingReplies.toString()} icon={<ChatBubbleLeftRightIcon className="w-8 h-8 text-rose-400" />} />
                </div>
                
                {canManage && (
                    <div className="mb-8 p-6 bg-gradient-to-tr from-slate-50 to-cyan-50 dark:from-slate-900/50 dark:to-cyan-900/30 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
                            <SparklesIcon className="w-7 h-7 text-cyan-400"/>
                            تحليل التقييمات بالذكاء الاصطناعي
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                             <select value={analysisServiceId} onChange={(e) => setAnalysisServiceId(Number(e.target.value))} className="w-full sm:w-64 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition">
                                <option value="0">كل الخدمات</option>
                                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <button onClick={handleAnalyzeReviews} disabled={isAnalyzing} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-cyan-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
                                {isAnalyzing ? <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <SparklesIcon className="w-5 h-5"/>}
                                <span>{isAnalyzing ? 'جاري التحليل...' : 'بدء التحليل'}</span>
                            </button>
                        </div>
                        {analysisError && <p className="text-red-500 text-sm">{analysisError}</p>}
                        {analysisResult && (
                            <div className="grid md:grid-cols-2 gap-6 mt-6 animate-fade-in">
                                <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                                    <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-200">ملخص عام</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{analysisResult.summary}</p>
                                </div>
                                <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                                    <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-200">النقاط الإيجابية الشائعة</h3>
                                    <ul className="space-y-1 text-sm">{analysisResult.positive_points.map((p,i)=><li key={i} className="flex items-start gap-2"><CheckCircleIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0"/><span>{p}</span></li>)}</ul>
                                </div>
                                <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                                    <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-200">نقاط للتحسين</h3>
                                    <ul className="space-y-1 text-sm">{analysisResult.negative_points.map((p,i)=><li key={i} className="flex items-start gap-2"><XCircleIcon className="w-4 h-4 text-red-500 mt-1 flex-shrink-0"/><span>{p}</span></li>)}</ul>
                                </div>
                                 <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                                    <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-200">رد مقترح</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{analysisResult.suggested_reply}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}


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
                            {filteredReviews.map(review => (
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
                                                <button onClick={() => handleOpenReplyModal(review)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-900/50 rounded-md" title="الرد"><ChatBubbleLeftRightIcon className="w-5 h-5" /></button>
                                                <button onClick={() => handleOpenEditModal(review)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md" title="تعديل"><PencilSquareIcon className="w-5 h-5" /></button>
                                                <button onClick={() => handleDeleteReview(review.serviceId, review.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md" title="حذف"><TrashIcon className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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