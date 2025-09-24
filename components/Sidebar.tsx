import React, { useState, memo, useMemo, useEffect, useRef } from 'react';
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
    ClipboardDocumentListIcon
} from './Icons';
// FIX: Import useServicesContext to get categories
import { useServicesContext } from '../context/ServicesContext';
// FIX: Import useAuthContext to get logout function
import { useAuthContext } from '../context/AuthContext';

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
    // FIX: 'categories' comes from ServicesContext.
    const { categories } = useServicesContext();
    const { logout } = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ 'الخدمات الرئيسية': true });

    // NOTE: The rest of the component was not provided. Returning null to make it a valid component.
    return null;
};

export default Sidebar;