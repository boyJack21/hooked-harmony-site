import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { PatternCard } from "@/components/PatternCard";
import { patterns } from "@/data/content";

const categories = ["All", ...Array.from(new Set(patterns.map((p) => p.category)))];

export default function Patterns() {
  const [active, setActive] = useState("All");

  const filtered = useMemo(
    () =>
      active === "All"
        ? patterns
        : patterns.filter((p) => p.category === active),
    [active]
  );

  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Patterns"
          title="Browse the collection"
          description="From beginner-friendly beanies to advanced lace shawls — filter by category to find your next project."
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={
                active === c
                  ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  : "rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground/80 hover:bg-muted"
              }
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PatternCard key={p.id} pattern={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-muted-foreground">
            No patterns in this category yet — check back soon.
          </p>
        )}
      </Container>
    </div>
  );
}
