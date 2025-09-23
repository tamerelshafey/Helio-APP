import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ClipboardDocumentListIcon, MagnifyingGlassIcon } from '../components/common/Icons';
import { useAppContext } from '../context/AppContext';

const AuditLogPage: React.FC = () => {
    const navigate = useNavigate();
    const { auditLogs } = useAppContext();

    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('all');

    const actionTypes = useMemo(() => {
        const types = new Set(auditLogs.map(log => log.action));
        return ['all', ...Array.from(types)];
    }, [auditLogs]);

    const filteredLogs = useMemo(() => {
        return auditLogs.filter(log => {
            const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  log.details.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = actionFilter === 'all' || log.action === actionFilter;
            return matchesSearch && matchesFilter;
        });
    }, [auditLogs, searchTerm, actionFilter]);

    const formatTimestamp = (isoString: string) => {
        return new Date(isoString).toLocaleString('ar-EG', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
    };

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>

            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                    <ClipboardDocumentListIcon className="w-8 h-8 text-cyan-500" />
                    سجل تدقيق الأنشطة
                </h1>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="بحث في السجلات..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="w-full sm:w-56 bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        {actionTypes.map(type => (
                             <option key={type} value={type}>{type === 'all' ? 'كل الإجراءات' : type}</option>
                        ))}
                    </select>
                </div>

                {/* Log Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">التوقيت</th>
                                <th scope="col" className="px-6 py-3">المستخدم</th>
                                <th scope="col" className="px-6 py-3">الإجراء</th>
                                <th scope="col" className="px-6 py-3">التفاصيل</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map(log => (
                                <tr key={log.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-mono whitespace-nowrap">{formatTimestamp(log.timestamp)}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{log.user}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300">{log.action}</span>
                                    </td>
                                    <td className="px-6 py-4">{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredLogs.length === 0 && (
                        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                            <h3 className="text-xl font-semibold">لا توجد سجلات تطابق بحثك</h3>
                            <p className="mt-2">حاول تغيير الفلاتر أو قم ببعض التعديلات في لوحة التحكم.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditLogPage;