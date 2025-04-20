"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';


// Dynamically import 3D components for better performance
const Portfolio3D = dynamic(() => import('@/components/Portfolio/Portfolio3D'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <Portfolio3D />
    </div>
  );
}
