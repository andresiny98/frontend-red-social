import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PostsService } from '../../../core/services/posts.service';
import { PostsStore } from '../../../core/store/posts.store';

@Component({
  selector: 'app-post-create',
  standalone: false,
  templateUrl: './post-create.html',
  styleUrl: './post-create.scss',
})
export class PostCreate {
  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly postsService: PostsService,
    private readonly postsStore: PostsStore
  ) {
    this.form = this.fb.group({
      message: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { message } = this.form.getRawValue();
    this.postsService.createPost(message!.trim()).subscribe({
      next: (post) => this.postsStore.addPost(post),
    });
    this.form.reset();
  }
}
