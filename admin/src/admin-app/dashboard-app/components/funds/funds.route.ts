import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import {FundsEditorComponent} from "./funds-editor.component";
import {FundsTransactionComponent} from "./funds-transaction.component";
import {FundsRequestComponent} from "./funds-request.component";
import {FundsJudgesComponent} from "./funds-judges.component";
import {FundsTransferComponent} from "./funds.components";

export const FundsRoute: Routes = [
  {path:'', component: FundsTransferComponent, data: { breadcrumb: 'Funds Transfer'},
    children: [
      {path: '', component: FundsJudgesComponent, data: { breadcrumb: 'Funds Transfer'}},
	  {path: 'judgeswallet', component: FundsJudgesComponent, data: { breadcrumb: 'judges Wallet'}},
	  {path: 'request', component: FundsRequestComponent, data: { breadcrumb: 'Funds request'}},
      {path: 'transaction', component: FundsTransactionComponent, data: { breadcrumb: 'Funds transaction'}},
    ],
  }
];

@NgModule({ 
  imports: [RouterModule.forChild(FundsRoute)],
  exports: [RouterModule],
})

export class FundsRouting { }