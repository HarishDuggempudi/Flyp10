import { UserSecurityUpdateComponent } from './user-security-question.component';
import { UserViewComponent } from './user-view.component';
import { UserListComponent } from './user-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRegistrationComponent } from './user-registration.component';
import { UserManagementComponent } from './user-management.component';
import { UserPasswordUpdateComponent } from './user-password-update.component';
import {JudgeSportEditorComponent} from './user-judge-sport-editor';
import {JudgeSportDetailsComponent} from './user-sport-details';
import {UserProfieVerifyComponent} from './verifyjudges';
import {UserVerifiedComponent} from './verified'
import {UserunVerifyComponent} from './unverified'
import {UserexpiredComponent} from './expired'
import {UserrejectedComponent} from './rejected'
import {UserSuperAdminViewComponent} from './user-superadmin-view';
import {UserWalletComponent} from './user-wallet-info';
import {SubscriptionComponent} from './subscription';
import {UserRecruiterVerifyComponent} from './verifyRecruiter'
import {RecruiterVerifiedComponent} from './recruiter-verified'
import {RecruiterunVerifyComponent} from './recruiter-unverified'
import {RecruiterrejectedComponent} from './recruiter-rejected'
import {RecruiterVerifyEditorComponent} from './recruiter-verifiy-editor';
import { USAGYMMemberComponent } from './USA-GYM-member.component';
export const UserManagementRoute: Routes = [
  {path: '', component: UserListComponent, data: {breadcrumb: 'Users List'}},
  {path: 'editor', component: UserRegistrationComponent, data: {breadcrumb: 'User Editor'}},
  {path: 'editor/:userId', component: UserRegistrationComponent, data: {breadcrumb: 'User Editor'}},
  {path: 'verifyeditor', component: RecruiterVerifyEditorComponent, data: {breadcrumb: 'Verify Recruiter'}},
  {path: 'detail/:userId', component: UserSuperAdminViewComponent, data: {breadcrumb: 'User Detail'},
   children: [
      {path: '', redirectTo: 'basic', pathMatch: 'full'},
      {path: 'basic', component: UserViewComponent, data: {breadcrumb: 'Basic Info'}},
      {path: 'advance', component: UserWalletComponent, data: {breadcrumb: 'Wallet Info'}},
      {path: 'subscription/:userId', component: SubscriptionComponent, data: {breadcrumb: 'Subscription Editor'}},  	  
    ]},
  {path: 'sportedititor', component: JudgeSportEditorComponent, data: {breadcrumb: 'Judge Sport Editor'}},
  {path: 'usa-gym-member', component: USAGYMMemberComponent, data: {breadcrumb: 'USA Gymnastics Memebership'}},
  {path: 'judgeSportdetails/:docid', component: JudgeSportDetailsComponent, data: {breadcrumb: 'Judge Sport Details'}},
  {path: 'detail/sportedititor/:docid', component: JudgeSportEditorComponent, data: {breadcrumb: 'Judge Sport Editor'}},
  {path: 'manage/:userId', component: UserManagementComponent, data: {breadcrumb: 'User Management'},
    children: [
      {path: '', redirectTo: 'password', pathMatch: 'full'},
      {path: 'password', component: UserPasswordUpdateComponent, data: {breadcrumb: 'Password'}}      
    ]
  },
  {path: 'verifyjudges', component:UserProfieVerifyComponent , data: {breadcrumb: 'Verify '},
     children: [
      {path: '', redirectTo: 'verified', pathMatch: 'full'},
      {path: 'verified', component: UserVerifiedComponent, data: {breadcrumb: 'Verify Judges'}},
      {path: 'unverified', component: UserunVerifyComponent, data: {breadcrumb: 'Verify Judges'}},
      {path: 'expired', component: UserexpiredComponent, data: {breadcrumb: 'Verify Judges'}},
      {path: 'rejected', component: UserrejectedComponent, data: {breadcrumb: 'Verify Judges'}}   	  
    ]
  
  },
  {path: 'verifyrecruiter', component: UserRecruiterVerifyComponent, data: {breadcrumb: 'Verify Recruiter'},
     children: [
      {path: '', redirectTo: 'verified', pathMatch: 'full'},
      {path: 'verified', component: RecruiterVerifiedComponent, data: {breadcrumb: 'Verify Recruiter'}},
      {path: 'unverified', component: RecruiterunVerifyComponent, data: {breadcrumb: 'Verify Recruiter'}},
      {path: 'rejected', component: RecruiterrejectedComponent, data: {breadcrumb: 'Verify Recruiter'}},
        	  
    ] 
  
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(UserManagementRoute)],
  exports: [RouterModule],
})

export class UserManagementRouting{    }