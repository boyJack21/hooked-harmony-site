import { useState, type FormEvent } from "react";
import { Check, Instagram, Mail, MessageCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_NUMBER,
  WHATSAPP_URL,
} from "@/data/products";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=Website%20enquiry&body=${body}`;
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold">Contact us</h1>
        <p className="mt-4 text-muted-foreground">
          Questions about sizing, delivery or a custom piece? We'd love to hear from
          you.
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {[
            {
              icon: Mail,
              title: "Email",
              body: CONTACT_EMAIL,
              href: `mailto:${CONTACT_EMAIL}`,
            },
            {
              icon: Instagram,
              title: "Instagram",
              body: INSTAGRAM_HANDLE,
              href: INSTAGRAM_URL,
            },
            {
              icon: MessageCircle,
              title: "WhatsApp",
              body: WHATSAPP_NUMBER,
              href: WHATSAPP_URL,
            },
            {
              icon: Truck,
              title: "Delivery",
              body: "Nationwide across South Africa, 2–4 working days after production",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-bold">{item.title}</h2>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="mt-1 block text-sm text-primary hover:underline"
                >
                  {item.body}
                </a>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              )}
            </div>
          ))}
        </div>

        {sent ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-card">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Check className="h-6 w-6" />
            </span>
            <h2 className="mt-6 font-display text-2xl font-bold">Message ready</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Your email app should have opened. If not, write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <Button className="mt-8" variant="outline" onClick={() => setSent(false)}>
              Send another message
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
          >
            <div>
              <label htmlFor="name" className="text-sm font-semibold">
                Your name
              </label>
              <input id="name" name="name" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-semibold">
                Email
              </label>
              <input id="email" name="email" type="email" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-semibold">
                Message
              </label>
              <textarea id="message" name="message" rows={6} required className={inputClass} />
            </div>
            <Button type="submit" size="lg" className="w-full shadow-glow">
              Send message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/40";
