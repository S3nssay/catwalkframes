import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Home, 
  MapPin,
  Bed,
  Bath,
  Maximize,
  Search,
  ChevronDown,
  ArrowRight,
  Star,
  Calendar,
  Key
} from 'lucide-react';
import { Link } from 'wouter';
import NaturalLanguageSearch from '@/components/NaturalLanguageSearch';
import heroLogo from "@/assets/catwalk-frames-logo.png";

gsap.registerPlugin(ScrollTrigger);

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
  status: string;
  furnished?: string;
  availableFrom?: string;
  minimumTenancy?: number;
}

export default function RentalsPage() {
  const [searchForm, setSearchForm] = useState({
    location: '',
    propertyType: '',
    minBeds: '',
    maxPrice: '',
    furnished: ''
  });

  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch featured properties
  const { data: featuredProperties = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/properties', 'featured', 'rental'],
    queryFn: async () => {
      const response = await fetch('/api/properties?listingType=rental&featured=true&limit=6');
      return response.json();
    }
  });

  // Fetch all rental properties
  const { data: allProperties = [], isLoading: allLoading } = useQuery({
    queryKey: ['/api/properties', 'rental', searchForm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('listingType', 'rental');
      if (searchForm.location) params.set('location', searchForm.location);
      if (searchForm.propertyType) params.set('propertyType', searchForm.propertyType);
      if (searchForm.minBeds) params.set('minBedrooms', searchForm.minBeds);
      if (searchForm.maxPrice) params.set('maxPrice', searchForm.maxPrice);
      if (searchForm.furnished) params.set('furnished', searchForm.furnished);
      
      const response = await fetch(`/api/properties?${params.toString()}`);
      return response.json();
    }
  });

  // GSAP Animations
  useEffect(() => {
    // Hero animation removed

    // Featured properties animation
    gsap.fromTo('.featured-card', {
      opacity: 0,
      y: 100,
      scale: 0.9
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      stagger: 0.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: featuredRef.current,
        start: "top 80%"
      }
    });

    // Property cards animation
    gsap.fromTo('.property-card', {
      opacity: 0,
      y: 80
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.properties-grid',
        start: "top 80%"
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [featuredProperties, allProperties]);

  const formatPrice = (price: number) => {
    return `£${price.toLocaleString()} pcm`;
  };

  const handleSearch = () => {
    // Search is handled by the query refetch
  };

  const handleNaturalLanguageSearch = async (query: string) => {
    try {
      // Send natural language query to backend for parsing
      const response = await fetch('/api/search/natural-language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, listingType: 'rental' })
      });

      if (response.ok) {
        const searchCriteria = await response.json();
        // Update the search form with parsed criteria
        setSearchForm({
          location: searchCriteria.location || '',
          propertyType: searchCriteria.propertyType || '',
          minBeds: searchCriteria.bedrooms || '',
          maxPrice: searchCriteria.maxPrice || ''
        });
      }
    } catch (error) {
      console.error('Natural language search failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pb-16" style={{ backgroundColor: '#791E75' }}>
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-slate-300/20 to-slate-500/10 rounded-full blur-sm animate-float-slow"></div>
          <div className="absolute bottom-20 right-32 w-48 h-48 bg-gradient-to-br from-slate-400/15 to-slate-600/5 rounded-3xl rotate-45 blur-sm animate-float-reverse"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <div className="mb-6">
            <img 
              src={heroLogo} 
              alt="Catwalk Eyewear" 
              className="max-w-xl w-full h-auto mx-auto mb-4"
            />
            <h1 className="text-4xl md:text-5xl font-black leading-none mb-6 text-white">
              RENTALS
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-8">
            Discover exceptional rental properties in West London's most prestigious neighborhoods
          </p>
          
          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Link href="/">
              <Button className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-xl">
                <Home className="mr-2 h-5 w-5" />
                HOME
              </Button>
            </Link>
            <Link href="/sales">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
                <Key className="mr-2 h-5 w-5" />
                SALES
              </Button>
            </Link>
          </div>
          
          {/* Advanced Search Bar */}
          <div ref={searchRef} className="bg-white/90 backdrop-blur-md rounded-2xl p-6 max-w-5xl mx-auto border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-1">
                <input
                  type="text"
                  placeholder="Enter Postcode or Town Name"
                  value={searchForm.location}
                  onChange={(e) => setSearchForm({...searchForm, location: e.target.value})}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              
              <div className="relative">
                <select
                  value={searchForm.propertyType}
                  onChange={(e) => setSearchForm({...searchForm, propertyType: e.target.value})}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="">Property Type</option>
                  <option value="flat">Flat</option>
                  <option value="house">House</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="maisonette">Maisonette</option>
                  <option value="studio">Studio</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={searchForm.minBeds}
                  onChange={(e) => setSearchForm({...searchForm, minBeds: e.target.value})}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="">Min Beds</option>
                  <option value="0">Studio</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={searchForm.maxPrice}
                  onChange={(e) => setSearchForm({...searchForm, maxPrice: e.target.value})}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="">Max Price</option>
                  <option value="1500">£1,500 pcm</option>
                  <option value="2500">£2,500 pcm</option>
                  <option value="4000">£4,000 pcm</option>
                  <option value="6000">£6,000 pcm</option>
                  <option value="10000">£10,000 pcm</option>
                  <option value="20000">£20,000+ pcm</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={searchForm.furnished}
                  onChange={(e) => setSearchForm({...searchForm, furnished: e.target.value})}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="">Furnished</option>
                  <option value="furnished">Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                  <option value="part_furnished">Part Furnished</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
              
              <Button 
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Natural Language Search */}
          <div className="mt-6 max-w-5xl mx-auto">
            <NaturalLanguageSearch
              onSearch={handleNaturalLanguageSearch}
              type="rentals"
              placeholder="Tell our AI what you're looking for... e.g., 'Find me a 2-bedroom flat in Notting Hill under £3000'"
            />
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section ref={featuredRef} className="py-20 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-center mb-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-800">FEATURED PROPERTIES</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked exceptional rental properties representing the finest in London luxury living
            </p>
          </div>

          {featuredLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property: Property) => (
                <Link 
                  key={property.id}
                  href={`/property/${property.id}`}
                  className="featured-card group block"
                >
                  <div className="bg-white backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-slate-50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-slate-200 shadow-sm h-full flex flex-col">
                    {/* Property Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={property.images?.[0] || '/api/placeholder/400/300'}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          FEATURED
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="bg-slate-800/90 text-white px-3 py-2 rounded-full text-lg font-bold">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Property Details */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300 text-gray-900">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{property.addressLine1}, {property.postcode}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-700 mb-4">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.bedrooms === 0 ? 'Studio' : property.bedrooms}</span>
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
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                        {property.description}
                      </p>
                      
                      <Button className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 rounded-lg relative overflow-hidden group mt-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <span className="relative z-10">View Details</span>
                        <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Properties Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-800">ALL PROPERTIES FOR RENT</h2>
              <p className="text-gray-600">
                {allProperties.length} {allProperties.length === 1 ? 'property' : 'properties'} available
              </p>
            </div>
            <div className="flex items-center text-blue-600">
              <Key className="h-5 w-5 mr-2" />
              <span className="font-medium">Move in ready</span>
            </div>
          </div>

          {allLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="properties-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProperties.map((property: Property) => (
                <Link 
                  key={property.id}
                  href={`/property/${property.id}`}
                  className="property-card group block"
                >
                  <div className="bg-white backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-slate-100 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-slate-200 shadow-sm h-full flex flex-col">
                    {/* Property Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={property.images?.[0] || '/api/placeholder/400/300'}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-slate-600 text-white px-3 py-1 rounded-full text-sm font-bold">
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
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300 text-gray-900">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{property.addressLine1}, {property.postcode}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-700 mb-4">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.bedrooms === 0 ? 'Studio' : property.bedrooms}</span>
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
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                        {property.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-wrap gap-2">
                          {property.features?.slice(0, 2).map((feature, index) => (
                            <span key={index} className="bg-slate-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {feature.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                        
                        <Button className="bg-slate-700 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          <span className="relative z-10">View Details</span>
                          <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {!allLoading && allProperties.length === 0 && (
            <div className="text-center py-16">
              <Home className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-gray-900">No properties found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your search criteria or check back later for new listings.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-slate-700 to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            Ready to Let Your Property?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get a free, no-obligation rental valuation from London's luxury property experts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/valuation">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-105">
                Get Free Valuation
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300">
                Speak to an Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}