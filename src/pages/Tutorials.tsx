import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { TutorialCard } from "@/components/TutorialCard";
import { tutorials } from "@/data/content";

export default function Tutorials() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Learn"
          title="Step-by-step tutorials"
          description="Clear, beginner-friendly guides that take you from slip knot to finished piece."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutorials.map((t) => (
            <TutorialCard key={t.id} tutorial={t} />
          ))}
        </div>
      </Container>
    </div>
  );
}
