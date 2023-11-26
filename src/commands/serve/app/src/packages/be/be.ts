import { createContext, useContext } from "react";
import { WebSocketSubject, webSocket } from "rxjs/webSocket";
import { ZrozumiloWebsocketMessage } from "./ZrozumiloWebsocketMessage";

export type WS = WebSocketSubject<ZrozumiloWebsocketMessage>;

let socket: WS | null = null;

const WS_URL = "ws://localhost:8080";

export const uniqid = ((prefix?: string, suffix?: string) => {
  let id = 0;
  return (): string => (prefix || "") + ++id + (suffix || "");
})();

export function getSocket(): WS {
  if (socket) return socket;
  socket = webSocket(WS_URL);
  return socket;
}

export const SocketContext = createContext<WS>(null as any as WS);

export function useWS(): WS {
  return useContext(SocketContext);
}
