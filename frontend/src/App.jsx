import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { statsService } from "./services/statsService";
import NavBar from "./components/NavBar";
import ErrorBoundary from "./components/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";
import Community from "./pages/Community";
import AuthModal from "./components/AuthModal";
import { C } from "./utils/designTokens";
import "./styles/App.css";

function App() {
  const { isAuthenticated } = useAuth();
  const [screen, setScreen] = useState("dashboard");
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (isAuthenticated) {
        try {
          const stats = await statsService.getMyStats();
          setUserStats(stats);
        } catch (err) {
          console.error("Error fetching user stats:", err);
        }
      }
    };

    fetchUserStats();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AuthModal isOpen={true} onClose={() => {}} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: C.mono,
      }}
    >
      <NavBar screen={screen} setScreen={setScreen} userStats={userStats} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <ErrorBoundary fallbackText="Failed to render this page.">
          {screen === "dashboard" && <Dashboard />}
          {screen === "leaderboard" && <Leaderboard />}
          {screen === "achievements" && <Achievements />}
          {screen === "community" && <Community />}
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
