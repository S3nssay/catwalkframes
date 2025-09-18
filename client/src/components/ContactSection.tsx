import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { contactFormSchema, type ContactFormData } from '@shared/schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Animation refs
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const whatsappRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const contactRefs = useRef<HTMLDivElement[]>([]);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      message: ''
    }
  });

  useEffect(() => {
    // Initial state - hide all elements
    gsap.set([titleRef.current, subtitleRef.current, phoneRef.current, emailRef.current, locationRef.current, whatsappRef.current, hoursRef.current], {
      opacity: 0,
      y: 100,
      scale: 0.8
    });

    // Title animation
    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // Subtitle animation
    gsap.to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.3,
      scrollTrigger: {
        trigger: subtitleRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // Contact items staggered animation
    const contactItems = [phoneRef.current, emailRef.current, locationRef.current];
    gsap.to(contactItems, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "power3.out",
      stagger: 0.2,
      delay: 0.6,
      scrollTrigger: {
        trigger: phoneRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // WhatsApp button animation
    gsap.to(whatsappRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.5,
      ease: "elastic.out(1, 0.3)",
      delay: 1.2,
      scrollTrigger: {
        trigger: whatsappRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // Working hours animation
    gsap.to(hoursRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
      delay: 1.5,
      scrollTrigger: {
        trigger: hoursRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // Floating animation for contact items
    contactItems.forEach((item, index) => {
      if (item) {
        gsap.to(item, {
          y: "+=20",
          duration: 2 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: 2 + index * 0.2
        });
      }
    });

    // Pulsing animation for WhatsApp button
    gsap.to(whatsappRef.current, {
      scale: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      delay: 3
    });

  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      await apiRequest('POST', '/api/contacts', data);

      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll be in touch shortly.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative min-h-screen py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden">

      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating circles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#8B4A9C]/5 animate-pulse"
            style={{
              width: `${50 + Math.random() * 100}px`,
              height: `${50 + Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Animated Title */}
        <div className="text-center mb-32">
          <div ref={titleRef} className="mb-8">
            <h2 className="text-7xl md:text-8xl font-bold text-[#8B4A9C]">
              Connect With Us
            </h2>
          </div>
          <div ref={subtitleRef}>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto">
              Experience exceptional service with London's premier estate agents
            </p>
          </div>
        </div>

        {/* Animated Contact Information */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid md:grid-cols-3 gap-16">

            {/* Phone */}
            <div ref={phoneRef} className="text-center">
              <div className="bg-[#8B4A9C] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Phone className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Call</h3>
              <p className="text-3xl font-bold text-[#8B4A9C]">020 (8) 969 3322</p>
            </div>

            {/* Email */}
            <div ref={emailRef} className="text-center">
              <div className="bg-[#8B4A9C] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Mail className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Email</h3>
              <p className="text-xl font-semibold text-[#8B4A9C]">lettings@catwalkframes.co.uk</p>
            </div>

            {/* Location */}
            <div ref={locationRef} className="text-center">
              <div className="bg-[#8B4A9C] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <MapPin className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Visit</h3>
              <p className="text-xl font-semibold text-[#8B4A9C]">
                332 Ladbroke Grove<br />London W10 5AD
              </p>
            </div>

          </div>
        </div>

        {/* Animated WhatsApp Button */}
        <div className="text-center mb-20">
          <div ref={whatsappRef}>
            <a
              href="https://wa.me/442089693322?text=Hi%2C%20I%27d%20like%20to%20inquire%20about%20your%20property%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-[#25D366] hover:bg-[#20b954] text-white font-bold py-8 px-16 text-2xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110"
            >
              <MessageCircle className="mr-6 h-10 w-10" />
              Start WhatsApp Conversation
              <ArrowRight className="ml-6 h-10 w-10" />
            </a>
          </div>
        </div>

        {/* Working Hours - Plain Text */}
        <div className="text-center">
          <div ref={hoursRef}>
            <h3 className="text-3xl font-bold mb-8 text-slate-600">Working Hours</h3>
            <div className="space-y-3 text-xl text-slate-600">
              <div>Monday - Friday: 9:00 AM - 6:00 PM</div>
              <div>Saturday: 10:00 AM - 4:00 PM</div>
              <div>Sunday: Closed</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;