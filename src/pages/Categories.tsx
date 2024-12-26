import { VotingInterface } from "@/components/VotingInterface";
import { Suspense } from "react";
import { LoadingState } from "@/components/voting/LoadingState";

const Categories = () => {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Halos */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-50%] left-[-35%] w-full h-[200%] bg-[radial-gradient(circle,rgba(217,70,239,0.25)_0%,transparent_50%)] z-[-3]" />
        <div className="absolute top-[-50%] right-[-35%] w-full h-[200%] bg-[radial-gradient(circle,rgba(14,165,233,0.25)_0%,transparent_50%)] z-[-3]" />
        <div className="absolute top-[85%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(201,165,92,0.35)_0%,transparent_60%)] z-[-3]" />
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