import {NgModule} from '@angular/core';
import {CountryListComponent} from './country-list';
import {CountryEditorComponent} from './country-editor';
import {Routes, RouterModule} from '@angular/router';

export const ContactRoute: Routes = [
       {path:'', redirectTo:'list', pathMatch:'full', data: {breadcrumb: 'Country'}},
       {path:'list', component: CountryListComponent, data: {breadcrumb: 'Country List'}},
       {path:'editor', component: CountryEditorComponent, data: {breadcrumb: 'Country Editor'}},
       {path:'editor/:Id', component: CountryEditorComponent, data: {breadcrumb: 'Country Editor'}}           
]

@NgModule({
    imports: [RouterModule.forChild(ContactRoute)],
    exports: [RouterModule],
  })


export class CountryRouting{    }