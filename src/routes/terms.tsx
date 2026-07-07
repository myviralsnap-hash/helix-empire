import { createFileRoute } from '@tanstack/react-router';
import { LegalLayout, LegalSection } from '@/components/LegalLayout';

export const Route = createFileRoute('/terms')({
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="July 5, 2026">
      <p>By using Helix Empire, you agree to these terms. Helix Empire is a product of the TomaAI Network.</p>

      <LegalSection title="1. Account Responsibility">
        <p>You are responsible for maintaining the security of your Empire account. Your account is shared across all TomaAI applications.</p>
      </LegalSection>

      <LegalSection title="2. Virtual Currency (ViralCoins)">
        <p>ViralCoins and JumpPoints are virtual rewards with no real-world cash value. We reserve the right to modify or revoke balances in cases of cheating or system abuse.</p>
      </LegalSection>

      <LegalSection title="3. User Conduct">
        <p>You agree not to use any automated tools, bots, or hacks to manipulate game scores or earn ViralCoins unfairly.</p>
      </LegalSection>

      <LegalSection title="4. Limitation of Liability">
        <p>TomaAI is not liable for any data loss resulting from network interruptions or service maintenance.</p>
      </LegalSection>
    </LegalLayout>
  );
}
