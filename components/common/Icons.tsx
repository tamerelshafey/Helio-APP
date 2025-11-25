import React from 'react';

// A base component for all icons to reduce boilerplate
const IconBase: React.FC<React.SVGProps<SVGSVGElement> & { fill?: string }> = ({ children, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={props.fill || "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {children}
    </svg>
);

export const AcademicCapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM17.25 15a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    </IconBase>
);
export const ArchiveBoxIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></IconBase>
);
export const ArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></IconBase>
);
export const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></IconBase>
);
export const ArrowRightOnRectangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></IconBase>
);
export const ArrowTrendingDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.511l-5.511-3.182" /></IconBase>
);
export const ArrowTrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.517l2.71-1.21-.776 2.898m0 0l-3.182-5.511m3.182 5.511l-5.511 3.182" /></IconBase>
);
export const ArrowUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></IconBase>
);
export const ArrowUturnLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></IconBase>
);
export const BanknotesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75V15m0 0V12.75m0 2.25A1.5 1.5 0 0110.5 15h.008a1.5 1.5 0 011.5-1.5h.008a1.5 1.5 0 011.5 1.5h-.008a1.5 1.5 0 01-1.5 1.5h-.008z" /></IconBase>
);
export const Bars3Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></IconBase>
);
export const BeakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.038-.502.062-.752.062h-1.5c-.25 0-.501-.024-.752-.062M9.75 3.104a2.25 2.25 0 012.25 2.25v5.714a2.25 2.25 0 00.659 1.591L19 14.5M12 14.5a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25M12 14.5c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125M12 14.5a2.25 2.25 0 00-2.25 2.25h-1.5a2.25 2.25 0 00-2.25-2.25M12 14.5c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125.504 1.125 1.125" /></IconBase>
);
export const BellAlertIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 6.032 23.849 23.849 0 005.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></IconBase>
);
export const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 6.032 23.849 23.849 0 005.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></IconBase>
);
export const BoltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></IconBase>
);
export const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></IconBase>
);
export const BriefcaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.098a2.25 2.25 0 01-2.25 2.25h-13.5a2.25 2.25 0 01-2.25-2.25v-4.098m18-8.217a2.25 2.25 0 00-2.25-2.25h-13.5a2.25 2.25 0 00-2.25 2.25v10.5M12 18.375a.375.375 0 11.75 0 .375.375 0 01-.75 0z" /></IconBase>
);
export const BuildingLibraryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></IconBase>
);
export const BuildingOffice2Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364L3 9m0 0h18" /></IconBase>
);
export const BusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19.5h6l-3-3-3 3zM10.75 21a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zm5.25 0a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 16.5V9.75m-3 6.75V9.75M3.75 12h16.5m-16.5-5.25h16.5M3.75 12a2.25 2.25 0 00-2.25 2.25v2.25a2.25 2.25 0 002.25 2.25h16.5a2.25 2.25 0 002.25-2.25v-2.25a2.25 2.25 0 00-2.25-2.25H3.75z" />
    </IconBase>
);
export const CakeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 15v-7.5M12 15a2.25 2.25 0 01-2.25-2.25m2.25 2.25a2.25 2.25 0 002.25-2.25M12 15a2.25 2.25 0 012.25-2.25M12 15a2.25 2.25 0 00-2.25-2.25m7.5-1.5V5.625c0-1.036-.84-1.875-1.875-1.875h-10.5c-1.036 0-1.875.84-1.875 1.875v3.375c0 1.036.84 1.875 1.875 1.875h10.5c1.036 0 1.875-.84 1.875-1.875z" /></IconBase>
);
export const CalendarDaysIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></IconBase>
);
export const CarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 013.375-3.375h9.75a3.375 3.375 0 013.375 3.375v1.875M10.5 6h3m-3.75 3h6.75" /></IconBase>
);
export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></IconBase>
);
export const ChartPieIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></IconBase>
);
export const ChatBubbleBottomCenterTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconBase>
);
export const ChatBubbleLeftRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.537V17.57a.5.5 0 00-.5.5V21l-3.192-3.192a.5.5 0 00-.354-.146H5.25a2.25 2.25 0 01-2.25-2.25v-4.286c0-1.136.847-2.1 1.98-2.193l3.722-.537V5.43a.5.5 0 00.5-.5V3l3.192 3.192a.5.5 0 00.354.146h6.258z" /></IconBase>
);
export const ChatBubbleOvalLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 12.75l-2.625 2.625M11.25 12.75l2.625 2.625M11.25 12.75v3M11.25 12.75A2.25 2.25 0 0113.5 15v1.5a2.25 2.25 0 01-2.25 2.25H7.5A2.25 2.25 0 015.25 16.5v-1.5a2.25 2.25 0 012.25-2.25H9M11.25 12.75A2.25 2.25 0 0013.5 10.5V9a2.25 2.25 0 00-2.25-2.25H7.5A2.25 2.25 0 005.25 9v1.5a2.25 2.25 0 002.25 2.25H9" /></IconBase>
);
export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconBase>
);
export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></IconBase>
);
export const ChevronLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></IconBase>
);
export const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></IconBase>
);
export const ChevronUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></IconBase>
);
export const ClipboardDocumentCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25c-.375 0-.75.025-1.125.075M10.5 7.5 12 9m0 0l1.5-1.5M12 9V3" /></IconBase>
);
export const ClipboardDocumentListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75c0-.231-.035-.454-.1-.664M6.75 7.5h1.5v-1.5h-1.5v1.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /></IconBase>
);
export const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></IconBase>
);
export const CloudArrowUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></IconBase>
);
export const Cog6ToothIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.962a8.97 8.97 0 015.71 5.71c.046.55-.412 1.02-1.023.962l-4.224-.442c-.517-.054-1.033-.36-1.358-.814l-1.51-2.012c-.326-.454-.326-1.037 0-1.49l1.51-2.012c.325-.453.841-.76 1.358-.814l4.224-.442zM12.933 13.067c.517.054 1.033.36 1.358.814l1.51 2.012c.326.454.326 1.037 0 1.49l-1.51 2.012c-.325.453-.841.76-1.358.814l-4.224.442c-.517.054-1.033-.36-1.358-.814l-1.51-2.012c-.326-.454-.326-1.037 0-1.49l1.51-2.012c.325-.453.841-.76 1.358-.814l4.224.442a.75.75 0 01.962 1.023l-.442 4.224c-.054.517.36.934.814 1.158l2.012 1.51c.454.326 1.037.326 1.49 0l2.012-1.51c.453-.325.76-.841.814-1.358l.442-4.224c.06-.517-.36-.934-.814-1.158l-2.012-1.51c-.454-.326-1.037-.326-1.49 0l-2.012 1.51c-.453.325-.76.841-.814 1.358l-.442 4.224z" /></IconBase>
);
export const CubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></IconBase>
);
export const DevicePhoneMobileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75A2.25 2.25 0 0015.75 1.5h-2.25m-3 0V3m3 0V3m0 18v-1.5m-3 0v-1.5m-6-9h12" /></IconBase>
);
export const DocumentChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></IconBase>
);
export const DocumentDuplicateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m9.375 2.25c.621 0 1.125.504 1.125 1.125v3.5m0 0a3.001 3.001 0 00-3-3m-3 0a3.001 3.001 0 00-3 3m0 0h6" /></IconBase>
);
export const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></IconBase>
);
export const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.43-4.44a1.012 1.012 0 011.416 0l4.44 4.43a1.012 1.012 0 010 .639l-4.44 4.43a1.012 1.012 0 01-1.416 0l-4.43-4.44z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></IconBase>
);
export const FilmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75v3.75m-3.75 0V15m1.5-3.75H18a2.25 2.25 0 012.25 2.25v3.75A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18v-3.75C3.75 13.048 4.798 12 6 12h12m-3-8.25v2.25m-3-2.25v2.25m-3-2.25v2.25m-3-2.25V6" /></IconBase>
);
export const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797z" /></IconBase>
);
export const GiftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.375H18a2.25 2.25 0 012.25 2.25v9.75a2.25 2.25 0 01-2.25 2.25h-4.5m-6 0a2.25 2.25 0 01-2.25-2.25v-9.75a2.25 2.25 0 012.25-2.25h4.5m-6 0h6m-6 0v6m6 0v-6m6 0v6m-6-6v6" /></IconBase>
);
export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></IconBase>
);
export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></IconBase>
);
export const HomeModernIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364L3 9m0 0h18" /></IconBase>
);
export const InformationCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconBase>
);
export const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a9 9 0 11-18 0 9 9 0 0118 0z" /></IconBase>
);
export const MagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></IconBase>
);
export const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></IconBase>
);
export const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></IconBase>
);
export const NewspaperIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-10.5c-.621 0-1.125-.504-1.125-1.125v-11.25c0-.621.504-1.125 1.125-1.125H12z" /></IconBase>
);
export const PaintBrushIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4-2.242 3 3 0 00-5.784 1.123 2.25 2.25 0 01-2.4-2.241 3 3 0 00-5.784 1.123c0 3.232 4.09 3.232 5.784 0a3 3 0 005.784-1.123 2.25 2.25 0 012.4-2.242 3 3 0 005.78-1.128 2.25 2.25 0 012.4-2.241z" /></IconBase>
);
export const PencilSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></IconBase>
);
export const PhoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></IconBase>
);
export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></IconBase>
);
export const QuestionMarkCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></IconBase>
);
export const RectangleGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6A1.125 1.125 0 012.25 10.875v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" /></IconBase>
);
export const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0 0c.18.324.283.696.283 1.093s-.103.77-.283 1.093m-9.566-7.5a2.25 2.25 0 10-3.935-2.186 2.25 2.25 0 003.935 2.186z" /></IconBase>
);
export const ShieldExclamationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></IconBase>
);
export const ShoppingBagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></IconBase>
);
export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.5 13.5L18 15l-1.5 1.5" /></IconBase>
);
export const Squares2X2Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></IconBase>
);
export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props} fill="currentColor" stroke="currentColor">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.757 2.927c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </IconBase>
);
export const StarIconOutline: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.418a.562.562 0 01.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 21.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988h5.418a.563.563 0 00.475-.31L11.48 3.5z" /></IconBase>
);
export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></IconBase>
);
export const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.975 2.673.314a2.25 2.25 0 00.962-4.134l-9.581-9.581a1.5 1.5 0 01-.424-1.06z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3h-4.318a2.25 2.25 0 00-2.25 2.25v4.318" /></IconBase>
);
export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></IconBase>
);
export const TruckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 013.375-3.375h9.75a3.375 3.375 0 013.375 3.375v1.875M10.5 6h3m-3.75 3h6.75" /></IconBase>
);
export const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></IconBase>
);
export const UserGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.023 1.5-1.848 2.6-2.434.908-.482 2.01-1.018 3.12-1.631M13.5 18.75h-3c-1.657 0-3-1.343-3-3V11.25a3 3 0 013-3h3a3 3 0 013 3v4.5c0 1.657-1.343 3-3 3z" /></IconBase>
);
export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></IconBase>
);
export const UserPlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></IconBase>
);
export const WrenchScrewdriverIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877-1.745 1.745-1.17 1.17-1.17-1.17z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 12.75L3 21m0 0l6.75-6.75M3 21h6.75m1.5-15l3.75 3.75-6 6-3.75-3.75 6-6z" /></IconBase>
);
export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconBase>
);
export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></IconBase>
);
export const GooglePlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M4.33 2.05C3.65 2.45 3 3.2 3 4v16c0 .8.64 1.55 1.33 1.95l10.96-10.95L4.33 2.05zM16.67 12L5.7 22.95c.57.24 1.25.26 1.86 0l13.12-7.56c1.1-0.63 1.1-2.28 0-2.91L7.56 5.05c-.61-.34-1.29-.26-1.86 0L16.67 12z"/>
    </svg>
);
export const AppleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M17.91,14.36c0,2.1-1.3,3.61-3.26,3.61c-1.89,0-2.9-1.4-4.22-1.4c-1.36,0-2.54,1.4-4.14,1.4c-1.92,0-3.37-1.58-3.37-3.68 C2.92,12.45,4,9.6,6.25,8.19c1.2-0.76,2.58-1.2,4.02-1.2c1.33,0,2.44,0.42,3.48,1.21c-1.23,0.76-2.03,2.05-2.03,3.58 c0,0.3,0.04,0.59,0.1,0.85c0.36-0.17,0.75-0.29,1.16-0.29c1.3,0,2.51,0.61,3.23,1.52C17.9,13.91,17.91,14.12,17.91,14.36z M14.3,5.61c0.91-1.12,1.55-2.68,1.38-4.29c-1.51,0.06-3.03,0.92-3.95,2.04c-0.85,1.03-1.63,2.65-1.42,4.19 C11.83,7.61,13.3,6.82,14.3,5.61z"/>
    </svg>
);
export const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 6.5h-2v2h2v7h3v-7h2l.5-2h-2.5v-1c0-.5.5-1 1-1h1.5v-3h-2.5c-2 0-3 1.5-3 3v1z"/>
    </svg>
);
export const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2c-2.717 0-3.056.01-4.122.06-1.065.05-1.79.22-2.428.46-1.29.51-2.29 1.51-2.8 2.8-.24.63-.41 1.36-.46 2.42C2.01 8.94 2 9.28 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.46 2.42.51 1.29 1.51 2.29 2.8 2.8.63.24 1.36.41 2.42.46 1.06.05 1.4.06 4.12.06s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.42-.46 1.29-.51 2.29-1.51 2.8-2.8.24-.63.41-1.36.46-2.42.05-1.06.06-1.4.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.46-2.42-.51-1.29-1.51-2.29-2.8-2.8-.63-.24-1.36-.41-2.42-.46C15.06 2.01 14.72 2 12 2zm0 1.62c2.65 0 2.95.01 4 .06 1.02.05 1.58.21 1.95.36.78.3 1.35.87 1.65 1.65.15.37.31.93.36 1.95.05 1.05.06 1.35.06 4s-.01 2.95-.06 4c-.05 1.02-.21 1.58-.36 1.95-.3.78-.87 1.35-1.65 1.65-.37.15-.93.31-1.95.36-1.05.05-1.35.06-4 .06s-2.95-.01-4-.06c-1.02-.05-1.58-.21-1.95-.36-.78-.3-1.35-.87-1.65-1.65-.15-.37-.31-.93-.36-1.95-.05-1.05-.06-1.35-.06-4s.01-2.95.06-4c.05-1.02.21-1.58.36-1.95.3-.78.87-1.35 1.65-1.65.37-.15.93.31 1.95-.36 1.05-.05 1.35-.06 4-.06zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8.38c-1.87 0-3.38-1.51-3.38-3.38S10.13 8.62 12 8.62s3.38 1.51 3.38 3.38-1.51 3.38-3.38 3.38zm6.06-9.19c0-.62-.51-1.12-1.12-1.12s-1.12.51-1.12 1.12.51 1.12 1.12 1.12 1.12-.51 1.12-1.12z" />
    </svg>
);
export const WhatsappIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.77.46 3.45 1.28 4.93L2 22l5.25-1.38c1.44.75 3.08 1.16 4.79 1.16 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.33 12.33c-.19.54-.95 1.03-1.3 1.09-.35.06-.74.06-1.12-.06-1.22-.38-2.61-1.2-3.87-2.61-1.04-1.18-1.58-2.18-1.86-2.94-.09-.25-.09-.53-.03-.8.29-1.25 1.25-1.54 1.25-1.54s.19-.03.38-.03c.19 0 .38.03.5.06.12.03.25.06.38.38.25.62.87 2.12.93 2.25.06.12.06.25 0 .38-.22.34-1.18 1.21-1.18 1.21s-.16.19-.03.38c.13.19.62.93 1.44 1.75.99.99 1.83 1.27 2.08 1.34.25.06.38 0 .5-.13.13-.13 1.18-1.12 1.18-1.12s.19-.13.38-.06c.19.06 1.37.65 1.62.78.25.13.44.19.5.25.06.06.06.38-.13.93z"/>
    </svg>
);