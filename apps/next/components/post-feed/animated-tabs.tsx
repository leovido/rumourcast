"use client";

import { motion } from "motion/react";
import clsx from "clsx";

interface AnimatedTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

//TODO: Fix the layout shift that happens on re-render of page

export default function AnimatedTabs({
  tabs,
  activeTab,
  onTabChange,
}: AnimatedTabsProps) {
  function firstLetterUpperCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <div className="gradient-border-wrapper rounded-full">
      <motion.div
        className="flex gap-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full p-1"
        layout
        transition={{ duration: 0.0 }}
      >
        {tabs.map((tab) => (
          <ul
            className={clsx(
              "relative cursor-pointer pl-2 pr-3 py-1 font-semibold outline-none transition-colors",
              activeTab === tab ? "text-zinc-900" : "text-zinc-400"
            )}
            tabIndex={0}
            key={tab}
            onFocus={() => onTabChange(tab)}
            onClick={() => onTabChange(tab)}
          >
            {activeTab === tab ? (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-full bg-primary-foreground"
              />
            ) : null}
            <span className="relative text-inherit">
              {tab === 'hot' ? '🔥 ' : '👀 '}{firstLetterUpperCase(tab)}
            </span>
          </ul>
        ))}
      </motion.div>
    </div>
  );
}