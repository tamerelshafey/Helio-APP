import React, { useState, useEffect, useCallback } from 'react';
import { TrashIcon, CloudArrowUpIcon, DocumentDuplicateIcon } from './Icons';

interface AttachmentUploaderProps {
    initialUrl?: string;
    initialType?: 'image' | 'pdf';
    onAttachmentChange: (url: string | null, type: 'image' | 'pdf' | null) => void;
    label?: string;
}

const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({
    initialUrl = '',
    initialType,
    onAttachmentChange,
    label = 'المرفق (صورة أو PDF)'
}) => {
    const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
    const [attachmentType, setAttachmentType] = useState<'image' | 'pdf' | null>(null);

    useEffect(() => {
        setAttachmentUrl(initialUrl || null);
        setAttachmentType(initialType || null);
    }, [initialUrl, initialType]);
    
    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        const type = file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : null;
        
        if (!type) {
            alert('يرجى اختيار ملف صورة أو PDF فقط.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setAttachmentUrl(result);
            setAttachmentType(type);
            onAttachmentChange(result, type);
        };
        reader.readAsDataURL(file);
        
        event.target.value = '';
    }, [onAttachmentChange]);

    const removeAttachment = useCallback(() => {
        setAttachmentUrl(null);
        setAttachmentType(null);
        onAttachmentChange(null, null);
    }, [onAttachmentChange]);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="mt-2 flex items-center gap-4">
                {attachmentUrl ? (
                    <div className="relative group">
                        {attachmentType === 'image' && (
                            <img src={attachmentUrl} alt="Preview" className="h-24 w-24 object-cover rounded-lg shadow-md" />
                        )}
                        {attachmentType === 'pdf' && (
                            <div className="h-24 w-24 flex flex-col items-center justify-center bg-slate-100 rounded-lg p-2 text-center">
                                <DocumentDuplicateIcon className="w-10 h-10 text-red-500" />
                                <span className="text-xs mt-2 truncate">ملف PDF</span>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={removeAttachment}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <label className="relative flex flex-col justify-center items-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors">
                        <div className="text-center p-2">
                            <CloudArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                        </div>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/gif, image/webp, application/pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </label>
                )}
            </div>
        </div>
    );
};

export default AttachmentUploader;