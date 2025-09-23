import React from 'react';
import { UserCircleIcon, CheckCircleIcon } from './Icons';

const mockUsers = [
    { name: 'عبدالرحمن الفيفي', avatar: 'https://picsum.photos/105' },
    { name: 'ريم العبدالله', avatar: 'https://picsum.photos/106' },
    { name: 'سلطان القحطاني', avatar: 'https://picsum.photos/107' },
];

const UsersToVerify: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center">
                <UserCircleIcon className="w-6 h-6 mr-2" />
                مستخدمون بحاجة للمتابعة
            </h3>
            <ul className="space-y-3">
                {mockUsers.map(user => (
                    <li key={user.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="flex items-center">
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover mr-3 rtl:ml-3" loading="lazy" />
                            <span className="font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                        </div>
                        <button className="p-2 rounded-full text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50">
                            <CheckCircleIcon className="w-5 h-5" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsersToVerify;