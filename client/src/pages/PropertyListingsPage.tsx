import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  MapPin,
  Bed,
  Bath,
  Maximize,
  Filter,
  Search,
  ChevronDown,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Link, useParams, useLocation } from 'wouter';
import heroLogo from "@/assets/catwalk-frames-logo.png";

interface Property {
  id: number;
  listingType: string;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number;
  addressLine1: string;
  postcode: string;
  images: string[];
  features: string[];
  areaName?: string;
}

export default function PropertyListingsPage() {
  const { type } = useParams();
  const [location] = useLocation();
  
  // Parse URL query parameters
  const getUrlParams = () => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(location.split('?')[1] || '');
    const urlFilters: any = {};
    
    params.forEach((value, key) => {
      if (key === 'propertyType' || key === 'area') {
        // Handle array parameters
        if (!urlFilters[key]) urlFilters[key] = [];
        urlFilters[key].push(value);
      } else {
        urlFilters[key] = value;
      }
    });
    
    return urlFilters;
  };
  
  const urlParams = getUrlParams();
  
  const [filters, setFilters] = useState({
    minPrice: urlParams.minPrice || '',
    maxPrice: urlParams.maxPrice || '',
    bedrooms: urlParams.bedrooms || '',
    propertyType: urlParams.propertyType?.[0] || ''
  });

  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  
  const listingType = urlParams.listingType || (type === 'rentals' ? 'rental' : 'sale');
  const pageTitle = type === 'rentals' ? 'LUXURY RENTALS' : 'LUXURY SALES';
  const pageSubtitle = type === 'rentals' 
    ? 'Discover exceptional rental properties in West London\'s most prestigious neighborhoods'
    : 'Discover exceptional properties for sale in West London\'s most prestigious neighborhoods';


  // Natural language search handler
  const handleNaturalLanguageSearch = async () => {
    if (!naturalLanguageQuery.trim()) return;

    try {
      const response = await fetch('/api/properties/natural-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: naturalLanguageQuery,
          listingType: listingType
        }),
      });

      if (response.ok) {
        const searchResults = await response.json();
        // The results will be displayed through the existing properties grid
      }
    } catch (error) {
      console.error('Natural language search error:', error);
    }
  };

  // Fetch properties
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['/api/properties', listingType, naturalLanguageQuery],
    queryFn: async () => {
      if (naturalLanguageQuery.trim()) {
        const response = await fetch('/api/properties/natural-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: naturalLanguageQuery,
            listingType: listingType
          }),
        });

        if (response.ok) {
          return response.json();
        }
      }

      const response = await fetch(`/api/properties?listingType=${listingType}`);
      return response.json();
    }
  });


  const formatPrice = (price: number) => {
    if (listingType === 'rental') {
      return `£${price.toLocaleString()} pcm`;
    }
    return `£${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <img 
            src={heroLogo} 
            alt="Catwalk Eyewear" 
            className="h-16 md:h-20 mx-auto mb-6 object-contain"
          />
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-none mb-4">
            {pageTitle}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-6">
            {pageSubtitle}
          </p>
          <Link href="/">
            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 mx-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </section>

      {/* Natural Language Search Section */}
      <section className="bg-gray-50 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Property Search</h3>
              <p className="text-gray-600 text-sm">
                Describe what you're looking for in natural language, e.g., "3 bedroom house under £800k in Maida Vale" or "luxury flat with garden near Queen's Park"
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Describe your ideal property..."
                value={naturalLanguageQuery}
                onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
              />
              <button
                onClick={handleNaturalLanguageSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-lg"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <select 
                value={filters.propertyType}
                onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              >
                <option value="">All Property Types</option>
                <option value="flat">Flat</option>
                <option value="house">House</option>
                <option value="penthouse">Penthouse</option>
                <option value="maisonette">Maisonette</option>
              </select>
              
              <select 
                value={filters.bedrooms}
                onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
              
              <input
                type="text"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 w-32"
              />
              
              <input
                type="text"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 w-32"
              />
              
              <Button 
                onClick={() => {
                  // Trigger refetch with current filters
                  window.location.reload();
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Apply Filters
              </Button>
            </div>
            
            <div className="text-gray-600">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-96"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property: Property) => (
                <Link 
                  key={property.id}
                  href={`/property/${property.id}`}
                  className="property-card group block"
                >
                  <div className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl">
                    {/* Property Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={property.images?.[0] || '/api/placeholder/400/300'}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {property.propertyType.toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="bg-black/80 text-white px-3 py-1 rounded-full text-lg font-bold">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Property Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{property.addressLine1}, {property.postcode}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-700 mb-4">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{property.bathrooms}</span>
                        </div>
                        {property.squareFootage && (
                          <div className="flex items-center">
                            <Maximize className="h-4 w-4 mr-1" />
                            <span>{property.squareFootage}ft²</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {property.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {property.features?.slice(0, 2).map((feature, index) => (
                            <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                              {feature.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                        
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {!isLoading && properties.length === 0 && (
            <div className="text-center py-16">
              <Home className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No properties found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your filters or check back later for new listings.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}