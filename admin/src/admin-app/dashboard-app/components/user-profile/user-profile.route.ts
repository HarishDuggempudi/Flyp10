import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { UserProfileManagementComponent } from './user-management.component';
import { UserProfileComponent } from './user-profile.component';
import { UserSecurityUpdateComponent } from '../user-management/user-security-question.component';
import {UserRegistrationComponent} from"../user-management/user-registration.component";
import { UserPasswordUpdateComponent } from '../user-management/user-password-update.component';
import { UserSettingComponent } from '../user-management/user-setting.component';
import {UserSportProfileComponent} from './user-sport-profile';
import {AccountListComponent} from './account-list';
import {AccountEditorComponent} from './account-editor';
import {CardListComponent} from './card.list';
import {CardEditorComponent} from './card.editor';
import { USAGYMMemberComponent } from './USA-GYM-member.component';
export const UserProfileRoute: Routes = [
  {path:'', component: UserProfileManagementComponent, data: {breadcrumb: 'User Profile Management'},
    children: [
        {path: '', component: UserProfileComponent, data: {breadcrumb: 'User Profile Component'}},
        {path: 'edit/:userId', component: UserRegistrationComponent, data: {breadcrumb: 'User Profile Editor'}},
        {path: 'sport', component: UserSportProfileComponent, data: {breadcrumb: 'sport'}},
        {path: 'security', component: UserSecurityUpdateComponent, data: {breadcrumb: 'Security'}},
        {path: 'password', component: UserPasswordUpdateComponent, data: {breadcrumb: 'Password'}},
        {path: 'setting', component: UserSettingComponent, data: {breadcrumb: 'User Profile Setting'}},
		{path: 'accountinfo', component: AccountListComponent, data: {breadcrumb: 'Account Details'}},
		{path: 'account-editor', component: AccountEditorComponent, data: {breadcrumb: 'Account Editor'}},
		{path: 'cards', component: CardListComponent, data: {breadcrumb: 'Cards Details'}},
      {path: 'cardseditor', component: CardEditorComponent, data: {breadcrumb: 'Card Editor'}},
      {path: 'usa-gym-member', component: USAGYMMemberComponent, data: {breadcrumb: 'USA Gymnastics Membership'}},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(UserProfileRoute)],
  exports: [RouterModule],
})

export class UserProfileRouting { }