import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Ruler, Scissors, Wind, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { patterns } from "@/data/content";

export default function PatternDetail() {
  const { slug } = useParams();
  const pattern = patterns.find((p) => p.slug === slug);

  if (!pattern) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">
          Pattern not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          The pattern you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <ButtonLink to="/patterns" variant="outline">
            Back to patterns
          </ButtonLink>
        </div>
      </Container>
    );
  }

  const details = [
    { icon: Ruler, label: "Gauge", value: pattern.gauge },
    { icon: Sparkles, label: "Yarn", value: pattern.yarn },
    { icon: Scissors, label: "Yardage", value: pattern.yardage },
    { icon: Wind, label: "Tool", value: pattern.tool },
  ];

  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-10">
        <ButtonLink to="/patterns" variant="ghost" className="w-fit">
          <ArrowLeft className="h-4 w-4" /> All patterns
        </ButtonLink>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex h-full min-h-[280px] items-center justify-center rounded-3xl bg-gradient-to-br from-clay/20 via-rose/10 to-cream">
            <span className="text-7xl">{pattern.emoji}</span>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={pattern.tone}>{pattern.category}</Badge>
              <Badge variant="outline">{pattern.difficulty}</Badge>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight">
              {pattern.title}
            </h1>
            <p className="text-lg text-muted-foreground">{pattern.description}</p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <d.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {d.label}
                    </p>
                    <p className="text-sm font-semibold">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-display text-2xl font-semibold">
            How it comes together
          </h2>
          <ol className="space-y-4">
            {pattern.steps.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-foreground/90">{step}</p>
              </li>
            ))}
          </ol>
          <p className="rounded-2xl bg-muted p-5 text-sm text-muted-foreground">
            Premium PDF download and full stitch charts coming soon. Sign up to
            the newsletter to be the first to know when this pattern goes
            premium.{" "}
            <Link to="/contact" className="font-semibold text-primary hover:underline">
              Contact us
            </Link>{" "}
            with any questions.
          </p>
        </div>
      </Container>
    </div>
  );
}
