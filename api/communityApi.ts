import { mockCommunityPosts, mockDiscussionCircles, mockLostAndFoundItems } from '../data/mock-data';
import type { CommunityPost, DiscussionCircle, CommunityComment, LostAndFoundItem } from '../types';

// Simulate backend storage
let communityPosts = JSON.parse(JSON.stringify(mockCommunityPosts));
let discussionCircles = JSON.parse(JSON.stringify(mockDiscussionCircles));
let lostAndFoundItems = JSON.parse(JSON.stringify(mockLostAndFoundItems));

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Circles ---
export const getCircles = async (): Promise<DiscussionCircle[]> => {
    await delay(300);
    return JSON.parse(JSON.stringify(discussionCircles));
};

export const saveCircle = async (circleData: Omit<DiscussionCircle, 'id'> & { id?: number }): Promise<DiscussionCircle> => {
    await delay(500);
    if (circleData.id) {
        discussionCircles = discussionCircles.map((c: DiscussionCircle) => c.id === circleData.id ? { ...c, ...circleData } : c);
        return discussionCircles.find((c: DiscussionCircle) => c.id === circleData.id)!;
    } else {
        const newCircle = { ...circleData, id: Date.now() };
        discussionCircles.push(newCircle);
        return newCircle;
    }
};

export const deleteCircle = async (id: number): Promise<void> => {
    await delay(400);
    const generalCircle = discussionCircles.find((c: DiscussionCircle) => c.category === 'عام');
    if (!generalCircle || generalCircle.id === id) {
        throw new Error("لا يمكن حذف دائرة النقاش العامة.");
    }
    // Re-assign posts
    communityPosts = communityPosts.map((p: CommunityPost) => p.circleId === id ? { ...p, circleId: generalCircle.id } : p);
    discussionCircles = discussionCircles.filter((c: DiscussionCircle) => c.id !== id);
};

// --- Posts ---
export const getPosts = async (): Promise<CommunityPost[]> => {
    await delay(400);
    return JSON.parse(JSON.stringify(communityPosts));
};

export const savePost = async (postData: Omit<CommunityPost, 'id' | 'authorId' | 'timestamp' | 'likes' | 'comments' | 'reports'> & { id?: number, authorId?: number }): Promise<CommunityPost> => {
    await delay(500);
    if (postData.id) {
        communityPosts = communityPosts.map((p: CommunityPost) => 
            p.id === postData.id 
                ? { ...p, content: postData.content, imageUrl: postData.imageUrl, circleId: postData.circleId } 
                : p
        );
        return communityPosts.find((p: CommunityPost) => p.id === postData.id)!;
    } else {
        const newPost: CommunityPost = {
            id: Date.now(),
            authorId: postData.authorId || 0, // 0 usually implies admin in this mock setup
            content: postData.content,
            imageUrl: postData.imageUrl,
            circleId: postData.circleId,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: [],
        };
        communityPosts.unshift(newPost);
        return newPost;
    }
};

export const deletePost = async (id: number): Promise<void> => {
    await delay(400);
    communityPosts = communityPosts.filter((p: CommunityPost) => p.id !== id);
};

export const dismissPostReports = async (id: number): Promise<void> => {
    await delay(300);
    communityPosts = communityPosts.map((p: CommunityPost) => p.id === id ? { ...p, reports: [] } : p);
};

// --- Comments ---
export const saveComment = async ({ postId, commentId, content }: { postId: number, commentId: number, content: string }): Promise<void> => {
    await delay(400);
    communityPosts = communityPosts.map((p: CommunityPost) => {
        if (p.id === postId) {
            return {
                ...p,
                comments: p.comments.map((c: CommunityComment) => c.id === commentId ? { ...c, content } : c)
            };
        }
        return p;
    });
};

export const deleteComment = async ({ postId, commentId }: { postId: number, commentId: number }): Promise<void> => {
    await delay(300);
    communityPosts = communityPosts.map((p: CommunityPost) => {
        if (p.id === postId) {
            return { ...p, comments: p.comments.filter((c: CommunityComment) => c.id !== commentId) };
        }
        return p;
    });
};

export const dismissCommentReports = async ({ postId, commentId }: { postId: number, commentId: number }): Promise<void> => {
    await delay(300);
    communityPosts = communityPosts.map((p: CommunityPost) => {
        if (p.id === postId) {
            return {
                ...p,
                comments: p.comments.map((c: CommunityComment) => c.id === commentId ? { ...c, reports: [] } : c)
            };
        }
        return p;
    });
};

// --- Lost & Found ---
export const getLostAndFoundItems = async (): Promise<LostAndFoundItem[]> => {
    await delay(300);
    return JSON.parse(JSON.stringify(lostAndFoundItems));
};

export const saveLostAndFoundItem = async (itemData: Omit<LostAndFoundItem, 'id' | 'moderationStatus'> & { id?: number, moderationStatus?: 'pending' | 'approved' | 'rejected' }): Promise<LostAndFoundItem> => {
    await delay(500);
    if (itemData.id) {
        lostAndFoundItems = lostAndFoundItems.map((i: LostAndFoundItem) => i.id === itemData.id ? { ...i, ...itemData } : i);
        return lostAndFoundItems.find((i: LostAndFoundItem) => i.id === itemData.id)!;
    } else {
        const newItem: LostAndFoundItem = {
            id: Math.max(...lostAndFoundItems.map((i: LostAndFoundItem) => i.id), 0) + 1,
            moderationStatus: 'pending',
            ...itemData
        };
        lostAndFoundItems.unshift(newItem);
        return newItem;
    }
};

export const deleteLostAndFoundItem = async (id: number): Promise<void> => {
    await delay(400);
    lostAndFoundItems = lostAndFoundItems.filter((i: LostAndFoundItem) => i.id !== id);
};

export const approveLostAndFoundItem = async (id: number): Promise<void> => {
    await delay(300);
    lostAndFoundItems = lostAndFoundItems.map((i: LostAndFoundItem) => i.id === id ? { ...i, moderationStatus: 'approved' } : i);
};

export const rejectLostAndFoundItem = async (id: number): Promise<void> => {
    await delay(300);
    lostAndFoundItems = lostAndFoundItems.map((i: LostAndFoundItem) => i.id === id ? { ...i, moderationStatus: 'rejected' } : i);
};
