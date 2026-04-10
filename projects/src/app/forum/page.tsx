'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  MessageCircle,
  ThumbsUp,
  Eye,
  Clock,
  Plus,
  ArrowLeft,
  Flame,
  Sparkles,
  MessageSquare,
  Users,
  BookOpen,
  Briefcase,
} from 'lucide-react';

const CATEGORIES = [
  { value: '全部', label: '全部', icon: Sparkles },
  { value: '面试经验', label: '面试经验', icon: MessageCircle },
  { value: '岗位讨论', label: '岗位讨论', icon: Briefcase },
  { value: '学习打卡', label: '学习打卡', icon: BookOpen },
  { value: '求职互助', label: '求职互助', icon: Users },
];

const SORT_OPTIONS = [
  { value: 'latest', label: '最新' },
  { value: 'hot', label: '最热' },
  { value: 'top', label: '精选' },
];

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

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('全部');
  const [sort, setSort] = useState('latest');
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '面试经验',
    company: '',
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== '全部') params.set('category', category);
      params.set('sort', sort);
      
      const res = await fetch(`/api/forum/posts?${params}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error('获取帖子失败:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [category, sort]);

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreate(false);
        setNewPost({ title: '', content: '', category: '面试经验', company: '', tags: '' });
        fetchPosts();
      }
    } catch (error) {
      console.error('创建帖子失败:', error);
    }
    setSubmitting(false);
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const getCategoryIcon = (cat: string) => {
    const item = CATEGORIES.find((c) => c.value === cat);
    return item?.icon || MessageCircle;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold text-lg">返回首页</span>
            </Link>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  发布帖子
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-white">发布新帖子</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">标题</label>
                    <Input
                      placeholder="输入帖子标题..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="bg-slate-800 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">分类</label>
                    <Select
                      value={newPost.category}
                      onValueChange={(v) => setNewPost({ ...newPost, category: v })}
                    >
                      <SelectTrigger className="bg-slate-800 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        {CATEGORIES.filter((c) => c.value !== '全部').map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">公司（可选）</label>
                    <Input
                      placeholder="如：字节跳动"
                      value={newPost.company}
                      onChange={(e) => setNewPost({ ...newPost, company: e.target.value })}
                      className="bg-slate-800 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">内容</label>
                    <Textarea
                      placeholder="分享你的经验..."
                      rows={6}
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      className="bg-slate-800 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">标签（可选）</label>
                    <Input
                      placeholder="如：#校招 #一面"
                      value={newPost.tags}
                      onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                      className="bg-slate-800 border-white/10 text-white"
                    />
                  </div>
                  <Button
                    onClick={handleCreatePost}
                    disabled={submitting || !newPost.title || !newPost.content}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  >
                    {submitting ? '发布中...' : '发布帖子'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              求职论坛
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            分享面试经验、讨论岗位发展、打卡学习进度，让求职之路不再孤单
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  category === cat.value
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort Options */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                  sort === opt.value
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.value === 'hot' && <Flame className="w-3 h-3 inline mr-1" />}
                {opt.value === 'latest' && <Clock className="w-3 h-3 inline mr-1" />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-400 mt-4">加载中...</p>
            </div>
          ) : posts.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-slate-500 mb-4" />
                <p className="text-slate-400">还没有帖子</p>
                <p className="text-slate-500 text-sm mt-2">成为第一个分享的人吧！</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => {
              const Icon = getCategoryIcon(post.category);
              return (
                <Link key={post.id} href={`/forum/${post.id}`}>
                  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                          <Icon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs border-indigo-500/50 text-indigo-400">
                              {post.category}
                            </Badge>
                            {post.company && (
                              <Badge variant="outline" className="text-xs border-slate-500/50 text-slate-400">
                                {post.company}
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-white font-medium text-lg mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <span className="text-slate-400">{post.author}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              {post.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {post.comments_count}
                            </span>
                            <span className="flex items-center gap-1 ml-auto">
                              <Clock className="w-4 h-4" />
                              {formatTime(post.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
