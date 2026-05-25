import PropertyCard from "@/components/common/PropertyCard";
import Link from "next/link";
async function getProperties() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/properties?featured=true`, {
    next: { revalidate: 60 } // Revalidate every minute
  });
  
  if (!res.ok) return [];
  const result = await res.json();
  return result.success ? result.data : [];
}

export default async function FeaturedProperties() {
  const properties = await getProperties();

  if (properties.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50/30 to-gray-50/80">
      <div className="max-w-full mx-auto px-4 sm:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-3 border border-primary/20 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Premium Selection
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
              Featured Collections
            </h2>
            <div className="h-1.5 w-20 bg-primary mt-2 rounded-full" />
            <p className="text-gray-500 mt-4 font-medium text-lg">
              Handpicked premium projects tailored just for you
            </p>
          </div>
          <Link href="/search" className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 px-6 py-3 rounded-full text-gray-800 hover:text-primary font-black text-sm uppercase tracking-widest transition-all group">
            View All Properties 
            <span className="w-6 h-6 rounded-full bg-gray-50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
