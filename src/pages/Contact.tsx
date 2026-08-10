import { useState } from "react";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="py-12 sm:py-16">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Say hello"
            title="We'd love to hear from you"
            description="Questions about a pattern, feedback on the site, or just want to talk yarn? Drop us a line."
          />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-muted-foreground">
                  hello@hookedharmony.example
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Community</p>
                <p className="text-sm text-muted-foreground">
                  Join us on Instagram & Discord
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Studio</p>
                <p className="text-sm text-muted-foreground">
                  Portland, Oregon
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
              <span className="text-5xl">📮</span>
              <h2 className="font-display text-2xl font-semibold">
                Message sent!
              </h2>
              <p className="max-w-sm text-muted-foreground">
                Thanks for reaching out — we'll get back to you within a couple
                of days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Your name</span>
                  <Input name="name" placeholder="Jane Maker" required />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Email</span>
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </label>
              </div>
              <label className="space-y-2">
                <span className="text-sm font-semibold">Subject</span>
                <Input name="subject" placeholder="What's it about?" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold">Message</span>
                <textarea
                  name="message"
                  rows={6}
                  required
                  placeholder="Tell us a little more..."
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
                />
              </label>
              <Button type="submit" className="w-full sm:w-auto">
                Send message
              </Button>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
