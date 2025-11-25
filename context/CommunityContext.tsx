import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { mockCommunityPosts, mockDiscussionCircles } from '../data/mock-data';
import type { CommunityPost, CommunityContextType, DiscussionCircle, CommunityComment } from '../types';

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logActivity } = useAppContext();
    const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(mockCommunityPosts);
    const [discussionCircles, setDiscussionCircles] = useState<DiscussionCircle[]>(mockDiscussionCircles);

    const handleSavePost = useCallback((postData: Omit<CommunityPost, 'id' | 'authorId' | 'timestamp' | 'likes' | 'comments' | 'reports'> & { id?: number }) => {
        const isNew = !postData.id;
        setCommunityPosts(prev => {
            if (postData.id) {
                 return prev.map(p => p.id === postData.id ? { ...p, content: postData.content, imageUrl: postData.imageUrl, circleId: postData.circleId } : p);
            } else {
                const newPost: CommunityPost = {
                    id: Date.now(),
                    authorId: 0, // Admin user
                    ...postData,
                    timestamp: new Date().toISOString(),
                    likes: 0,
                    comments: [],
                };
                return [newPost, ...prev];
            }
        });
        logActivity(isNew ? 'إضافة منشور مجتمع' : 'تعديل منشور مجتمع', `تم حفظ المنشور: "${postData.content.substring(0, 30)}..."`);
    }, [logActivity]);

    const handleUpdatePost = useCallback((updatedPost: CommunityPost) => {
        setCommunityPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
        logActivity('تحديث منشور', `تم تحديث المنشور (ID: ${updatedPost.id})`);
    }, [logActivity]);

    const handleDeletePost = useCallback((id: number) => {
        const post = communityPosts.find(p => p.id === id);
        setCommunityPosts(prev => prev.filter(p => p.id !== id));
        logActivity('حذف منشور مجتمع', `تم حذف المنشور: "${post?.content.substring(0, 30)}..."`);
    }, [communityPosts, logActivity]);

    const handleUpdateComment = useCallback((postId: number, commentId: number, newContent: string) => {
        setCommunityPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: post.comments.map(comment => 
                        comment.id === commentId ? { ...comment, content: newContent } : comment
                    )
                };
            }
            return post;
        }));
        logActivity('تعديل تعليق', `تم تعديل التعليق (ID: ${commentId}) على المنشور (ID: ${postId})`);
    }, [logActivity]);
    
    const handleDeleteComment = useCallback((postId: number, commentId: number) => {
        setCommunityPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: post.comments.filter(comment => comment.id !== commentId)
                };
            }
            return post;
        }));
        logActivity('حذف تعليق', `تم حذف التعليق (ID: ${commentId}) من المنشور (ID: ${postId})`);
    }, [logActivity]);

    const handleSaveCircle = useCallback((circleData: Omit<DiscussionCircle, 'id'> & { id?: number }) => {
        const isNew = !circleData.id;
        setDiscussionCircles(prev => {
            if (circleData.id) {
                return prev.map(g => g.id === circleData.id ? { ...g, ...circleData } : g);
            } else {
                const newCircle: DiscussionCircle = { ...circleData, id: Date.now() };
                return [...prev, newCircle];
            }
        });
        logActivity(isNew ? 'إضافة دائرة نقاش' : 'تعديل دائرة نقاش', `تم حفظ الدائرة: "${circleData.name}"`);
    }, [logActivity]);

    const handleDeleteCircle = useCallback((circleId: number) => {
        const circle = discussionCircles.find(g => g.id === circleId);
        if (!circle) return;

        const generalCircle = discussionCircles.find(g => g.category === 'عام');
        if (!generalCircle || generalCircle.id === circleId) {
            console.error("لا يمكن حذف دائرة النقاش العامة.");
            // Here you might want to show a toast to the user
            return;
        }
        
        // Re-assign posts from the deleted circle to the general circle
        setCommunityPosts(prev => prev.map(p => p.circleId === circleId ? { ...p, circleId: generalCircle.id } : p));
        
        setDiscussionCircles(prev => prev.filter(g => g.id !== circleId));
        logActivity('حذف دائرة نقاش', `تم حذف الدائرة: "${circle.name}" ونقل منشوراتها.`);
    }, [discussionCircles, logActivity]);

    const handleDismissPostReports = useCallback((postId: number) => {
        setCommunityPosts(prev => prev.map(post => 
            post.id === postId ? { ...post, reports: [] } : post
        ));
        logActivity('تجاهل بلاغات منشور', `تم تجاهل البلاغات على المنشور (ID: ${postId})`);
    }, [logActivity]);

    const handleDismissCommentReports = useCallback((postId: number, commentId: number) => {
        setCommunityPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: post.comments.map(comment => 
                        comment.id === commentId ? { ...comment, reports: [] } : comment
                    )
                };
            }
            return post;
        }));
         logActivity('تجاهل بلاغات تعليق', `تم تجاهل البلاغات على التعليق (ID: ${commentId})`);
    }, [logActivity]);

    const value = useMemo(() => ({
        communityPosts,
        discussionCircles,
        handleSavePost,
        handleUpdatePost,
        handleDeletePost,
        handleDeleteComment,
        handleUpdateComment,
        handleSaveCircle,
        handleDeleteCircle,
        handleDismissPostReports,
        handleDismissCommentReports,
    }), [
        communityPosts, discussionCircles, handleSavePost, handleUpdatePost, handleDeletePost,
        handleDeleteComment, handleUpdateComment, handleSaveCircle, handleDeleteCircle,
        handleDismissPostReports, handleDismissCommentReports
    ]);

    return (
        <CommunityContext.Provider value={value}>
            {children}
        </CommunityContext.Provider>
    );
};

export const useCommunityContext = (): CommunityContextType => {
    const context = useContext(CommunityContext);
    if (!context) {
        throw new Error('useCommunityContext must be used within a CommunityProvider');
    }
    return context;
};
