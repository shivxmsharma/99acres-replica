import PropertyCard from "@/components/common/PropertyCard";
import Link from "next/link";
import SearchFilters from "@/components/search/SearchFilters";
import { Suspense } from "react";

async function getProperties(searchParams) {
  const query = new URLSearchParams(searchParams).toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/properties?${query}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) return [];
  const result = await res.json();
  return result.success ? result.data : [];
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const properties = await getProperties(params);
  const q = params.q || "";
  const status = params.status || "All";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/30">
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs (Optional but 99acres-like) */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-primary text-gray-400">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Search Results</span>
          </div>

          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {properties.length} Properties {status !== "All" ? `for ${status}` : ""} {q ? `in "${q}"` : ""}
              </h1>
              <p className="text-gray-500 mt-1 font-medium italic">Verified listings matching your search</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <Suspense fallback={<div className="h-96 bg-white rounded-3xl animate-pulse" />}>
                  <SearchFilters />
                </Suspense>
              </div>
            </aside>

            {/* Results Grid */}
            <div className="flex-1">
              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm text-center px-4">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-4xl">
                    🏢
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">No results found</h3>
                  <p className="text-gray-500 max-w-xs font-medium">
                    We couldn't find any properties matching your criteria in our verified database.
                  </p>
                  <Link href="/" className="mt-8 bg-gray-900 text-white font-black px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-primary transition-all">
                    Back to Homepage
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

