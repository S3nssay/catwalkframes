import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Building2, 
  MapPin,
  Maximize,
  Search,
  ChevronDown,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  PoundSterling
} from 'lucide-react';
import { Link } from 'wouter';
import NaturalLanguageSearch from '@/components/NaturalLanguageSearch';
import heroLogo from "@/assets/catwalk-frames-logo.png";

gsap.registerPlugin(ScrollTrigger);

interface CommercialProperty {
  id: number;
  listingType: string;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  squareFootage?: number;
  addressLine1: string;
  postcode: string;
  images: string[];
  features: string[];
  areaName?: string;
  status: string;
  businessType?: string;
  leaseLength?: number;
  serviceCharge?: number;
}

export default function CommercialPage() {
  const [searchForm, setSearchForm] = useState({
    location: '',
    propertyType: '',
    minSize: '',
    maxPrice: '',
    businessType: ''
  });

  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch featured commercial properties
  const { data: featuredProperties = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/properties', 'featured', 'commercial'],
    queryFn: async () => {
      const response = await fetch('/api/properties?listingType=commercial&featured=true&limit=6');
      return response.json();
    }
  });

  // Fetch all commercial properties
  const { data: allProperties = [], isLoading: allLoading } = useQuery({
    queryKey: ['/api/properties', 'commercial', searchForm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('listingType', 'commercial');
      if (searchForm.location) params.set('location', searchForm.location);
      if (searchForm.propertyType) params.set('propertyType', searchForm.propertyType);
      if (searchForm.minSize) params.set('minSize', searchForm.minSize);
      if (searchForm.maxPrice) params.set('maxPrice', searchForm.maxPrice);
      if (searchForm.businessType) params.set('businessType', searchForm.businessType);
      
      const response = await fetch(`/api/properties?${params.toString()}`);
      return response.json();
    }
  });

  // GSAP Animations
  useEffect(() => {
    // Hero animation
    gsap.fromTo(heroRef.current, {
      opacity: 0,
      y: 50
    }, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power4.out"
    });

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

  const formatPrice = (price: number, isRental?: boolean) => {
    if (isRental) {
      return `£${price.toLocaleString()} pcm`;
    }
    return `£${price.toLocaleString()}`;
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
        body: JSON.stringify({ query, listingType: 'commercial' })
      });

      if (response.ok) {
        const searchCriteria = await response.json();
        // Update the search form with parsed criteria
        setSearchForm({
          location: searchCriteria.location || '',
          propertyType: searchCriteria.propertyType || '',
          minSize: searchCriteria.minSize || '',
          maxPrice: searchCriteria.maxPrice || '',
          businessType: searchCriteria.businessType || ''
        });
      }
    } catch (error) {
      console.error('Natural language search failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[70vh] flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#791E75' }}>
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-purple-600/10 rounded-full blur-sm animate-float-slow"></div>
          <div className="absolute bottom-20 right-32 w-48 h-48 bg-gradient-to-br from-purple-500/15 to-purple-700/5 rounded-3xl rotate-45 blur-sm animate-float-reverse"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <div className="mb-6">
            <img 
              src={heroLogo} 
              alt="Catwalk Frames Estate & Management" 
              className="max-w-xl w-full h-auto mx-auto mb-4"
            />
            <h1 className="text-5xl md:text-7xl font-black leading-none mb-6 text-white">
              COMMERCIAL
              <span className="block text-white">PROPERTIES</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-12">
            Prime commercial spaces in London's most dynamic business districts
          </p>
          
          {/* Advanced Search Bar */}
          <div ref={searchRef} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-1">
                <input
                  type="text"
                  placeholder="Enter Postcode or Area"
                  value={searchForm.location}
                  onChange={(e) => setSearchForm({...searchForm, location: e.target.value})}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#F8B324]"
                />
              </div>
              
              <div className="relative">
                <select
                  value={searchForm.propertyType}
                  onChange={(e) => setSearchForm({...searchForm, propertyType: e.target.value})}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#F8B324]"
                >
                  <option value="">Property Type</option>
                  <option value="office">Office</option>
                  <option value="retail">Retail</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="industrial">Industrial</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="mixed_use">Mixed Use</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={searchForm.minSize}
                  onChange={(e) => setSearchForm({...searchForm, minSize: e.target.value})}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#F8B324]"
                >
                  <option value="">Min Size</option>
                  <option value="500">500+ sq ft</option>
                  <option value="1000">1,000+ sq ft</option>
                  <option value="2500">2,500+ sq ft</option>
                  <option value="5000">5,000+ sq ft</option>
                  <option value="10000">10,000+ sq ft</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={searchForm.maxPrice}
                  onChange={(e) => setSearchForm({...searchForm, maxPrice: e.target.value})}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#F8B324]"
                >
                  <option value="">Max Price</option>
                  <option value="2000">£2,000 pcm</option>
                  <option value="5000">£5,000 pcm</option>
                  <option value="10000">£10,000 pcm</option>
                  <option value="25000">£25,000 pcm</option>
                  <option value="50000">£50,000+ pcm</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={searchForm.businessType}
                  onChange={(e) => setSearchForm({...searchForm, businessType: e.target.value})}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#F8B324]"
                >
                  <option value="">Business Type</option>
                  <option value="professional_services">Professional Services</option>
                  <option value="creative_industries">Creative Industries</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="hospitality">Hospitality</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none" />
              </div>
              
              <Button
                onClick={handleSearch}
                className="bg-[#F8B324] hover:bg-[#D8809D] text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
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
              type="commercial"
              placeholder="Tell our AI what you're looking for... e.g., 'Show me office spaces near Paddington station'"
            />
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section ref={featuredRef} className="py-20 px-6 bg-gradient-to-b from-black to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-[#F8B324] mr-3" />
              <h2 className="text-4xl md:text-5xl font-black">PREMIUM COMMERCIAL SPACES</h2>
              <Star className="h-8 w-8 text-[#F8B324] ml-3" />
            </div>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Strategically located commercial properties for forward-thinking businesses
            </p>
          </div>

          {featuredLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property: CommercialProperty) => (
                <Link 
                  key={property.id}
                  href={`/property/${property.id}`}
                  className="featured-card group block"
                >
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:from-white/15 hover:to-white/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-[#F8B324]/20">
                    {/* Property Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={property.images?.[0] || '/api/placeholder/400/300'}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#F8B324] text-black px-3 py-1 rounded-full text-sm font-bold flex items-center">
                          <Building2 className="h-3 w-3 mr-1" />
                          FEATURED
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="bg-black/80 text-white px-3 py-2 rounded-full text-lg font-bold">
                          {formatPrice(property.price, property.listingType === 'rental')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Property Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[#F8B324] transition-colors duration-300">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center text-white/60 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{property.addressLine1}, {property.postcode}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-white/80 mb-4">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span>{property.propertyType?.replace('_', ' ')}</span>
                        </div>
                        {property.squareFootage && (
                          <div className="flex items-center">
                            <Maximize className="h-4 w-4 mr-1" />
                            <span>{property.squareFootage.toLocaleString()} sq ft</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-white/60 text-sm mb-4 line-clamp-2">
                        {property.description}
                      </p>
                      
                      <Button className="w-full bg-gradient-to-r from-[#F8B324] to-[#D8809D] hover:from-[#D8809D] hover:to-[#791E75] text-black font-bold py-2 rounded-lg group-hover:scale-105 transition-all duration-300">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
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
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">ALL COMMERCIAL PROPERTIES</h2>
              <p className="text-white/60">
                {allProperties.length} commercial {allProperties.length === 1 ? 'space' : 'spaces'} available
              </p>
            </div>
            <div className="flex items-center text-[#F8B324]">
              <TrendingUp className="h-5 w-5 mr-2" />
              <span className="font-medium">Prime locations available</span>
            </div>
          </div>

          {allLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="properties-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProperties.map((property: CommercialProperty) => (
                <Link 
                  key={property.id}
                  href={`/property/${property.id}`}
                  className="property-card group block"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    {/* Property Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={property.images?.[0] || '/api/placeholder/400/300'}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#791E75] text-white px-3 py-1 rounded-full text-sm font-bold">
                          {property.propertyType?.toUpperCase().replace('_', ' ')}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="bg-black/80 text-white px-3 py-1 rounded-full text-lg font-bold">
                          {formatPrice(property.price, property.listingType === 'rental')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Property Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[#F8B324] transition-colors duration-300">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center text-white/60 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{property.addressLine1}, {property.postcode}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-white/80 mb-4">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span>{property.propertyType?.replace('_', ' ')}</span>
                        </div>
                        {property.squareFootage && (
                          <div className="flex items-center">
                            <Maximize className="h-4 w-4 mr-1" />
                            <span>{property.squareFootage.toLocaleString()} sq ft</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-white/60 text-sm mb-4 line-clamp-2">
                        {property.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {property.features?.slice(0, 2).map((feature, index) => (
                            <span key={index} className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs">
                              {feature.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                        
                        <Button className="bg-gradient-to-r from-[#F8B324] to-[#D8809D] hover:from-[#D8809D] hover:to-[#791E75] text-black font-bold px-4 py-2 rounded-lg group-hover:scale-105 transition-all duration-300">
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
          
          {!allLoading && allProperties.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 text-white/40 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">No commercial properties found</h3>
              <p className="text-white/60 max-w-md mx-auto">
                Try adjusting your search criteria or check back later for new listings.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Business Services Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6">COMMERCIAL SERVICES</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Comprehensive commercial property solutions for growing businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <Users className="h-12 w-12 text-[#F8B324] mb-6" />
              <h3 className="text-xl font-bold mb-4">Tenant Representation</h3>
              <p className="text-white/70 mb-6">Expert guidance in finding the perfect commercial space for your business needs.</p>
              <Button className="bg-gradient-to-r from-[#F8B324] to-[#D8809D] text-black font-bold">
                Learn More
              </Button>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <Building2 className="h-12 w-12 text-[#F8B324] mb-6" />
              <h3 className="text-xl font-bold mb-4">Investment Sales</h3>
              <p className="text-white/70 mb-6">Strategic advice for commercial property investment and portfolio management.</p>
              <Button className="bg-gradient-to-r from-[#F8B324] to-[#D8809D] text-black font-bold">
                Learn More
              </Button>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <PoundSterling className="h-12 w-12 text-[#F8B324] mb-6" />
              <h3 className="text-xl font-bold mb-4">Property Valuation</h3>
              <p className="text-white/70 mb-6">Professional commercial property valuations for lending, taxation, and investment purposes.</p>
              <Button className="bg-gradient-to-r from-[#F8B324] to-[#D8809D] text-black font-bold">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#791E75] to-[#8B4A9C]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            Need Commercial Property Advice?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Our commercial property experts are ready to help your business find the perfect space
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-[#F8B324] hover:bg-white text-black font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-105">
                Speak to an Expert
              </Button>
            </Link>
            <Link href="/valuation">
              <Button className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300">
                Get Property Valuation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}