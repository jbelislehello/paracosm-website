import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import EditorialAuthShell from "@/components/editorial/EditorialAuthShell";
import EditorialCTA from "@/components/editorial/EditorialCTA";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <EditorialAuthShell
      numeral="404"
      kicker="Dispatch / Not Found"
      tone="night"
      title={<>The page you sought is not in this issue.</>}
      subtitle={
        <>
          The route <span className="font-mono opacity-90">{location.pathname}</span> doesn't
          exist — or has been folded into another chapter.
        </>
      }
      footer={
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.3em] opacity-70 hover:opacity-100 transition-opacity"
        >
          Paracosm · Editorial Front Door
        </Link>
      }
    >
      <div className="flex flex-col gap-3">
        <EditorialCTA to="/" tone="night" variant="primary">
          Return to the front page
        </EditorialCTA>
        <EditorialCTA to="/trainings" tone="night" variant="ghost">
          Browse trainings
        </EditorialCTA>
      </div>
    </EditorialAuthShell>
  );
};

export default NotFound;
