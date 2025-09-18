import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Helmet } from 'react-helmet';
import { useEffect } from 'react';
import Lenis from 'lenis';
import EstateAgentHome from "@/pages/EstateAgentHome";
import PropertyListingsPage from "@/pages/PropertyListingsPage";
import PropertyDetailPage from "@/pages/PropertyDetailPage";
import SalesPage from "@/pages/SalesPage";
import RentalsPage from "@/pages/RentalsPage";
import CommercialPage from "@/pages/CommercialPage";
import ValuationPage from "@/pages/ValuationPage";
import RegisterRentalPage from "@/pages/RegisterRentalPage";
import AreaPage from "@/pages/AreaPage";
import ScrollToTop from "@/components/ScrollToTop";
import { Switch, Route, useLocation } from "wouter";
import { AuthProvider } from "@/hooks/use-auth";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "@/lib/protected-route";
import DashboardPage from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import TestEmailPage from "@/pages/TestEmailPage";
import TestSmsPage from "@/pages/TestSmsPage";
import TestDashboardPage from "@/pages/TestDashboardPage";

// Area-specific pages
import BayswaterPage from "@/pages/areas/BayswaterPage";
import HarlesdenPage from "@/pages/areas/HarlesdenPage";
import KensalGreenPage from "@/pages/areas/KensalGreenPage";
import KensalRisePage from "@/pages/areas/KensalRisePage";
import KilburnPage from "@/pages/areas/KilburnPage";
import LabdrokeGrovePage from "@/pages/areas/LabdrokeGrovePage";
import MaidaValePage from "@/pages/areas/MaidaValePage";
import NorthKensingtonPage from "@/pages/areas/NorthKensingtonPage";
import QueensParkPage from "@/pages/areas/QueensParkPage";
import WestbourneParkPage from "@/pages/areas/WestbourneParkPage";
import WillesdenPage from "@/pages/areas/WillesdenPage";


function App() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Listen for the scroll event and log the event data
    lenis.on('scroll', (e) => {
      // You can add custom scroll handlers here if needed
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Helmet>
            <title>Catwalk Eyewear | Luxury Designer Frames & Sunglasses</title>
            <meta name="description" content="Discover the finest collection of luxury eyewear. Premium designer frames and sunglasses from the world's most exclusive brands." />
          </Helmet>

          <main className="flex-grow">
            <Router />
          </main>
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={EstateAgentHome} />
        <Route path="/properties" component={PropertyListingsPage} />
        <Route path="/sales" component={SalesPage} />
        <Route path="/rentals" component={RentalsPage} />
        <Route path="/commercial" component={CommercialPage} />
        <Route path="/valuation" component={ValuationPage} />
        <Route path="/register-rental" component={RegisterRentalPage} />
        <Route path="/area/:postcode" component={AreaPage} />
        <Route path="/property/:id" component={PropertyDetailPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/test" component={TestDashboardPage} />
        <Route path="/test-email" component={TestEmailPage} />
        <Route path="/test-sms" component={TestSmsPage} />
        
        {/* Specific Area Pages */}
        <Route path="/areas/bayswater" component={BayswaterPage} />
        <Route path="/areas/harlesden" component={HarlesdenPage} />
        <Route path="/areas/kensal-green" component={KensalGreenPage} />
        <Route path="/areas/kensal-rise" component={KensalRisePage} />
        <Route path="/areas/kilburn" component={KilburnPage} />
        <Route path="/areas/ladbroke-grove" component={LabdrokeGrovePage} />
        <Route path="/areas/maida-vale" component={MaidaValePage} />
        <Route path="/areas/north-kensington" component={NorthKensingtonPage} />
        <Route path="/areas/queens-park" component={QueensParkPage} />
        <Route path="/areas/westbourne-park" component={WestbourneParkPage} />
        <Route path="/areas/willesden" component={WillesdenPage} />
        
        <ProtectedRoute path="/dashboard">
          <DashboardPage />
        </ProtectedRoute>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default App;
