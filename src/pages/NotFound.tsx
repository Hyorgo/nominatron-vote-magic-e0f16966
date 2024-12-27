import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Oops! La page que vous recherchez n'existe pas.</p>
      <Link to="/">
        <Button className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          Retourner à l'accueil
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;