import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { VotingInterface } from "@/components/VotingInterface";

const Categories = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate any initial loading that might be needed
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8 animate-fade-in">
        <h1 className="text-4xl font-bold mb-8 golden-reflection text-center">
          Catégories
        </h1>
        <VotingInterface />
      </div>
    </main>
  );
};

export default Categories;