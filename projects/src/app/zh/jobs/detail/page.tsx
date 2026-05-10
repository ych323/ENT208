import { Suspense } from 'react';
import { JobDetailScreen } from '@/components/site/JobDetailScreen';

export default function ChineseJobDetailQueryPage() {
  return (
    <Suspense fallback={null}>
      <JobDetailScreen locale="zh" />
    </Suspense>
  );
}
