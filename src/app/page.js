import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProperties from "@/components/home/FeaturedProperties";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Hero />
      <CategoryGrid />
      
      <FeaturedProperties />

      {/* Why Choose Us / Trust Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">India's No. 1 Property Portal</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Providing a seamless experience for buyers, sellers and renters with our advanced technology and verification systems.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "15M+", sub: "Monthly Visitors" },
              { label: "1.2M+", sub: "Verified Listings" },
              { label: "500k+", sub: "Owners/Dealers" },
              { label: "100k+", sub: "New Projects" },
            ].map((stat, i) => (
              <div key={i} className="p-6">
                <div className="text-4xl font-black text-primary mb-2">{stat.label}</div>
                <div className="text-gray-500 font-medium">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
