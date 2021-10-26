import {NgModule}      from '@angular/core';
import {EventsListComponent} from "./events-list-component";
import {EventsComponent} from "./events-component";
import {EventsEditorComponent}from "./events-editor-component";
import {EventsRouting} from './events.route';
import {SharedModule} from '../../../shared/shared.module';
import { XhrService } from '../../../shared/services/xhr.service';
import {EventsService} from './events.service';
import { FullCalendarModule } from 'ng-fullcalendar';
import { UploadCSVDialog } from './upload-csv-dialog';
import { MatDialogModule } from '@angular/material';
@NgModule({
    imports: [SharedModule.forRoot(),EventsRouting, FullCalendarModule, MatDialogModule],
    declarations: [EventsListComponent, EventsComponent,EventsEditorComponent,UploadCSVDialog],
    providers: [EventsService,XhrService],
    entryComponents: [UploadCSVDialog]
})

export class EventsModule {
}