import { VotingInterface } from "@/components/VotingInterface";
import { Suspense } from "react";
import { LoadingState } from "@/components/voting/LoadingState";
import { useIsMobile } from "@/hooks/use-mobile";

const Categories = () => {
  const isMobile = useIsMobile();

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Halos - uniquement affichés sur desktop */}
      {!isMobile && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-50%] left-[-35%] w-full h-[200%] bg-[radial-gradient(circle,rgba(217,70,239,0.15)_0%,transparent_50%)] z-[-3]" />
          <div className="absolute top-[-50%] right-[-35%] w-full h-[200%] bg-[radial-gradient(circle,rgba(14,165,233,0.15)_0%,transparent_50%)] z-[-3]" />
          <div className="gold-halo" />
        </div>
      )}

      {/* Grain Effect */}
      <div className="fixed inset-0 opacity-20 z-[-2] pointer-events-none">
        <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-50" />
      </div>

      <Suspense fallback={<LoadingState />}>
        <div className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-8 animate-fade-in">
          <VotingInterface />
        </div>
      </Suspense>
    </main>
  );
};

export default Categories;