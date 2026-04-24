import PropertyCard from "@/components/common/PropertyCard";

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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
              Featured Collections
            </h2>
            <div className="h-1.5 w-20 bg-primary mt-2 rounded-full" />
            <p className="text-gray-500 mt-4 font-medium text-lg italic">
              Handpicked premium projects for you
            </p>
          </div>
          <button className="text-primary font-black text-sm uppercase tracking-widest hover:text-secondary transition-colors group">
            View All Properties <span className="ml-1 group-hover:ml-2 transition-all">→</span>
          </button>
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
