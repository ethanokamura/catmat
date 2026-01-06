import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Circle, Diamond, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import catmat from "@/assets/catmat-clear-design.webp";

export default function Home() {
  return (
    <main id="main-content" className="relative min-h-[calc(100vh-4rem)] pb-40">
      {/* Hero Section */}
      <section
        className="relative h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={catmat}
            alt=""
            fill
            priority
            className="object-contain opacity-20"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-background/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <h1
            id="hero-heading"
            className="text-[clamp(3rem,15vw,12rem)] font-bold leading-none tracking-tighter"
          >
            CATMAT
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
            Premium desk mats crafted for the modern workspace. Minimalist
            design meets exceptional quality.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="min-w-[200px]">
              <Link href="/products">
                View Collection
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          aria-hidden="true"
        >
          <ArrowDown className="text-muted-foreground" />
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-24 px-4 sm:px-6 bg-accent/30"
        aria-labelledby="features-heading"
      >
        <div className="max-w-6xl mx-auto">
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl font-bold text-center mb-16"
          >
            Crafted with Care
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span
                  className="text-2xl"
                  role="img"
                  aria-label="Quality materials"
                >
                  <Star />
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Quality Over Quantity
              </h3>
              <p className="text-muted-foreground">
                Every mat is made with premium materials designed for longevity.
                No shortcuts, no compromises.
              </p>
            </article>
            <article className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span
                  className="text-2xl"
                  role="img"
                  aria-label="Perfect dimensions"
                >
                  <Diamond />
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Thoughtful Design:</h3>
              <p className="text-muted-foreground">
                Each design showcases a unqiue artstyle while still being
                practical for everyday use.
              </p>
            </article>
            <article className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span
                  className="text-2xl"
                  role="img"
                  aria-label="Unique designs"
                >
                  <Circle />
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community First:</h3>
              <p className="text-muted-foreground">
                We want towork hand in hand with the community to create the
                best products for you.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to upgrade your desk?
          </h2>
          <Button asChild size="lg">
            <Link href="/products">
              View Collection
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
