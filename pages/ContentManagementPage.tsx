import React, { useState, useCallback, ReactNode, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPublicContent, updatePublicContent } from '../api/generalApi';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, HomeIcon, InformationCircleIcon, QuestionMarkCircleIcon, BookOpenIcon, PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, PencilSquareIcon } from '../components/common/Icons';
import type { HomePageContent, AboutPageContent, FaqPageContent, FaqCategory, FaqItem, PolicyPageContent, PolicySection, PublicPagesContent } from '../types';
import { InputField, TextareaField } from '../components/common/FormControls';
import RichTextEditor from '../components/common/RichTextEditor';
import QueryStateWrapper from '../components/common/QueryStateWrapper';
import useDocumentTitle from '../hooks/useDocumentTitle';

// Reusable Components
const SaveButton: React.FC<{ onClick: () => void; isSaving: boolean }> = ({ onClick, isSaving }) => (
    <button onClick={onClick} disabled={isSaving} className="px-6 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600 disabled:bg-slate-400">
        {isSaving ? '...جاري الحفظ' : 'حفظ التغييرات'}
    </button>
);

// Form Components per Tab
const HomePageForm: React.FC<{ content: HomePageContent; onSave: (data: HomePageContent) => void }> = ({ content, onSave }) => {
    const [data, setData] = useState(content);
    const [isSaving, setIsSaving] = useState(false);
    const showToast = useStore((state) => state.showToast);

    // Update local state when content prop changes
    useEffect(() => {
        setData(content);
    }, [content]);

    const handleChange = (field: keyof HomePageContent, value: string) => setData(prev => ({ ...prev, [field]: value }));
    const handleFeatureChange = (index: number, field: keyof typeof data.features[0], value: string) => {
        const newFeatures = [...data.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleSaveClick = () => {
        setIsSaving(true);
        onSave(data);
        setTimeout(() => {
            setIsSaving(false);
            showToast('تم حفظ محتوى الصفحة الرئيسية بنجاح!');
        }, 1000);
    };
    
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">محتوى الصفحة الرئيسية</h3>
            <InputField name="heroTitleLine1" label="العنوان الرئيسي (سطر 1)" value={data.heroTitleLine1} onChange={e => handleChange('heroTitleLine1', e.target.value)} />
            <InputField name="heroTitleLine2" label="العنوان الرئيسي (سطر 2)" value={data.heroTitleLine2} onChange={e => handleChange('heroTitleLine2', e.target.value)} />
            <TextareaField name="heroSubtitle" label="النص التعريفي" value={data.heroSubtitle} onChange={e => handleChange('heroSubtitle', e.target.value)} />
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-2">قسم المميزات</h3>
                <InputField name="featuresSectionTitle" label="عنوان القسم" value={data.featuresSectionTitle} onChange={e => handleChange('featuresSectionTitle', e.target.value)} />
                <TextareaField name="featuresSectionSubtitle" label="الوصف" value={data.featuresSectionSubtitle} onChange={e => handleChange('featuresSectionSubtitle', e.target.value)} />
                {data.features.map((feature, index) => (
                    <div key={index} className="p-4 border rounded-md mt-2 bg-slate-50 dark:bg-slate-700/50">
                        <InputField name={`feature_title_${index}`} label={`الميزة ${index + 1}: العنوان`} value={feature.title} onChange={e => handleFeatureChange(index, 'title', e.target.value)} />
                        <TextareaField name={`feature_desc_${index}`} label={`الميزة ${index + 1}: الوصف`} value={feature.description} onChange={e => handleFeatureChange(index, 'description', e.target.value)} />
                    </div>
                ))}
            </div>
             <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                 <h3 className="text-lg font-semibold mb-2">قسم الروابط</h3>
                 <InputField name="infoLinksSectionTitle" label="عنوان القسم" value={data.infoLinksSectionTitle} onChange={e => handleChange('infoLinksSectionTitle', e.target.value)} />
            </div>
            <div className="flex justify-end pt-4"><SaveButton onClick={handleSaveClick} isSaving={isSaving} /></div>
        </div>
    );
};

const AboutPageForm: React.FC<{ content: AboutPageContent; onSave: (data: AboutPageContent) => void }> = ({ content, onSave }) => {
    const [data, setData] = useState(content);
    const [isSaving, setIsSaving] = useState(false);
    const showToast = useStore((state) => state.showToast);
    
    useEffect(() => {
        setData(content);
    }, [content]);

    const handleSaveClick = () => {
        setIsSaving(true);
        onSave(data);
        setTimeout(() => {
            setIsSaving(false);
            showToast('تم حفظ محتوى صفحة "حول التطبيق" بنجاح!');
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">محتوى صفحة "حول التطبيق"</h3>
            <InputField name="title" label="العنوان" value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} />
            <TextareaField name="intro" label="المقدمة" value={data.intro} onChange={e => setData(d => ({ ...d, intro: e.target.value }))} rows={5} />
            <InputField name="vision_title" label="عنوان الرؤية" value={data.vision.title} onChange={e => setData(d => ({ ...d, vision: {...d.vision, title: e.target.value }}))} />
            <TextareaField name="vision_text" label="نص الرؤية" value={data.vision.text} onChange={e => setData(d => ({ ...d, vision: {...d.vision, text: e.target.value }}))} />
            <InputField name="mission_title" label="عنوان المهمة" value={data.mission.title} onChange={e => setData(d => ({ ...d, mission: {...d.mission, title: e.target.value }}))} />
            <TextareaField name="mission_text" label="نص المهمة" value={data.mission.text} onChange={e => setData(d => ({ ...d, mission: {...d.mission, text: e.target.value }}))} />
            <div className="flex justify-end pt-4"><SaveButton onClick={handleSaveClick} isSaving={isSaving} /></div>
        </div>
    );
};

const FaqPageForm: React.FC<{ content: FaqPageContent; onSave: (data: FaqPageContent) => void }> = ({ content, onSave }) => {
    const [data, setData] = useState(content);
    const [isSaving, setIsSaving] = useState(false);
    const showToast = useStore((state) => state.showToast);

    useEffect(() => {
        setData(content);
    }, [content]);

    const handleCategoryChange = (catIndex: number, value: string) => {
        const newData = { ...data };
        newData.categories[catIndex].category = value;
        setData(newData);
    };
    const handleItemChange = (catIndex: number, itemIndex: number, field: 'q' | 'a', value: string) => {
        const newData = { ...data };
        newData.categories[catIndex].items[itemIndex][field] = value;
        setData(newData);
    };

    const addCategory = () => setData(prev => ({...prev, categories: [...prev.categories, { category: 'فئة جديدة', items: [{q: 'سؤال جديد', a: 'إجابة جديدة'}]}]}));
    const removeCategory = (catIndex: number) => setData(prev => ({...prev, categories: prev.categories.filter((_, i) => i !== catIndex)}));
    const addItem = (catIndex: number) => {
        const newData = { ...data };
        newData.categories[catIndex].items.push({q: 'سؤال جديد', a: 'إجابة جديدة'});
        setData(newData);
    };
    const removeItem = (catIndex: number, itemIndex: number) => {
        const newData = { ...data };
        newData.categories[catIndex].items = newData.categories[catIndex].items.filter((_, i) => i !== itemIndex);
        setData(newData);
    };
     const handleSaveClick = () => {
        setIsSaving(true);
        onSave(data);
        setTimeout(() => {
            setIsSaving(false);
            showToast('تم حفظ محتوى صفحة "الأسئلة الشائعة" بنجاح!');
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">محتوى صفحة "الأسئلة الشائعة"</h3>
            <InputField name="title" label="العنوان" value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} />
            <InputField name="subtitle" label="العنوان الفرعي" value={data.subtitle} onChange={e => setData(d => ({ ...d, subtitle: e.target.value }))} />
            
            {data.categories.map((cat, catIndex) => (
                <div key={catIndex} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-4">
                    <div className="flex justify-between items-center">
                        <input type="text" value={cat.category} onChange={e => handleCategoryChange(catIndex, e.target.value)} className="w-full text-lg font-bold bg-transparent focus:outline-none focus:ring-0 border-b border-slate-300 dark:border-slate-600"/>
                        <button onClick={() => removeCategory(catIndex)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                    {cat.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="p-3 border rounded-md bg-white dark:bg-slate-800">
                             <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium">السؤال #{itemIndex+1}</label>
                                <button onClick={() => removeItem(catIndex, itemIndex)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-4 h-4"/></button>
                             </div>
                            <TextareaField name={`q_${catIndex}_${itemIndex}`} label="السؤال" value={item.q} onChange={e => handleItemChange(catIndex, itemIndex, 'q', e.target.value)} rows={2} />
                            <TextareaField name={`a_${catIndex}_${itemIndex}`} label="الإجابة" value={item.a} onChange={e => handleItemChange(catIndex, itemIndex, 'a', e.target.value)} rows={4} />
                        </div>
                    ))}
                    <button onClick={() => addItem(catIndex)} className="flex items-center gap-2 text-sm text-cyan-600 font-semibold mt-2"><PlusIcon className="w-4 h-4"/>إضافة سؤال</button>
                </div>
            ))}
            <button onClick={addCategory} className="flex items-center gap-2 text-sm font-semibold p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-md hover:bg-cyan-200"><PlusIcon className="w-5 h-5"/>إضافة فئة جديدة</button>
             <div className="flex justify-end pt-4"><SaveButton onClick={handleSaveClick} isSaving={isSaving} /></div>
        </div>
    );
};

const PolicyPageForm: React.FC<{ content: PolicyPageContent; onSave: (data: PolicyPageContent) => void }> = ({ content, onSave }) => {
    const [data, setData] = useState(content);
    const [isSaving, setIsSaving] = useState(false);
    const showToast = useStore((state) => state.showToast);

    useEffect(() => {
        setData(content);
    }, [content]);

    const handleSectionChange = (secIndex: number, field: 'title' | 'content', value: string) => {
        const newData = { ...data };
        if (field === 'title') {
            newData.sections[secIndex].title = value;
        } else {
            newData.sections[secIndex].content = value;
        }
        setData(newData);
    };
    
    const addSection = () => setData(prev => ({...prev, sections: [...prev.sections, { title: 'قسم جديد', content: '<p>نص جديد.</p>'}]}));
    const removeSection = (secIndex: number) => setData(prev => ({...prev, sections: prev.sections.filter((_, i) => i !== secIndex)}));
    const handleSaveClick = () => {
        setIsSaving(true);
        onSave(data);
        setTimeout(() => {
            setIsSaving(false);
            showToast(`تم حفظ محتوى صفحة "${data.title}" بنجاح!`);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">محتوى صفحة "{data.title}"</h3>
            <InputField name="title" label="العنوان" value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} />
            <InputField name="lastUpdated" label="آخر تحديث" value={data.lastUpdated} onChange={e => setData(d => ({ ...d, lastUpdated: e.target.value }))} />
            
            {data.sections.map((section, secIndex) => (
                <div key={secIndex} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-4">
                     <div className="flex justify-between items-center">
                        <input type="text" value={section.title} onChange={e => handleSectionChange(secIndex, 'title', e.target.value)} className="w-full text-lg font-bold bg-transparent focus:outline-none focus:ring-0 border-b border-slate-300 dark:border-slate-600"/>
                        <button onClick={() => removeSection(secIndex)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المحتوى</label>
                        <RichTextEditor
                            value={section.content}
                            onChange={html => handleSectionChange(secIndex, 'content', html)}
                        />
                    </div>
                </div>
            ))}

            <button onClick={addSection} className="flex items-center gap-2 text-sm font-semibold p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-md hover:bg-cyan-200"><PlusIcon className="w-5 h-5"/>إضافة قسم</button>
            <div className="flex justify-end pt-4"><SaveButton onClick={handleSaveClick} isSaving={isSaving} /></div>
        </div>
    );
};


// Main Component
type Tab = 'home' | 'about' | 'faq' | 'privacy' | 'terms';

const ContentManagementPage: React.FC = () => {
    useDocumentTitle('إدارة المحتوى | Helio');
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<Tab>('home');
    
    const { data: publicPagesContent } = useQuery({ 
        queryKey: ['publicContent'], 
        queryFn: getPublicContent 
    });

    const updateContentMutation = use