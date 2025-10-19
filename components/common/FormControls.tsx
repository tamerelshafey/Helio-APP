import React from 'react';

export const InputField: React.FC<{ 
    label: string; 
    name: string;
    value: string | number; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    type?: string; 
    required?: boolean; 
    placeholder?: string;
}> = ({ label, name, value, onChange, type = 'text', required = false, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input 
            id={name}
            name={name}
            type={type} 
            value={value} 
            onChange={onChange} 
            required={required} 
            placeholder={placeholder}
            className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none" 
        />
    </div>
);

export const TextareaField: React.FC<{ 
    label: string;
    name: string;
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
    required?: boolean; 
    rows?: number; 
}> = ({ label, name, value, onChange, required = false, rows = 3 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <textarea 
            id={name}
            name={name}
            value={value} 
            onChange={onChange} 
            required={required} 
            rows={rows}
            className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        ></textarea>
    </div>
);
