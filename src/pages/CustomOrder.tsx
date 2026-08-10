import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CONTACT_EMAIL, categories, colorOptions } from "@/data/products";

export default function CustomOrder() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${data.get(
        "phone"
      )}\n\nItem type: ${data.get("type")}\nColour: ${data.get("color")}\nSize: ${data.get(
        "size"
      )}\nQuantity: ${data.get("qty")}\n\nDetails:\n${data.get("details")}\n`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=Custom%20order%20request&body=${body}`;
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header>
        <h1 className="font-display text-4xl font-bold">Custom order</h1>
        <p className="mt-4 text-muted-foreground">
          Want something in your own colour, size or design? Tell us what you have in
          mind and we'll quote you.
        </p>
      </header>

      {sent ? (
        <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center shadow-card">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="h-6 w-6" />
          </span>
          <h2 className="mt-6 font-display text-2xl font-bold">Request ready to send</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Your email app should have opened with the details. If it didn't, mail us
            directly at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <Button className="mt-8" variant="outline" onClick={() => setSent(false)}>
            Send another request
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone / WhatsApp" name="phone" />
            <div>
              <Label>Item type</Label>
              <select name="type" className={inputClass} defaultValue={categories[0].name}>
                {categories.map((c) => (
                  <option key={c.slug}>{c.name}</option>
                ))}
                <option>Something else</option>
              </select>
            </div>
            <div>
              <Label>Colour</Label>
              <select name="color" className={inputClass} defaultValue={colorOptions[0]}>
                {colorOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
                <option>Other (described below)</option>
              </select>
            </div>
            <div>
              <Label>Size</Label>
              <select name="size" className={inputClass} defaultValue="M">
                {["XS", "S", "M", "L", "XL", "Custom measurements"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <Field label="Quantity" name="qty" type="number" defaultValue="1" min="1" />

          <div>
            <Label>Tell us about your piece</Label>
            <textarea
              name="details"
              rows={5}
              required
              placeholder="Style, inspiration, measurements, deadline…"
              className={inputClass}
            />
          </div>

          <Button type="submit" size="lg" className="w-full shadow-glow">
            Send request
          </Button>
        </form>
      )}
    </div>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/40";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-semibold">{children}</span>;
}

function Field({
  label,
  name,
  ...rest
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label>{label}</Label>
      <input id={name} name={name} className={inputClass} {...rest} />
    </div>
  );
}
