import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext<WebSocket | null>(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export default function WebSocketProvider({ url, children }: { url: string; children: React.ReactNode }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
