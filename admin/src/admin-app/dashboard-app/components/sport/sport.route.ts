import { NgModule } from '@angular/core';
import { SportComponent } from './sport.component';
import { Routes,RouterModule } from '@angular/router';
import { SportEditorComponent } from './sport-editor.component';
import { SportLevelComponent } from './sport-level-list.component';
import { SportLevelEditorComponent } from './sport-level-editor.component';
import { SportEventComponent } from './sport-event-list.component';
import {EventDetailsComponent} from './sport-event-details';
import { SportEventEditorComponent } from './sport-event-editor.component';
import { SportListComponent } from './sport-list.component';
import { MappingComponent } from './mapping.component';
import { CategoryListComponent } from './category-list.component';
import { CategoryEditorComponent } from './category-editor.component'
import { ElementListComponent } from './element-list.component';
import { ElementEditorComponent } from './element-editor.component';
import { ElementGroupComponent } from './elementgroup-list.component'; 
import { ElementGroupEditorComponent } from './elementgroup-editor.component';
import { BaseListComponent } from './base-list.component';
import { BaseEditorComponent } from './base-editor.component';
import  {SettingComponent} from './setting.component';
import {PricingEditorComponent} from './pricing-editor';
export const SportRoute: Routes = [
  {path:'', component: SportComponent, data: { breadcrumb: 'Sport List'},
    children: [
      {path: '', component: SportListComponent, data: { breadcrumb: 'Sport List'}},
      {path: 'editor', component: SportEditorComponent, data: { breadcrumb: 'Sport Editor'}},
      {path: 'editor/:sportId', component: SportEditorComponent, data: { breadcrumb: 'Sport Editor'}},
      {path: 'event', component: SportEventComponent, data: { breadcrumb: 'Sport Level List'}},
      {path: 'event-editor', component: SportEventEditorComponent, data: { breadcrumb: 'Sport Level Editor'}},
      {path: 'event-editor/:eventid', component: SportEventEditorComponent, data: { breadcrumb: 'Sport Level Editor'}},
      {path: 'event-details/:eventid', component: EventDetailsComponent, data: { breadcrumb: 'Sport Level Editor'}},
	  {path: 'level', component: SportLevelComponent, data: { breadcrumb: 'Sport Level Editor'}},
      {path: 'level-editor', component: SportLevelEditorComponent, data: { breadcrumb: 'Sport Level Editor'}},
      {path: 'level-editor/:levelid', component: SportLevelEditorComponent, data: { breadcrumb: 'Sport Level Editor'}},
      {path: 'category', component: CategoryListComponent, data: { breadcrumb: 'Sport Category Editor'}},
      {path: 'category-editor', component: CategoryEditorComponent, data: { breadcrumb: 'Sport category Editor'}},
      {path: 'category-editor/:categoryid', component: CategoryEditorComponent, data: { breadcrumb: 'Sport category Editor'}},
      {path: 'element', component: ElementListComponent, data: { breadcrumb: 'Sport element Editor'}},
      {path: 'element-editor', component: ElementEditorComponent, data: { breadcrumb: 'Sport element Editor'}},
      {path: 'element-editor/:elementid', component: ElementEditorComponent, data: { breadcrumb: 'Sport element Editor'}},
      {path: 'elementgroup', component: ElementGroupComponent, data: { breadcrumb: 'Sport element Editor'}},
      {path: 'elementgroup-editor', component: ElementGroupEditorComponent, data: { breadcrumb: 'Sport element Editor'}},
      {path: 'elementgroup-editor/:elementgroupid', component: ElementGroupEditorComponent, data: { breadcrumb: 'Sport element Editor'}},
      {path: 'base', component: BaseListComponent, data: { breadcrumb: 'Base List'}},
      {path: 'base-editor', component: BaseEditorComponent, data: { breadcrumb: 'Base Editor'}},
      {path: 'base-editor/:baseid', component: BaseEditorComponent, data: { breadcrumb: 'Base Editor'}},
      {path: 'mapping', component: MappingComponent, data: { breadcrumb: 'Mapping'}},
	  {path: 'pricing', component: SettingComponent, data: { breadcrumb: 'Pricing'}},
	  {path: 'pricing-editor', component: PricingEditorComponent, data: { breadcrumb: 'Pricing Editor'}},
      {path: 'pricing-editor/:priceid', component: PricingEditorComponent, data: { breadcrumb: 'Pricing Editor'}},
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(SportRoute)],
  exports: [RouterModule],
})

export class SportRouting { }