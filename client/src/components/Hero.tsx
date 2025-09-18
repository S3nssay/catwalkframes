import { ArrowRight, Check, Clock, Coins, Home, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-[#0E6BFF] text-white py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-white opacity-10 rounded-full"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-[#F7EF81] px-4 py-2 rounded-full mb-6 animate-bounce">
            <span className="flex items-center font-medium text-[#0E6BFF]">
              <Sparkles className="h-5 w-5 mr-2" /> Quick & Hassle-Free!
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white">
            Sell your Property Fast, <span className="underline decoration-4 decoration-[#F7EF81]">Get Paid Cash in 7 days</span>
          </h1>
          
          <p className="text-xl md:text-3xl mb-14 text-white font-light">
            Get a guaranteed cash offer within 24 hours with no fees or hidden costs!
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 text-sm max-w-3xl mx-auto">
            <div className="bg-[#F7EF81] rounded-xl p-5 flex flex-col items-center">
              <div className="text-[#0E6BFF] p-3 rounded-full mb-3">
                <Coins className="h-6 w-6" />
              </div>
              <span className="font-medium text-base text-[#0E6BFF]">No Fees</span>
            </div>
            
            <div className="bg-[#F7EF81] rounded-xl p-5 flex flex-col items-center">
              <div className="text-[#0E6BFF] p-3 rounded-full mb-3">
                <Home className="h-6 w-6" />
              </div>
              <span className="font-medium text-base text-[#0E6BFF]">No Viewings</span>
            </div>
            
            <div className="bg-[#F7EF81] rounded-xl p-5 flex flex-col items-center">
              <div className="text-[#0E6BFF] p-3 rounded-full mb-3">
                <Check className="h-6 w-6" />
              </div>
              <span className="font-medium text-base text-[#0E6BFF]">No Chain</span>
            </div>
            
            <div className="bg-[#F7EF81] rounded-xl p-5 flex flex-col items-center">
              <div className="text-[#0E6BFF] p-3 rounded-full mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <span className="font-medium text-base text-[#0E6BFF]">Fast Completion</span>
            </div>
          </div>
          
          <div className="mt-14">
            <a 
              href="#valuation-form" 
              className="bg-[#F7EF81] hover:bg-[#f0e95a] text-[#0E6BFF] text-xl px-10 py-8 h-auto inline-flex items-center rounded-full font-bold shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Get Your Free Valuation <ArrowRight className="ml-3 h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
