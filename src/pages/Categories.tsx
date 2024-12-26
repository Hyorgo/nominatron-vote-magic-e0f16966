import { VotingInterface } from "@/components/VotingInterface";
import { Suspense } from "react";
import { LoadingState } from "@/components/voting/LoadingState";

const Categories = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Halo fuchsia à gauche */}
      <div className="fixed top-[-50%] left-[-35%] w-full h-[200%] bg-[radial-gradient(circle,rgba(217,70,239,0.25)_0%,transparent_50%)] pointer-events-none z-[-3]" />

      {/* Halo bleu à droite */}
      <div className="fixed top-[-50%] right-[-35%] w-full h-[200%] bg-[radial-gradient(circle,rgba(14,165,233,0.25)_0%,transparent_50%)] pointer-events-none z-[-3]" />

      {/* Halo doré central */}
      <div className="gold-halo" />

      <Suspense fallback={<LoadingState />}>
        <div className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-8 animate-fade-in">
          <VotingInterface />
        </div>
      </Suspense>
    </main>
  );
};

export default Categories;