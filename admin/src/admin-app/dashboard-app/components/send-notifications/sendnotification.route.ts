import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { SendNotificationComponent } from './sendnotification.component';



export const RoutineRoute: Routes = [
  {path:'', component: SendNotificationComponent},
  //{path: '', component: },
];

@NgModule({
  imports: [RouterModule.forChild(RoutineRoute)],
  exports: [RouterModule],
})

export class SendNotificationRouting{
  
 }