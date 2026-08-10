import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { MakerCard } from "@/components/MakerCard";
import { makers } from "@/data/content";

export default function Makers() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Community"
          title="The people of Hooked Harmony"
          description="Meet the makers behind the patterns — their stories, styles, and favorite tools."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {makers.map((m) => (
            <MakerCard key={m.id} maker={m} />
          ))}
        </div>
      </Container>
    </div>
  );
}
