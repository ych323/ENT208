'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Eye, ThumbsUp, MessageCircle, Clock, Send } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  category: string;
  tags: string;
  target_job: string;
  company: string;
  views: number;
  likes: number;
  comments_count: number;
  created_at: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  likes: number;
  created_at: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/forum/posts/${postId}`);
      const data = await res.json();
      if (data.success) {
        setPost(data.post);
        setComments(data.comments);
      }
    } catch (error) {
      console.error('获取帖子失败:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/forum/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          content: newComment,
          author: authorName || '匿名用户',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewComment('');
        fetchPost(); // 刷新评论
      }
    } catch (error) {
      console.error('评论失败:', error);
    }
    setSubmitting(false);
  };

  const formatTime = (time: string) => {
    return new Date(time).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-12 px-8 text-center">
            <p className="text-slate-400">帖子不存在</p>
            <Link href="/forum">
              <Button className="mt-4 bg-indigo-500">返回论坛</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <Link href="/forum" className="inline-flex items-center gap-2 text-white hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>返回论坛</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Post Content */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/50">
                {post.category}
              </Badge>
              {post.company && (
                <Badge variant="outline" className="border-slate-500/50 text-slate-400">
                  {post.company}
                </Badge>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">{post.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-6 pb-6 border-b border-white/10">
              <span>作者：{post.author}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(post.created_at)}
              </span>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>
            
            {post.tags && (
              <div className="flex gap-2 mt-6 pt-6 border-t border-white/10">
                {post.tags.split(',').map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-slate-600 text-slate-400">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/10 text-slate-400">
              <span className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {post.views} 浏览
              </span>
              <span className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5" />
                {post.likes} 点赞
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {post.comments_count} 评论
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-400" />
              评论 ({comments.length})
            </h2>
            
            {/* Comment Input */}
            <div className="mb-8 pb-8 border-b border-white/10">
              <Input
                placeholder="你的昵称（选填）"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="mb-3 bg-slate-800/50 border-white/10 text-white"
              />
              <Textarea
                placeholder="写下你的评论..."
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3 bg-slate-800/50 border-white/10 text-white"
              />
              <Button
                onClick={handleSubmitComment}
                disabled={submitting || !newComment.trim()}
                className="bg-gradient-to-r from-indigo-500 to-purple-500"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitting ? '发送中...' : '发表评论'}
              </Button>
            </div>
            
            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-center text-slate-500 py-8">还没有评论，来抢沙发吧！</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="pb-6 border-b border-white/5 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{comment.author}</span>
                      <span className="text-sm text-slate-500">{formatTime(comment.created_at)}</span>
                    </div>
                    <p className="text-slate-300">{comment.content}</p>
                    <button className="flex items-center gap-1 mt-2 text-slate-500 hover:text-indigo-400 transition-colors text-sm">
                      <ThumbsUp className="w-4 h-4" />
                      {comment.likes}
                    </button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
