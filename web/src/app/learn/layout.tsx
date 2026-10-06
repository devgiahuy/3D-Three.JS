import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { LearningTheme, type ThemePreference } from '@/learning/shared/LearningTheme';

export const metadata: Metadata = {
  title: 'Khu học 3D — Smart Kids',
  description: 'Học Three.js từng bước, từ object và animation đến Guide và Result Mode.',
};

export default async function LearningLayout({ children }: { children: ReactNode }) {
  const savedTheme = (await cookies()).get('smart-kids-learning-theme')?.value;
  const initialTheme: ThemePreference = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'system';
  return <LearningTheme initialTheme={initialTheme}>{children}</LearningTheme>;
}
