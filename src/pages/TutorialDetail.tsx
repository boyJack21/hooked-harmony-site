import { useParams } from "react-router-dom";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { tutorials } from "@/data/content";

export default function TutorialDetail() {
  const { slug } = useParams();
  const tutorial = tutorials.find((t) => t.slug === slug);

  if (!tutorial) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">
          Tutorial not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          That guide isn't in our library right now.
        </p>
        <div className="mt-6">
          <ButtonLink to="/tutorials" variant="outline">
            Back to tutorials
          </ButtonLink>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <Container className="max-w-3xl space-y-8">
        <ButtonLink to="/tutorials" variant="ghost" className="w-fit">
          <ArrowLeft className="h-4 w-4" /> All tutorials
        </ButtonLink>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={tutorial.tone}>{tutorial.technique}</Badge>
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> {tutorial.minutes} min
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight">
            {tutorial.title}
          </h1>
        </div>

        <div className="space-y-6">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
            <BookOpen className="h-5 w-5 text-primary" /> The guide
          </h2>
          <ol className="space-y-4">
            {tutorial.content.map((step, i) => (
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
        </div>
      </Container>
    </div>
  );
}
