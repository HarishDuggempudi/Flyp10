import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { EventMeetGroup } from './event-meet-group.component';

export const eventRoute: Routes = [
  {path:'', component: EventMeetGroup, data: { breadcrumb: 'Event Meet Grouping'}},
  
  
 
];

@NgModule({
  imports: [RouterModule.forChild(eventRoute)],
  exports: [RouterModule],
})

export class EventMeetGroupRouting{
  
 }