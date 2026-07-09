import { createFileRoute } from '@tanstack/react-router';
import { LegalLayout, LegalSection } from '@/components/LegalLayout';

export const Route = createFileRoute('/faq')({
  component: FAQPage,
});

function FAQPage() {
  return (
    <LegalLayout title="F.A.Q.">
      <LegalSection title="What are JumpPoints (JP)?">
        <p>JumpPoints are the primary reward for gameplay. You earn them for every platform you pass. JP can be redeemed for real-world gift cards or rewards once you reach the minimum threshold.</p>
      </LegalSection>

      <LegalSection title="What are ViralCoins (VC)?">
        <p>ViralCoins are the premium ecosystem currency. They are shared between Helix Empire, ViralSnap, and AlgoRhythm. You earn them as bonuses for reaching stage milestones (Stage 5, 10, etc).</p>
      </LegalSection>

      <LegalSection title="How do I get paid?">
        <p>Once you have enough JumpPoints, go to the Shop or Win tab and click &quot;Request Payout.&quot; Our team will verify your account and send your reward within 7 business days.</p>
      </LegalSection>

      <LegalSection title="Is there a limit to how much I can earn?">
        <p>No! As long as you keep playing and clearing stages, you can keep gathering JP and VC.</p>
      </LegalSection>
    </LegalLayout>
  );
}
