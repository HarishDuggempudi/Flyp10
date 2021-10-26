import { NgModule } from '@angular/core';
import { WalletComponent } from './wallet-list.component';
import { Routes,RouterModule } from '@angular/router';
import { WalletEditorComponent} from './wallet-editor.component';
import {JudgesHistoryTableComponent} from './judges-history-table.component';
import {RemittanceHistoryComponent} from './remittance-history.component';
import {TransactionHistoryComponent} from './transaction-history.component';

// {path:'', component: UserProfileManagementComponent, data: {breadcrumb: 'User Profile Management'},
//     children: [
//         {path: '', component: UserProfileComponent, data: {breadcrumb: 'User Profile Component'}},
//         {path: 'edit/:userId', component: UserRegistrationComponent, data: {breadcrumb: 'User Profile Editor'}},
//         {path: 'sport', component: UserSportProfileComponent, data: {breadcrumb: 'sport'}},
//         {path: 'security', component: UserSecurityUpdateComponent, data: {breadcrumb: 'Security'}},
//         {path: 'password', component: UserPasswordUpdateComponent, data: {breadcrumb: 'Password'}},
//         {path: 'setting', component: UserSettingComponent, data: {breadcrumb: 'User Profile Setting'}},
// 		{path: 'accountinfo', component: AccountListComponent, data: {breadcrumb: 'Account Details'}},
// 		{path: 'account-editor', component: AccountEditorComponent, data: {breadcrumb: 'Account Editor'}},
// 		{path: 'cards', component: CardListComponent, data: {breadcrumb: 'Cards Details'}},
// 	    {path: 'cardseditor', component: CardEditorComponent, data: {breadcrumb: 'Card Editor'}}
//     ]
//   }

export const WalletRoute: Routes = [
  {path:'', component: WalletComponent,
    children: [
      {path: '', component: TransactionHistoryComponent},
      {path: 'remittance', component: RemittanceHistoryComponent},
    ]
  },
  {path:'wallet', component: WalletComponent, 
  children: [
    {path: '', component: TransactionHistoryComponent},
    {path: 'remittance', component: RemittanceHistoryComponent},
  ]},
  // {path:'history', component: JudgesHistoryTableComponent,
  //   children: [
  //     {path: '', component: TransactionHistoryComponent},
  //     {path: 'remittance', component: RemittanceHistoryComponent},
  //   ]
  // },

  // {path: 'editor', component: WalletEditorComponent},
  // {path: 'history/transaction', component: TransactionHistoryComponent},
  // {path: 'history/remittance', component: RemittanceHistoryComponent},
  {path: 'editor/:type', component: WalletEditorComponent},
];

@NgModule({ 
  imports: [RouterModule.forChild(WalletRoute)],
  exports: [RouterModule],
})

export class WalletRouting { }