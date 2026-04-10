import type { Metadata } from 'next';
import { LandingPage } from '@/components/LandingPage';

export const metadata: Metadata = {
  title: '够得着 - AI求职能力定位器',
  description: '找到够得着的岗位，补上够不着的差距。帮助大学生看清能力位置，让求职不再盲目，让成长有迹可循。',
  keywords: [
    '求职',
    '能力定位',
    '职业规划',
    '大学生就业',
    'AI助手',
    '岗位匹配',
    '求职辅导',
    '职业发展',
  ],
};

export default function Home() {
  return <LandingPage />;
}
