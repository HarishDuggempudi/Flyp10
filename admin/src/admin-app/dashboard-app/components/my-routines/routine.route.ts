import { NgModule } from '@angular/core';
import { RoutineListComponent } from './routine-list.component';
import { Routes,RouterModule } from '@angular/router';
import {RoutineDetailComponent} from './routine-detail.component';
import {SharePage} from './sharepage.component'

export const RoutineRoute: Routes = [
  {path:'', component: RoutineListComponent},
  {path: 'details/:routineId', component: RoutineDetailComponent},
  {path: 'share/:routineId', component: SharePage},
  
];

@NgModule({
  imports: [RouterModule.forChild(RoutineRoute)],
  exports: [RouterModule],
})

export class RoutineRouting{
  
 }