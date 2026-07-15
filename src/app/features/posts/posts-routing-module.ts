import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostList } from './post-list/post-list';

const routes: Routes = [{ path: '', component: PostList }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
