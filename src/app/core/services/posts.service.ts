import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly baseUrl = `${environment.apiUrl}/posts`;

  constructor(private readonly http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl);
  }

  createPost(message: string): Observable<Post> {
    return this.http.post<Post>(this.baseUrl, { message });
  }

  likePost(postId: number): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/${postId}/like`, {});
  }
}
