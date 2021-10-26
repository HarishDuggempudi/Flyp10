import { NgModule } from '@angular/core';
import { VideoComponent } from './video-list.component';
import { Routes,RouterModule } from '@angular/router';
import {VideoEditorComponent} from './video-editor.component';

export const VideoRoute: Routes = [
  {path:'', component: VideoComponent},
  {path:'banner', component: VideoComponent},
  {path: 'editor', component: VideoEditorComponent},
  {path: 'editor/:bannerid', component: VideoEditorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(VideoRoute)],
  exports: [RouterModule],
})

export class VideoRouting { }