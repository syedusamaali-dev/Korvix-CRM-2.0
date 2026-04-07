import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { SOCKET_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket!: Socket;

  connect(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('❌ No authentication token found.');
      return;
    }

    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token
      },
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('🔌 Socket connected:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>((observer) => {

      if (!this.socket) {
        return;
      }

      this.socket.on(event, (data: T) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(event);
      };
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined!;
    }
  }
}
