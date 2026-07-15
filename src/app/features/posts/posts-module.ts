import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PostsRoutingModule } from './posts-routing-module';
import { PostList } from './post-list/post-list';
import { PostItem } from './post-item/post-item';
import { PostCreate } from './post-create/post-create';


@NgModule({
  declarations: [
    PostList,
    PostItem,
    PostCreate
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PostsRoutingModule
  ]
})
export class PostsModule { }
