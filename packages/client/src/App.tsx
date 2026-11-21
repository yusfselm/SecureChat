import { useState } from "react";
import { Login } from "./pages/Login.tsx";
import { Register } from "./pages/Register.tsx";
import { Users } from "./pages/Users.tsx";
import { Chat } from "./pages/Chat.tsx";

// Minimal screen switching – no router needed for 4 screens.
export type Screen = "login" | "register" | "users" | "chat";

export function App() {
  const [screen, setScreen] = useState<Screen>("login");

  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 720, margin: "2rem auto" }}>
      <h1>SecureChat</h1>
      <nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["login", "register", "users", "chat"] as const).map((s) => (
          <button key={s} onClick={() => setScreen(s)} disabled={screen === s}>
            {s}
          </button>
        ))}
      </nav>
      {screen === "login" && <Login />}
      {screen === "register" && <Register />}
      {screen === "users" && <Users />}
      {screen === "chat" && <Chat />}
    </main>
  );
}
