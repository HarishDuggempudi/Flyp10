import {NgModule}      from '@angular/core';
import {SportService} from "./sport.service";
import { SportEditorComponent } from "./sport-editor.component";
import {SportComponent} from "./sport.component";
import {SportRouting} from './sport.route';
import { SportEventComponent } from './sport-event-list.component';
import { SportEventEditorComponent } from './sport-event-editor.component';
import {EventDetailsComponent} from './sport-event-details';
import { SportListComponent } from './sport-list.component';
import { SportLevelComponent } from './sport-level-list.component';
import { SportLevelEditorComponent } from './sport-level-editor.component';
import {SharedModule} from '../../../shared/shared.module';
import { TagInputModule } from 'ngx-chips';
import { MappingComponent } from './mapping.component';
import {MatListModule} from '@angular/material/list';
import { CategoryListComponent } from './category-list.component';
import { CategoryEditorComponent } from './category-editor.component';
import { ElementListComponent } from './element-list.component';
import { ElementEditorComponent } from './element-editor.component';
import { ElementGroupComponent } from './elementgroup-list.component';
import { ElementGroupEditorComponent } from './elementgroup-editor.component';
import { BaseListComponent } from './base-list.component';
import { BaseEditorComponent } from './base-editor.component';
import {SettingComponent} from './setting.component';
import {PricingEditorComponent} from './pricing-editor';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatIconModule} from '@angular/material';
@NgModule({
    imports: [SharedModule.forRoot(),SportRouting,TagInputModule,MatListModule,NgxMatSelectSearchModule,MatIconModule],
    declarations: [
        SportComponent, 
        SportEditorComponent, 
        SportLevelComponent, 
        SportListComponent,
        SportEventComponent,
        MappingComponent,
        SportEventEditorComponent,
        CategoryListComponent,
        CategoryEditorComponent,
        ElementListComponent,
        ElementEditorComponent,
        ElementGroupComponent,
        ElementGroupEditorComponent,
        BaseListComponent,
        BaseEditorComponent,
		EventDetailsComponent,
        SportLevelEditorComponent,SettingComponent,PricingEditorComponent],
    providers: [SportService]
})

export class SportModule {
}