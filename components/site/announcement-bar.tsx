"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Marquee } from "@/components/ui/marquee";
import { getAnnouncements, defaultAnnouncements } from "@/lib/site-data";

export function AnnouncementBar() {
  const [items, setItems] = useState<Array<{ id: string; text: string; link?: string | null }>>(
    defaultAnnouncements
  );

  useEffect(() => {
    getAnnouncements().then((data) => {
      if (data && data.length > 0) {
        setItems(data);
      }
    });
  }, []);

  return (
    <aside
      aria-label="Announcement ticker"
      className="bg-white/80 border-b border-slate-200/50 backdrop-blur-md py-2 overflow-hidden text-xs text-textSecondary select-none relative z-40"
    >
      <Marquee speed={32} pauseOnHover>
        <div className="flex items-center gap-8 px-4 font-medium tracking-wide">
          {items.map((item, idx) => (
            <div key={item.id || idx} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {item.link ? (
                <Link
                  href={item.link}
                  className="hover:text-accent hover:underline transition-colors cursor-pointer"
                >
                  {item.text}
                </Link>
              ) : (
                <span>{item.text}</span>
              )}
            </div>
          ))}
        </div>
      </Marquee>
    </aside>
  );
}
