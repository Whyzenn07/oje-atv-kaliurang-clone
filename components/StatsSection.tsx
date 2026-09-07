"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, Briefcase, Users, Trophy } from "lucide-react";

const stats = [
  {
    value: 1112,
    label: "Pelanggan",
    suffix: "",
    icon: Compass,
    bg: "bg-[#b51b41]",
    glow: "group-hover:shadow-[0_0_35px_rgba(181,27,65,0.75)]",
    animation: "animate-social-float-1",
  },
  {
    value: 1550,
    label: "Tour ATV Completed",
    suffix: "",
    icon: Briefcase,
    bg: "bg-[#f6a440]",
    glow: "group-hover:shadow-[0_0_35px_rgba(246,164,64,0.75)]",
    animation: "animate-social-float-2",
  },
  {
    value: 20,
    label: "Team",
    suffix: "+",
    icon: Users,
    bg: "bg-[#b51b41]",
    glow: "group-hover:shadow-[0_0_35px_rgba(181,27,65,0.75)]",
    animation: "animate-social-float-1",
  },
  {
    value: 1,
    label: "Tahun Berpengalaman",
    suffix: "+",
    icon: Trophy,
    bg: "bg-[#f6a440]",
    glow: "group-hover:shadow-[0_0_35px_rgba(246,164,64,0.75)]",
    animation: "animate-social-float-2",
  },
];

function useCountUp(target: number, duration = 2000, started = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);

  return count;
}

function StatCard({
  value,
  label,
  suffix,
  Icon,
  bg,
  glow,
  animation,
  started,
  isLast,
  index,
}: {
  value: number;
  label: string;
  suffix?: string;
  Icon: React.ComponentType<{ className?: string }>;
  bg: string;
  glow: string;
  animation: string;
  started: boolean;
  isLast: boolean;
  index: number;
}) {
  const count = useCountUp(value, 2200, started);
  return (
    <div
      className={`flex flex-col items-center text-center px-3 sm:px-6 py-6 group cursor-default transition-all duration-700 ${
        !isLast ? "md:border-r border-white/15" : ""
      }`}
      style={{
        transitionDelay: `${index * 150}ms`,
        transform: started ? "translateY(0)" : "translateY(24px)",
        opacity: started ? 1 : 0,
      }}
    >
      {/* Sleek Circular Icon Badge */}
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${bg} flex items-center justify-center mb-4 sm:mb-5 shadow-2xl border-2 border-white/30 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${glow} ${animation}`}
      >
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
      </div>

      {/* Bold Animated Counter */}
      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-1.5 sm:mb-2 tracking-tight group-hover:text-[#f6a440] transition-colors duration-300 drop-shadow-md font-sans">
        {started ? count.toLocaleString() : "0"}
        {suffix}
      </p>

      {/* Label */}
      <p className="text-white/85 text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider drop-shadow-sm">
        {label}
      </p>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-16 sm:py-24 md:py-28 overflow-hidden bg-[#1c1c1c]" ref={ref}>
      {/* Parallax-style background image with deep dark gradient overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/atv-kaliurang-merapi-4.jpeg"
          alt="Stats background"
          className="w-full h-full object-cover object-center brightness-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/90 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-0">
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              Icon={stat.icon}
              bg={stat.bg}
              glow={stat.glow}
              animation={stat.animation}
              started={started}
              isLast={i === stats.length - 1}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

