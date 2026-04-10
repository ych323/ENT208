'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  Code,
  Library,
  ExternalLink,
  ThumbsUp,
  Eye,
  Layers,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: '全部', icon: Layers },
  { value: '前端', label: '前端', icon: Code },
  { value: '后端', label: '后端', icon: Server },
  { value: '算法', label: '算法', icon: BookOpen },
  { value: '面试', label: '面试', icon: FileText },
  { value: '工具', label: '工具', icon: Library },
];

const LEVELS = [
  { value: 'all', label: '全部难度' },
  { value: '入门', label: '入门' },
  { value: '进阶', label: '进阶' },
  { value: '高级', label: '高级' },
];

const TYPE_LABELS: Record<string, { icon: any; color: string }> = {
  article: { icon: FileText, color: 'text-blue-400' },
  video: { icon: Video, color: 'text-red-400' },
  course: { icon: BookOpen, color: 'text-green-400' },
  book: { icon: Library, color: 'text-yellow-400' },
  project: { icon: Code, color: 'text-purple-400' },
};

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  sub_category: string;
  type: string;
  url: string;
  level: string;
  tags: string;
  likes: number;
  views: number;
  created_at: string;
}

function Server(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  );
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (level !== 'all') params.set('level', level);
      
      const res = await fetch(`/api/resources?${params}`);
      const data = await res.json();
      if (data.success) {
        setResources(data.data);
      }
    } catch (error) {
      console.error('获取资源失败:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, [category, level]);

  // Group resources by category
  const groupedResources = resources.reduce((acc, res) => {
    const cat = res.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(res);
    return acc;
  }, {} as Record<string, Resource[]>);

  const getCategoryIcon = (cat: string) => {
    const item = CATEGORIES.find((c) => c.value === cat);
    return item?.icon || Layers;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-lg">返回首页</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              学习资源库
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            精心整理的学习路线和优质资源，助你系统提升求职竞争力
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="选择方向" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/10">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {cat.label}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="难度" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/10">
              {LEVELS.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Resources by Category */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 mt-4">加载中...</p>
          </div>
        ) : resources.length === 0 ? (
          <Card className="bg-white/5 border-white/10 max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <Library className="w-12 h-12 mx-auto text-slate-500 mb-4" />
              <p className="text-slate-400">暂无相关资源</p>
            </CardContent>
          </Card>
        ) : category === 'all' ? (
          // Grouped view
          <div className="space-y-12">
            {Object.entries(groupedResources).map(([cat, resList]) => {
              const Icon = getCategoryIcon(cat);
              return (
                <section key={cat}>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    {cat}
                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
                      {resList.length} 个资源
                    </Badge>
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {resList.map((res) => {
                      const TypeIcon = TYPE_LABELS[res.type]?.icon || FileText;
                      const typeColor = TYPE_LABELS[res.type]?.color || 'text-slate-400';
                      return (
                        <a
                          key={res.id}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all h-full">
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div className={`p-2 rounded-lg bg-white/5 ${typeColor}`}>
                                  <TypeIcon className="w-4 h-4" />
                                </div>
                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                  {res.level || '全部'}
                                </Badge>
                              </div>
                              <h3 className="text-white font-medium mb-2 line-clamp-2">
                                {res.title}
                              </h3>
                              <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                                {res.description}
                              </p>
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <ThumbsUp className="w-3 h-3" />
                                    {res.likes}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {res.views}
                                  </span>
                                </div>
                                <ExternalLink className="w-4 h-4" />
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          // Grid view for single category
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {resources.map((res) => {
              const TypeIcon = TYPE_LABELS[res.type]?.icon || FileText;
              const typeColor = TYPE_LABELS[res.type]?.color || 'text-slate-400';
              return (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg bg-white/5 ${typeColor}`}>
                          <TypeIcon className="w-4 h-4" />
                        </div>
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                          {res.level || '全部'}
                        </Badge>
                      </div>
                      <h3 className="text-white font-medium mb-2 line-clamp-2">
                        {res.title}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                        {res.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {res.likes}
                        </span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
