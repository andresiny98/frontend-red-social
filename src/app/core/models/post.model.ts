export interface PostAuthor {
  id: number;
  username: string;
  alias: string;
}

export interface Post {
  id: number;
  message: string;
  publishedAt: string;
  author: PostAuthor | null;
  likesCount: number;
  likedByMe: boolean;
}

export interface LikeUpdateEvent {
  postId: number;
  likesCount: number;
  likedBy: number[];
}
