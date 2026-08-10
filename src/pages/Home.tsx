import { ArrowRight, Heart, Leaf, Users } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { PatternCard } from "@/components/PatternCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { patterns, makers } from "@/data/content";

const values = [
  {
    icon: Heart,
    title: "Made with love",
    text: "Every pattern is tested and written to be kind to beginners and satisfying for experts.",
  },
  {
    icon: Leaf,
    title: "Mindful & natural",
    text: "We champion natural fibers, small-batch yarns, and slow, soothing making.",
  },
  {
    icon: Users,
    title: "A real community",
    text: "Share progress, ask questions, and cheer on fellow makers from around the world.",
  },
];

export default function Home() {
  const featured = patterns.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Container className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full bg-clay/10 px-4 py-1.5 text-sm font-semibold text-clay">
              Crochet · Knitting · Amigurumi
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find your calm, one stitch at a time.
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Hooked Harmony is a cozy home for crochet and knitting makers.
              Browse beautiful patterns, learn new techniques, and meet the
              people who make this craft so warm.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink
                size="lg"
                to="/patterns"
                className="inline-flex items-center gap-2"
              >
                Browse patterns <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink size="lg" variant="secondary" to="/tutorials">
                Start learning
              </ButtonLink>
            </div>
          </div>
          <div className="relative">
            <img
              src={hero}
              alt="Cozy knit and crochet pieces with yarn balls on a cream linen table"
              width={1024}
              height={1024}
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-soft"
            />
          </div>
        </Container>
      </section>

      {/* Value props */}
      <section className="bg-muted/50 py-16">
        <Container className="grid gap-8 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-semibold">{v.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {v.text}
              </p>
            </div>
          ))}
        </Container>
      </section>

      {/* Featured patterns */}
      <section className="py-16 sm:py-20">
        <Container className="space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Patterns"
              title="Our most-loved patterns"
              description="A handful of favorites to get you started — from cozy throws to sweet amigurumi."
            />
            <ButtonLink
              variant="outline"
              to="/patterns"
              className="inline-flex items-center gap-2"
            >
              View all <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PatternCard key={p.id} pattern={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Makers strip */}
      <section className="bg-muted/50 py-16 sm:py-20">
        <Container className="space-y-10">
          <SectionHeading
            eyebrow="Community"
            title="Meet the makers"
            description="Real people, real yarn, real stories — the heart of Hooked Harmony."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {makers.slice(0, 3).map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-clay/20 font-display font-bold text-clay">
                  {m.initials}
                </div>
                <div>
                  <h3 className="font-display font-semibold">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {m.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <ButtonLink
            variant="outline"
            to="/makers"
            className="inline-flex items-center gap-2"
          >
            Meet everyone <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-gradient-to-br from-clay/15 via-rose/10 to-cream p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md space-y-2">
              <h2 className="font-display text-3xl font-semibold">
                New patterns, twice a month
              </h2>
              <p className="text-muted-foreground">
                Join the newsletter for fresh tutorials, member spotlights, and
                the occasional discount on premium patterns.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </Container>
      </section>
    </div>
  );
}
