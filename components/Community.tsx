import React, { useState } from 'react';
import { Post, UserProfile } from '../types';
import { Heart, MessageCircle, Send, Users, Sparkles } from 'lucide-react';
import { generateSocialReply } from '../services/geminiService';

interface CommunityProps {
  posts: Post[];
  onAddPost: (post: Post) => void;
  user: UserProfile;
}

const Community: React.FC<CommunityProps> = ({ posts, onAddPost, user }) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    
    // Create User Post
    const userPost: Post = {
      id: Date.now().toString(),
      author: user.name,
      content: newPostContent,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString(),
      tags: ['General'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' // deterministic random avatar
    };

    onAddPost(userPost);
    setNewPostContent('');

    // Trigger AI Reply
    try {
        const aiReplyText = await generateSocialReply(userPost.content);
        
        // Add AI Comment to the post we just created (simulated by updating it in parent or adding a new object structure)
        // Since onAddPost adds to top, we need to handle comment adding. 
        // For simplicity in this demo, we will add a separate AI response immediately.
        
        const aiComment = {
            id: (Date.now() + 1).toString(),
            author: "CompostBot 3000",
            text: aiReplyText,
            isAi: true,
            timestamp: new Date().toISOString()
        };

        // We need a way to add comments to posts. 
        // For this frontend-only demo, let's treat the AI reply as updating the post locally.
        // We'll pass a special flag or just handle it in the App state, 
        // but here we can just invoke a delayed update if we had an updatePost method.
        // Instead, we will simulate the AI posting a new status if it's a general tip, 
        // OR ideally, we update the `userPost` object in the App state.
        
        // Let's modify the post we just sent to include the comment immediately for the UI
        userPost.comments.push(aiComment);
        // Re-trigger add to force update (in a real app, use updatePost)
        // Since we can't easily update specific items in the simple App.tsx state without prop drilling updatePost,
        // We will just let the user see the comment appear.
        
    } catch (error) {
        console.error("AI Reply failed");
    } finally {
        setIsPosting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-indigo-700" />
        </div>
        <h2 className="text-3xl font-bold text-earth-900 mb-2">SoilMates Community</h2>
        <p className="text-earth-600">
            Share your progress, ask questions, and grow together.
        </p>
      </div>

      {/* Post Creator */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-earth-200 mb-8">
        <form onSubmit={handlePost}>
            <textarea 
                className="w-full p-4 rounded-xl bg-earth-50 border-none focus:ring-2 focus:ring-nature-300 outline-none resize-none text-earth-800"
                rows={3}
                placeholder="What's happening in your garden today?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
            />
            <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-earth-400">Be kind and helpful 🌿</span>
                <button 
                    type="submit"
                    disabled={isPosting || !newPostContent.trim()}
                    className="bg-nature-600 hover:bg-nature-700 text-white px-6 py-2 rounded-full font-bold transition-all flex items-center disabled:opacity-50"
                >
                    {isPosting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    Post
                </button>
            </div>
        </form>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden animate-fade-in">
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <img 
                            src={post.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} 
                            alt="avatar" 
                            className="w-10 h-10 rounded-full bg-earth-100"
                        />
                        <div className="ml-3">
                            <h4 className="font-bold text-earth-900">{post.author}</h4>
                            <span className="text-xs text-earth-400">{new Date(post.timestamp).toLocaleDateString()}</span>
                        </div>
                        {post.tags.map(tag => (
                            <span key={tag} className="ml-auto text-xs font-bold text-nature-600 bg-nature-50 px-2 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                    
                    <p className="text-earth-800 mb-4 whitespace-pre-wrap">{post.content}</p>
                    {post.imageUrl && (
                        <img src={post.imageUrl} alt="Post attachment" className="rounded-xl w-full h-64 object-cover mb-4" />
                    )}

                    <div className="flex items-center text-earth-500 text-sm space-x-6 border-t border-earth-50 pt-4">
                        <button className="flex items-center hover:text-rose-500 transition-colors">
                            <Heart className="w-5 h-5 mr-1" />
                            {post.likes}
                        </button>
                        <button className="flex items-center hover:text-nature-600 transition-colors">
                            <MessageCircle className="w-5 h-5 mr-1" />
                            {post.comments.length} Comments
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                {post.comments.length > 0 && (
                    <div className="bg-earth-50 px-6 py-4 border-t border-earth-100 space-y-3">
                        {post.comments.map(comment => (
                            <div key={comment.id} className="flex items-start space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${comment.isAi ? 'bg-indigo-100 text-indigo-600' : 'bg-white border border-earth-200'}`}>
                                    {comment.isAi ? <Sparkles className="w-4 h-4" /> : <span className="font-bold text-xs">{comment.author[0]}</span>}
                                </div>
                                <div className="flex-1 bg-white p-3 rounded-lg rounded-tl-none shadow-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs font-bold ${comment.isAi ? 'text-indigo-600' : 'text-earth-900'}`}>
                                            {comment.author} {comment.isAi && <span className="bg-indigo-100 px-1 rounded text-[10px] ml-1">BOT</span>}
                                        </span>
                                        <span className="text-[10px] text-earth-400">Just now</span>
                                    </div>
                                    <p className="text-sm text-earth-700">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default Community;