import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventMeetComponent} from '../events-meet/event-meet-list/event-meet-list'
import { SharedModule } from '../../../shared/shared.module';
import { XhrService } from '../../../shared/services/xhr.service';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import { USAGSanctionRouting } from './usag-sanction.route';
import { USAGSanctionService } from './usag-sanction.service';
import { USAGSanctionListComponent } from './usag-sanction-list';




@NgModule({
  imports: [
    CommonModule,MatAutocompleteModule,SharedModule.forRoot(),USAGSanctionRouting,MatChipsModule
  ],
  declarations: [
    USAGSanctionListComponent,
  ],providers: [USAGSanctionService,XhrService]
})
export class USAGSanctionModule { }
