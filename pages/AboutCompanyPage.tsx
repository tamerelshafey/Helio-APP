import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BuildingOffice2Icon } from '../components/common/Icons';

const AboutCompanyPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                        <BuildingOffice2Icon className="w-12 h-12 text-purple-500" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-4">
                        عن شركة مصر الجديدة للإسكان والتعمير
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">رائدة التطوير العقاري وصانعة المجتمعات الراقية في مصر.</p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-right leading-relaxed" style={{ direction: 'rtl' }}>
                    <p>
                        تعتبر شركة مصر الجديدة للإسكان والتعمير واحدة من أعرق شركات التطوير العقاري في مصر، حيث يعود تاريخ تأسيسها إلى عام 1906. على مدار أكثر من قرن، ساهمت الشركة في تشكيل المشهد العمراني المصري من خلال مشاريعها الرائدة التي تجمع بين الأصالة المعمارية والتخطيط الحديث.
                    </p>
                    <h2 className="text-purple-500 dark:text-purple-400">تاريخ وإرث</h2>
                    <p>
                        بدأت الشركة مسيرتها بتطوير ضاحية مصر الجديدة، التي أصبحت نموذجًا فريدًا للأحياء السكنية الراقية في القاهرة. استمرت الشركة في البناء على هذا الإرث، لتطلق مشاريع عملاقة مثل مدينة هليوبوليس الجديدة، التي تمثل امتدادًا عصريًا لرؤيتها في بناء مجتمعات متكاملة ومستدامة.
                    </p>
                    <h2 className="text-purple-500 dark:text-purple-400">رؤيتنا ومشاريعنا</h2>
                    <p>
                        تتمثل رؤية الشركة في خلق مجتمعات عمرانية متكاملة توفر أعلى مستويات جودة الحياة، مع الحفاظ على الطابع المعماري المميز وتحقيق التنمية المستدامة. تشمل محفظة مشاريعها:
                    </p>
                    <ul>
                        <li><strong>مدينة هليوبوليس الجديدة:</strong> مدينة متكاملة شرق القاهرة تمتد على مساحة شاسعة.</li>
                        <li><strong>مشروع هليو بارك:</strong> مشروع سكني وتجاري ضخم في القاهرة الجديدة.</li>
                        <li><strong>تطوير أصول تاريخية:</strong> تعمل الشركة على إعادة إحياء وتطوير المباني التاريخية المملوكة لها في مصر الجديدة للحفاظ على قيمتها التراثية.</li>
                    </ul>
                    <p>
                        تلتزم شركة مصر الجديدة للإسكان والتعمير بتقديم قيمة مضافة للمجتمع من خلال مشاريعها، وتواصل مسيرتها كقوة دافعة في قطاع التطوير العقاري المصري.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutCompanyPage;