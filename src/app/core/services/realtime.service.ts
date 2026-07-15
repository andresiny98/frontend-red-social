import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LikeUpdateEvent } from '../models/post.model';

interface SocketMessage {
  type: string;
  payload: unknown;
}

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private socket: WebSocket | null = null;
  private readonly likeUpdateSubject = new Subject<LikeUpdateEvent>();

  readonly likeUpdate$ = this.likeUpdateSubject.asObservable();

  connect(token: string): void {
    if (this.socket) {
      return;
    }
    const wsUrl = environment.wsUrl.replace(/^http/, 'ws');
    this.socket = new WebSocket(`${wsUrl}/ws?token=${encodeURIComponent(token)}`);
    this.socket.addEventListener('message', (event) => {
      const message: SocketMessage = JSON.parse(event.data);
      if (message.type === 'post:like') {
        this.likeUpdateSubject.next(message.payload as LikeUpdateEvent);
      }
    });
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
  }
}
