import {NgModule}      from '@angular/core';
import {NotificationService} from "./notification.service";
import {NotificationDetailComponent} from "./notification-detail.component";
import {NotificationListComponent} from "./notification-list.component";
import {NotificationRouting} from './notification.route';
import {SharedModule} from '../../../shared/shared.module';
import { XhrService } from '../../../shared/services/xhr.service';
import {MatDividerModule} from '@angular/material/divider';
import {TimeAgoPipe} from 'time-ago-pipe';

@NgModule({
    imports: [SharedModule.forRoot(),NotificationRouting,MatDividerModule],
    declarations: [NotificationListComponent, NotificationDetailComponent, TimeAgoPipe],
    providers: [NotificationService,XhrService],
    exports:[NotificationListComponent]
})

export class NotificationModule {
}