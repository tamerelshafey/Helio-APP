import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CubeIcon, BuildingLibraryIcon, BuildingOffice2Icon } from '../components/common/Icons';

const InfoSection: React.FC<{ id: string; title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ id, title, icon, children }) => (
    <section id={id} className="mb-12 scroll-mt-20">
        <div className="text-center mb-8">
            <div className="inline-block p-4 bg-slate-100 dark:bg-slate-700/50 rounded-full">
                {icon}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-4">{title}</h2>
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none text-right leading-relaxed" style={{ direction: 'rtl' }}>
            {children}
        </div>
    </section>
);

const AboutPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <InfoSection id="about-app" title="حول تطبيق Helio" icon={<CubeIcon className="w-12 h-12 text-cyan-500" />}>
                     <p className="text-center">
                        تطبيق "هيليو" هو بوابتك الرقمية الشاملة لمدينة هليوبوليس الجديدة. تم تصميم التطبيق ليكون الرفيق اليومي لكل ساكن، حيث يهدف إلى تسهيل الوصول إلى كافة الخدمات والمعلومات الحيوية داخل المدينة، وتعزيز التواصل بين السكان وإدارة المدينة.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 text-right mt-8">
                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <h3 className="text-2xl font-semibold mb-3 text-cyan-600 dark:text-cyan-400">رؤيتنا</h3>
                            <p>أن نكون المنصة الرائدة التي تساهم في بناء مجتمع مترابط وذكي في هليوبوليس الجديدة، حيث يتمتع السكان بحياة أسهل وأكثر راحة من خلال التكنولوجيا.</p>
                        </div>
                         <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <h3 className="text-2xl font-semibold mb-3 text-cyan-600 dark:text-cyan-400">مهمتنا</h3>
                            <p>توفير منصة موحدة تجمع كافة الخدمات، الأخبار، والعقارات، وتسهل التواصل الفعال بين السكان، مقدمي الخدمات، وإدارة المدينة لتعزيز جودة الحياة للجميع.</p>
                        </div>
                    </div>
                </InfoSection>

                <div className="border-t border-slate-200 dark:border-slate-700 my-12"></div>

                <InfoSection id="about-city" title="عن مدينة هليوبوليس الجديدة" icon={<BuildingLibraryIcon className="w-12 h-12 text-green-500" />}>
                    <p>
                        تأسست مدينة هليوبوليس الجديدة كامتداد طبيعي لحي مصر الجديدة العريق، وهي تمثل رؤية مستقبلية لمجتمع سكني متكامل ومستدام. تقع المدينة في موقع استراتيجي شرق القاهرة، مما يوفر سهولة الوصول إلى العاصمة الإدارية الجديدة والقاهرة الجديدة ومطار القاهرة الدولي.
                    </p>
                    <h3 className="text-green-600 dark:text-green-400">التخطيط العمراني</h3>
                    <p>
                        تم تصميم المدينة بعناية فائقة لتوفير أعلى مستويات جودة الحياة، حيث تتميز بشوارعها الواسعة، ومساحاتها الخضراء الشاسعة، وبحيراتها الصناعية التي تضفي لمسة جمالية فريدة. ينقسم التخطيط إلى أحياء سكنية متنوعة ما بين مناطق فيلات وعمارات، بالإضافة إلى مناطق خدمية وتجارية وترفيهية متكاملة.
                    </p>
                </InfoSection>
                
                <div className="border-t border-slate-200 dark:border-slate-700 my-12"></div>

                <InfoSection id="about-company" title="عن شركة مصر الجديدة للإسكان والتعمير" icon={<BuildingOffice2Icon className="w-12 h-12 text-purple-500" />}>
                     <p>
                        تعتبر شركة مصر الجديدة للإسكان والتعمير واحدة من أعرق شركات التطوير العقاري في مصر، حيث يعود تاريخ تأسيسها إلى عام 1906. على مدار أكثر من قرن، ساهمت الشركة في تشكيل المشهد العمراني المصري من خلال مشاريعها الرائدة التي تجمع بين الأصالة المعمارية والتخطيط الحديث.
                    </p>
                    <h3 className="text-purple-500 dark:text-purple-400">تاريخ وإرث</h3>
                    <p>
                        بدأت الشركة مسيرتها بتطوير ضاحية مصر الجديدة، التي أصبحت نموذجًا فريدًا للأحياء السكنية الراقية في القاهرة. استمرت الشركة في البناء على هذا الإرث، لتطلق مشاريع عملاقة مثل مدينة هليوبوليس الجديدة، التي تمثل امتدادًا عصريًا لرؤيتها في بناء مجتمعات متكاملة ومستدامة.
                    </p>
                </InfoSection>
            </div>
        </div>
    );
};

export default AboutPage;