export interface ChatMessage {
  id: string;
  authorName: string;
  message: string;
  authorPhoto: string;
  isMember: boolean;
  timestamp: string;
}
