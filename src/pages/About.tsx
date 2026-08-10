import { ButtonLink } from "@/components/ui/Button";
import { faqs } from "@/data/products";
import { useProducts } from "@/lib/catalog";

export default function About() {
  const { featuredProduct } = useProducts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <header>
        <h1 className="font-display text-4xl font-bold">About EverythingHooked</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A small South African crochet studio turning premium yarn into clothing you
          actually want to wear.
        </p>
      </header>

      {featuredProduct && (
      <div className="mt-10 overflow-hidden rounded-3xl border border-border shadow-card">
        <img
          src={featuredProduct.heroImage}
          alt="Handmade crochet piece by EverythingHooked"
          className="h-full w-full object-cover"
        />
      </div>
      )}

      <div className="mt-10 space-y-5 text-muted-foreground">
        <p>
          EverythingHooked started with one hook, a basket of yarn and a lot of late
          nights. Today every cardigan, shirt, beanie and bag is still made by hand,
          one stitch at a time — no factories, no shortcuts.
        </p>
        <p>
          Because each piece is made to order, you get to choose the colour and the
          size, and we can adjust the fit to your measurements. It takes a few days
          longer than fast fashion, and that's exactly the point.
        </p>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl font-bold">Frequently asked</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                {item.q}
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-14 flex flex-wrap gap-4">
        <ButtonLink to="/shop" size="lg" className="shadow-glow">
          Shop the collection
        </ButtonLink>
        <ButtonLink to="/contact" size="lg" variant="outline">
          Get in touch
        </ButtonLink>
      </div>
    </div>
  );
}
