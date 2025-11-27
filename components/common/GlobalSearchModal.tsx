import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../api/usersApi';
import { getServices } from '../../api/servicesApi';
import { getProperties } from '../../api/propertiesApi';
import { getNews } from '../../api/contentApi';
import type { SearchResult } from '../../types';
import { MagnifyingGlassIcon, XMarkIcon, WrenchScrewdriverIcon, HomeModernIcon, NewspaperIcon, UserGroupIcon } from './Icons';
import useDebounce from '../../hooks/useDebounce';

interface GlobalSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
    const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: getUsers, enabled: isOpen });
    const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: getServices, enabled: isOpen });
    const { data: properties = [] } = useQuery({ queryKey: ['properties'], queryFn: getProperties, enabled: isOpen });
    const { data: news = [] } = useQuery({ queryKey: ['news'], queryFn: getNews, enabled: isOpen });
    
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce search term by 300ms
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            setSearchTerm(''); // Reset search term when closed
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    const searchResults = useMemo((): SearchResult[] => {
        if (debouncedSearchTerm.trim().length < 2) {
            return [];
        }
        const lowercasedTerm = debouncedSearchTerm.toLowerCase();
        
        const serviceResults: SearchResult[] = services
            .filter(s => s.name.toLowerCase().includes(lowercasedTerm))
            .map(s => ({
                id: `service-${s.id}`,
                type: 'خدمة',
                title: s.name,
                subtitle: s.address,
                link: `/dashboard/services/detail/${s.id}`,
                icon: <WrenchScrewdriverIcon className="w-5 h-5 text-cyan-500" />
            }));

        const propertyResults: SearchResult[] = properties
            .filter(p => p.title.toLowerCase().includes(lowercasedTerm))
            .map(p => ({
                id: `property-${p.id}`,
                type: 'عقار',
                title: p.title,
                subtitle: p.location.address,
                link: '/dashboard/properties',
                icon: <HomeModernIcon className="w-5 h-5 text-amber-500" />
            }));
        
        const newsResults: SearchResult[] = news
            .filter(n => n.title.toLowerCase().includes(lowercasedTerm))
            .map(n => ({
                id: `news-${n.id}`,
                type: 'خبر',
                title: n.title,
                subtitle: `بواسطة ${n.author}`,
                link: '/dashboard/news',
                icon: <NewspaperIcon className="w-5 h-5 text-purple-500" />
            }));
            
        const userResults: SearchResult[] = users
            .filter(u => u.name.toLowerCase().includes(lowercasedTerm) || u.email.toLowerCase().includes(lowercasedTerm))
            .map(u => ({
                id: `user-${u.id}`,
                type: 'مستخدم',
                title: u.name,
                subtitle: u.email,
                link: `/dashboard/users/${u.id}`,
                icon: <UserGroupIcon className="w-5 h-5 text-lime-500" />
            }));

        return [...serviceResults, ...propertyResults, ...newsResults, ...userResults].slice(0, 15);
    }, [debouncedSearchTerm, services, properties, news, users]);

    const groupedResults: Record<string, SearchResult[]> = useMemo(() => {
        return searchResults.reduce<Record<string, SearchResult[]>>((acc, result) => {
            const type = result.type;
            (acc[type] = acc[type] || []).push(result);
            return acc;
        }, {});
    }, [searchResults]);

    const handleLinkClick = (link: string) => {
        navigate(link);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-start pt-16 sm:pt-24 p-4" 
            dir="rtl"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-4 -translate-y-1/2" />
                    <input 
                        type="text"
                        placeholder="ابحث عن خدمة, عقار, خبر..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        className="w-full bg-transparent text-lg py-4 pr-12 pl-12 focus:outline-none text-gray-800 dark:text-white rounded-t-lg"
                    />
                    <button onClick={onClose} className="absolute top-1/2 left-4 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800 dark:hover:text-white">
                        <XMarkIcon className="w-6 h-6"/>
                    </button>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 max-h-[60vh] overflow-y-auto">
                    {searchTerm.trim().length < 2 ? (
                        <p className="text-center text-gray-500 p-8">ابدأ بالكتابة للبحث...</p>
                    ) : searchResults.length > 0 ? (
                        <div>
                            {Object.entries(groupedResults).map(([type, results]) => (
                                <div key={type}>
                                    <h3 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 bg-slate-100 dark:bg-slate-700/50 px-4 py-1.5 sticky top-0">{type}</h3>
                                    <ul>
                                        {results.map(result => (
                                            <li key={result.id}>
                                                <button onClick={() => handleLinkClick(result.link)} className="w-full text-right flex items-center gap-4 px-4 py-3 hover:bg-cyan-50 dark:hover:bg-cyan-900/20">
                                                    <div className="flex-shrink-0">{result.icon}</div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-white">{result.title}</p>
                                                        {result.subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{result.subtitle}</p>}
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 p-8">لا توجد نتائج بحث لـ "{debouncedSearchTerm}"</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlobalSearchModal;