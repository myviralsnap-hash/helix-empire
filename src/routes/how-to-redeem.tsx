import { createFileRoute } from '@tanstack/react-router';
import { LegalLayout, LegalSection } from '@/components/LegalLayout';
import { Gift, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export const Route = createFileRoute('/how-to-redeem')({
  component: HowToRedeemPage,
});

function HowToRedeemPage() {
  return (
    <LegalLayout title="Redeem Rewards">
      <div className="space-y-6 py-4">
        <div className="bg-yellow-500/10 border-2 border-yellow-500/20 p-6 rounded-[30px] flex gap-4">
            <Gift className="h-8 w-8 text-yellow-500 shrink-0" />
            <p className="text-xs font-bold text-yellow-200">Accumulate JumpPoints (JP) by smashing through platforms and clearing stages.</p>
        </div>

        <LegalSection title="Redemption Thresholds">
            <ul className="space-y-3 text-[11px] opacity-80">
                <li className="flex justify-between border-b border-white/5 pb-2"><span>250,000 JP</span> <span className="text-green-400 font-black">$2.00 Reward</span></li>
                <li className="flex justify-between border-b border-white/5 pb-2"><span>500,000 JP</span> <span className="text-green-400 font-black">$5.00 Reward</span></li>
                <li className="flex justify-between"><span>1,000,000 JP</span> <span className="text-green-400 font-black">$10.00 Reward</span></li>
            </ul>
        </LegalSection>

        <LegalSection title="The Process">
            <div className="space-y-4">
                <div className="flex gap-3 items-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <p className="text-[10px]">Select your preferred gift card in the "Win" tab.</p>
                </div>
                <div className="flex gap-3 items-center">
                    <Clock className="h-4 w-4 text-primary" />
                    <p className="text-[10px]">Requests are processed within 7-10 business days.</p>
                </div>
                <div className="flex gap-3 items-center">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <p className="text-[10px]">Cheating or botting will result in a permanent ban and forfeit of points.</p>
                </div>
            </div>
        </LegalSection>
      </div>
    </LegalLayout>
  );
}
