import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { Pattern, Tone } from "@/data/content";

export const toneArt: Record<Tone, string> = {
  clay: "from-clay/25 to-rose/20",
  sage: "from-sage/25 to-cream",
  rose: "from-rose/30 to-clay/15",
  cream: "from-cream to-sage/15",
  coco: "from-coco/15 to-clay/20",
};

export function PatternCard({ pattern }: { pattern: Pattern }) {
  return (
    <Link to={`/patterns/${pattern.slug}`} className="group block">
      <Card className="overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
        <div
          className={cn(
            "flex h-40 items-center justify-center bg-gradient-to-br",
            toneArt[pattern.tone]
          )}
        >
          <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
            {pattern.emoji}
          </span>
        </div>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={pattern.tone}>{pattern.category}</Badge>
            <span className="text-xs text-muted-foreground">
              {pattern.difficulty}
            </span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold leading-snug">
              {pattern.title}
            </h3>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {pattern.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
