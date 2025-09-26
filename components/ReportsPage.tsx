import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentContext } from '../context/ContentContext';
import { useServicesContext } from '../context/ServicesContext';
import { usePropertiesContext } from '../context/PropertiesContext';
import { ArrowLeftIcon, StarIcon, EyeIcon, ChatBubbleOvalLeftIcon, WrenchScrewdriverIcon, ChartPieIcon, ChartBarIcon, HomeModernIcon, NewspaperIcon, MagnifyingGlassIcon, StarIconOutline } from './Icons';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Service, Property, News } from '../types';

const KpiCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 rtl:space-x-reverse">
        <div className="p-3 bg-cyan-100 dark:bg-cyan-900/50 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; icon: React.ReactNode }> = ({ active, onClick, children, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-md transition-colors focus:outline-none text-sm ${
            active
                ? 'bg-cyan-500 text-white shadow'
                : 'bg-slate-200/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
    >
        {icon}
        {children}
    </button>
);

const ServiceReports: React.FC<{ data: Service[] }> = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const kpiData = useMemo(() => {
        if (data.length === 0) return { total: 0, avgRating: 'N/A', totalReviews: 0, topFav: 'N/A' };
        const total = data.length;
        const servicesWithReviews = data.filter(s => s.reviews.length > 0);
        const avgRating = servicesWithReviews.length > 0 ? (servicesWithReviews.reduce((acc, s) => acc + s.rating, 0) / servicesWithReviews.length).toFixed(1) : '0.0';
        const totalReviews = data.reduce((acc, s) => acc + s.reviews.length, 0);
        const topFav = [...data].filter(s => s.isFavorite).sort((a,b) => b.rating - a.rating)[0]?.name