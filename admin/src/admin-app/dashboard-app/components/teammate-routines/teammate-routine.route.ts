import { NgModule } from '@angular/core';

import { Routes,RouterModule } from '@angular/router';
import { TeamMateRoutineDetailComponent } from './teammate-routine-detail';
import { TeammateRoutineListComponent } from './teammate-routine-list';


export const RoutineRoute: Routes = [
  {path:'', component: TeammateRoutineListComponent},
  {path:'teammate-routine', component: TeammateRoutineListComponent},
  {path: ':routineId', component: TeamMateRoutineDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(RoutineRoute)],
  exports: [RouterModule],
})

export class TeamMateRoutineRouting{
  
 }