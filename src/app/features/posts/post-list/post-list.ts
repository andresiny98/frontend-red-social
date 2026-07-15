import { Component, OnInit, signal } from '@angular/core';
import { PostsService } from '../../../core/services/posts.service';
import { PostsStore } from '../../../core/store/posts.store';

@Component({
  selector: 'app-post-list',
  standalone: false,
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss',
})
export class PostList implements OnInit {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private readonly postsService: PostsService,
    readonly postsStore: PostsStore
  ) { }

  ngOnInit(): void {
    this.loading.set(true);
    this.postsService.getPosts().subscribe({
      next: (posts) => {
        this.postsStore.setPosts(posts);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'No se pudieron cargar las publicaciones');
        this.loading.set(false);
      },
    });
  }
}
