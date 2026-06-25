import express from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { Masterchat, stringify } from "masterchat";
import path from "path";

const PORT = Number(process.env.PORT) || 3001;
const DIST_DIR = path.resolve(import.meta.dirname, "dist");

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

function listen(port: number) {
  const app = express();
  app.use(cors());
  app.use(express.static(DIST_DIR));
  app.get("*", (_req, res) => res.sendFile(path.join(DIST_DIR, "index.html")));

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer });
  wss.on("connection", handleConnection);

  httpServer.on("error", (err) => {
    throw err;
  });

  httpServer.listen(port, () => {
    console.log(`✅ Server listening on port ${port}`);
  });
}

listen(PORT);
