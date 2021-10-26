import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatChipsModule } from '@angular/material';
import { EventMeetJudgeMapping } from './eventmeet-judge-mapping.component';
import { EventMeetJudgeMapRouting } from './eventmeet-judge-mapping.route';
import { EventMeetJudgeMappingService } from './eventmeet-judge.service';

@NgModule({
  imports: [
    CommonModule,
    EventMeetJudgeMapRouting,
    SharedModule.forRoot(),NgxMatSelectSearchModule,MatChipsModule
  ],
  declarations: [
    EventMeetJudgeMapping
  ],
  providers:[EventMeetJudgeMappingService]
})
export class EventMeetJudgeMappingModule { }
