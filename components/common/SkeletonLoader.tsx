import React from 'react';

const SkeletonLine: React.FC<{ width?: string; height?: string; className?: string }> = ({ width = 'w-full', height = 'h-4', className = '' }) => (
    <div className={`${width} ${height} bg-slate-200 dark:bg-slate-700 rounded animate-pulse ${className}`}></div>
);

export const NewsCardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
        <div className="p-6">
            <SkeletonLine height="h-3" width="w-1/2" className="mb-2" />
            <SkeletonLine height="h-6" width="w-full" className="mb-3" />
            <SkeletonLine height="h-3" width="w-full" className="mb-1" />
            <SkeletonLine height="h-3" width="w-full" className="mb-1" />
            <SkeletonLine height="h-3" width="w-3/4" className="mb-4" />
            <SkeletonLine height="h-4" width="w-1/3" />
        </div>
    </div>
);

export const ReportPageSkeleton: React.FC = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                 <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <SkeletonLine height="h-4" width="w-1/3" />
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                    </div>
                    <SkeletonLine height="h-8" width="w-1/2" className="mt-4" />
                </div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-80"><SkeletonLine /></div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-80"><SkeletonLine /></div>
        </div>
         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-96"><SkeletonLine /></div>
    </div>
);


export const PropertyCardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
        <div className="p-4">
            <SkeletonLine height="h-5" width="w-3/4" className="mb-2" />
            <SkeletonLine height="h-3" width="w-1/2" className="mb-3" />
            <SkeletonLine height="h-8" width="w-2/3" className="mb-4" />
            <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-3">
                <SkeletonLine height="h-4" width="w-1/4" />
                <SkeletonLine height="h-4" width="w-1/3" />
            </div>
        </div>
    </div>
);


export const UserTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="p-4"><div className="w-4 h-4 bg-slate-200 dark:bg-slate-600 rounded"></div></th>
                        <th scope="col" className="px-6 py-3">المستخدم</th>
                        <th scope="col" className="px-6 py-3">الحالة</th>
                        <th scope="col" className="px-6 py-3">تاريخ الانضمام</th>
                        <th scope="col" className="px-6 py-3">إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                            <td className="w-4 p-4"><div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                    <div>
                                        <SkeletonLine height="h-3" width="w-24 mb-1.5" />
                                        <SkeletonLine height="h-2" width="w-32" />
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4"><SkeletonLine height="h-6" width="w-20" /></td>
                            <td className="px-6 py-4"><SkeletonLine height="h-4" width="w-24" /></td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                    <div className="w-8 h-8 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                    <div className="w-8 h-8 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const ServiceProviderTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">مقدم الخدمة</th>
                        <th scope="col" className="px-6 py-3">الخدمات المرتبطة</th>
                        <th scope="col" className="px-6 py-3">إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                    <div>
                                        <SkeletonLine height="h-3" width="w-24 mb-1.5" />
                                        <SkeletonLine height="h-2" width="w-32" />
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4"><SkeletonLine height="h-4" width="w-20" /></td>
                            <td className="px-6 py-4">
                                <div className="w-8 h-8 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const AdminTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">المدير</th>
                        <th scope="col" className="px-6 py-3">الدور</th>
                        <th scope="col" className="px-6 py-3">إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                    <div>
                                        <SkeletonLine height="h-3" width="w-24 mb-1.5" />
                                        <SkeletonLine height="h-2" width="w-32" />
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                    <SkeletonLine height="h-5" width="w-20" />
                                    <SkeletonLine height="h-5" width="w-24" />
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                    <div className="w-8 h-8 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};