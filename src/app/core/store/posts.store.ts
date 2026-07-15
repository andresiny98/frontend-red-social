import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { AuthStore } from './auth.store';
import { RealtimeService } from '../services/realtime.service';
import { Post } from '../models/post.model';

interface PostsState {
  posts: Post[];
}

const initialState: PostsState = {
  posts: [],
};

export const PostsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authStore = inject(AuthStore)) => ({
    setPosts(posts: Post[]): void {
      patchState(store, { posts });
    },

    addPost(post: Post): void {
      patchState(store, { posts: [post, ...store.posts()] });
    },

    updateLike(postId: number, likesCount: number, likedBy: number[]): void {
      const currentUserId = authStore.user()?.id;
      patchState(store, {
        posts: store.posts().map((post) =>
          post.id === postId
            ? { ...post, likesCount, likedByMe: currentUserId != null && likedBy.includes(currentUserId) }
            : post
        ),
      });
    },
  })),
  withHooks({
    onInit(store) {
      const realtimeService = inject(RealtimeService);
      realtimeService.likeUpdate$.subscribe((event) => {
        store.updateLike(event.postId, event.likesCount, event.likedBy);
      });
    },
  })
);

// Permite inyectar PostsStore por constructor (`constructor(private postsStore: PostsStore)`):
// signalStore() solo produce un binding de valor, así que aquí se le añade el tipo homónimo.
export interface PostsStore extends InstanceType<typeof PostsStore> {}
