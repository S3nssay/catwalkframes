import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  Star,
  Camera,
  ChevronLeft,
  ChevronRight,
  Share,
  Heart
} from 'lucide-react';
import { Link, useParams } from 'wouter';

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
  receptions?: number;
  squareFootage?: number;
  addressLine1: string;
  addressLine2?: string;
  postcode: string;
  images: string[];
  features: string[];
  amenities: string[];
  tenure: string;
  councilTaxBand?: string;
  energyRating?: string;
  yearBuilt?: number;
  areaName?: string;
  rentPeriod?: string;
  furnished?: string;
  deposit?: number;
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroRef = useRef(null);
  const detailsRef = useRef(null);
  const galleryRef = useRef(null);
  const featuresRef = useRef(null);
  const contactRef = useRef(null);
  const imageRefs = useRef<HTMLDivElement[]>([]);

  // Fetch property
  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ['/api/properties', id],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${id}`);
      if (!response.ok) throw new Error('Property not found');
      return response.json();
    }
  });

  // GSAP Parallax Animations
  useEffect(() => {
    if (!property) return;

    // Hero parallax effect
    gsap.to(heroRef.current, {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Property details dramatic entrance
    gsap.fromTo(detailsRef.current, {
      y: 100,
      opacity: 0,
      rotationX: 15
    }, {
      y: 0,
      opacity: 1,
      rotationX: 0,
      duration: 1.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: detailsRef.current,
        start: "top 80%"
      }
    });

    // Gallery images parallax
    imageRefs.current.forEach((img, index) => {
      if (img) {
        gsap.fromTo(img, {
          y: 50 * (index % 2 === 0 ? 1 : -1),
          opacity: 0,
          scale: 0.9
        }, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: img,
            start: "top 85%"
          }
        });

        // Continuous parallax scroll
        gsap.to(img, {
          y: index % 2 === 0 ? -30 : 30,
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      }
    });

    // Features cards animation
    gsap.fromTo('.feature-card', {
      y: 60,
      opacity: 0,
      rotationY: 15
    }, {
      y: 0,
      opacity: 1,
      rotationY: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top 75%"
      }
    });

    // Contact section parallax
    gsap.fromTo(contactRef.current, {
      y: 100,
      opacity: 0,
      scale: 0.95
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: contactRef.current,
        start: "top 80%"
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [property]);

  const formatPrice = (price: number) => {
    if (property?.listingType === 'rental') {
      return `£${price.toLocaleString()} pcm`;
    }
    return `£${price.toLocaleString()}`;
  };

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F8B324] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Property Not Found</h1>
          <p className="text-white/60 mb-8">The property you're looking for doesn't exist.</p>
          <Link href="/sales">
            <Button className="bg-[#F8B324] text-black font-bold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Hero Image with Parallax */}
      <section className="relative h-screen overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 -top-20">
          <img 
            src={property.images?.[currentImageIndex] || '/api/placeholder/1200/800'}
            alt={property.title}
            className="w-full h-[120%] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>
        
        {/* Back Button */}
        <div className="absolute top-8 left-8 z-20">
          <Link href={`/${property.listingType === 'rental' ? 'rentals' : 'sales'}`}>
            <Button className="bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listings
            </Button>
          </Link>
        </div>

        {/* Image Navigation */}
        {property.images && property.images.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-8">
            <Button onClick={prevImage} className="bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-sm">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button onClick={nextImage} className="bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-sm">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Property Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold">
                {property.propertyType.toUpperCase()}
              </span>
              <span className="text-2xl font-black text-blue-400">
                {formatPrice(property.price)}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              {property.title}
            </h1>
            
            <div className="flex items-center text-white/80 text-lg">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{property.addressLine1}, {property.postcode}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section ref={detailsRef} className="py-16 px-6 bg-gradient-to-br from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Main Details */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                  <Bed className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-slate-800">{property.bedrooms}</div>
                  <div className="text-gray-600">Bedrooms</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                  <Bath className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-slate-800">{property.bathrooms}</div>
                  <div className="text-gray-600">Bathrooms</div>
                </div>
                {property.receptions && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                    <Star className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-slate-800">{property.receptions}</div>
                    <div className="text-gray-600">Receptions</div>
                  </div>
                )}
                {property.squareFootage && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                    <Maximize className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-slate-800">{property.squareFootage}</div>
                    <div className="text-gray-600">Sq Ft</div>
                  </div>
                )}
              </div>
              
              <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 shadow-sm">
                <h2 className="text-3xl font-bold mb-6 text-slate-800">Property Description</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div ref={contactRef} className="space-y-6">
              <div className="bg-slate-700 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-white">Contact Catwalk Frames</h3>
                
                <div className="space-y-4 mb-6">
                  <a href="https://wa.me/442077240000?text=Hi%20Catwalk%20Frames%2C%20I'm%20interested%20in%20this%20property." 
                     className="block">
                    <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4">
                      <MessageCircle className="mr-3 h-5 w-5" />
                      WhatsApp Inquiry
                    </Button>
                  </a>
                  
                  <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-4">
                    <Phone className="mr-3 h-5 w-5" />
                    020 7724 0000
                  </Button>
                  
                  <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-4">
                    <Mail className="mr-3 h-5 w-5" />
                    Email Inquiry
                  </Button>
                </div>
                
                <div className="text-center text-white/90 text-sm">
                  Available for viewings 7 days a week
                </div>
              </div>
              
              {/* Property Details */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-bold mb-4 text-slate-800">Property Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tenure:</span>
                    <span className="capitalize text-slate-800">{property.tenure}</span>
                  </div>
                  {property.councilTaxBand && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Council Tax:</span>
                      <span className="text-slate-800">Band {property.councilTaxBand}</span>
                    </div>
                  )}
                  {property.energyRating && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">EPC Rating:</span>
                      <span className="text-slate-800">{property.energyRating}</span>
                    </div>
                  )}
                  {property.yearBuilt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year Built:</span>
                      <span className="text-slate-800">{property.yearBuilt}</span>
                    </div>
                  )}
                  {property.furnished && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Furnished:</span>
                      <span className="capitalize text-slate-800">{property.furnished.replace('_', ' ')}</span>
                    </div>
                  )}
                  {property.deposit && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deposit:</span>
                      <span className="text-slate-800">£{property.deposit.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Amenities */}
      <section ref={featuresRef} className="py-16 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">Features & Amenities</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Property Features</h3>
              <div className="grid grid-cols-2 gap-4">
                {property.features?.map((feature, index) => (
                  <div key={index} className="feature-card bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm">
                    <span className="text-gray-700 capitalize">{feature.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Local Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities?.map((amenity, index) => (
                  <div key={index} className="feature-card bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm">
                    <span className="text-gray-700 capitalize">{amenity.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery with Parallax */}
      <section ref={galleryRef} className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">Property Gallery</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {property.images?.map((image, index) => (
              <div 
                key={index}
                ref={(el) => { if (el) imageRefs.current[index] = el; }}
                className="relative group overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
                onClick={() => setCurrentImageIndex(index)}
              >
                <img 
                  src={image}
                  alt={`Property view ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}