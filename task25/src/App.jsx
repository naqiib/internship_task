import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WelcomeScreen from "./components/WelcomeScreen";
import TaskManager from "./components/TaskManager";

export default function App() {
  const [userName, setUserName] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userName={userName} onLogout={() => setUserName("")} />

      {userName ? (
        <TaskManager userName={userName} />
      ) : (
        <WelcomeScreen onStart={setUserName} />
      )}

      <Footer />
    </div>
  );
}
