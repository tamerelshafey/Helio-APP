import React, { useState, memo, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    HomeIcon, UserGroupIcon, Cog6ToothIcon, MagnifyingGlassIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, 
    WrenchScrewdriverIcon, TruckIcon, ShieldExclamationIcon, NewspaperIcon, ChevronDownIcon, HeartIcon, ShoppingBagIcon, 
    BuildingStorefrontIcon, AcademicCapIcon, DevicePhoneMobileIcon, BoltIcon, SparklesIcon, CarIcon, Squares2X2Icon, 
    PaintBrushIcon, HomeModernIcon, BuildingLibraryIcon, InformationCircleIcon,
    CakeIcon, FireIcon,
    BookOpenIcon, BellAlertIcon, DocumentChartBarIcon, DocumentDuplicateIcon, RectangleGroupIcon,
    BeakerIcon,
    GiftIcon,
    FilmIcon,
    TrashIcon,
    BanknotesIcon,
    EnvelopeIcon,
    BuildingOffice2Icon,
    ChatBubbleOvalLeftIcon,
    QuestionMarkCircleIcon
} from './Icons';
import { useAppContext } from '../../context/AppContext';

const iconComponents: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    BuildingLibraryIcon, InformationCircleIcon, DocumentDuplicateIcon, TruckIcon,
    HeartIcon, BuildingStorefrontIcon, HomeModernIcon, UserGroupIcon, BeakerIcon, CakeIcon, FireIcon, ShoppingBagIcon,
    AcademicCapIcon, BookOpenIcon, GiftIcon, FilmIcon, SparklesIcon, BoltIcon, TrashIcon, WrenchScrewdriverIcon,
    BanknotesIcon, EnvelopeIcon,
    DevicePhoneMobileIcon, CarIcon, Squares2X2Icon, PaintBrushIcon
};

const getIcon = (name: string, props: React.SVGProps<SVGSVGElement>) => {
    const IconComponent = iconComponents[name];
    return IconComponent ? <IconComponent {...props} /> : <Squares2X2Icon {...props} />;
};


interface NavItemData {
    name: string;
    icon: React.ReactNode;
    to?: string;
    children?: NavItemData[];
}

const filterNavItems = (items: NavItemData[], query: string): NavItemData[] => {
    if (!query.trim()) return items;
    const lowerCaseQuery = query.toLowerCase();

    return items.reduce((acc: NavItemData[], item) => {
        if (item.name.toLowerCase().includes(lowerCaseQuery)) {
            acc.push(item);
            return acc;
        }
        if (item.children) {
            const filteredChildren = filterNavItems(item.children, query);
            if (filteredChildren.length > 0) acc.push({ ...item, children: filteredChildren });
        }
        return acc;
    }, []);
};

const Sidebar: React.FC = () => {
    const { categories } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ 'الخدمات الرئيسية': true });
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    const navItems = useMemo(() => {
        const serviceCategories = categories.filter(c => c.name !== "المدينة والجهاز");

        const serviceNavItems: NavItemData[] = serviceCategories.map(category => ({
            name: category.name,
            icon: getIcon(category.icon, { className: "w-5 h-5" }),
            children: category.subCategories.map(sub => ({
                name: sub.name,
                icon: <div className="w-5 h-5" />,
                to: `/services/subcategory/${sub.id}`,
            }))
        }));

        const constructedNavItems: NavItemData[] = [
            { name: "نظرة عامة", icon: <HomeIcon className="w-6 h-6" />, to: "/" },
            { name: "هيكل الخدمات", icon: <RectangleGroupIcon className="w-6 h-6" />, to: "/services-overview" },
            { 
                name: "دليل خدمات جهاز المدينة", 
                icon: <DocumentDuplicateIcon className="w-6 h-6 text-sky-400" />, 
                to: "/city-services-guide" 
            },
        ];
        
        if (serviceNavItems.length > 0) {
            constructedNavItems.push({
                name: "الخدمات الرئيسية",
                icon: <WrenchScrewdriverIcon className="w-6 h-6" />,
                children: serviceNavItems
            });
        }

        constructedNavItems.push(
            { name: "إدارة العقارات", icon: <HomeModernIcon className="w-6 h-6" />, to: "/properties" },
            { name: "إدارة النقل", icon: <TruckIcon className="w-6 h-6" />, to: "/transportation" },
            { name: "إدارة الطوارئ", icon: <ShieldExclamationIcon className="w-6 h-6" />, to: "/emergency" },
            { name: "أخبار المدينة", icon: <NewspaperIcon className="w-6 h-6" />, to: "/news" },
            { name: "إدارة الإشعارات", icon: <BellAlertIcon className="w-6 h-6" />, to: "/notifications" },
            { name: "المستخدمون", icon: <UserGroupIcon className="w-6 h-6" />, to: "/users" },
            { name: "إدارة التقييمات", icon: <ChatBubbleOvalLeftIcon className="w-6 h-6" />, to: "/reviews" },
            { name: "التقارير", icon: <DocumentChartBarIcon className="w-6 h-6" />, to: "/reports" },
            { name: "حول", icon: <InformationCircleIcon className="w-6 h-6" />, to: "/about" },
            { name: "الأسئلة الشائعة", icon: <QuestionMarkCircleIcon className="w-6 h-6" />, to: "/faq" },
            { name: "شروط الاستخدام", icon: <DocumentDuplicateIcon className="w-6 h-6" />, to: "/terms-of-use" },
            { name: "سياسة الخصوصية", icon: <BookOpenIcon className="w-6 h-6" />, to: "/privacy-policy" },
            { name: "الإعدادات", icon: <Cog6ToothIcon className="w-6 h-6" />, to: "/settings" }
        );
        return constructedNavItems;
    }, [categories]);

    useEffect(() => {
        if (isOpen) setIsOpen(false);
    }, [location.pathname]);

    const filteredNavItems = useMemo(() => filterNavItems(navItems, searchQuery), [navItems, searchQuery]);

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
        
        const paddingRightClass = level === 1 ? 'pr-6' : level === 2 ? 'pr-10' : 'pr-4';

        if (hasChildren) {
            return (
                <div>
                    <button onClick={() => handleMenuToggle(item.name)} className={`w-full flex items-center justify-between space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-colors duration-200 text-right ${isParentOfActive && !searchQuery ? 'text-white bg-slate-800' : 'hover:bg-slate-800 hover:text-white'}`}>
                        <div className={`flex items-center space-x-3 rtl:space-x-reverse ${level > 0 ? 'text-gray-300' : 'text-white'}`}>
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </div>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isMenuOpen ? 'rotate-0' : '-rotate-90'}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                         <ul className={`mt-1 mr-4 pl-0 pr-2 space-y-1 ${level === 0 ? 'border-r-2 border-slate-700' : ''}`}>
                            {item.children?.map(child => <li key={child.name}><NavItem item={child} level={level + 1} /></li>)}
                        </ul>
                    </div>
                </div>
            );
        }

        const linkClasses = `flex items-center space-x-3 rtl:space-x-reverse w-full px-3 py-2 rounded-md transition-colors text-sm font-medium ${paddingRightClass} text-right ${isActive ? 'bg-cyan-500 text-white font-semibold shadow' : `hover:bg-slate-800 hover:text-white ${level > 0 ? 'text-gray-300' : 'text-white'}`}`;
        
        return <Link to={item.to || '#'} className={linkClasses}>{item.icon}<span>{item.name}</span></Link>;
    };
    
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-900 text-gray-200">
            <div className="flex items-center justify-center h-20 border-b border-slate-800">
                 <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-wider">Helio</h1>
            </div>
            <div className="p-4">
                <div className="relative"><span className="absolute inset-y-0 right-3 flex items-center pl-3"><MagnifyingGlassIcon className="w-5 h-5 text-gray-400" /></span><input type="text" placeholder="بحث..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-800 text-white rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/></div>
            </div>
            <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
                 {filteredNavItems.map((item) => <NavItem key={item.name} item={item} level={0} />)}
                 {filteredNavItems.length === 0 && searchQuery && <p className="text-center text-gray-400 p-4">لا توجد نتائج بحث.</p>}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <img className="w-12 h-12 rounded-full object-cover" src="https://picsum.photos/100" alt="Admin" loading="lazy" />
                    <div><p className="font-semibold text-white">مدير النظام</p><p className="text-sm text-gray-400">admin@helio.com</p></div>
                    <button className="mr-auto rtl:ml-auto p-2 rounded-full hover:bg-slate-800 transition"><ArrowLeftOnRectangleIcon className="w-6 h-6" /></button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-md">
                {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
            <aside className="w-72 hidden lg:block flex-shrink-0"><SidebarContent /></aside>
            <div className={`fixed inset-0 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
                 <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)}></div>
                 <div className="relative w-72 h-full mr-auto rtl:ml-auto"><SidebarContent /></div>
            </div>
        </>
    );
};

export default memo(Sidebar);