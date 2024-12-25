import { useState } from "react";
import { AdminDashboard } from "@/components/AdminDashboard";
import { VotingInterface } from "@/components/VotingInterface";
import { Button } from "@/components/ui/button";
import { UserCog, Vote } from "lucide-react";

const Index = () => {
  const [view, setView] = useState<"admin" | "voting">("voting");

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-bold">Système de Vote</h1>
          <Button
            variant="ghost"
            onClick={() => setView(view === "admin" ? "voting" : "admin")}
          >
            {view === "admin" ? (
              <>
                <Vote className="h-4 w-4 mr-2" />
                Mode Vote
              </>
            ) : (
              <>
                <UserCog className="h-4 w-4 mr-2" />
                Mode Admin
              </>
            )}
          </Button>
        </div>
      </header>

      <main>
        {view === "admin" ? <AdminDashboard /> : <VotingInterface />}
      </main>
    </div>
  );
};

export default Index;