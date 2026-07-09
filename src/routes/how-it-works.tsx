import { createFileRoute } from '@tanstack/react-router';
import { LegalLayout, LegalSection } from '@/components/LegalLayout';
import { Smartphone, Zap, Coins, Trophy, CreditCard } from 'lucide-react';

export const Route = createFileRoute('/how-it-works')({
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <LegalLayout title="How It Works">
      <div className="space-y-8 py-4">
        <div className="flex gap-4 items-start">
            <div className="bg-primary p-3 rounded-2xl shrink-0"><Smartphone className="h-6 w-6 text-white" /></div>
            <div>
                <h4 className="font-black uppercase italic text-white leading-none">1. Rotate & Fall</h4>
                <p className="text-[10px] opacity-70 mt-1 leading-relaxed">Swipe your finger left or right to rotate the tower. Find the gaps and fall through to reach the next platform.</p>
            </div>
        </div>
        <div className="flex gap-4 items-start">
            <div className="bg-green-500 p-3 rounded-2xl shrink-0"><Zap className="h-6 w-6 text-white" /></div>
            <div>
                <h4 className="font-black uppercase italic text-white leading-none">2. Multi-Gap Smashes</h4>
                <p className="text-[10px] opacity-70 mt-1 leading-relaxed">Fall through 3 or more gaps in a single drop to earn massive STREAK BONUSES and smash through the next floor!</p>
            </div>
        </div>
        <div className="flex gap-4 items-start">
            <div className="bg-yellow-500 p-3 rounded-2xl shrink-0"><CreditCard className="h-6 w-6 text-white" /></div>
            <div>
                <h4 className="font-black uppercase italic text-white leading-none">3. Earn & Redeem JP</h4>
                <p className="text-[10px] opacity-70 mt-1 leading-relaxed">Every bounce earns JumpPoints (JP). Accumulate enough JP to redeem them for real-world gift cards or rewards via our Payout portal!</p>
            </div>
        </div>
        <div className="flex gap-4 items-start">
            <div className="bg-blue-600 p-3 rounded-2xl shrink-0"><Coins className="h-6 w-6 text-white" /></div>
            <div>
                <h4 className="font-black uppercase italic text-white leading-none">4. Empire Sync</h4>
                <p className="text-[10px] opacity-70 mt-1 leading-relaxed">Clear every 5 stages to earn bonus ViralCoins. These coins are instantly shared with ViralSnap and AlgoRhythm!</p>
            </div>
        </div>
      </div>
    </LegalLayout>
  );
}
