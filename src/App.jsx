import { useGameStore } from "./store/useGameStore.js";
import DraftScreen from "./screens/DraftScreen.jsx";
import PlayoffsScreen from "./screens/PlayoffsScreen.jsx";
import BoxScoreScreen from "./screens/BoxScoreScreen.jsx";

export default function App() {
  const screen = useGameStore(s => s.screen);
  return (
    <div className="min-h-full">
      {screen === "draft" && <DraftScreen />}
      {screen === "playoffs" && <PlayoffsScreen />}
      {screen === "boxscore" && <BoxScoreScreen />}
    </div>
  );
}