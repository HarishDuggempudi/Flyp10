import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { EventMeetJudgeMapping } from './eventmeet-judge-mapping.component';

export const eventRoute: Routes = [
  {path:'', component: EventMeetJudgeMapping, data: { breadcrumb: 'Event Meet Coach Routing'}},
  
  
 
];

@NgModule({
  imports: [RouterModule.forChild(eventRoute)],
  exports: [RouterModule],
})

export class EventMeetJudgeMapRouting{
  
 }