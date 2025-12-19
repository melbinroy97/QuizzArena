import { useEffect } from "react";
import socket from "../socket";

export default function SocketTest() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);

      // fake session id for test
      socket.emit("join-session", "TEST_SESSION_ID");
    });

    return () => socket.disconnect();
  }, []);

  return <h1>Socket Test Page</h1>;
}
