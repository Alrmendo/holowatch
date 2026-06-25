import { useEffect, useState } from "react";
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

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onopen = () => {
      if (cancelled) return;
      setIsConnected(true);
      ws.send(JSON.stringify({ type: "join", videoId }));
    };

    ws.onmessage = (event) => {
      if (cancelled) return;
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
      if (cancelled) return;
      setIsConnected(false);
    };

    ws.onerror = () => {
      if (cancelled) return;
      setError("Connection to chat server failed");
    };

    return () => {
      cancelled = true;
      ws.close();
    };
  }, [videoId]);

  return { messages, isConnected, error };
}
