import { createFileRoute } from '@tanstack/react-router';
import { LegalLayout, LegalSection } from '@/components/LegalLayout';
import { Mail, Globe, MessageSquare } from 'lucide-react';

export const Route = createFileRoute('/contact')({
  component: ContactPage,
});

function ContactPage() {
  return (
    <LegalLayout title="Contact Us">
      <p>We value your feedback and questions. Get in touch with the TomaAI team below:</p>

      <div className="grid gap-4 mt-8">
        <a href="mailto:support@helixempire.fun" className="bg-white/5 p-6 rounded-[32px] border-2 border-white/10 flex items-center gap-4 hover:border-primary transition-colors">
            <Mail className="h-6 w-6 text-primary" />
            <div>
                <p className="font-black uppercase italic">Email Support</p>
                <p className="text-[10px] opacity-40">support@helixempire.fun</p>
            </div>
        </a>
        <div className="bg-white/5 p-6 rounded-[32px] border-2 border-white/10 flex items-center gap-4">
            <Globe className="h-6 w-6 text-blue-400" />
            <div>
                <p className="font-black uppercase italic">Main Website</p>
                <p className="text-[10px] opacity-40">www.helixempire.fun</p>
            </div>
        </div>
      </div>
    </LegalLayout>
  );
}
