import {NgModule}      from '@angular/core';
import {SendNotificationService} from "./sendnotification.service";
import {SharedModule} from '../../../shared/shared.module';
import { XhrService } from '../../../shared/services/xhr.service';
import {MatDividerModule} from '@angular/material/divider';
import {TimeAgoPipe} from 'time-ago-pipe';
import { SendNotificationRouting } from './sendnotification.route';
import { SendNotificationComponent } from './sendnotification.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatChipsModule } from '@angular/material';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule,SharedModule.forRoot(),SendNotificationRouting,NgxMatSelectSearchModule,MatChipsModule],
    declarations: [SendNotificationComponent],
    providers: [SendNotificationService,XhrService],
    exports:[SendNotificationComponent]
})

export class SendNotificationModule {
}