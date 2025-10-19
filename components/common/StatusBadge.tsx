import React from 'react';
import type { UserStatus, MarketplaceItemStatus, LostFoundStatus, ModerationStatus, UserAccountType } from '../../types';

type StatusType = UserStatus | MarketplaceItemStatus | LostFoundStatus | ModerationStatus | 'active' | 'scheduled' | 'expired';

interface StatusBadgeProps {
    status: StatusType;
}

const statusMap: Record<StatusType, { text: string; classes: string }> = {
    // UserStatus & general 'active'
    active: { text: 'مفعل', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    // MarketplaceItemStatus & ModerationStatus
    pending: { text: 'بانتظار المراجعة', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    // UserStatus
    banned: { text: 'محظور', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    // MarketplaceItemStatus & ModerationStatus
    approved: { text: 'موافق عليه', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    rejected: { text: 'مرفوض', classes: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
    // MarketplaceItemStatus
    expired: { text: 'منتهي الصلاحية', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    // LostFoundStatus
    lost: { text: 'مفقود', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    found: { text: 'تم العثور عليه', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    returned: { text: 'تم التسليم', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    // Notification/Ad Status (custom)
    scheduled: { text: 'مجدول', classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
};

/**
 * A badge for displaying status based on start and end dates.
 */
export const ContentStatusBadge: React.FC<{ startDate: string, endDate: string }> = ({ startDate, endDate }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const end = new Date(endDate);

    let status: 'scheduled' | 'active' | 'expired';
    if (today < start) {
        status = 'scheduled';
    } else if (today >= start && today <= end) {
        status = 'active';
    } else {
        status = 'expired';
    }
    const { text, classes } = statusMap[status];
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes}`}>{text}</span>;
};

/**
 * A badge for displaying user account type.
 */
export const AccountTypeBadge: React.FC<{ type: UserAccountType }> = ({ type }) => {
    const typeMap: Record<UserAccountType, { text: string; classes: string }> = {
        user: { text: 'مستخدم', classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
        service_provider: { text: 'مقدم خدمة', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    };
    const { text, classes } = typeMap[type];
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes}`}>{text}</span>;
}


/**
 * A generic badge for displaying various status types from a predefined map.
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const statusInfo = statusMap[status];
    if (!statusInfo) {
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{status}</span>;
    }
    const { text, classes } = statusInfo;
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes}`}>{text}</span>;
};

export default React.memo(StatusBadge);