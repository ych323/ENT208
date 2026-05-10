import { Suspense } from 'react';
import { JobDetailScreen } from '@/components/site/JobDetailScreen';

export default function EnglishJobDetailQueryPage() {
  return (
    <Suspense fallback={null}>
      <JobDetailScreen locale="en" />
    </Suspense>
  );
}
