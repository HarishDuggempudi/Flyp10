import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { EventMeetCoachMapping } from './event-meet-coach-mapping.component';
export const eventRoute: Routes = [
  {path:'', component: EventMeetCoachMapping, data: { breadcrumb: 'Event Meet Coach Routing'}},
  
  
 
];

@NgModule({
  imports: [RouterModule.forChild(eventRoute)],
  exports: [RouterModule],
})

export class EventMeetCoachMapRouting{
  
 }