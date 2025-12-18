import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import MainLayout from "@/layout/main-layout";
import { useSEO } from "@/hooks/use-seo";
import { useLandingPage } from "@/hooks/use-landing-page";

import { BookingSearch } from "@/components/booking-search";
import { FeaturedPackages } from "@/components/featured-packages";
import { AboutSection } from "@/components/about-section";
import { PromoSection } from "@/components/promo-section";
import { NewsletterSection } from "@/components/newsletter-section";

const heroImage =
  "https://images.unsplash.com/photo-1540202404-a2f29016b523?q=80&w=2000&auto=format&fit=crop";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isLoading, destinations, packages } = useLandingPage();

  useSEO({
    title: "Home",
    description:
      "Discover amazing travel packages and book your dream vacation with Wonderfull Inn. Explore destinations worldwide with expert travel agents.",
    keywords:
      "travel packages, vacation booking, holiday destinations, tourism, travel agent, Wonderfull Inn",
    ogImage: heroImage,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="space-y-12 py-8 lg:py-16">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="space-y-2 md:space-y-4">
              <h1 className="text-2xl font-bold leading-tight md:text-4xl lg:text-5xl">
                Refresh, Relax, and Rediscover
                <br />
                Life&apos;s Simple Pleasures
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                Discover the luxury, where tranquility meets the beauty of
                nature. Every moment feels like home with all the comfort of the
                luxurious inn.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 md:max-w-sm md:gap-3">
              <Button
                onClick={() => navigate("/packages")}
                className="rounded-full px-4 text-xs md:px-8 md:text-base"
              >
                Explore
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/contact")}
                className="rounded-full px-4 text-xs md:px-8 md:text-base"
              >
                Contact
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <img
              src={heroImage}
              alt="Luxury overwater villa with stunning ocean view"
              className="aspect-[21/9] w-full object-cover"
            />
          </div>
        </div>

        <BookingSearch />

        <FeaturedPackages
          packages={packages}
          destinations={destinations}
        />

        <AboutSection />
        <PromoSection />
        <NewsletterSection />
      </section>
    </MainLayout>
  );
}
