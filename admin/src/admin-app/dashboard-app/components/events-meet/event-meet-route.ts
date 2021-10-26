import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import {EventMeetComponent} from '../events-meet/event-meet-list/event-meet-list'
import{EventMeetEditorComponent} from './event-meet-editor/event-meet-editor'
import { EventMeetView } from './event-meet-view/event-meet-view';
import { USAGSanctionSettingComponent } from './usag-sanction-settings/usag-sanction-setting.component';
import { USAGSanctionListComponent } from './usag-sanction/usag-sanction-list.component';
export const eventRoute: Routes = [
  {path:'', component: EventMeetComponent, data: { breadcrumb: 'Event Meet'}},
  {path: 'event-meet-list', component: EventMeetComponent, data: { breadcrumb: 'Event Meet'}},
  {path: 'event-meet-editor', component: EventMeetEditorComponent, data: { breadcrumb: 'Event Meet Editor'}},
  {path: 'event-meet-view/:eventId', component: EventMeetView, data: { breadcrumb: 'Event Meet Editor'}},
  {path: 'event-meet-editor/:eventId', component: EventMeetEditorComponent, data: { breadcrumb: 'Event Meet Editor'}},
  {path:'usag-sanction-list',component:USAGSanctionListComponent, data: { breadcrumb: 'USAG Sanction'}},
  {path:'usag-sanction-event-meet/:sanctionid',component:EventMeetComponent, data: { breadcrumb: 'USAG Sanction Event Meet'}},
  {path:'usag-sanction-event-meet-editor/:sanctionid',component:EventMeetEditorComponent, data: { breadcrumb: 'USAG Sanction Event Meet Editor'}},
  {path:'usag-sanction-setting/:sanctionid',component:USAGSanctionSettingComponent, data: { breadcrumb: 'USAG Sanction Setting'}}

  
 
];

@NgModule({
  imports: [RouterModule.forChild(eventRoute)],
  exports: [RouterModule],
})

export class EventMeetRouting{
  
 }