import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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

interface NotificationResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  data: Notification[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly apiUrl = 'http://localhost:5000/api/notifications';

  private notificationsSubject =
    new BehaviorSubject<Notification[]>([]);

  notifications$ =
    this.notificationsSubject.asObservable();

  private unreadCountSubject =
    new BehaviorSubject<number>(0);

  unreadCount$ =
    this.unreadCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private socketService: SocketService
  ) {}

  // Load existing notifications
  loadNotifications(): void {

    this.http.get<NotificationResponse>(this.apiUrl)
      .subscribe({
        next: (response) => {

          this.notificationsSubject.next(response.data);

          this.updateUnreadCount(response.data);

        },

        error: (error) => {
          console.error(
            'Failed to load notifications:',
            error
          );
        }
      });
  }

  // Listen for real-time notifications
  listenForNotifications(): void {

    this.socketService
      .on<Notification>('notification:new')
      .subscribe((notification) => {

        console.log(
          '🔔 New notification received:',
          notification
        );

        const current =
          this.notificationsSubject.value;

        const updated = [
          notification,
          ...current
        ];

        this.notificationsSubject.next(updated);

        this.updateUnreadCount(updated);
      });
  }

  private updateUnreadCount(
    notifications: Notification[]
  ): void {

    const unread =
      notifications.filter(
        notification => !notification.isRead
      ).length;

    this.unreadCountSubject.next(unread);
  }

  // Get current notifications
  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  // Get unread count
  getUnreadCount(): Observable<number> {
    return this.unreadCount$;
  }
}