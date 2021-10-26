import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../shared/shared.module';
import { XhrService } from '../../../../shared/services/xhr.service';
import {MatCardModule} from '@angular/material/card';
import {ProgressBarModule} from "angular-progress-bar";





import { USAGRoutineRouting } from './usag-organizer.route';
import { USAGRoutineService } from './usag-routine.service';
import { USAGRoutineListComponent } from './usag-organizer-routine.list';
import { USAGViewComponent } from './usag-routine-view';
import { USAGEventmeetListComponent } from './usag-organizer-eventmeet-list';
import { NewRoutineListComponent } from './newRoutine';
import { JudgedRoutineListComponent } from './judgedroutine';
import { QueueRoutineComponent } from './queueRoutine';

@NgModule({
    imports: [SharedModule.forRoot(),USAGRoutineRouting,MatCardModule,ProgressBarModule],
    declarations: [USAGViewComponent,USAGEventmeetListComponent,QueueRoutineComponent,JudgedRoutineListComponent,NewRoutineListComponent,USAGRoutineListComponent],
    providers: [USAGRoutineService,XhrService]
})

export class USAGRoutineModule {
    
}