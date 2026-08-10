import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-muted/60">
      <Container className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-semibold">
              Hooked Harmony
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            A cozy community for crochet and knitting makers. Find patterns,
            learn techniques, and connect with makers like you.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">
            Explore
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-foreground" to="/patterns">Patterns</Link></li>
            <li><Link className="hover:text-foreground" to="/tutorials">Tutorials</Link></li>
            <li><Link className="hover:text-foreground" to="/makers">Meet the makers</Link></li>
            <li><Link className="hover:text-foreground" to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">
            Categories
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Crochet</li>
            <li>Knitting</li>
            <li>Amigurumi</li>
            <li>Home &amp; gifts</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">
            Stay in the loop
          </h3>
          <p className="text-sm text-muted-foreground">
            New patterns and tutorials, twice a month. No spam, ever.
          </p>
        </div>
      </Container>
      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Hooked Harmony. Made with warmth.</span>
          <span>Crochet, knit, repeat.</span>
        </Container>
      </div>
    </footer>
  );
}
