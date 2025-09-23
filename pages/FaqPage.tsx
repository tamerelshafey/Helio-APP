import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ChevronDownIcon, QuestionMarkCircleIcon } from '../components/common/Icons';

interface FaqItemProps {
    question: string;
    answer: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center p-4 text-right bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
                <span className="font-semibold text-lg text-gray-800 dark:text-white">{question}</span>
                <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                <div className="p-6 text-gray-600 dark:text-gray-300 leading-relaxed prose dark:prose-invert max-w-none">
                    {answer}
                </div>
            </div>
        </div>
    );
};

const FaqPage: React.FC = () => {
    const navigate = useNavigate();
    const [openFaqId, setOpenFaqId] = useState<number | null>(1);

    const faqs = [
        {
            id: 1,
            category: "عن التطبيق",
            items: [
                {
                    q: "ما هو Helio APP؟",
                    a: <p>Helio APP هو تطبيق دليلي يساعدك تكتشف كل ما في هليوبوليس الجديدة بسهولة، من مطاعم وكافيهات، إلى مراكز طبية، حضانات، جيم، محلات، وخدمات قريبة منك – وكلها مجمعة في مكان واحد.</p>
                },
                {
                    q: "مين اللي ممكن يستخدم التطبيق؟",
                    a: <p>أي حد ساكن أو بيزور هليوبوليس الجديدة وعايز يعرف الأماكن والخدمات اللي حواليه بسرعة وبدقة.</p>
                },
                {
                    q: "هل لازم أسجل حساب؟",
                    a: <p>لا، تقدر تتصفح المحتوى بدون تسجيل. لكن التسجيل بيوفر لك مزايا إضافية زي حفظ الأماكن المفضلة وتقييم الخدمات.</p>
                }
            ]
        },
        {
            id: 2,
            category: "كيف أستخدم Helio APP؟",
            items: [
                {
                    q: "إزاي ألاقي مكان معين؟",
                    a: <p>استخدم خاصية البحث أو استعرض الدليل للخدمات المختلفة (مطاعم، تعليم، صحة، خدمات...).</p>
                },
                {
                    q: "هل ممكن أعرف تقييم الناس للمكان؟",
                    a: <p>في صفحة الخدمة هتلاقي تقييم، دا تقييم فعلى من السكان والمستخدمين.</p>
                },
                {
                    q: "هل التطبيق بيشتغل بدون إنترنت؟",
                    a: <p>التطبيق يحتاج اتصال بالإنترنت لعرض أحدث البيانات.</p>
                }
            ]
        },
        {
            id: 3,
            category: "أماكن وخدمات",
            items: [
                {
                    q: "إزاي أبلغ عن محل جديد مش موجود؟",
                    a: <p>فيه زر واتس اب ممكن تبعت لنا منه.</p>
                },
                {
                    q: "لقيت معلومات غلط عن محل – أعمل إيه؟",
                    a: <p>كلمنا على واتساب، وهنراجع البيانات فورًا.</p>
                }
            ]
        },
        {
            id: 4,
            category: "التواصل والدعم",
            items: [
                {
                    q: "لو عندي استفسار أو مشكلة، أتواصل مع مين؟",
                    a: <ul><li>واتساب: <a href="tel:+201234567890" className="text-cyan-500 hover:underline">+201234567890</a></li></ul>
                }
            ]
        },
        {
            id: 5,
            category: "خطط التطوير",
            items: [
                {
                    q: "هل في خطط لتطوير التطبيق؟",
                    a: <p>طبعًا، التطبيق بيتطور باستمرار بناءً على اقتراحاتكم. وهدفنا نخلي Helio APP أداة يومية لكل ساكن في المدينة.</p>
                }
            ]
        }
    ];

    let questionCounter = 0;

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-cyan-100 dark:bg-cyan-900/50 rounded-full">
                        <QuestionMarkCircleIcon className="w-12 h-12 text-cyan-500" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-4">الأسئلة الشائعة</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Helio APP بوابتك المتكاملة لقلب هليوبوليس الجديدة النابض بالحياة</p>
                </div>
                
                <div className="space-y-8">
                    {faqs.map(category => (
                        <div key={category.id}>
                            <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200 border-b-2 border-cyan-500/50 pb-2">{category.category}</h2>
                            <div className="space-y-4">
                                {category.items.map((item, index) => {
                                    const id = ++questionCounter;
                                    return (
                                        <FaqItem
                                            key={id}
                                            question={item.q}
                                            answer={item.a}
                                            isOpen={openFaqId === id}
                                            onClick={() => setOpenFaqId(openFaqId === id ? null : id)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                 <div className="mt-12 text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <p className="font-bold text-xl">☀️ Helio APP = مدينتك في جيبك</p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">كل الأماكن، كل الخدمات، كل التفاصيل... في تطبيق واحد. جربه دلوقتي، وخلي المدينة أسهل.</p>
                </div>
            </div>
        </div>
    );
};

export default FaqPage;