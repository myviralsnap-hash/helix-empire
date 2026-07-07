import { createFileRoute } from '@tanstack/react-router';
import { LegalLayout, LegalSection } from '@/components/LegalLayout';
import { Smartphone, Zap, Coins, Trophy } from 'lucide-react';

export const Route = createFileRoute('/how-it-works')({
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <LegalLayout title="How It Works">
      <div className="space-y-8 py-4">
        <div className="flex gap-4 items-start">
            <div className="bg-primary p-3 rounded-2xl"><Smartphone className="h-6 w-6 text-white" /></div>
            <div>
                <h4 className="font-black uppercase italic">1. Control</h4>
                <p className="text-xs opacity-70">Swipe to rotate the tower and fall through the gaps.</p>
            </div>
        </div>
        <div className="flex gap-4 items-start">
            <div className="bg-green-500 p-3 rounded-2xl"><Trophy className="h-6 w-6 text-white" /></div>
            <div>
                <h4 className="font-black uppercase italic">2. Score</h4>
                <p className="text-xs opacity-70">Earn JumpPoints for every level passed. Reach the bottom to win.</p>
            </div>
        </div>
        <div className="flex gap-4 items-start">
            <div className="bg-yellow-500 p-3 rounded-2xl"><Coins className="h-6 w-6 text-white" /></div>
            <div>
                <h4 className="font-black uppercase italic">3. Rewards</h4>
                <p className="text-xs opacity-70">Clear milestones to earn ViralCoins shared across all Empire apps.</p>
            </div>
        </div>
      </div>
    </LegalLayout>
  );
}
