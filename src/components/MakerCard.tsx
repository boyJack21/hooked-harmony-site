import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { Maker } from "@/data/content";

export function MakerCard({ maker }: { maker: Maker }) {
  return (
    <Card className="h-full">
      <CardContent className="space-y-4">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br font-display text-lg font-bold text-foreground",
            maker.tone === "clay" && "from-clay/30 to-rose/20",
            maker.tone === "sage" && "from-sage/30 to-cream",
            maker.tone === "rose" && "from-rose/30 to-clay/15",
            maker.tone === "cream" && "from-cream to-sage/20",
            maker.tone === "coco" && "from-coco/15 to-clay/20"
          )}
        >
          {maker.initials}
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">{maker.name}</h3>
          <p className="text-sm text-muted-foreground">{maker.location}</p>
        </div>
        <Badge variant={maker.tone}>{maker.specialty}</Badge>
        <p className="text-sm text-muted-foreground">{maker.bio}</p>
        <a
          href={`https://${maker.website}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          {maker.website}
        </a>
      </CardContent>
    </Card>
  );
}
