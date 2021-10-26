import { NgModule } from '@angular/core';
import { FaqListComponent } from './faq-list-component';
import { Routes,RouterModule } from '@angular/router';
import {FaqComponent} from './faq-component';
import {FaqEditorComponent} from './faq-editor-component';
export const RoutineRoute: Routes = [
  {path:'', component: FaqComponent, data: { breadcrumb: 'FAQ'}},
  {path: 'faqlist', component: FaqListComponent, data: { breadcrumb: 'FAQ List'}},
  {path:'faq-editor',component: FaqEditorComponent,data: { breadcrumb: 'FAQ Editor'}},
  {path:'faq-editor/:faqid',component: FaqEditorComponent,data: { breadcrumb: 'FAQ Editor'}}
];

@NgModule({
  imports: [RouterModule.forChild(RoutineRoute)],
  exports: [RouterModule],
})

export class FaqRouting{
  
 }