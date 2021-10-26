import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '../../../shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatChipsModule } from '@angular/material';
import { EventMeetGroupRouting } from './event-meet-group-route';
import { EventMeetGroupService } from './event-meet-group.service';
import { EventMeetGroup } from './event-meet-group.component';

@NgModule({
  imports: [
    CommonModule,
    EventMeetGroupRouting,
    SharedModule.forRoot(),NgxMatSelectSearchModule,MatChipsModule
  ],
  declarations: [
    EventMeetGroup
  ],
  providers:[EventMeetGroupService]
})
export class EventMeetGroupModule { }
