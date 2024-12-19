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
    <div className="relative cursor-pointer font-semibold transition-colors flex rounded-full">
      <motion.div
        className="gradient-border-wrapper rounded-full flex gap-1 p-1 w-fit bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary"
        layout
        transition={{ duration: 0.0 }}
      >
        {tabs.map((tab) => (
          <ul
            className={clsx(
              "relative cursor-pointer px-4 py-2 font-semibold transition-colors flex rounded-full",
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