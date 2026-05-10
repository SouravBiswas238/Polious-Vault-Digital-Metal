import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SkeletonDemo() {
  return (
    <div className="container mx-auto py-12 px-6 max-w-5xl">
      <header className="mb-12">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Skeleton Loading Demo</h1>
        <p className="text-white/60 max-w-2xl">
          A showcase of premium skeleton loading states for the Polyus Vault ecosystem. 
          Designed with smooth shimmer animations and glassmorphism.
        </p>
      </header>

      <div className="grid gap-12">
        {/* Profile / List Section */}
        <section>
          <h2 className="text-xl font-semibold text-gold mb-6 uppercase tracking-wider">Profile & List Variants</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* User Profile Skeleton */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/2 opacity-60" />
              </div>
            </div>

            {/* Notification Item Skeleton */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 opacity-60" />
            </div>
          </div>
        </section>

        {/* Product / Card Section */}
        <section>
          <h2 className="text-xl font-semibold text-gold mb-6 uppercase tracking-wider">Content Cards</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all">
                <Skeleton className="aspect-video w-full rounded-none" />
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full opacity-60" />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Table / List Section */}
        <section>
          <h2 className="text-xl font-semibold text-gold mb-6 uppercase tracking-wider">Data Tables</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex gap-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4 ml-auto" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex gap-4 border-b border-white/5 last:border-0 items-center">
                <Skeleton className="h-8 w-8 rounded shrink-0" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16 rounded-full ml-auto" />
              </div>
            ))}
          </div>
        </section>

        {/* Large Layout Section */}
        <section>
          <h2 className="text-xl font-semibold text-gold mb-6 uppercase tracking-wider">Detailed View Layout</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-[300px] w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-gold/20 bg-gold/5 space-y-4">
                <Skeleton className="h-6 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                <Skeleton className="h-5 w-1/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
