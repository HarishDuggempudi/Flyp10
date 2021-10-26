import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { USAGSanctionListComponent } from './usag-sanction-list';


export const eventRoute: Routes = [
  {path:'', component:USAGSanctionListComponent , data: { breadcrumb: 'Event Meet'}},
];

@NgModule({
  imports: [RouterModule.forChild(eventRoute)],
  exports: [RouterModule],
})

export class USAGSanctionRouting{
  
 }