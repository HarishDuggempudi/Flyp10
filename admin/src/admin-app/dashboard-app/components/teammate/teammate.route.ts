import { NgModule } from '@angular/core';
import { TeamListComponent } from './teammate-list.component';
import { Routes,RouterModule } from '@angular/router';
import {TeammateDetailComponent} from './teammate-detail.component';
import { AddTeamComponent } from './addteam.component';

export const RoutineRoute: Routes = [
  {path:'', component: TeamListComponent},
  {path:'add-teammate', component: AddTeamComponent},
  {path: 'teammate/:teammateid', component: TeammateDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(RoutineRoute)],
  exports: [RouterModule],
})

export class TeamRouting{
  
 }