"use client";

import { useState, Suspense, useMemo } from "react";
import dynamic from "next/dynamic";
import { 
  InstantSearch, 
  Hits, 
  SearchBox, 
  Configure, 
  Pagination,
  useInstantSearch,
  useHits
} from "react-instantsearch";
import { algoliasearch } from "algoliasearch";
import AlgoliaHit from "@/components/search/AlgoliaHit";
import AlgoliaSearchFilters from "@/components/search/AlgoliaSearchFilters";
import { Search as SearchIcon, Map as MapIcon, Grid3X3, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/common/SafeImage";

const PropertyMap = dynamic(() => import("@/components/map/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-[40px] animate-pulse">
      <MapPin className="w-10 h-10 text-gray-300" />
    </div>
  ),
});

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ""
);

function MapView() {
  const { hits } = useHits();
  
  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-280px)] min-h-[600px]">
      <div className="w-full lg:w-96 overflow-y-auto pr-4 custom-scrollbar space-y-4">
        {hits.map(hit => (
          <Link key={hit.objectID} href={`/property/${hit.objectID}`} className="group flex gap-4 p-4 bg-white border border-gray-100 rounded-3xl hover:shadow-xl transition-all">
            <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden">
              <SafeImage src={hit.coverPhoto} alt="" fill className="object-cover" />
            </div>
            <div className="min-w-0 py-1">
              <h4 className="font-black text-gray-900 text-sm truncate uppercase tracking-tighter group-hover:text-[#0041C2]">{hit.title}</h4>
              <p className="text-[10px] text-gray-400 font-bold mt-1 flex items-center gap-1 uppercase">
                <MapPin size={10} className="text-[#0041C2]" /> {hit.locality}
              </p>
              <p className="text-[#0041C2] font-black text-lg mt-2 tracking-tighter">₹{hit.price?.toLocaleString('en-IN')}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex-1 min-h-[400px]">
        <PropertyMap hits={hits} />
      </div>
    </div>
  );
}

function SearchResultsCount() {
  const { results } = useInstantSearch();
  return (
    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
      {results?.nbHits || 0} Properties Found
    </h1>
  );
}

function LoadingState() {
  const { status } = useInstantSearch();
  if (status === 'loading' || status === 'stalled') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-[40px]">
        <Loader2 className="w-10 h-10 animate-spin text-[#0041C2]" />
      </div>
    );
  }
  return null;
}

function EmptyState() {
  const { results } = useInstantSearch();
  if (results && results.nbHits === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm text-center px-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-4xl">
          🏢
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">No results found</h3>
        <p className="text-gray-500 max-w-xs font-medium">
          We couldn't find any properties matching your criteria in our verified database.
        </p>
        <button onClick={() => window.location.reload()} className="mt-8 bg-gray-900 text-white font-black px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-[#0041C2] transition-all">
          Clear All Filters
        </button>
      </div>
    );
  }
  return null;
}

export default function SearchPage() {
  const [viewMode, setViewMode] = useState("grid");

  return (
    <InstantSearch 
      searchClient={searchClient} 
      indexName="99acres_properties"
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={viewMode === 'map' ? 50 : 12} />
      
      <div className="flex flex-col min-h-screen bg-gray-50/30">
        <main className="flex-grow pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
              <Link href="/" className="hover:text-[#0041C2] text-gray-400">Home</Link>
              <span>/</span>
              <span className="text-gray-900">Search Results</span>
            </div>

            {/* Header & SearchBox */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <SearchResultsCount />
                  <p className="text-gray-500 mt-1 font-medium italic uppercase text-[10px] tracking-widest">Verified listings in India</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative w-full md:w-80 group">
                    <SearchBox 
                      placeholder="Search area, city or project..."
                      className="algolia-searchbox"
                      submitIconComponent={() => <SearchIcon size={18} className="text-[#0041C2]" />}
                      resetIconComponent={() => null}
                    />
                  </div>

                  <button 
                    onClick={() => setViewMode(viewMode === "grid" ? "map" : "grid")}
                    className="flex items-center gap-2 bg-white border border-gray-100 px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-[#0041C2] transition-all"
                  >
                    {viewMode === "grid" ? (
                      <><MapIcon size={16} className="text-[#0041C2]" /> Show Map</>
                    ) : (
                      <><Grid3X3 size={16} className="text-[#0041C2]" /> Show List</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 relative">
              <LoadingState />
              
              {/* Sidebar Filters - Only show in grid mode */}
              {viewMode === "grid" && (
                <aside className="w-full lg:w-80 flex-shrink-0">
                  <div className="sticky top-24">
                    <AlgoliaSearchFilters />
                  </div>
                </aside>
              )}

              {/* Results Area */}
              <div className="flex-1">
                <EmptyState />
                
                {viewMode === "grid" ? (
                  <>
                    <Hits 
                      hitComponent={AlgoliaHit} 
                      classNames={{
                        list: "grid grid-cols-1 md:grid-cols-2 gap-8",
                      }}
                    />
                    
                    <div className="mt-12 flex justify-center">
                      <Pagination 
                        classNames={{
                          list: "flex gap-2",
                          item: "w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 font-bold text-sm hover:border-[#0041C2] transition-colors",
                          selectedItem: "bg-[#0041C2] border-[#0041C2] text-white",
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <MapView />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .algolia-searchbox form {
          position: relative;
        }
        .algolia-searchbox input {
          width: 100%;
          padding: 1rem 1.5rem;
          padding-right: 3.5rem;
          background: white;
          border: 1px solid #f3f4f6;
          border-radius: 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          outline: none;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .algolia-searchbox input:focus {
          border-color: #0041C2;
          box-shadow: 0 10px 30px rgba(0,65,194,0.1);
        }
        .algolia-searchbox button[type="submit"] {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: #f0f7ff;
          padding: 0.5rem;
          border-radius: 0.75rem;
          transition: all 0.3s;
        }
        .algolia-searchbox button[type="submit"]:hover {
          background: #0041C2;
        }
        .algolia-searchbox button[type="submit"]:hover svg {
          color: white;
        }
      `}</style>
    </InstantSearch>
  );
}
