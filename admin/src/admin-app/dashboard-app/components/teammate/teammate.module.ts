import {NgModule}      from '@angular/core';
import {TeammateService} from "./teammate.service";
import {TeammateDetailComponent} from "./teammate-detail.component";
import {TeamListComponent} from "./teammate-list.component";
import {TeamRouting} from './teammate.route';
import {SharedModule} from '../../../shared/shared.module';
import { XhrService } from '../../../shared/services/xhr.service';
import { AddTeamComponent } from './addteam.component';
import { DialogOverviewExampleDialog } from './dialog-overview-example-dialog';
import { MatDialogModule } from '@angular/material';


@NgModule({
    imports: [SharedModule.forRoot(),TeamRouting,MatDialogModule],
    declarations: [TeamListComponent, TeammateDetailComponent, AddTeamComponent,DialogOverviewExampleDialog],
    providers: [TeammateService,XhrService],
    // exports: [AddTeamComponent]
    entryComponents: [DialogOverviewExampleDialog]
})

export class TeammateModule {
}