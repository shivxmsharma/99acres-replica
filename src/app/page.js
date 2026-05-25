import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import RealEstateTools from "@/components/home/RealEstateTools";
import StatsSection from "@/components/home/StatsSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Hero />
      <FeaturedProperties />
      <CategoryGrid />
      <RealEstateTools />
      <StatsSection />
    </div>
  );
}
