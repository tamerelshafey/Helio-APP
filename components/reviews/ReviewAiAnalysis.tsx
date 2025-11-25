import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Service, Review } from '../../types';
import Spinner from '../common/Spinner';
import { SparklesIcon, CheckCircleIcon, XCircleIcon } from '../common/Icons';

interface AnalysisResult {
    summary: string;
    positive_points: string[];
    negative_points: string[];
    suggested_reply: string;
}

interface ReviewAiAnalysisProps {
    services: Service[];
    allReviews: (Review & { serviceId: number; serviceName: string; })[];
}

const ReviewAiAnalysis: React.FC<ReviewAiAnalysisProps> = ({ services, allReviews }) => {
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [analysisServiceId, setAnalysisServiceId] = useState<number>(0); // 0 for all

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

        const analysisSchema = {
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
                    responseSchema: analysisSchema,
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

    return (
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
            {isAnalyzing && <Spinner />}
            {analysisError && <p className="text-red-500 text-sm">{analysisError}</p>}
            {analysisResult && !isAnalyzing && (
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
    );
};

export default ReviewAiAnalysis;
