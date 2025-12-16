import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.token = token;
    
    this.socket = io('http://localhost:3003/messaging', {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('new-message', (data) => {
      this.emit('new-message', data);
    });

    this.socket.on('message-sent', (data) => {
      this.emit('message-sent', data);
    });

    this.socket.on('user-online', (data) => {
      this.emit('user-online', data);
    });

    this.socket.on('user-offline', (data) => {
      this.emit('user-offline', data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.token = null;
  }

  sendMessage(threadId: string, receiverId: string, text: string): void {
    if (!this.socket?.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.emit('send-message', {
      threadId,
      receiverId,
      text,
    });
  }

  markThreadAsRead(threadId: string): void {
    if (!this.socket?.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.emit('mark-read', { threadId });
  }

  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const webSocketService = new WebSocketService();

