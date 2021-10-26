import {NgModule}      from '@angular/core';

import {SharedModule} from '../../../shared/shared.module';
import { XhrService } from '../../../shared/services/xhr.service';

import { MatDialogModule } from '@angular/material';
import { TeammateRoutineService } from './teammate-routine.service';
import { TeamMateRoutineRouting } from './teammate-routine.route';
import { TeammateRoutineListComponent } from './teammate-routine-list';
import { TeamMateRoutineDetailComponent } from './teammate-routine-detail';


@NgModule({
    imports: [SharedModule.forRoot(),TeamMateRoutineRouting,MatDialogModule],
    declarations: [TeammateRoutineListComponent, TeamMateRoutineDetailComponent],
    providers: [TeammateRoutineService,XhrService],
    // exports: [AddTeamComponent]
    
})

export class TeammateRoutineModule {
}