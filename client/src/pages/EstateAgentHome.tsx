import { useState, useRef, useEffect, ComponentProps, ReactNode, isValidElement, cloneElement } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, MapPin, Phone, MessageCircle, Home, Building, Users, ArrowRight, ExternalLink, ArrowUp, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'wouter';
import ContactSection from '@/components/ContactSection';
import { PropertyChatInterface } from '@/components/PropertyChatInterface';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logoWhite from '@/assets/catwalk-frames-full-logo-unstacked.png';
import heroVideo from '@/assets/catwalk-frames-hero.mp4';
import heroLogo from '@/assets/catwalk-frames-hero-logo.png';
import teamAslam from '@/assets/generated_images/Aslam_Noor_professional_headshot_15403d62.png';
import teamIury from '@/assets/generated_images/Iury_Campos_professional_headshot_dc928d52.png';
import teamMayssaa from '@/assets/generated_images/Mayssaa_Sabrah_professional_headshot_f6227228.png';
import lettingsTeam from '@/assets/generated_images/Lettings_team_group_photo_f04de92e.png';
import salesLeftImage from '@/assets/sales-left-rectangle.png';
import salesRightImage from '@/assets/sales-right-image.png';
import rentalsLeftImage from '@/assets/rentals-left-image.jpg';
import rentalsRightImage from '@/assets/rentals-right-image.png';
import commercialLeftImage from '@/assets/commercial-left-image.jpeg';
import commercialRightImage from '@/assets/commercial-right-image.webp';

gsap.registerPlugin(ScrollTrigger);

const EstateAgentHome = () => {
  // BackToTopArrow Component
  const BackToTopArrow = () => (
    <div className="fixed right-8 top-1/2 -translate-y-[200px] z-[80] opacity-60 hover:opacity-100 transition-opacity duration-300">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="bg-[#8B4A9C] hover:bg-[#7A4289] text-white p-4 rounded-full shadow-lg transition-colors duration-300 group border-2 border-[#8B4A9C]/30"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-6 w-6 text-white group-hover:text-white transition-colors duration-300" />
      </button>
    </div>
  );

  // Social Media Buttons Component
  const SocialMediaButtons = () => (
    <div className="fixed top-4 right-4 md:top-8 md:right-8 z-[80]">
      <div className="flex gap-2 md:gap-3">
        {/* Facebook */}
        <a
          href="https://facebook.com/catwalkframesestates"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
          aria-label="Follow us on Facebook"
        >
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-semibold bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
            Facebook
          </div>
          <div className="w-11 h-11 md:w-10 md:h-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 group">
            <Facebook className="w-5 h-5 md:w-5 md:h-5 text-white/80 group-hover:text-white" />
          </div>
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com/catwalkframesestates"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
          aria-label="Follow us on Instagram"
        >
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-semibold bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
            Instagram
          </div>
          <div className="w-11 h-11 md:w-10 md:h-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#D4A04F] hover:to-[#B8903E] hover:border-transparent transition-all duration-300 group">
            <Instagram className="w-5 h-5 md:w-5 md:h-5 text-white/80 group-hover:text-white" />
          </div>
        </a>

        {/* Twitter */}
        <a
          href="https://twitter.com/catwalkframesestates"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
          aria-label="Follow us on Twitter"
        >
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-semibold bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
            Twitter
          </div>
          <div className="w-11 h-11 md:w-10 md:h-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-blue-400 hover:border-blue-400 transition-all duration-300 group">
            <Twitter className="w-5 h-5 md:w-5 md:h-5 text-white/80 group-hover:text-white" />
          </div>
        </a>
      </div>
    </div>
  );

  
  // Section refs
  const heroRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const bridgeBackgroundRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  
  // Animation refs
  const catwalkFramesTextRef = useRef<HTMLDivElement>(null);
  const salesLeftImageRef = useRef<HTMLDivElement>(null);
  const salesRightImageRef = useRef<HTMLDivElement>(null);
  const section3PreviewRef = useRef<HTMLDivElement>(null);
  
  // Enhanced carousel system
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselAnimationRef = useRef<number>();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // Carousel interaction state
  const carouselStateRef = useRef({
    isPerpetualScrolling: true,
    isUserInteracting: false,
    hoverDirection: null as 'left' | 'right' | null,
    lastScrollPosition: 0
  });
  const rentalsLeftImageRef = useRef<HTMLDivElement>(null);
  const rentalsRightImageRef = useRef<HTMLDivElement>(null);
  const commercialLeftImageRef = useRef<HTMLDivElement>(null);
  const commercialRightImageRef = useRef<HTMLDivElement>(null);
  
  // Center title overlay refs for slower parallax
  const salesTitleRef = useRef<HTMLDivElement>(null);
  const rentalsTitleRef = useRef<HTMLDivElement>(null);
  const commercialTitleRef = useRef<HTMLDivElement>(null);

  // History section refs for scroll lock functionality
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const [isHorizontalScrollComplete, setIsHorizontalScrollComplete] = useState(false);

  // Team animation refs
  const teamTitleRef = useRef<HTMLDivElement>(null);
  const teamContainerRef = useRef<HTMLDivElement>(null);

  // Section navigation state and functions
  const sections = ['hero', 'history', 'sales', 'rentals', 'commercial', 'team', 'contact'];
  const [currentSection, setCurrentSection] = useState(0);

  // Enhanced animation state management system
  const animationStatesRef = useRef({
    history: { state: 'reset', lastProgress: -1 },
    sales: { state: 'reset', lastProgress: -1 },
    rentals: { state: 'reset', lastProgress: -1 },
    commercial: { state: 'reset', lastProgress: -1 },
    team: { state: 'reset', lastProgress: -1 },
  });

  // Animation state machine: 'reset' -> 'entering' -> 'animating' -> 'completed' -> 'reset'
  const updateAnimationState = (section: string, newState: string, progress: number) => {
    const current = animationStatesRef.current[section as keyof typeof animationStatesRef.current];
    if (current) {
      current.state = newState;
      current.lastProgress = progress;
    }
  };

  const shouldTriggerAnimation = (section: string, progress: number, threshold: number) => {
    const current = animationStatesRef.current[section as keyof typeof animationStatesRef.current];
    return current && progress >= threshold && current.state === 'reset';
  };

  const shouldResetAnimation = (section: string, progress: number, minRange: number, maxRange: number) => {
    const current = animationStatesRef.current[section as keyof typeof animationStatesRef.current];
    if (!current) return false;
    
    // Reset if we re-enter the section or if we were completed and moved significantly
    const wasCompleted = current.state === 'completed';
    const hasMovedSignificantly = Math.abs(progress - current.lastProgress) > 0.3;
    const isInRange = progress >= minRange && progress <= maxRange;
    
    return isInRange && (wasCompleted && hasMovedSignificantly);
  };

  const resetSectionStates = () => {
    // Reset all animation states
    Object.keys(animationStatesRef.current).forEach(section => {
      const state = animationStatesRef.current[section as keyof typeof animationStatesRef.current];
      if (state) {
        state.state = 'reset';
        state.lastProgress = -1;
      }
    });

    // Heritage section simplified - no layer animations needed

    if (salesLeftImageRef.current && salesRightImageRef.current && salesTitleRef.current) {
      gsap.set(salesLeftImageRef.current, { opacity: 0, x: "-100%" });
      gsap.set(salesRightImageRef.current, { opacity: 0, x: "100%" });
      gsap.set(salesTitleRef.current, { opacity: 0 });
    }

    if (rentalsLeftImageRef.current && rentalsRightImageRef.current && rentalsTitleRef.current) {
      gsap.set(rentalsLeftImageRef.current, { opacity: 0, x: "-100%" });
      gsap.set(rentalsRightImageRef.current, { opacity: 0, x: "100%" });
      gsap.set(rentalsTitleRef.current, { opacity: 0 });
    }

    if (commercialLeftImageRef.current && commercialRightImageRef.current && commercialTitleRef.current) {
      gsap.set(commercialLeftImageRef.current, { opacity: 0, x: "-100%" });
      gsap.set(commercialRightImageRef.current, { opacity: 0, x: "100%" });
      gsap.set(commercialTitleRef.current, { opacity: 0 });
    }

    if (teamTitleRef.current && teamContainerRef.current) {
      gsap.set(teamTitleRef.current, { opacity: 0 });
      gsap.set(teamContainerRef.current, { opacity: 0 });
      gsap.set(".team-card", { opacity: 0 });
    }
  };

  const navigateToSection = (sectionIndex: number) => {
    if (sectionIndex < 0 || sectionIndex >= sections.length) return;
    
    // Reset all animation states before navigating
    resetSectionStates();
    
    setCurrentSection(sectionIndex);
    
    // Calculate the scroll position to align with our 1000vh spacer system
    // The spacer div starts at 100vh (after hero) and goes to 1100vh total
    // Each section transition should be evenly spaced within this range
    const spacerStart = window.innerHeight; // 100vh where spacer starts
    const spacerHeight = window.innerHeight * 10; // 1000vh total spacer height
    
    // Calculate target position within the spacer range
    // Section 0 (hero) = at top (0vh)
    // Section 1 (history) = early in spacer (~100vh + 100vh)
    // Section 6 (contact) = end of spacer (~1100vh)
    let targetScrollTop = 0;
    
    if (sectionIndex === 0) {
      // Hero section - scroll to top
      targetScrollTop = 0;
    } else {
      // Other sections - position within spacer range
      // Distribute sections evenly across the spacer height
      const scrollProgress = (sectionIndex - 1) / (sections.length - 2); // -2 because hero is at 0 and we have 6 other sections
      targetScrollTop = spacerStart + (scrollProgress * spacerHeight * 0.85); // 0.85 to not go to the very end
    }
    
    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
  };

  // Handle horizontal scroll progress tracking for heritage section
  const handleHorizontalScroll = () => {
    const container = horizontalScrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScrollLeft = scrollWidth - clientWidth;
    const scrollProgress = maxScrollLeft <= 0 ? 1 : scrollLeft / maxScrollLeft;

    // Each panel is 50vw wide, so we have 4 panels total
    // Complete when we've scrolled through at least 3.5 panels (87.5% of total scroll)
    if (scrollProgress >= 0.875 && !isHorizontalScrollComplete) {
      setIsHorizontalScrollComplete(true);
    }

    // Update background text vertical position based on horizontal scroll
    const backgroundText = document.getElementById('scrolling-background-text');
    if (backgroundText) {
      // Map horizontal scroll (0 to 1) to vertical movement (-200px to 300px)
      const verticalOffset = -200 + (scrollProgress * 500);
      backgroundText.style.transform = `translateY(${verticalOffset}px)`;
    }
  };

  // Section Navigation Component
  const SectionNavigation = ({ sectionIndex }: { sectionIndex: number }) => {
    const sectionNames = {
      hero: 'Home',
      history: 'Heritage',
      sales: 'Sales',
      rentals: 'Lettings',
      commercial: 'Commercial',
      team: 'Team',
      contact: 'Contact'
    };

    const canGoUp = sectionIndex > 0;
    const canGoDown = sectionIndex < sections.length - 1;

    return (
      <div className="fixed top-1/2 right-2 md:right-6 z-[80] -translate-y-1/2">
        <div className="flex flex-col items-center gap-2 md:gap-3">
          {/* Up Arrow */}
          {canGoUp && (
            <button
              onClick={() => navigateToSection(sectionIndex - 1)}
              className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white p-2 rounded-full shadow-lg transition-all duration-300 group border-2 border-[#8B4A9C]/30 hover:scale-110"
              aria-label="Go to previous section"
            >
              <ChevronUp className="h-4 w-4 text-white group-hover:text-white transition-colors duration-300" />
            </button>
          )}

          {/* Navigation Dots */}
          <div className="flex flex-col gap-3">
            {sections.map((section, index) => (
              <button
                key={section}
                onClick={() => navigateToSection(index)}
                className={`group relative flex items-center transition-all duration-300 ${
                  index === sectionIndex
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {/* Section dot indicator */}
                <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  index === sectionIndex
                    ? 'bg-white border-white shadow-lg shadow-white/30'
                    : 'border-white/50 group-hover:border-white/80'
                }`} />

                {/* Section name tooltip */}
                <div className={`absolute right-5 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium border border-white/20 transition-all duration-300 whitespace-nowrap ${
                  index === sectionIndex
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                }`}>
                  {sectionNames[section as keyof typeof sectionNames]}
                </div>
              </button>
            ))}
          </div>

          {/* Down Arrow */}
          {canGoDown && (
            <button
              onClick={() => navigateToSection(sectionIndex + 1)}
              className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white p-2 rounded-full shadow-lg transition-all duration-300 group border-2 border-[#8B4A9C]/30 hover:scale-110"
              aria-label="Go to next section"
            >
              <ChevronDown className="h-4 w-4 text-white group-hover:text-white transition-colors duration-300" />
            </button>
          )}
        </div>
      </div>
    );
  };

  // Coverage areas data
  const coverageAreas = [
    { name: "Bayswater", postcode: "W2", route: "/areas/bayswater" },
    { name: "Harlesden", postcode: "NW10", route: "/areas/harlesden" },
    { name: "Kensal Green", postcode: "NW10", route: "/areas/kensal-green" },
    { name: "Kensal Rise", postcode: "NW10", route: "/areas/kensal-rise" },
    { name: "Kilburn", postcode: "NW6", route: "/areas/kilburn" },
    { name: "Ladbroke Grove", postcode: "W10", route: "/areas/ladbroke-grove" },
    { name: "Maida Vale", postcode: "W9", route: "/areas/maida-vale" },
    { name: "North Kensington", postcode: "W10", route: "/areas/north-kensington" },
    { name: "Queens Park", postcode: "NW6", route: "/areas/queens-park" },
    { name: "Westbourne Park", postcode: "W10", route: "/areas/westbourne-park" },
    { name: "Willesden", postcode: "NW10", route: "/areas/willesden" }
  ];

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Aslam Noor",
      role: "Director of Lettings & Property Management",
      image: teamAslam,
      whatsapp: "+442077240000",
      description: "Leading our lettings division with over 15 years of experience in central London property management."
    },
    {
      id: 2,
      name: "Iury Campos",
      role: "Associate Partner & General Manager",
      image: teamIury,
      whatsapp: "+442077240000",
      description: "Overseeing operations and client relationships with expertise in both residential sales and commercial ventures."
    },
    {
      id: 3,
      name: "Mayssaa Sabrah",
      role: "Sales & Lettings Negotiator",
      image: teamMayssaa,
      whatsapp: "+442077240000",
      description: "Specializing in client negotiations and property matching services across prime London locations."
    }
  ];

  // Handle carousel arrow clicks with infinite scroll support
  const handleCarouselScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const cardWidth = 128 + 16; // card width + gap
      const scrollWidth = container.scrollWidth;
      const realContentWidth = scrollWidth / 2; // Since content is duplicated
      
      if (direction === 'left') {
        if (container.scrollLeft <= cardWidth) {
          // If near the beginning, jump to end of real content
          container.scrollLeft = realContentWidth - cardWidth;
        } else {
          container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        }
      } else {
        if (container.scrollLeft >= realContentWidth - cardWidth) {
          // If near end of real content, jump to beginning
          container.scrollLeft = 0;
        } else {
          container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }
    }
  };

  // Initialize animations and ScrollTrigger effects
  useEffect(() => {
    // Set initial positions for layered curtain effect
    // Hero starts visible and accessible, all others start below screen
    gsap.set(heroRef.current, { y: 0, visibility: "visible" });
    gsap.set(historyRef.current, { y: "100vh" });
    gsap.set(section2Ref.current, { y: "100vh" });
    gsap.set(section3Ref.current, { y: "100vh" });
    gsap.set(section4Ref.current, { y: "100vh" });
    gsap.set(teamRef.current, { y: "100vh" });
    gsap.set(contactRef.current, { y: "100vh" });
    // Team animations are handled within the curtain roll system

    // Team horizontal scroll will be handled within the curtain roll system

    // Heritage section simplified - no layer elements to hide


    // Set Sales section elements to be HIDDEN initially
    if (salesLeftImageRef.current && salesRightImageRef.current && salesTitleRef.current) {
      gsap.set(salesLeftImageRef.current, { opacity: 0, x: "-100%" });
      gsap.set(salesRightImageRef.current, { opacity: 0, x: "100%" });
      gsap.set(salesTitleRef.current, { opacity: 0 });
    }

    // Set Rentals section elements to be HIDDEN initially
    if (rentalsLeftImageRef.current && rentalsRightImageRef.current && rentalsTitleRef.current) {
      gsap.set(rentalsLeftImageRef.current, { opacity: 0, x: "-100%" });
      gsap.set(rentalsRightImageRef.current, { opacity: 0, x: "100%" });
      gsap.set(rentalsTitleRef.current, { opacity: 0 });
    }

    // Set Commercial section elements to be HIDDEN initially
    if (commercialLeftImageRef.current && commercialRightImageRef.current && commercialTitleRef.current) {
      gsap.set(commercialLeftImageRef.current, { opacity: 0, x: "-100%" });
      gsap.set(commercialRightImageRef.current, { opacity: 0, x: "100%" });
      gsap.set(commercialTitleRef.current, { opacity: 0 });
    }

    // Set Team section elements to be HIDDEN initially
    if (teamTitleRef.current && teamContainerRef.current) {
      gsap.set(teamTitleRef.current, { opacity: 0 });
      gsap.set(teamContainerRef.current, { opacity: 0 });
      gsap.set(".team-card", { opacity: 0 });
    }

    // Individual Section Animations - triggered when each section is fully revealed
    // Using refs so navigation can reset these flags

    // SVG path animation for section dividers
    setTimeout(() => {
      const paths = document.querySelectorAll('path[stroke-dasharray]');
      paths.forEach((p: any) => {
        const len = p.getTotalLength();
        p.style.setProperty('--len', len);
      });
    }, 100);

    // Layered Curtain Roll System - Each section climbs up to cover the previous layer
    
    // Create invisible spacer div to drive scroll
    const spacerDiv = document.createElement('div');
    spacerDiv.style.height = '1400vh'; // Extended for full contact section scroll plus heritage section
    spacerDiv.style.position = 'absolute';
    spacerDiv.style.top = '100vh'; // Start after hero
    spacerDiv.style.width = '1px';
    spacerDiv.style.pointerEvents = 'none';
    spacerDiv.style.opacity = '0';
    document.body.appendChild(spacerDiv);

    // Master scroll trigger that controls all curtain animations
    ScrollTrigger.create({
      trigger: spacerDiv,
      start: "top bottom", 
      end: "bottom top",
      scrub: 1,
      onUpdate: self => {
        const progress = self.progress;
        const totalSections = 14; // Extended for full contact section scroll plus heritage section
        
        // Update current section based on scroll progress
        // Use scrollProgress to determine which section is currently active
        const scrollProgress = progress * totalSections;
        let currentSectionIndex = 0;

        if (scrollProgress >= 0 && scrollProgress < 1.2) {
          currentSectionIndex = 0; // Hero
        } else if (scrollProgress >= 1.2 && scrollProgress < 4) {
          currentSectionIndex = 1; // History
        } else if (scrollProgress >= 4 && scrollProgress < 5.5) {
          currentSectionIndex = 2; // Sales
        } else if (scrollProgress >= 5.5 && scrollProgress < 7) {
          currentSectionIndex = 3; // Rentals
        } else if (scrollProgress >= 7 && scrollProgress < 8.5) {
          currentSectionIndex = 4; // Commercial
        } else if (scrollProgress >= 8.5 && scrollProgress < 10) {
          currentSectionIndex = 5; // Team
        } else if (scrollProgress >= 10) {
          currentSectionIndex = 6; // Contact
        }

        setCurrentSection(currentSectionIndex);
        
        // History section with vertical-to-horizontal scroll conversion
        if (scrollProgress >= 0 && scrollProgress <= 4) {
          // First phase: section slides up normally (0 to 1.2)
          if (scrollProgress <= 1.2) {
            const historyProgress = Math.min(scrollProgress / 1.2, 1);
            gsap.set(historyRef.current, {
              y: (1 - historyProgress) * 100 + "vh",
              visibility: 'visible'
            });
            
            // Reset horizontal scroll when entering
            setIsHorizontalScrollComplete(false);
            if (horizontalScrollRef.current) {
              horizontalScrollRef.current.scrollLeft = 0;
            }
          }
          // Second phase: section locked, vertical scroll drives horizontal movement (1.2 to 3.5)
          else if (scrollProgress > 1.2 && scrollProgress <= 3.5) {
            // Lock heritage section in position
            gsap.set(historyRef.current, { y: 0, visibility: 'visible' });
            
            // Convert vertical scroll progress to horizontal scroll position
            const horizontalProgress = (scrollProgress - 1.2) / (3.5 - 1.2); // 0 to 1
            
            if (horizontalScrollRef.current && !isHorizontalScrollComplete) {
              const container = horizontalScrollRef.current;
              const maxScrollLeft = container.scrollWidth - container.clientWidth;
              const targetScrollLeft = horizontalProgress * maxScrollLeft;
              
              // Smoothly animate to target position
              gsap.to(container, {
                scrollLeft: targetScrollLeft,
                duration: 0.3,
                ease: "power2.out"
              });
              
              // Check if we've completed horizontal scrolling
              if (horizontalProgress >= 0.875) {
                setIsHorizontalScrollComplete(true);
              }
            }
            
            // Prevent further section progression until horizontal scroll complete
            if (!isHorizontalScrollComplete && scrollProgress > 3.2) {
              return; // Lock scroll progression
            }
          }
          // Third phase: allow progression to next section (3.5+)
          else {
            gsap.set(historyRef.current, { y: 0, visibility: 'visible' });
          }
        } else {
          gsap.set(historyRef.current, { y: "100vh", visibility: 'visible' });
        }
        
        // Sales section - Simple side panel slide animation
        if (scrollProgress >= 3.5 && scrollProgress <= 5) {
          const salesProgress = Math.min((scrollProgress - 3.5) / 1.2, 1);
          gsap.set(section2Ref.current, {
            y: (1 - salesProgress) * 100 + "vh"
          });
          
          // Left side panel - simple slide from left
          if (salesLeftImageRef.current) {
            gsap.set(salesLeftImageRef.current, { 
              x: -100 * (1 - salesProgress) + "%",
              opacity: salesProgress
            });
          }
          
          // Right side panel - simple slide from right  
          if (salesRightImageRef.current) {
            gsap.set(salesRightImageRef.current, { 
              x: 100 * (1 - salesProgress) + "%",
              opacity: salesProgress
            });
          }
          
          // Main text - simple fade in
          if (salesTitleRef.current) {
            gsap.set(salesTitleRef.current, {
              opacity: salesProgress
            });
          }
        } else if (scrollProgress > 5) {
          gsap.set(section2Ref.current, { y: 0 });
          // Keep all elements in final positions
          if (salesLeftImageRef.current && salesRightImageRef.current) {
            gsap.set(salesLeftImageRef.current, { opacity: 1, x: "0%" });
            gsap.set(salesRightImageRef.current, { opacity: 1, x: "0%" });
          }
          if (salesTitleRef.current) {
            gsap.set(salesTitleRef.current, { opacity: 1 });
          }
        } else {
          gsap.set(section2Ref.current, { y: "100vh" });
          // Reset all elements
          if (salesLeftImageRef.current && salesRightImageRef.current) {
            gsap.set(salesLeftImageRef.current, { opacity: 0, x: "-100%" });
            gsap.set(salesRightImageRef.current, { opacity: 0, x: "100%" });
          }
          if (salesTitleRef.current) {
            gsap.set(salesTitleRef.current, { opacity: 0 });
          }
        }
        
        // Rentals section - Simple side panel slide animation
        if (scrollProgress >= 5 && scrollProgress <= 6.5) {
          const rentalsProgress = Math.min((scrollProgress - 5) / 1.2, 1);
          gsap.set(section3Ref.current, {
            y: (1 - rentalsProgress) * 100 + "vh"
          });
          
          // Left side panel - simple slide from left
          if (rentalsLeftImageRef.current) {
            gsap.set(rentalsLeftImageRef.current, { 
              x: -100 * (1 - rentalsProgress) + "%",
              opacity: rentalsProgress
            });
          }
          
          // Right side panel - simple slide from right
          if (rentalsRightImageRef.current) {
            gsap.set(rentalsRightImageRef.current, { 
              x: 100 * (1 - rentalsProgress) + "%",
              opacity: rentalsProgress
            });
          }
          
          // Main text - simple fade in
          if (rentalsTitleRef.current) {
            gsap.set(rentalsTitleRef.current, {
              opacity: rentalsProgress
            });
          }
        } else if (scrollProgress > 5) {
          gsap.set(section3Ref.current, { y: 0 });
          // Keep all elements in final positions
          if (rentalsLeftImageRef.current && rentalsRightImageRef.current && rentalsTitleRef.current) {
            gsap.set(rentalsLeftImageRef.current, { opacity: 1, x: "0%" });
            gsap.set(rentalsRightImageRef.current, { opacity: 1, x: "0%" });
            gsap.set(rentalsTitleRef.current, { opacity: 1 });
          }
        } else {
          gsap.set(section3Ref.current, { y: "100vh" });
          // Reset all elements
          if (rentalsLeftImageRef.current && rentalsRightImageRef.current && rentalsTitleRef.current) {
            gsap.set(rentalsLeftImageRef.current, { opacity: 0, x: "-100%" });
            gsap.set(rentalsRightImageRef.current, { opacity: 0, x: "100%" });
            gsap.set(rentalsTitleRef.current, { opacity: 0 });
          }
        }
        
        // Commercial section - Simple side panel slide animation
        if (scrollProgress >= 6.5 && scrollProgress <= 8) {
          const commercialProgress = Math.min((scrollProgress - 6.5) / 1.2, 1);
          gsap.set(section4Ref.current, {
            y: (1 - commercialProgress) * 100 + "vh"
          });
          
          // Left side panel - simple slide from left
          if (commercialLeftImageRef.current) {
            gsap.set(commercialLeftImageRef.current, { 
              x: -100 * (1 - commercialProgress) + "%",
              opacity: commercialProgress
            });
          }
          
          // Right side panel - simple slide from right
          if (commercialRightImageRef.current) {
            gsap.set(commercialRightImageRef.current, { 
              x: 100 * (1 - commercialProgress) + "%",
              opacity: commercialProgress
            });
          }
          
          // Main text - simple fade in
          if (commercialTitleRef.current) {
            gsap.set(commercialTitleRef.current, {
              opacity: commercialProgress
            });
          }
        } else if (scrollProgress > 6.5) {
          gsap.set(section4Ref.current, { y: 0 });
          // Keep all elements in final positions
          if (commercialLeftImageRef.current && commercialRightImageRef.current && commercialTitleRef.current) {
            gsap.set(commercialLeftImageRef.current, { opacity: 1, x: "0%" });
            gsap.set(commercialRightImageRef.current, { opacity: 1, x: "0%" });
            gsap.set(commercialTitleRef.current, { opacity: 1 });
          }
        } else {
          gsap.set(section4Ref.current, { y: "100vh" });
          // Reset all elements
          if (commercialLeftImageRef.current && commercialRightImageRef.current && commercialTitleRef.current) {
            gsap.set(commercialLeftImageRef.current, { opacity: 0, x: "-100%" });
            gsap.set(commercialRightImageRef.current, { opacity: 0, x: "100%" });
            gsap.set(commercialTitleRef.current, { opacity: 0 });
          }
        }
        
        // Team section - Simple fade animation
        if (scrollProgress >= 8 && scrollProgress <= 9.5) {
          const teamProgress = Math.min((scrollProgress - 8) / 1.5, 1);
          gsap.set(teamRef.current, {
            y: (1 - teamProgress) * 100 + "vh"
          });
          
          // Simple fade in for title and team cards
          if (teamTitleRef.current) {
            gsap.set(teamTitleRef.current, { 
              opacity: teamProgress
            });
          }
          
          if (teamContainerRef.current) {
            gsap.set(teamContainerRef.current, {
              opacity: teamProgress
            });
            
            // Simple fade for all team cards
            const teamCards = document.querySelectorAll('.team-card');
            teamCards.forEach((card) => {
              gsap.set(card, {
                opacity: teamProgress
              });
            });
          }
        } else if (scrollProgress > 8.5) {
          gsap.set(teamRef.current, { y: 0 });
          // Keep everything visible
          if (teamTitleRef.current && teamContainerRef.current) {
            gsap.set(teamTitleRef.current, { opacity: 1 });
            gsap.set(teamContainerRef.current, { opacity: 1 });
            
            const teamCards = document.querySelectorAll('.team-card');
            teamCards.forEach((card) => {
              gsap.set(card, { opacity: 1 });
            });
          }
        } else {
          gsap.set(teamRef.current, { y: "100vh" });
          // Reset to hidden
          if (teamTitleRef.current && teamContainerRef.current) {
            gsap.set(teamTitleRef.current, { opacity: 0 });
            gsap.set(teamContainerRef.current, { opacity: 0 });
            
            const teamCards = document.querySelectorAll('.team-card');
            teamCards.forEach((card) => {
              gsap.set(card, { opacity: 0 });
            });
          }
        }
        
        // Contact section climbs up (section 6: starts after team section is fully scrolled)
        if (scrollProgress >= 9.6 && scrollProgress <= 12.0) {
          const contactProgress = Math.min((scrollProgress - 9.6) / 2.4, 1);
          gsap.set(contactRef.current, {
            y: (1 - contactProgress) * 100 + "vh"
          });
        } else if (scrollProgress > 12.0) {
          // Keep contact at full coverage
          gsap.set(contactRef.current, { y: 0 });
        } else {
          // Below contact range - hide
          gsap.set(contactRef.current, { y: "100vh" });
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Enhanced carousel animation system with seamless infinite scroll
  useEffect(() => {
    const moveCarousel = () => {
      if (!carouselRef.current) return;
      
      const container = carouselRef.current;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const state = carouselStateRef.current;
      
      // Since we duplicate content, the real content width is half of scrollWidth
      const realContentWidth = scrollWidth / 2;
      const maxScroll = realContentWidth;
      
      // Handle user interaction (hover directions)
      if (state.isUserInteracting) {
        if (state.hoverDirection === 'left') {
          container.scrollLeft -= 8;
          // If scrolled too far left, wrap to the end of the real content
          if (container.scrollLeft <= 0) {
            container.scrollLeft = maxScroll;
          }
        } else if (state.hoverDirection === 'right') {
          container.scrollLeft += 8;
          // If scrolled past real content, wrap to beginning
          if (container.scrollLeft >= maxScroll) {
            container.scrollLeft = 0;
          }
        }
      } 
      // Handle perpetual scrolling when not interacting
      else if (state.isPerpetualScrolling) {
        container.scrollLeft += 1;
        
        // Seamless reset when we reach the end of real content
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        }
      }
      
      state.lastScrollPosition = container.scrollLeft;
      carouselAnimationRef.current = requestAnimationFrame(moveCarousel);
    };
    
    carouselAnimationRef.current = requestAnimationFrame(moveCarousel);
    
    return () => {
      if (carouselAnimationRef.current) {
        cancelAnimationFrame(carouselAnimationRef.current);
      }
    };
  }, []);

  // Carousel interaction handlers
  const handleCarouselInteraction = (direction: 'left' | 'right' | null, isInteracting: boolean) => {
    const state = carouselStateRef.current;
    state.hoverDirection = direction;
    state.isUserInteracting = isInteracting;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      
      {/* Hero Section with Logo and Coverage Areas Carousel */}
      <section ref={heroRef} className="fixed top-0 left-0 w-full min-h-screen flex flex-col justify-center items-center" style={{ zIndex: 10, perspective: '1000px', visibility: 'visible' }}>
        {/* Hero Video Background */}
        <video 
          autoPlay 
          muted 
          loop 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 1 }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black/40" style={{ zIndex: 2 }}></div>
        
        {/* Logo and Tagline Content */}
        <div className="text-center relative" style={{ zIndex: 10 }}>
          <img
            src={heroLogo}
            alt="Catwalk Frames Estate & Management"
            className="max-w-[500px] w-auto h-auto object-contain mx-auto mb-8"
          />
          <p className="text-white text-xl md:text-2xl font-light tracking-wide max-w-3xl mx-auto mb-12">
            Over three decades of trusted property expertise across west and north west London
          </p>
          
          {/* Coverage Areas Carousel - Positioned at bottom of hero */}
        </div>

        {/* Coverage Areas Carousel - Moved outside and positioned at bottom */}
        <div className="absolute bottom-24 left-0 right-0 w-full z-20">
            {/* Left Arrow */}
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#5A1A5A]/20 backdrop-blur-sm rounded-full p-3 text-[#D4A04F] hover:bg-[#4A1545]/20 transition-all duration-300 border border-[#D4A04F]/30"
              onClick={() => handleCarouselScroll('left')}
              onMouseEnter={() => handleCarouselInteraction('left', true)}
              onMouseLeave={() => handleCarouselInteraction(null, false)}
              aria-label="Scroll carousel left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            {/* Right Arrow */}
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#5A1A5A]/20 backdrop-blur-sm rounded-full p-3 text-[#D4A04F] hover:bg-[#4A1545]/20 transition-all duration-300 border border-[#D4A04F]/30"
              onClick={() => handleCarouselScroll('right')}
              onMouseEnter={() => handleCarouselInteraction('right', true)}
              onMouseLeave={() => handleCarouselInteraction(null, false)}
              aria-label="Scroll carousel right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Carousel Container */}
            <div 
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scroll-smooth px-12 carousel-container"
              onMouseMove={(e) => {
                const container = e.currentTarget;
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const containerWidth = rect.width;
                const leftThreshold = containerWidth * 0.25; // Left 25%
                const rightThreshold = containerWidth * 0.75; // Right 75%
                
                if (x < leftThreshold) {
                  handleCarouselInteraction('left', true);
                } else if (x > rightThreshold) {
                  handleCarouselInteraction('right', true);
                } else {
                  handleCarouselInteraction(null, false);
                }
              }}
              onMouseLeave={() => handleCarouselInteraction(null, false)}
            >
              <style>{`
                .carousel-container {
                  scrollbar-width: none;
                  -ms-overflow-style: none;
                }
                .carousel-container::-webkit-scrollbar {
                  display: none;
                }
                .coverage-card {
                  width: 128px;
                  height: 96px;
                  min-width: 128px;
                  min-height: 96px;
                  flex-shrink: 0;
                }
              `}</style>
              
              {/* Coverage Area Cards */}
              {coverageAreas.map((area) => {
                const areaId = area.name.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link key={areaId} href={area.route}>
                    <div 
                      className={`coverage-card relative backdrop-blur-sm rounded-xl text-center transition-all duration-300 border border-[#D4A04F]/30 overflow-hidden cursor-pointer flex-shrink-0 ${
                        hoveredCard === areaId 
                          ? 'bg-[#D4A04F]/20 border-[#D4A04F]' 
                          : 'bg-[#5A1A5A]/20 hover:bg-[#4A1545]/20'
                      }`}
                      onMouseEnter={() => setHoveredCard(areaId)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        // Calculate which edge is closest
                        const distToTop = y;
                        const distToBottom = rect.height - y;
                        const distToLeft = x;
                        const distToRight = rect.width - x;
                        const minDist = Math.min(distToTop, distToBottom, distToLeft, distToRight);
                        
                        let edgeX, edgeY;
                        if (minDist === distToTop) {
                          edgeX = x;
                          edgeY = 0;
                        } else if (minDist === distToBottom) {
                          edgeX = x;
                          edgeY = rect.height;
                        } else if (minDist === distToLeft) {
                          edgeX = 0;
                          edgeY = y;
                        } else {
                          edgeX = rect.width;
                          edgeY = y;
                        }
                        
                        e.currentTarget.style.setProperty('--edge-x', `${edgeX}px`);
                        e.currentTarget.style.setProperty('--edge-y', `${edgeY}px`);
                        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                      }}
                    >
                      {/* Bright white light sweep effect */}
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                        <div 
                          className="absolute w-20 h-20 rounded-full"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.2) 60%, transparent 100%)',
                            left: 'var(--edge-x, 50%)',
                            top: 'var(--edge-y, 50%)',
                            transform: 'translate(-50%, -50%)',
                            filter: 'blur(3px)',
                            boxShadow: '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4)'
                          }}
                        />
                        <div 
                          className="absolute w-8 h-8 rounded-full"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                            left: 'var(--edge-x, 50%)',
                            top: 'var(--edge-y, 50%)',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 15px rgba(255,255,255,1)'
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
                        {hoveredCard === areaId ? (
                          <>
                            <div className="text-sm font-gotham font-black text-black leading-none">MORE</div>
                            <div className="text-sm font-gotham font-black text-black leading-none">INFO</div>
                          </>
                        ) : (
                          <>
                            <div className="text-2xl font-gotham font-black text-[#D4A04F] leading-none">{area.postcode}</div>
                            <div className="text-xs text-white/80 font-gotham font-medium text-center leading-none mt-1">{area.name}</div>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
              
              {/* Duplicate Coverage Area Cards for Seamless Infinite Scroll */}
              {coverageAreas.map((area) => {
                const areaId = `${area.name.toLowerCase().replace(/\s+/g, '-')}-duplicate`;
                return (
                  <Link key={areaId} href={area.route}>
                    <div 
                      className={`coverage-card relative backdrop-blur-sm rounded-xl text-center transition-all duration-300 border border-[#D4A04F]/30 overflow-hidden cursor-pointer flex-shrink-0 ${
                        hoveredCard === areaId 
                          ? 'bg-[#D4A04F]/20 border-[#D4A04F]' 
                          : 'bg-[#5A1A5A]/20 hover:bg-[#4A1545]/20'
                      }`}
                      onMouseEnter={() => setHoveredCard(areaId)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        // Calculate which edge is closest
                        const distToTop = y;
                        const distToBottom = rect.height - y;
                        const distToLeft = x;
                        const distToRight = rect.width - x;
                        const minDist = Math.min(distToTop, distToBottom, distToLeft, distToRight);
                        
                        let edgeX, edgeY;
                        if (minDist === distToTop) {
                          edgeX = x;
                          edgeY = 0;
                        } else if (minDist === distToBottom) {
                          edgeX = x;
                          edgeY = rect.height;
                        } else if (minDist === distToLeft) {
                          edgeX = 0;
                          edgeY = y;
                        } else {
                          edgeX = rect.width;
                          edgeY = y;
                        }
                        
                        e.currentTarget.style.setProperty('--edge-x', `${edgeX}px`);
                        e.currentTarget.style.setProperty('--edge-y', `${edgeY}px`);
                        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                      }}
                    >
                      {/* Bright white light sweep effect */}
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                        <div 
                          className="absolute w-20 h-20 rounded-full"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.2) 60%, transparent 100%)',
                            left: 'var(--edge-x, 50%)',
                            top: 'var(--edge-y, 50%)',
                            transform: 'translate(-50%, -50%)',
                            filter: 'blur(3px)',
                            boxShadow: '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4)'
                          }}
                        />
                        <div 
                          className="absolute w-8 h-8 rounded-full"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                            left: 'var(--edge-x, 50%)',
                            top: 'var(--edge-y, 50%)',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 15px rgba(255,255,255,1)'
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
                        {hoveredCard === areaId ? (
                          <>
                            <div className="text-sm font-gotham font-black text-black leading-none">MORE</div>
                            <div className="text-sm font-gotham font-black text-black leading-none">INFO</div>
                          </>
                        ) : (
                          <>
                            <div className="text-2xl font-gotham font-black text-[#D4A04F] leading-none">{area.postcode}</div>
                            <div className="text-xs text-white/80 font-gotham font-medium text-center leading-none mt-1">{area.name}</div>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
        </div>

      </section>

      {/* Our History Section - Proper Split Screen with Oversized Text and Scrollable Story */}
      <section ref={historyRef} className="fixed top-0 left-0 w-full min-h-screen bg-white overflow-hidden" style={{ zIndex: 20 }}>

        {/* Hide horizontal scrollbar with CSS */}
        <style>{`
          .horizontal-scroll::-webkit-scrollbar {
            display: none;
          }
          .horizontal-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Background Text Layer - Top-right corner with vertical scroll */}
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none" style={{zIndex: 5}}>
          <div className="relative h-full">
            <div id="scrolling-background-text" className="absolute left-12 top-24 opacity-100">
              <div className="space-y-16 text-left">
                <h1 className="text-6xl md:text-7xl font-black text-gray-300 leading-none tracking-tight">
                  PRIME
                  <br />
                  LETTINGS
                </h1>
                <div className="w-20 h-px bg-gray-300/50 my-8"></div>
                <h2 className="text-6xl md:text-7xl font-black text-gray-300 leading-none tracking-tight">
                  LUXURY
                  <br />
                  SALES
                </h2>
                <div className="w-20 h-px bg-gray-300/50 my-8"></div>
                <h3 className="text-6xl md:text-7xl font-black text-gray-300 leading-none tracking-tight">
                  COMMERCIAL
                  <br />
                  PROPERTY
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* New Layout - Split with Story in Bottom Left and Horizontal Scroll */}
        <div className="h-screen w-full relative">
          {/* Top Half */}
          <div className="h-1/2 flex">
            {/* Top Left - AI Search Introduction */}
            <div className="w-1/2 h-full bg-purple-700 flex items-center justify-center px-8 relative overflow-hidden">
              {/* Foreground AI Search introduction */}
              <div className="relative z-10 text-center max-w-2xl px-4">
                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-6">
                  EXPERIENCE THE FUTURE
                  <br />
                  OF PROPERTY SEARCH
                </h1>
                <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium mb-8">
                  Discover your perfect property using our revolutionary AI-powered search. Simply describe what you're looking for in natural language to our chatbot, and let our intelligent system find exactly what you need.
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <p className="text-sm text-white/80 mb-4 font-medium">Try asking:</p>
                  <div className="space-y-2 text-sm text-white/70">
                    <p>"Find me a 2-bedroom flat in Notting Hill under £3000"</p>
                    <p>"Show me commercial spaces near Paddington"</p>
                    <p>"Properties with gardens in Maida Vale"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Right - Empty for now, can add content later */}
            <div className="w-1/2 h-full bg-white">
            </div>
          </div>

          {/* Bottom Half */}
          <div className="h-1/2 flex">
            {/* Bottom Left - Story Content */}
            <div className="w-1/2 h-full bg-white flex items-center justify-center px-8 overflow-hidden relative z-50">
              <div className="max-w-2xl px-4">
                {/* Story Header */}
                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-none">
                    OUR STORY
                  </h2>
                  <div className="w-20 h-1 bg-purple-700 mb-6"></div>
                  
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 leading-tight">
                    Established Heritage,
                    <br />
                    Modern Expertise
                  </h3>
                </div>

                {/* Story Text */}
                <div>
                  <p className="text-lg text-gray-800 leading-relaxed font-medium mb-6">
                    Catwalk Frames Estate & Management represents over 35 years of unwavering commitment to excellence in London property services. Since 1988, our independent agency has built its reputation on a foundation of discretion, professionalism, and an uncompromising dedication to quality that sets us apart in the capital's competitive market.
                  </p>
                  
                  <p className="text-lg text-gray-700 leading-relaxed font-medium">
                    Our ethos is rooted in genuine partnership. We believe that exceptional property services begin with understanding that every client and every property is unique. This philosophy drives our bespoke approach across prime lettings, sales, commercial property, and comprehensive residential management throughout Central, North West and West London's most desirable postcodes.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Right - Horizontal Scrolling Content */}
            <div
              ref={horizontalScrollRef}
              className="w-1/2 h-full bg-gray-50 overflow-x-auto overflow-y-hidden relative z-10"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              onScroll={handleHorizontalScroll}
            >
              {/* Scroll Indicator and Progress */}
              {!isHorizontalScrollComplete && (
                <>
                  <div className="absolute top-4 right-4 z-10 bg-purple-700/80 text-white px-3 py-2 rounded-full text-sm font-medium animate-pulse">
                    Scroll right to continue →
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="bg-white/20 h-1 rounded-full">
                      <div 
                        className="bg-white h-1 rounded-full transition-all duration-300"
                        style={{ width: `${(horizontalScrollRef.current ? (horizontalScrollRef.current.scrollLeft / (horizontalScrollRef.current.scrollWidth - horizontalScrollRef.current.clientWidth)) : 0) * 100}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="h-full flex snap-x snap-mandatory z-30 relative">
                
                {/* Panel 1 - Local Expertise - Full Width */}
                <div className="h-full flex-shrink-0 bg-white snap-center flex items-center justify-center" style={{ width: '80vw' }}>
                  <div className="max-w-2xl px-6">
                    <h4 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                      Local expertise defines our advantage.
                    </h4>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                      From Bayswater's garden squares to St John's Wood's tree-lined avenues, from the cultural vibrancy of Ladbroke Grove to the emerging appeal of Kensal Rise, our deep neighbourhood knowledge spans decades of market insight. We understand not just property values, but the communities, transport links, and lifestyle factors that make each location distinctive.
                    </p>
                  </div>
                </div>

                {/* Panel 2 - Modern Innovation - Full Width */}
                <div className="h-full flex-shrink-0 bg-gray-100 snap-center flex items-center justify-center" style={{ width: '80vw' }}>
                  <div className="max-w-2xl px-6">
                    <h4 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                      Modern innovation enhances our established practices.
                    </h4>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                      While our values remain constant, our methods evolve continuously. We blend traditional relationship-building with contemporary market analysis, strategic negotiation techniques with cutting-edge technology. Our latest innovation includes AI-powered property search capabilities, allowing clients to explore our portfolio through natural language queries - representing the evolution of our established practices into the digital age.
                    </p>
                  </div>
                </div>

                {/* Panel 3 - Comprehensive Service - Full Width */}
                <div className="h-full flex-shrink-0 bg-white snap-center flex items-center justify-center" style={{ width: '80vw' }}>
                  <div className="max-w-2xl px-6">
                    <h4 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                      Our comprehensive service reflects integrated expertise.
                    </h4>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                      With skilled negotiators, experienced property managers, and an in-house network of registered contractors, we deliver seamless solutions whether you're a discerning vendor, astute investor, or quality-conscious tenant. Every interaction reflects our commitment to exceeding expectations through attention to detail and responsive, professional service.
                    </p>
                  </div>
                </div>

                {/* Panel 4 - Closing Statement - Full Width */}
                <div className="h-full flex-shrink-0 bg-purple-700 text-white snap-center flex items-center justify-center" style={{ width: '80vw' }}>
                  <div className="max-w-2xl px-6">
                    <p className="text-3xl md:text-4xl font-bold leading-relaxed italic mb-8 tracking-tight">
                      At Catwalk Frames Estate & Management, established heritage and modern expertise converge to create something rare in today's market: a truly personal service that consistently delivers exceptional results.
                    </p>
                    <p className="text-xl md:text-2xl font-medium leading-relaxed">
                      This is how we've served London's property community for over three decades, and how we'll continue to serve for generations to come.
                    </p>
                  </div>
                </div>

                {/* Panel 5 - Company Stats */}
                <div className="h-full flex-shrink-0 bg-white" style={{ width: '400px' }}>
                  <div className="p-8 h-full flex flex-col justify-center">
                    <div className="space-y-8">
                      <div className="text-center">
                        <div className="text-5xl font-black text-purple-700">35+</div>
                        <div className="text-sm text-gray-600 uppercase tracking-widest font-bold">Years Since 1988</div>
                      </div>
                      <div className="text-center">
                        <div className="text-5xl font-black text-purple-700">1000+</div>
                        <div className="text-sm text-gray-600 uppercase tracking-widest font-bold">Properties Across London</div>
                      </div>
                      <div className="text-center">
                        <div className="text-5xl font-black text-purple-700">24/7</div>
                        <div className="text-sm text-gray-600 uppercase tracking-widest font-bold">Support Always Available</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Sales Section */}
      <section
        ref={section2Ref}
        className="fixed top-0 left-0 w-full min-h-screen bg-gray-900 overflow-hidden"
        style={{ zIndex: 30, perspective: '1000px' }}
      >
        {/* Catwalk Frames Logo */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 min-w-[800px] w-auto overflow-visible">
          <img
            src={heroLogo}
            alt="Catwalk Frames Estate & Management"
            className="h-48 w-auto max-w-[700px] object-contain opacity-85 hover:opacity-100 transition-opacity duration-300 mx-auto block overflow-visible"
            style={{ filter: 'invert(1) brightness(0) saturate(100%) invert(1)' }}
          />
        </div>

        {/* Layer 0 - Primary Content (visible during curtain roll) */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-6">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-8">SALES</h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-12">
            Expert sales services in prime London locations with personalized approach and market expertise
          </p>
          <Link href="/sales">
            <Button
              size="lg"
              className="bg-[#8B4A9C] hover:bg-[#7A4289] text-white px-8 py-4 text-lg"
            >
              Explore Sales
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Left Image - Hidden during curtain roll */}
        <div 
          ref={salesLeftImageRef}
          className="absolute left-0 top-0 w-1/2 h-full bg-cover bg-center opacity-0"
          style={{
            backgroundImage: `url(${salesLeftImage})`,
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/70"></div>
        </div>

        {/* Right Image - Hidden during curtain roll */}
        <div 
          ref={salesRightImageRef}
          className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center opacity-0"
          style={{
            backgroundImage: `url(${salesRightImage})`,
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-900/70"></div>
        </div>

        {/* Center Title Reference (for animations) */}
        <div
          ref={salesTitleRef}
          className="absolute inset-0 pointer-events-none opacity-0"
        >
        </div>

      </section>

      {/* Rentals Section */}
      <section
        ref={section3Ref}
        className="fixed top-0 left-0 w-full min-h-screen bg-gray-800 overflow-hidden"
        style={{ zIndex: 40, perspective: '1000px' }}
      >
        {/* Catwalk Frames Logo */}
        <div className="absolute top-4 left-0 right-0 z-50 px-4 overflow-visible flex justify-center">
          <img
            src={heroLogo}
            alt="Catwalk Frames Estate & Management"
            className="h-48 w-auto max-w-[700px] object-contain opacity-85 hover:opacity-100 transition-opacity duration-300 overflow-visible"
            style={{ filter: 'invert(1) brightness(0) saturate(100%) invert(1)' }}
          />
        </div>

        {/* Left Image */}
        <div 
          ref={rentalsLeftImageRef}
          className="absolute left-0 top-0 w-1/2 h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${rentalsLeftImage})`,
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-800/70"></div>
        </div>

        {/* Right Image */}
        <div 
          ref={rentalsRightImageRef}
          className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${rentalsRightImage})`,
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-800/70"></div>
        </div>

        {/* Center Content Overlay */}
        <div 
          ref={rentalsTitleRef}
          className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-6"
        >
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-8">RENTALS</h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-12">
            Comprehensive lettings and property management services with 24/7 support and maintenance
          </p>
          <Link href="/rentals">
            <Button
              size="lg"
              className="bg-[#8B4A9C] hover:bg-[#7A4289] text-white px-8 py-4 text-lg"
            >
              Explore Rentals
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

      </section>

      {/* Commercial Section */}
      <section
        ref={section4Ref}
        className="fixed top-0 left-0 w-full min-h-screen bg-gray-700 overflow-hidden"
        style={{ zIndex: 50, perspective: '1000px' }}
      >
        {/* Catwalk Frames Logo */}
        <div className="absolute top-4 left-0 right-0 z-50 px-4 overflow-visible flex justify-center">
          <img
            src={heroLogo}
            alt="Catwalk Frames Estate & Management"
            className="h-48 w-auto max-w-[700px] object-contain opacity-85 hover:opacity-100 transition-opacity duration-300 overflow-visible"
            style={{ filter: 'invert(1) brightness(0) saturate(100%) invert(1)' }}
          />
        </div>

        {/* Left Image */}
        <div 
          ref={commercialLeftImageRef}
          className="absolute left-0 top-0 w-1/2 h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${commercialLeftImage})`,
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-700/70"></div>
        </div>

        {/* Right Image */}
        <div 
          ref={commercialRightImageRef}
          className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${commercialRightImage})`,
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-700/70"></div>
        </div>

        {/* Center Content Overlay */}
        <div 
          ref={commercialTitleRef}
          className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-6"
        >
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-8">COMMERCIAL</h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-12">
            Strategic commercial property solutions for businesses across Central and West London
          </p>
          <Link href="/commercial">
            <Button
              size="lg"
              className="bg-[#8B4A9C] hover:bg-[#7A4289] text-white px-8 py-4 text-lg"
            >
              Explore Commercial
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

      </section>

      {/* Team Section - Full Width Layout */}
      <section ref={teamRef} className="fixed top-0 left-0 w-full h-screen md:overflow-hidden overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800" style={{ zIndex: 60, perspective: '1000px' }}>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4A04F]/20 via-transparent to-[#D4A04F]/20"></div>
        </div>
        
        <div className="relative z-10 h-auto md:h-full flex flex-col justify-start md:justify-center items-center min-h-screen">
          {/* Title Section */}
          <div ref={teamTitleRef} className="text-center py-6 md:py-12 px-6 mt-10 md:mt-20">
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6">Meet Our Team</h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              Our experienced professionals are dedicated to providing exceptional service
              and expertise in the London property market
            </p>
          </div>

          {/* Team Cards - Responsive Layout */}
          <div ref={teamContainerRef} className="flex-1 px-4 md:px-8 pb-6 md:pb-12">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-stretch md:items-center max-w-none">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="team-card group relative w-full max-w-sm md:w-80 h-auto md:h-[768px] min-h-[600px] transform transition-all duration-500 hover:scale-105"
                >
                  {/* Sophisticated Background with Gradient */}
                  <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-3xl border border-white/20 group-hover:border-[#D4A04F]/50 transition-all duration-500 overflow-hidden h-full">
                    
                    {/* Animated background glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4A04F]/10 via-[#D4A04F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Profile Section */}
                    <div className="relative z-10 p-8 h-full flex flex-col">
                      <div className="relative mb-8">
                        {/* Profile Image with Elegant Frame */}
                        <div className="relative w-48 h-48 mx-auto">
                          {/* Outer decorative ring */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4A04F] via-[#E6B366] to-[#D4A04F] p-1 group-hover:scale-110 transition-transform duration-500">
                            <div className="w-full h-full rounded-full bg-gray-900 p-1">
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                          </div>

                          {/* Floating accent */}
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-[#D4A04F] to-[#E6B366] rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      </div>

                      {/* Content Section - flexible */}
                      <div className="text-center flex-grow flex flex-col justify-between">
                        {/* Top content group */}
                        <div className="space-y-4">
                          {/* Name with enhanced typography */}
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#D4A04F] transition-colors duration-300">{member.name}</h3>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#D4A04F] to-transparent mx-auto opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>

                          {/* Role with sophisticated styling */}
                          <p className="text-[#D4A04F] text-base font-semibold tracking-wide uppercase">
                            {member.role}
                          </p>

                          {/* Description with better spacing */}
                          <p className="text-white/80 text-sm leading-relaxed px-2">
                            {member.description}
                          </p>
                        </div>

                        {/* Enhanced Contact Button - at bottom */}
                        <div className="pt-6">
                          <a 
                            href={`https://wa.me/${member.whatsapp.replace('+', '')}?text=Hi%20${member.name.replace(' ', '%20')}%2C%20I%20have%20a%20property%20enquiry.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn inline-flex items-center justify-center bg-gradient-to-r from-[#25D366] to-[#20b954] hover:from-[#20b954] hover:to-[#1da851] text-white px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <MessageCircle className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                            Contact Me
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Group Team Photo Card - Enhanced Design */}
              <div className="team-card group relative w-full max-w-sm md:w-80 h-auto md:h-[768px] min-h-[600px] flex-shrink-0 transform transition-all duration-500 hover:scale-105">
                {/* Sophisticated Background */}
                <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-3xl border border-white/20 group-hover:border-[#D4A04F]/50 transition-all duration-500 overflow-hidden h-full">
                  
                  {/* Animated background glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4A04F]/10 via-[#D4A04F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Team Photo Section */}
                  <div className="relative z-10 p-8 h-full flex flex-col">
                    <div className="relative mb-8">
                      {/* Team Photo with Elegant Frame */}
                      <div className="relative w-full h-48 mx-auto">
                        {/* Outer decorative border */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D4A04F] via-[#E6B366] to-[#D4A04F] p-1 group-hover:scale-105 transition-transform duration-500">
                          <div className="w-full h-full rounded-xl bg-gray-900 p-1">
                            <img 
                              src={lettingsTeam} 
                              alt="Catwalk Frames Lettings Team"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        </div>
                        
                        {/* Floating accent elements */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-[#D4A04F] to-[#E6B366] rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-[#D4A04F] to-[#B8903E] rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="text-center space-y-4 flex-grow flex flex-col justify-between">
                      {/* Team Name with enhanced typography */}
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#D4A04F] transition-colors duration-300">Our Lettings Team</h3>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4A04F] to-transparent mx-auto opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Tagline with sophisticated styling */}
                      <p className="text-[#D4A04F] text-base font-semibold tracking-wide uppercase">
                        Complete Property Solutions
                      </p>
                      
                      {/* Description with better spacing */}
                      <p className="text-white/80 text-sm leading-relaxed px-2">
                        Working together to provide comprehensive lettings, sales, and property management 
                        services across Central, North West and West London.
                      </p>
                      
                      {/* Enhanced Contact Button */}
                      <div className="pt-4">
                        <a 
                          href="https://wa.me/442077240000?text=Hi%20John%20Barclay%2C%20I%20have%20a%20property%20enquiry."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn inline-flex items-center justify-center bg-gradient-to-r from-[#25D366] to-[#20b954] hover:from-[#20b954] hover:to-[#1da851] text-white px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <MessageCircle className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                          Contact Our Team
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>


      {/* Contact Section */}
      <section ref={contactRef} className="fixed top-0 left-0 w-full min-h-screen" style={{ zIndex: 70 }}>
        <ContactSection />

      </section>
      
      {/* Back to Top Arrow */}
      <BackToTopArrow />

      {/* Social Media Buttons */}
      <SocialMediaButtons />
      
      {/* Right-side Navigation Indicator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[80] flex flex-col gap-3">
        {sections.map((section, index) => {
          const isActive = currentSection === index;
          const sectionNames = {
            hero: 'HOME',
            history: 'HISTORY', 
            sales: 'SALES',
            rentals: 'RENTALS',
            commercial: 'COMMERCIAL',
            team: 'TEAM',
            contact: 'CONTACT'
          };
          
          return (
            <div key={section} className="relative group">
              {/* Section Label */}
              <div className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                isActive
                  ? 'text-[#D4A04F] opacity-100 scale-100'
                  : 'text-white/50 opacity-80 group-hover:opacity-100 group-hover:text-white/80 scale-95 group-hover:scale-100'
              }`}>
                {sectionNames[section as keyof typeof sectionNames]}
              </div>
              
              {/* Navigation Dot */}
              <button
                onClick={() => navigateToSection(index)}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 hover:scale-125 ${
                  isActive
                    ? 'bg-[#D4A04F] border-[#D4A04F] scale-125 shadow-lg shadow-[#D4A04F]/50'
                    : currentSection === 1
                      ? 'bg-transparent border-gray-700/60 hover:border-gray-800/80 hover:bg-gray-700/20'
                      : 'bg-transparent border-white/40 hover:border-white/80 hover:bg-white/20'
                }`}
                aria-label={`Go to ${section} section`}
              />
              
              {/* Connection Line */}
              {index < sections.length - 1 && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-6 transition-colors duration-300 ${
                  currentSection > index
                    ? 'bg-[#D4A04F]'
                    : currentSection === 1
                      ? 'bg-gray-700/40'
                      : 'bg-white/20'
                }`} />
              )}
            </div>
          );
        })}
        
      </div>

      {/* Property Chat Interface - Fixed position chat bubble */}
      <PropertyChatInterface />

    </div>
  );
};

export default EstateAgentHome;