import { Link } from "react-router-dom";
import { Clock, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { Tutorial } from "@/data/content";
import { toneArt } from "@/components/PatternCard";

export function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  return (
    <Link to={`/tutorials/${tutorial.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
        <div
          className={cn(
            "flex h-32 items-center justify-center bg-gradient-to-br",
            toneArt[tutorial.tone]
          )}
        >
          <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
            {tutorial.emoji}
          </span>
        </div>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={tutorial.tone}>{tutorial.technique}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> {tutorial.minutes} min
            </span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold leading-snug">
              {tutorial.title}
            </h3>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
