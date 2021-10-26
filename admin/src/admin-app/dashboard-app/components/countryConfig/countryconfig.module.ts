import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CountryListComponent} from './country-list';
import {CountryEditorComponent} from './country-editor';
import {CountryService} from './country.service'
import {CountryRouting} from './country.route'
import {SharedModule} from '../../../shared/shared.module';
@NgModule({
  imports: [
    SharedModule.forRoot(),CountryRouting
  ],
  declarations: [CountryListComponent,CountryEditorComponent],
  providers: [CountryService]
})
export class CountryconfigModule { }
