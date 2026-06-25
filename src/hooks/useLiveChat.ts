import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "../types/chat";

const MAX_MESSAGES = 200;

interface UseLiveChatResult {
  messages: ChatMessage[];
  isConnected: boolean;
  error: string | null;
}

export function useLiveChat(videoId: string | null): UseLiveChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([]);
    setError(null);
    setIsConnected(false);

    if (!videoId) return;

    let cancelled = false;
    let ws: WebSocket | undefined;

    fetch("/chat-port.json")
      .then((res) => res.json())
      .then((data: { port: number }) => {
        if (cancelled) return;

        ws = new WebSocket(`ws://localhost:${data.port}`);

        ws.onopen = () => {
          setIsConnected(true);
          ws?.send(JSON.stringify({ type: "join", videoId }));
        };

        ws.onmessage = (event) => {
          const parsed = JSON.parse(event.data);

          if (parsed.type === "chat") {
            setMessages((prev) => {
              const next = [...prev, parsed.data as ChatMessage];
              return next.length > MAX_MESSAGES ? next.slice(next.length - MAX_MESSAGES) : next;
            });
          } else if (parsed.type === "error") {
            setError(parsed.message);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
        };

        ws.onerror = () => {
          setError("Connection to chat server failed");
        };
      })
      .catch(() => {
        if (!cancelled) setError("Could not reach chat server");
      });

    return () => {
      cancelled = true;
      ws?.close();
    };
  }, [videoId]);

  return { messages, isConnected, error };
}
