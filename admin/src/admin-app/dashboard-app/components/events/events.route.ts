import { NgModule } from '@angular/core';
import { EventsListComponent } from './events-list-component';
import { Routes,RouterModule } from '@angular/router';
import {EventsComponent} from './events-component';
import {EventsEditorComponent} from './events-editor-component';
export const RoutineRoute: Routes = [
  {path:'', component: EventsComponent, data: { breadcrumb: 'Events'}},
  {path: 'eventslist', component: EventsListComponent, data: { breadcrumb: 'Events List'}},
  {path:'events-editor',component: EventsEditorComponent,data: { breadcrumb: 'Events Editor'}},
  {path:'events-editor/:eventsid',component: EventsEditorComponent,data: { breadcrumb: 'Events Editor'}}
];

@NgModule({
  imports: [RouterModule.forChild(RoutineRoute)],
  exports: [RouterModule],
})

export class EventsRouting{
  
 }