import express from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { Masterchat, stringify } from "masterchat";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

const MIN_PORT = 3001;
const MAX_PORT = 3010;
const CHAT_PORT_FILE = path.resolve(import.meta.dirname, "..", "public", "chat-port.json");

interface JoinMessage {
  type: "join";
  videoId: string;
}

function isJoinMessage(value: unknown): value is JoinMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as JoinMessage).type === "join" &&
    typeof (value as JoinMessage).videoId === "string"
  );
}

function handleConnection(ws: WebSocket) {
  console.log("🔌 Client connected");
  let mc: Masterchat | undefined;

  ws.once("message", async (raw) => {
    console.log("Raw message:", raw.toString());

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw.toString());
    } catch (err) {
      console.error("JSON.parse error:", err);
      ws.send(JSON.stringify({ type: "error", message: "Invalid message" }));
      return;
    }
    console.log("Parsed message:", parsed);

    if (!isJoinMessage(parsed)) {
      ws.send(JSON.stringify({ type: "error", message: "Expected join message" }));
      return;
    }

    console.log("🎯 Joining videoId:", parsed.videoId);
    try {
      mc = await Masterchat.init(parsed.videoId);
    } catch (err) {
      console.error("Masterchat.init error:", err);
      ws.send(JSON.stringify({ type: "error", message: "Stream is not live" }));
      return;
    }
    console.log("Masterchat initialized, isLive:", mc.isLive);

    if (!mc.isLive) {
      ws.send(JSON.stringify({ type: "error", message: "Stream is not live" }));
      return;
    }

    mc.on("chat", (action) => {
      // console.log(`📨 chat from ${action.authorName}: ${stringify(action.message)}`);
      const data = {
        id: action.id,
        authorName: action.authorName ?? "Unknown",
        message: stringify(action.message),
        authorPhoto: action.authorPhoto,
        isMember: action.membership !== undefined,
        timestamp: action.timestamp.toISOString(),
      };
      ws.send(JSON.stringify({ type: "chat", data }));
    });

    mc.on("error", (err) => {
      console.error("Masterchat listen error:", err);
      ws.send(JSON.stringify({ type: "error", message: "Stream is not live" }));
    });

    mc.listen();
  });

  ws.on("close", () => {
    console.log("🔌 Client disconnected");
    mc?.stop();
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
}

function writeChatPortFile(port: number) {
  mkdirSync(path.dirname(CHAT_PORT_FILE), { recursive: true });
  writeFileSync(CHAT_PORT_FILE, JSON.stringify({ port }));
}

function tryListen(port: number) {
  const app = express();
  app.use(cors());

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer });
  wss.on("connection", handleConnection);

  // ws forwards the underlying http server's "error" event onto wss, so a
  // single EADDRINUSE fires this handler twice (once per emitter) — guard
  // against acting on it more than once per attempt.
  let handled = false;

  function handleServerError(err: NodeJS.ErrnoException) {
    if (handled) return;
    handled = true;

    if (err.code === "EADDRINUSE" && port < MAX_PORT) {
      httpServer.close(() => tryListen(port + 1));
      return;
    }

    if (err.code === "EADDRINUSE") {
      console.error(
        `❌ Ports ${MIN_PORT}-${MAX_PORT} are all in use. Run: netstat -ano | findstr :${port} then taskkill /PID <pid> /F`
      );
      process.exit(1);
    }

    throw err;
  }

  httpServer.on("error", handleServerError);
  wss.on("error", handleServerError);

  httpServer.listen(port, () => {
    writeChatPortFile(port);
    console.log(`✅ Chat server listening on port ${port}`);
  });
}

tryListen(MIN_PORT);
