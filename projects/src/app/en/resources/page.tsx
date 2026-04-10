'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Server,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All', icon: Layers },
  { value: '前端', label: 'Frontend', icon: Code },
  { value: '后端', label: 'Backend', icon: Server },
  { value: '算法', label: 'Algorithm', icon: BookOpen },
  { value: '面试', label: 'Interview', icon: FileText },
];

const CATEGORY_LABELS: Record<string, string> = {
  '前端': 'Frontend',
  '后端': 'Backend',
  '算法': 'Algorithm',
  '面试': 'Interview',
};

const LEVELS = [
  { value: 'all', label: 'All Levels' },
  { value: '入门', label: 'Beginner' },
  { value: '进阶', label: 'Intermediate' },
  { value: '高级', label: 'Advanced' },
];

const LEVEL_LABELS: Record<string, string> = {
  '入门': 'Beginner',
  '进阶': 'Intermediate',
  '高级': 'Advanced',
};

const TYPE_LABELS: Record<string, { icon: any; color: string }> = {
  article: { icon: FileText, color: 'text-blue-400' },
  video: { icon: Video, color: 'text-red-400' },
  course: { icon: BookOpen, color: 'text-green-400' },
  book: { icon: Library, color: 'text-yellow-400' },
  project: { icon: Code, color: 'text-purple-400' },
};

const TYPE_NAMES: Record<string, string> = {
  article: 'Article',
  video: 'Video',
  course: 'Course',
  book: 'Book',
  project: 'Project',
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

export default function EnglishResourcesPage() {
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
      console.error('Failed to fetch resources:', error);
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
          <div className="flex items-center justify-between">
            <Link href="/en" className="inline-flex items-center gap-2 text-white">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold text-lg">Back to Home</span>
            </Link>
            <Link href="/resources" className="text-slate-400 hover:text-white px-3 py-2 text-sm">
              中文
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Learning Resources
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Curated learning paths and quality resources to boost your career
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Category" />
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
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Level" />
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
            <p className="text-slate-400 mt-4">Loading...</p>
          </div>
        ) : resources.length === 0 ? (
          <Card className="bg-white/5 border-white/10 max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <Library className="w-12 h-12 mx-auto text-slate-500 mb-4" />
              <p className="text-slate-400">No resources found</p>
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
                    {CATEGORY_LABELS[cat] || cat}
                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
                      {resList.length} resources
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
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                    {TYPE_NAMES[res.type] || res.type}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs border-emerald-500/50 text-emerald-400">
                                    {LEVEL_LABELS[res.level] || res.level || 'All'}
                                  </Badge>
                                </div>
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
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {TYPE_NAMES[res.type] || res.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-emerald-500/50 text-emerald-400">
                            {LEVEL_LABELS[res.level] || res.level || 'All'}
                          </Badge>
                        </div>
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
