import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { USAGRoutineListComponent } from './usag-organizer-routine.list';
import { USAGViewComponent } from './usag-routine-view';
import { USAGEventmeetListComponent } from './usag-organizer-eventmeet-list';
import { NewRoutineListComponent } from './newRoutine';
import { JudgedRoutineListComponent } from './judgedroutine';
import { QueueRoutineComponent } from './queueRoutine';

export const RoutineRoute: Routes = [
  {path:'',redirectTo: 'routine-management', pathMatch: 'full'},
  {path: 'routine-details/:routineId', component: USAGViewComponent},
  {path: 'routine-management', component: USAGEventmeetListComponent, data: {breadcrumb: 'Routine Management'},  },
  {path: 'routine-management/eventmeet/:eventId', component: USAGRoutineListComponent, data: {breadcrumb: 'Routine Management'},
  children: [
   {path: '', redirectTo: 'newRoutine', pathMatch: 'full'},
   {path: 'newRoutine', component: NewRoutineListComponent, data: {breadcrumb: 'New Routine'}},
   {path: 'judgedRoutine', component: JudgedRoutineListComponent, data: {breadcrumb: 'Judged Routine'}},
   {path: 'queueRoutine', component: QueueRoutineComponent, data: {breadcrumb: 'Queue Routine'}},
   
 ]

},
];

@NgModule({
  imports: [RouterModule.forChild(RoutineRoute)],
  exports: [RouterModule],
})

export class USAGRoutineRouting{
  
 }