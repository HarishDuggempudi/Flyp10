import {NgModule} from '@angular/core';
import {RoutineService} from "./routines.service";
import {RoutineDetailComponent} from "./routine-detail.component";
import {RoutineListComponent} from "./routine-list.component";
import {RoutineRouting} from './routine.route';
import {SharedModule} from '../../../shared/shared.module';
import { XhrService } from '../../../shared/services/xhr.service';
import {ReversePipe} from './routinepipe';
import { ShareButtonsModule } from '@ngx-share/buttons';
import {SharePage} from './sharepage.component'
import {MatCardModule} from '@angular/material/card';
import {MinuteSecondsPipe} from './minuteSeconds';
import {TermsPage} from '../../../../app/components/landing/conditons.component';
import  {Services }from '../../../../app/shared/services';
import {GroupByPipe} from './groupby';
import {ProgressBarModule} from "angular-progress-bar";

@NgModule({
    imports: [SharedModule.forRoot(),RoutineRouting,ShareButtonsModule.forRoot(),MatCardModule,ProgressBarModule],
    declarations: [RoutineListComponent, RoutineDetailComponent,ReversePipe,GroupByPipe,SharePage,MinuteSecondsPipe,TermsPage],
    providers: [RoutineService,XhrService,Services]
})

export class RoutineModule {
    
}