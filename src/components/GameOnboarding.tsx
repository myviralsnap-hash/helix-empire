import { useState, useEffect } from 'react';
import { Zap, Trophy, Coins, Smartphone, ChevronRight, Play, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = "helix:onboarded";

const slides = [
  {
    icon: Smartphone,
    title: "The Helix Empire",
    body: "Swipe to rotate the tower. Find the gaps and smash your way to the bottom!",
    color: "bg-primary",
  },
  {
    icon: Trophy,
    title: "Evolving Stages",
    body: "Experience new geometry every 5 levels. From simple cylinders to intense master hexagons!",
    color: "bg-green-500",
  },
  {
    icon: CreditCard,
    title: "Gather & Redeem",
    body: "Collect JumpPoints (JP) for every drop. Reach the threshold to redeem them for REAL gift cards and rewards!",
    color: "bg-yellow-500",
  },
  {
    icon: Coins,
    title: "Empire Sync",
    body: "Clear milestones to earn ViralCoins. Your wallet is shared with ViralSnap and AlgoRhythm!",
    color: "bg-blue-600",
  },
];

export function GameOnboarding({ onComplete }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
  }, []);

  const finish = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
    if (onComplete) onComplete();
  };

  if (!open) return null;

  const slide = slides[step];
  const Icon = slide.icon;
  const isLast = step === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6 pointer-events-auto animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm flex flex-col items-center text-center">
        <div className={cn(
            "h-32 w-32 rounded-[45px] flex items-center justify-center mb-8 border-4 border-white/10 shadow-2xl transition-all duration-500",
            slide.color
        )}>
          <Icon className="h-16 w-16 text-white animate-pulse" />
        </div>
        <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase mb-4 leading-none">{slide.title}</h2>
        <p className="text-white/60 font-bold uppercase tracking-widest text-[11px] leading-relaxed mb-16 px-4">
            {slide.body}
        </p>
        <div className="flex gap-2 mb-12">
          {slides.map((_, i) => (
            <div key={i} className={cn("h-1.5 transition-all duration-300 rounded-full", i === step ? "w-10 bg-primary" : "w-1.5 bg-white/20")} />
          ))}
        </div>
        <button onClick={() => isLast ? finish() : setStep(s => s + 1)} className="w-full h-24 bg-white text-black rounded-[40px] font-black uppercase text-2xl tracking-tighter shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
          {isLast ? "START EARNING" : "NEXT"}
          {isLast ? <Play className="h-6 w-6 fill-current ml-2" /> : <ChevronRight className="h-8 w-8" />}
        </button>
      </div>
    </div>
  );
}
