import {NgModule}      from '@angular/core';
// import {RoutineService} from "./routines.service";
import {JudgeRoutineComponent} from "./judge-routine.component";
import {RoutineListComponent} from "./routines-list.component";
import {RoutineRouting} from './routines-route';
import {SharedModule} from '../../../shared/shared.module';
import { XhrService } from '../../../shared/services/xhr.service';
import { MinuteSecondsPipe } from './minuteSeconds';
import {MatSliderModule} from '@angular/material/slider';
import {RoutineService} from "./routines.service";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ReversePipe} from './routinepipe';
import { PendingChangesGuard } from './pending-changes.guard';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';

@NgModule({
    imports: [Ng2DeviceDetectorModule.forRoot(),SharedModule.forRoot(),RoutineRouting,MatSliderModule,FormsModule,ReactiveFormsModule,MatAutocompleteModule],
    declarations: [RoutineListComponent, JudgeRoutineComponent, MinuteSecondsPipe,ReversePipe],
    providers: [       
        RoutineService,XhrService,PendingChangesGuard]
})

export class RoutineModule {
    
} 