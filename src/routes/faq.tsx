import { createFileRoute } from '@tanstack/react-router';
import { LegalLayout, LegalSection } from '@/components/LegalLayout';

export const Route = createFileRoute('/faq')({
  component: FAQPage,
});

function FAQPage() {
  return (
    <LegalLayout title="F.A.Q.">
      <LegalSection title="What are ViralCoins?">
        <p>ViralCoins are a premium virtual currency that you can earn in Helix Empire and spend in our other apps like ViralSnap.</p>
      </LegalSection>

      <LegalSection title="How do I sync my progress?">
        <p>Simply sign in using your TomaAI account. Your balance will update automatically on all devices.</p>
      </LegalSection>

      <LegalSection title="I hit a red zone, what happens?">
        <p>Hitting a red hazard ends your run. You can restart or watch a quick video ad to revive once per game.</p>
      </LegalSection>

      <LegalSection title="Is the game free?">
        <p>Yes, Helix Empire is 100% free to play, supported by optional advertisements.</p>
      </LegalSection>
    </LegalLayout>
  );
}
