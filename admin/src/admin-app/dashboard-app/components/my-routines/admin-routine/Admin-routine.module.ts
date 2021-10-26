import {NgModule} from '@angular/core';
import {AdminRoutineService} from "./Admin-routines.service";
import {AdminRoutineRouting} from './Admin-routine.route';
import {SharedModule} from '../../../../shared/shared.module';
import { XhrService } from '../../../../shared/services/xhr.service';
import {MatCardModule} from '@angular/material/card';
import {ProgressBarModule} from "angular-progress-bar";
import {AdminRoutineListComponent} from './admin-routine-list';
import {AdminViewComponent} from "./admin-routine-view";
import {NewRoutineListComponent} from "./newRoutine";
import {JudgedRoutineListComponent} from "./judgedroutine";
import {AssignedRoutineListComponent} from './assignedRoutine';
import {InappropriateRoutineListComponent} from './inappropriateRoutine';
import {InCompletedRoutineListComponent} from './incompletedRoutine';
import {ReviewRoutineListComponent} from './review-routine';
import { QueueRoutineComponent } from './queueRoutine';
import { MatExpansionModule, MatIconModule } from '@angular/material';
@NgModule({
    imports: [SharedModule.forRoot(),AdminRoutineRouting,MatIconModule,MatCardModule,ProgressBarModule,MatExpansionModule],
    declarations: [ReviewRoutineListComponent,QueueRoutineComponent,AdminViewComponent,AdminRoutineListComponent,NewRoutineListComponent,InCompletedRoutineListComponent,InappropriateRoutineListComponent,AssignedRoutineListComponent,JudgedRoutineListComponent],
    providers: [AdminRoutineService,XhrService]
})

export class AdminRoutineModule {
    
}