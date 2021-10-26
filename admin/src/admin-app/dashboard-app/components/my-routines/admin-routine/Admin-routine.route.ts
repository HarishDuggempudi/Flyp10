import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import {AdminRoutineListComponent} from './admin-routine-list';
import {AdminViewComponent} from "./admin-routine-view";
import {NewRoutineListComponent} from "./newRoutine";
import {JudgedRoutineListComponent} from "./judgedroutine"
import {AssignedRoutineListComponent} from './assignedRoutine';
import {InappropriateRoutineListComponent} from './inappropriateRoutine';
import {InCompletedRoutineListComponent} from './incompletedRoutine';
import {ReviewRoutineListComponent} from './review-routine';
import { QueueRoutineComponent } from './queueRoutine';
export const RoutineRoute: Routes = [
  {path:'',redirectTo: 'routine-management', pathMatch: 'full'},
  {path: 'routine-details/:routineId', component: AdminViewComponent},
  {path: 'routine-management', component:AdminRoutineListComponent , data: {breadcrumb: 'Routine Management'},
     children: [
      {path: '', redirectTo:'newRoutine/flyp10'},
      {path: 'newRoutine/:type', component: NewRoutineListComponent, data: {breadcrumb: 'New Routine'}},
      {path: 'QueueRoutine/:type', component: QueueRoutineComponent, data: {breadcrumb: 'New Routine'}},
      {path: 'judgedRoutine/:type', component: JudgedRoutineListComponent, data: {breadcrumb: 'Judged Routine'}},
      {path: 'assignedRoutine/:type', component: AssignedRoutineListComponent, data: {breadcrumb: 'Assigned Routine'}},
      {path: 'incompletedRoutine/:type', component: InCompletedRoutineListComponent, data: {breadcrumb: 'In Complete Routine'}},
      {path: 'inappropriateRoutine/:type', component: InappropriateRoutineListComponent, data: {breadcrumb: 'In Appropriate Routine'}},
      {path: 'Meet-Routine/:type', component: ReviewRoutineListComponent, data: {breadcrumb: 'Event Meet Routine'}}    	  
    ]
  
  },
];

@NgModule({
  imports: [RouterModule.forChild(RoutineRoute)],
  exports: [RouterModule],
})

export class AdminRoutineRouting{
  
 }