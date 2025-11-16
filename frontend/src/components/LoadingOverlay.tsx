'use client';

import { useLoading } from '@/contexts/LoadingContext';

export default function LoadingOverlay() {
  const { isPending } = useLoading();

  if (!isPending) return null;

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-neutral-200">
        <div className="h-full bg-gradient-to-r from-primary-600 to-secondary-600 animate-progress" />
      </div>

      {/* Full page overlay with spinner */}
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[9998] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-neutral-200 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-neutral-900">
              Loading products...
            </p>
            <p className="text-sm text-neutral-500 mt-1">Please wait</p>
          </div>
        </div>
      </div>
    </>
  );
}
