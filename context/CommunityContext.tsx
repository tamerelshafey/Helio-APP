import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { mockCommunityPosts } from '../data/mock-data';
import type { CommunityContextType, CommunityPost } from '../types';

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logActivity } = useAppContext();
    const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(mockCommunityPosts);

    const handleDeletePost = useCallback((postId: number) => {
        const postContent = communityPosts.find(p => p.id === postId)?.content.substring(0, 30) || `ID: ${postId}`;
        setCommunityPosts(prev => prev.filter(p => p.id !== postId));
        logActivity('حذف منشور مجتمعي', `حذف المنشور: "${postContent}..."`);
    }, [communityPosts, logActivity]);

    const handleTogglePostPin = useCallback((postId: number) => {
        let isPinnedNow = false;
        const postContent = communityPosts.find(p => p.id === postId)?.content.substring(0, 30) || `ID: ${postId}`;
        setCommunityPosts(prev => prev.map(p => {
            if (p.id === postId) {
                isPinnedNow = !p.isPinned;
                return { ...p, isPinned: !p.isPinned };
            }
            return p;
        }));
        const action = isPinnedNow ? 'تثبيت منشور' : 'إلغاء تثبيت منشور';
        logActivity(action, `تغيير حالة تثبيت المنشور: "${postContent}..."`);
    }, [communityPosts, logActivity]);

    const handleDeleteComment = useCallback((postId: number, commentId: number) => {
        let postContent = '';
        let commentContent = '';
        setCommunityPosts(prev => prev.map(p => {
            if (p.id === postId) {
                postContent = p.content.substring(0, 20);
                const comment = p.comments.find(c => c.id === commentId);
                if (comment) commentContent = comment.content.substring(0, 20);
                return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
            }
            return p;
        }));
        logActivity('حذف تعليق', `حذف تعليق "${commentContent}..." من منشور "${postContent}..."`);
    }, [logActivity]);

    const value = useMemo(() => ({
        communityPosts,
        handleDeletePost,
        handleTogglePostPin,
        handleDeleteComment,
    }), [communityPosts, handleDeletePost, handleTogglePostPin, handleDeleteComment]);

    return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
};

export const useCommunityContext = (): CommunityContextType => {
    const context = useContext(CommunityContext);
    if (context === undefined) {
        throw new Error('useCommunityContext must be used within a CommunityProvider');
    }
    return context;
};