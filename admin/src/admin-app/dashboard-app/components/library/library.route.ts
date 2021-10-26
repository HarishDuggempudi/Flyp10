import { NgModule } from '@angular/core';
import { LibraryListComponent } from './library-list-component';
import { Routes,RouterModule } from '@angular/router';
import {LibraryComponent} from './library-component';
import {LibraryEditorComponent} from './library-editor-component';
export const RoutineRoute: Routes = [
  {path:'', component: LibraryComponent, data: { breadcrumb: 'library'}},
  {path: 'librarylist', component: LibraryListComponent, data: { breadcrumb: 'library List'}},
  {path:'library-editor',component: LibraryEditorComponent,data: { breadcrumb: 'library Editor'}},
  {path:'library-editor/:libraryid',component: LibraryEditorComponent,data: { breadcrumb: 'library Editor'}}
];

@NgModule({
  imports: [RouterModule.forChild(RoutineRoute)],
  exports: [RouterModule],
})

export class LibraryRouting{
  
 }