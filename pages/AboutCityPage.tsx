import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BuildingLibraryIcon } from '../components/common/Icons';

const AboutCityPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <div className="text-center mb-8">
                     <div className="inline-block p-4 bg-green-100 dark:bg-green-900/50 rounded-full">
                        <BuildingLibraryIcon className="w-12 h-12 text-green-500" />
                     </div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-4">
                        عن مدينة هليوبوليس الجديدة
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">جوهرة شرق القاهرة: مجتمع متكامل يجمع بين الأصالة والحداثة.</p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-right leading-relaxed" style={{ direction: 'rtl' }}>
                    <p>
                        تأسست مدينة هليوبوليس الجديدة كامتداد طبيعي لحي مصر الجديدة العريق، وهي تمثل رؤية مستقبلية لمجتمع سكني متكامل ومستدام. تقع المدينة في موقع استراتيجي شرق القاهرة، مما يوفر سهولة الوصول إلى العاصمة الإدارية الجديدة والقاهرة الجديدة ومطار القاهرة الدولي.
                    </p>
                    <h2 className="text-green-600 dark:text-green-400">التخطيط العمراني</h2>
                    <p>
                        تم تصميم المدينة بعناية فائقة لتوفير أعلى مستويات جودة الحياة، حيث تتميز بشوارعها الواسعة، ومساحاتها الخضراء الشاسعة، وبحيراتها الصناعية التي تضفي لمسة جمالية فريدة. ينقسم التخطيط إلى أحياء سكنية متنوعة ما بين مناطق فيلات وعمارات، بالإضافة إلى مناطق خدمية وتجارية وترفيهية متكاملة.
                    </p>
                    <h2 className="text-green-600 dark:text-green-400">المرافق والخدمات</h2>
                    <ul>
                        <li><strong>تعليمية:</strong> تضم المدينة مجموعة من المدارس الدولية والخاصة المرموقة التي تقدم مستويات تعليمية متميزة.</li>
                        <li><strong>صحية:</strong> تتوفر مراكز طبية مجهزة ومستشفيات تقدم رعاية صحية متكاملة للسكان على مدار الساعة.</li>
                        <li><strong>تجارية وترفيهية:</strong> تحتوي على مولات تجارية حديثة، نوادٍ رياضية واجتماعية، مطاعم ومقاهي متنوعة لتلبية كافة احتياجات وأذواق السكان.</li>
                        <li><strong>بنية تحتية:</strong> شبكات طرق ومرافق حديثة تضمن سلاسة الحركة وتوفر الخدمات الأساسية بكفاءة عالية.</li>
                    </ul>
                    <p>
                        هليوبوليس الجديدة ليست مجرد مكان للعيش، بل هي مجتمع ينبض بالحياة، يوفر لسكانه بيئة آمنة وصحية ومحفزة للنمو والازدهار.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutCityPage;