import React, { useState, memo, useMemo, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    HomeIcon, UserGroupIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon, 
    WrenchScrewdriverIcon, TruckIcon, ShieldExclamationIcon, NewspaperIcon, ChevronDownIcon, 
    HomeModernIcon, BuildingLibraryIcon,
    BellAlertIcon, DocumentChartBarIcon, DocumentDuplicateIcon, RectangleGroupIcon,
    ChatBubbleOvalLeftIcon,
    ClipboardDocumentListIcon,
    PencilSquareIcon,
    ChatBubbleLeftRightIcon,
} from './Icons';
import { useAuthContext } from '../../context/AuthContext';
import type { AdminUserRole } from '../../types';

interface NavItemData {
    name: string;
    icon: React.ReactNode;
    to?: string;
    children?: NavItemData[];
    roles?: AdminUserRole[];
}

const filterNavItemsBySearch = (items: NavItemData[], query: string): NavItemData[] => {
    if (!query.trim()) return items;
    const lowerCaseQuery = query.toLowerCase();

    return items.reduce((acc: NavItemData[], item) => {
        if (item.name.toLowerCase().includes(lowerCaseQuery)) {
            acc.push(item);
            return acc;
        }
        if (item.children) {
            const filteredChildren = filterNavItemsBySearch(item.children, query);
            if (filteredChildren.length > 0) acc.push({ ...item, children: filteredChildren });
        }
        return acc;
    }, []);
};

const Sidebar: React.FC = () => {
    const { currentUser } = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    const navItems = useMemo(() => {
        const serviceManagerRoles: AdminUserRole[] = ['مدير عام', 'مسؤول ادارة الخدمات'];
        const contentManagerRoles: AdminUserRole[] = ['مدير عام', 'مسؤول المحتوى'];
        const communityManagerRoles: AdminUserRole[] = ['مدير عام', 'مسؤول المجتمع'];

        return [
            // 1. Overview
            { name: "نظرة عامة", icon: <HomeIcon className="w-6 h-6" />, to: "/dashboard" },
            
            // 2. Services Group
            { name: "هيكل الخدمات", icon: <RectangleGroupIcon className="w-6 h-6" />, to: "/dashboard/services-overview", roles: serviceManagerRoles },
            { name: "إدارة التقييمات", icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, to: "/dashboard/reviews", roles: serviceManagerRoles },
            { name: "دليل خدمات جهاز المدينة", icon: <DocumentDuplicateIcon className="w-6 h-6 text-sky-400" />, to: "/dashboard/city-services-guide", roles: serviceManagerRoles },
            { name: "إدارة الطوارئ", icon: <ShieldExclamationIcon className="w-6 h-6" />, to: "/dashboard/emergency", roles: serviceManagerRoles },
    
            // 3. Content Group
            { name: "إدارة المحتوى", icon: <PencilSquareIcon className="w-6 h-6" />, to: "/dashboard/content-management", roles: ['مدير عام'] },
            { name: "أخبار المدينة", icon: <NewspaperIcon className="w-6 h-6" />, to: "/dashboard/news", roles: contentManagerRoles },
            { name: "إدارة الإشعارات", icon: <BellAlertIcon className="w-6 h-6" />, to: "/dashboard/notifications", roles: contentManagerRoles },
            { name: "إدارة الإعلانات", icon: <NewspaperIcon className="w-6 h-6 text-orange-400" />, to: "/dashboard/ads", roles: contentManagerRoles },
            
            // 4. Modules Group
            { name: "إدارة العقارات", icon: <HomeModernIcon className="w-6 h-6" />, to: "/dashboard/properties", roles: ['مدير عام', 'مسؤول العقارات'] },
            { name: "إدارة النقل", icon: <TruckIcon className="w-6 h-6" />, to: "/dashboard/transportation", roles: ['مدير عام', 'مسؤول النقل'] },
            { name: "إدارة المجتمع", icon: <ChatBubbleOvalLeftIcon className="w-6 h-6" />, to: "/dashboard/community", roles: communityManagerRoles },
    
            // 5. Users
            { name: "المستخدمون", icon: <UserGroupIcon className="w-6 h-6" />, to: "/dashboard/users", roles: ['مدير عام'] },
    
            // 6. Analytics & System
            { name: "التقارير", icon: <DocumentChartBarIcon className="w-6 h-6" />, to: "/dashboard/reports" },
            { name: "سجل التدقيق", icon: <ClipboardDocumentListIcon className="w-6 h-6" />, to: "/dashboard/audit-log", roles: ['مدير عام'] }
        ];
    }, []);

    useEffect(() => {
        if (isOpen) setIsOpen(false);
    }, [location.pathname]);

    const visibleNavItems = useMemo(() => {
        if (!currentUser) return [];

        const filterByRole = (items: NavItemData[]): NavItemData[] => {
            const userRoles = currentUser.roles;
            if (userRoles.includes('مدير عام')) return items;
            
            return items
                .filter(item => !item.roles || item.roles.some(requiredRole => userRoles.includes(requiredRole)))
                .map(item => ({
                    ...item,
                    children: item.children ? filterByRole(item.children) : undefined
                }))
                .filter(item => item.to || (item.children && item.children.length > 0));
        };

        const roleFilteredItems = filterByRole(navItems);
        return filterNavItemsBySearch(roleFilteredItems, searchQuery);

    }, [navItems, currentUser, searchQuery]);


    const handleMenuToggle = (name: string) => {
        if (searchQuery) return;
        setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const NavItem: React.FC<{ item: NavItemData; level: number }> = ({ item, level }) => {
        const hasChildren = item.children && item.children.length > 0;
        
        const isParentOfActive = useMemo(() => {
            if (!hasChildren) return false;
            const checkChildren = (children: NavItemData[]): boolean => children.some(child => (child.to && location.pathname.startsWith(child.to.split('#')[0])) || (child.children && checkChildren(child.children)));
            return checkChildren(item.children!);
        }, [item, location.pathname]);
        
        const isMenuOpen = (searchQuery.length > 0 && hasChildren) || !!openMenus[item.name] || isParentOfActive;
        const isActive = item.to ? location.pathname === item.to.split('#')[0] : false;
        
        const linkRef = useRef<HTMLAnchorElement>(null);

        useEffect(() => {
            if (isActive && !isOpen) { // Only scroll on desktop
                const timer = setTimeout(() => {
                    linkRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
                return () => clearTimeout(timer);
            }
        }, [isActive, isOpen]);

        const paddingRightClass = level === 1 ? 'pr-8' : level === 2 ? 'pr-10' : 'pr-4';

        if (hasChildren) {
            return (
                <div>
                    <button onClick={() => handleMenuToggle(item.name)} className={`w-full flex items-center justify-between space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-colors duration-200 text-right ${isParentOfActive && !searchQuery ? 'text-gray-800 dark:text-white bg-slate-100 dark:bg-slate-800' : 'text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'}`}>
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </div>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                         <ul className={`mt-1 mr-4 pl-0 pr-2 space-y-1 ${level === 0 ? 'border-r-2 border-slate-200 dark:border-slate-700' : ''}`}>
                            {item.children?.map(child => <li key={child.name}><NavItem item={child} level={level + 1} /></li>)}
                        </ul>
                    </div>
                </div>
            );
        }

        const linkClasses = `flex items-center space-x-3 rtl:space-x-reverse w-full px-3 py-3 rounded-md transition-colors text-sm font-medium ${paddingRightClass} text-right ${isActive ? 'bg-cyan-500 text-white font-semibold shadow' : `text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white`}`;
        
        return <Link ref={linkRef} to={item.to || '#'} className={linkClasses}>{item.icon}<span>{item.name}</span></Link>;
    };
    
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200">
            <div className="flex items-center justify-center h-20 border-b border-slate-200 dark:border-slate-800">
                 <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-wider">Helio</h1>
            </div>
            <div className="p-4">
                <div className="relative"><span className="absolute inset-y-0 right-3 flex items-center pl-3"><MagnifyingGlassIcon className="w-5 h-5 text-gray-400" /></span><input type="text" placeholder="بحث..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-800 text-gray-800 dark:text-white rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/></div>
            </div>
            <nav className="flex-1 px-2 py-2 space-y-1.5 overflow-y-auto">
                 {visibleNavItems.map((item) => <NavItem key={item.name} item={item} level={0} />)}
                 {visibleNavItems.length === 0 && searchQuery && <p className="text-center text-gray-400 p-4">لا توجد نتائج بحث.</p>}
            </nav>
        </div>
    );

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 text-gray-800 dark:text-white rounded-md shadow-lg">
                {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
            <aside className="w-72 hidden lg:block flex-shrink-0"><SidebarContent /></aside>
            <div className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'}`}>
                 <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)}></div>
                 <div className="relative w-72 h-full mr-auto rtl:ml-auto rtl:mr-0"><SidebarContent /></div>
            </div>
        </>
    );
};

export default memo(Sidebar);