import { createFileRoute } from '@tanstack/react-router';
import { LegalLayout, LegalSection } from '@/components/LegalLayout';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <LegalLayout title="About Us">
      <p>Helix Empire is the premier hyper-casual gaming destination within the TomaAI Empire Network.</p>

      <LegalSection title="Our Mission">
        <p>We build connected digital experiences. Our goal is to reward user loyalty by creating an ecosystem where your progress in one app benefits your journey in another.</p>
      </LegalSection>

      <LegalSection title="The Network">
        <p>TomaAI encompasses social media (ViralSnap), music (AlgoRhythm), and competitive gaming. Join millions of users in the next generation of the mobile web.</p>
      </LegalSection>
    </LegalLayout>
  );
}
