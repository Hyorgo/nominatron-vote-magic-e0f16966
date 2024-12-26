import { VotingInterface } from "@/components/VotingInterface";
import { Suspense } from "react";
import { LoadingState } from "@/components/voting/LoadingState";

const Categories = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Halos */}
      <div className="gold-halo" />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-3]" />
      
      <Suspense fallback={<LoadingState />}>
        <div className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-8 animate-fade-in">
          <VotingInterface />
        </div>
      </Suspense>
    </main>
  );
};

export default Categories;