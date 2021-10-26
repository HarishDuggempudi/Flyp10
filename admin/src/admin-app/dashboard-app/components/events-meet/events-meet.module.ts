import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventMeetComponent} from '../events-meet/event-meet-list/event-meet-list'
import {EventMeetRouting} from "./event-meet-route"
import { SharedModule } from '../../../shared/shared.module';
import { XhrService } from '../../../shared/services/xhr.service';
import { EventMeetService } from './event-meet-service';
import{EventMeetEditorComponent} from './event-meet-editor/event-meet-editor';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EventMeetView } from './event-meet-view/event-meet-view';
import {MatChipsModule} from '@angular/material/chips';
import {MatMenuModule} from '@angular/material/menu';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import { USAGSanctionListComponent } from './usag-sanction/usag-sanction-list.component';
import { USAGSanctionSettingComponent } from './usag-sanction-settings/usag-sanction-setting.component';
import {ProgressBarModule} from "angular-progress-bar";


@NgModule({
  imports: [
    CommonModule,MatMenuModule,MatIconModule,MatAutocompleteModule,ProgressBarModule,SharedModule.forRoot(),EventMeetRouting,NgxMatSelectSearchModule,MatChipsModule
  ],
  declarations: [
    EventMeetComponent,
    EventMeetEditorComponent,
    EventMeetView,
    USAGSanctionListComponent,
    USAGSanctionSettingComponent,
  ],providers: [EventMeetService,XhrService]
})
export class EventsMeetModule { }
