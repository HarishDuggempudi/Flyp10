import { DashboardRouting } from './dashboard.route';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {
    UserCount, PageViewComponent, BrowserAnalysisChart, CountryWiseChart,
    LastWeekVsThisWeekAnalysisChart
} from "./dashboard.component";
import {DashboardService} from "./dashboard.service";
import {DashboardComponent} from './dashboard.component';
import {AnimateCounterComponent} from "../../../shared/components/animate-counter.component";
import { ChartsModule } from 'ng2-charts';
import { Analytics } from './anlytics';
import { EventValue } from './eventvalue';
import { EventScore } from './eventScore';
import { EventScoreTracking } from './eventScoreTracking';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {GroupBySportsPipe} from './groupBySports';
//import { FullCalendarModule } from 'ng-fullcalendar';
@NgModule({
    imports: [SharedModule.forRoot(), DashboardRouting, ChartsModule, MatProgressBarModule],
    declarations: [UserCount, PageViewComponent, DashboardComponent,EventScoreTracking,GroupBySportsPipe,
        CountryWiseChart, BrowserAnalysisChart,Analytics,EventValue,EventScore,
        LastWeekVsThisWeekAnalysisChart, AnimateCounterComponent],
    providers: [DashboardService]
})

export class DashboardModule {
}