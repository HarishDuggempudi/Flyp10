import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '../../../shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatChipsModule } from '@angular/material';

import { RouterModule, Routes } from '@angular/router';
import { DataExportComponent } from './data-export.component';
import { DataExportService } from './data-export.service';
export const Route: Routes = [
    {path:'', component: DataExportComponent, data: { breadcrumb: 'Data Export'}}
    
  ];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(Route),
    SharedModule.forRoot(),NgxMatSelectSearchModule,MatChipsModule
  ],
  declarations: [
  DataExportComponent
  ],
  providers:[DataExportService]
})
export class DataExportModule { }
