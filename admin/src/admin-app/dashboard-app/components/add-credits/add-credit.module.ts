import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '../../../shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatChipsModule } from '@angular/material';

import { RouterModule, Routes } from '@angular/router';

import { AddCreditService } from './add-credit.service';
import { AddCreditComponent } from './add-credit.component';
import { CreditListComponent } from './credit-list.component';
export const Route: Routes = [
    {path:'', component: CreditListComponent, data: { breadcrumb: 'Credit'}},
    {path:'form', component: AddCreditComponent, data: { breadcrumb: 'Add Credit'}},
    
    
   
  ];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(Route),
    SharedModule.forRoot(),NgxMatSelectSearchModule,MatChipsModule
  ],
  declarations: [
    AddCreditComponent,
    CreditListComponent
  ],
  providers:[AddCreditService]
})
export class AddCreditModule { }
