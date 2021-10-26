import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventMeetCoachMapping } from './event-meet-coach-mapping.component';
import { EventMeetCoachMappingService } from './event-meet-coach-map.service';
import { EventMeetCoachMapRouting } from './event-meet-coach-mapping-route';
import { SharedModule } from '../../../shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatChipsModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    EventMeetCoachMapRouting,
    SharedModule.forRoot(),NgxMatSelectSearchModule,MatChipsModule
  ],
  declarations: [
    EventMeetCoachMapping
  ],
  providers:[EventMeetCoachMappingService]
})
export class EventMeetCoachMappingModule { }
