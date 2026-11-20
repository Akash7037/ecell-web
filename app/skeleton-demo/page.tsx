'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import EventsSkeleton from '@/components/skeletons/EventsSkeleton';
import BlogSkeleton from '@/components/skeletons/BlogSkeleton';
import BlogDetailSkeleton from '@/components/skeletons/BlogDetailSkeleton';
import TeamSkeleton from '@/components/skeletons/TeamSkeleton';
import ContactSkeleton from '@/components/skeletons/ContactSkeleton';
import HomeSkeleton from '@/components/skeletons/HomeSkeleton';

export default function SkeletonDemoPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'blog' | 'blog-detail' | 'team' | 'contact' | 'home'>('team');

  return (
    <div className="min-h-screen bg-[#FAF8F2]">
      <Navbar />

      {/* Floating Demo Switcher */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#121316] text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-stone-700/80 text-xs font-mono">
        <span className="text-stone-400 mr-1 uppercase">Preview:</span>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-3 py-1 rounded-full transition-colors ${
            activeTab === 'events' ? 'bg-[#FF4D2E] text-white font-semibold' : 'text-stone-300 hover:text-white'
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`px-3 py-1 rounded-full transition-colors ${
            activeTab === 'blog' ? 'bg-[#FF4D2E] text-white font-semibold' : 'text-stone-300 hover:text-white'
          }`}
        >
          Blog
        </button>
        <button
          onClick={() => setActiveTab('blog-detail')}
          className={`px-3 py-1 rounded-full transition-colors ${
            activeTab === 'blog-detail' ? 'bg-[#FF4D2E] text-white font-semibold' : 'text-stone-300 hover:text-white'
          }`}
        >
          Article
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`px-3 py-1 rounded-full transition-colors ${
            activeTab === 'team' ? 'bg-[#FF4D2E] text-white font-semibold' : 'text-stone-300 hover:text-white'
          }`}
        >
          Team
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-3 py-1 rounded-full transition-colors ${
            activeTab === 'contact' ? 'bg-[#FF4D2E] text-white font-semibold' : 'text-stone-300 hover:text-white'
          }`}
        >
          Contact
        </button>
        <button
          onClick={() => setActiveTab('home')}
          className={`px-3 py-1 rounded-full transition-colors ${
            activeTab === 'home' ? 'bg-[#FF4D2E] text-white font-semibold' : 'text-stone-300 hover:text-white'
          }`}
        >
          Home
        </button>
      </div>

      {/* Render Selected Skeleton */}
      {activeTab === 'events' && <EventsSkeleton />}
      {activeTab === 'blog' && <BlogSkeleton />}
      {activeTab === 'blog-detail' && <BlogDetailSkeleton />}
      {activeTab === 'team' && <TeamSkeleton />}
      {activeTab === 'contact' && <ContactSkeleton />}
      {activeTab === 'home' && <HomeSkeleton />}
    </div>
  );
}
