import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Hero />
      <CategoryGrid />
      
      {/* Featured Collections Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Collections</h2>
              <p className="text-gray-600 mt-1">Handpicked projects for you</p>
            </div>
            <button className="text-primary font-bold hover:underline">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder for future listing cards */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
                  <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
                  <div className="pt-4 flex justify-between">
                    <div className="h-8 bg-gray-200 w-1/4 rounded"></div>
                    <div className="h-8 bg-gray-200 w-1/4 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
