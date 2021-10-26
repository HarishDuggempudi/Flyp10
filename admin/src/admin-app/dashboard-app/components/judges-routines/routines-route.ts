import { NgModule } from '@angular/core';
import { RoutineListComponent } from './routines-list.component';
import { Routes,RouterModule } from '@angular/router';
import {JudgeRoutineComponent} from './judge-routine.component';
import { PendingChangesGuard } from './pending-changes.guard';
export const RoutineRoute: Routes = [
  {path:'to-judge/:routineId', component: RoutineListComponent,canDeactivate: [PendingChangesGuard]},
  {path: '', component: JudgeRoutineComponent,canDeactivate: [PendingChangesGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(RoutineRoute)],
  exports: [RouterModule],
})

export class RoutineRouting{
  
 }