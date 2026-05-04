import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Header from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Reachable',
    template: '%s | Reachable',
  },
  description:
    'An AI career workspace for students and early-career candidates, focused on positioning, job matching, applications, resume building, and guided practice.',
  keywords: [
    'AI 求职',
    '职业定位',
    '岗位匹配',
    '大学生求职',
    '应届生求职',
    'career positioning',
    'job matching',
    'student career assistant',
  ],
  authors: [{ name: 'Reachable Team' }],
  openGraph: {
    title: 'Reachable',
    description:
      'Use chat, jobs, resources, practice, and tracking to make job search decisions clearer and more actionable.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LanguageProvider>
            <Header />
            <main className="min-h-screen pt-[72px]">
              {children}
            </main>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
