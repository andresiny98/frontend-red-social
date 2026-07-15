import { Component, Input } from '@angular/core';
import { Post } from '../../../core/models/post.model';
import { PostsService } from '../../../core/services/posts.service';

@Component({
  selector: 'app-post-item',
  standalone: false,
  templateUrl: './post-item.html',
  styleUrl: './post-item.scss',
})
export class PostItem {
  @Input({ required: true }) post!: Post;

  constructor(private readonly postsService: PostsService) { }

  toggleLike(): void {
    this.postsService.likePost(this.post.id).subscribe();
  }
}
