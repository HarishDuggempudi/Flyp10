import { NgModule } from '@angular/core';
import { NotificationListComponent } from './notification-list.component';
import { Routes,RouterModule } from '@angular/router';
import { NotificationDetailComponent } from './notification-detail.component';

export const RoutineRoute: Routes = [
  {path:'', component: NotificationListComponent},
  {path: 'details/:routineId', component: NotificationDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(RoutineRoute)],
  exports: [RouterModule],
})

export class NotificationRouting{
  
 }