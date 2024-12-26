import { VotingInterface } from "@/components/VotingInterface";
import { Suspense } from "react";
import { LoadingState } from "@/components/voting/LoadingState";

const Categories = () => {
  return (
    <main className="min-h-screen bg-background relative">
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