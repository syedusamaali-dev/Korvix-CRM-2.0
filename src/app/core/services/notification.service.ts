import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from './socket.service';

export interface Notification {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  module: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private socketService: SocketService
  ) {}

  onNewNotification(): Observable<Notification> {
    return this.socketService.on<Notification>(
      'notification:new'
    );
  }
}