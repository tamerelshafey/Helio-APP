import React, { useState, useRef, useEffect } from 'react';

// Simplified Icons for the editor toolbar
const BoldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M15.25 12c0 .69-.56 1.25-1.25 1.25h-3.5a.75.75 0 010-1.5h.75a.75.75 0 000-1.5h-1.5a.75.75 0 010-1.5h2.5c.69 0 1.25.56 1.25 1.25v2.5zM12 2a10 10 0 100 20 10 10 0 000-20zM6.5 7.5c0-1.38 1.12-2.5 2.5-2.5h2.25c1.657 0 3 1.343 3 3v.75a.75.75 0 01-1.5 0V8c0-.828-.672-1.5-1.5-1.5H9c-.828 0-1.5.672-1.5 1.5v7c0 .828.672 1.5 1.5 1.5h3.25c1.657 0 3-1.343 3-3v-.75a.75.75 0 011.5 0V16c0 2.485-2.015 4.5-4.5 4.5H9c-2.485 0-4.5-2.015-4.5-4.5v-7z" /></svg>;
const ItalicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM9.99 17.25a.75.75 0 01-1.48-.25l1.5-9a.75.75 0 011.48.25l-1.5 9zm6 0a.75.75 0 01-1.48-.25l1.5-9a.75.75 0 011.48.25l-1.5 9z" /></svg>;
const ListBulletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2.25 4.5A.75.75 0 013 3.75h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 4.5A.75.75 0 013 8.25h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 4.5A.75.75 0 013 12.75h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 013-.75h14.25a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    // Sync external value changes to the editor
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCmd = (command: string) => {
        document.execCommand(command, false);
        editorRef.current?.focus();
        handleInput(); // Manually trigger update after command
    };

    const ToolbarButton: React.FC<{ command: string; children: React.ReactNode }> = ({ command, children }) => (
        <button
            type="button"
            onClick={() => execCmd(command)}
            onMouseDown={e => e.preventDefault()} // Prevent editor from losing focus
            className="p-2 rounded text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-600"
        >
            {children}
        </button>
    );

    return (
        <div className="border border-slate-300 dark:border-slate-600 rounded-lg">
            <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-t-lg">
                <ToolbarButton command="bold"><BoldIcon /></ToolbarButton>
                <ToolbarButton command="italic"><ItalicIcon /></ToolbarButton>
                <ToolbarButton command="insertUnorderedList"><ListBulletIcon /></ToolbarButton>
            </div>
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="w-full min-h-[150px] p-3 focus:outline-none text-right bg-slate-100 dark:bg-slate-700 rounded-b-lg prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: value }}
            />
        </div>
    );
};

export default RichTextEditor;
