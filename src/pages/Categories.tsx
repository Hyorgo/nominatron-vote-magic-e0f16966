import { VotingInterface } from "@/components/VotingInterface";
import { Suspense } from "react";
import { LoadingState } from "@/components/voting/LoadingState";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Categories = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-background">
        <Suspense fallback={<LoadingState />}>
          <div className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-8 animate-fade-in">
            <VotingInterface />
          </div>
        </Suspense>
      </main>
    </QueryClientProvider>
  );
};

export default Categories;