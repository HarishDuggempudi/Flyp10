import {UserManagementRouting} from './user-management.route';
import {NgModule} from '@angular/core';
import {UserListComponent} from"./user-list.component";
import {UserManagementComponent} from"./user-management.component";
import {UserRegistrationComponent} from"./user-registration.component";
import {UserSecurityUpdateComponent} from"./user-security-question.component";
import {UserSettingComponent} from"./user-setting.component";
import {UserPasswordUpdateComponent} from"./user-password-update.component";
import {UserService} from"./user.service";
import {SharedModule} from '../../../shared/shared.module';
import {UserViewComponent} from "./user-view.component";
import {RoleModule} from "../role-management/role.module";
import {JudgeSportEditorComponent} from "./user-judge-sport-editor";
import { ImageCropperModule } from 'ngx-image-cropper';
import {GroupByarrPipe} from './groupby';
import {WalletService} from "../wallet/wallet.service";
import {JudgeSportDetailsComponent} from './user-sport-details';
import {UserProfieVerifyComponent} from './verifyjudges';
import {UserRecruiterVerifyComponent} from './verifyRecruiter'
import {RecruiterVerifiedComponent} from './recruiter-verified'
import {RecruiterunVerifyComponent} from './recruiter-unverified'
import {RecruiterrejectedComponent} from './recruiter-rejected'
import {UserVerifiedComponent} from './verified'
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {UserunVerifyComponent} from './unverified'
import {UserexpiredComponent} from './expired'
import {UserrejectedComponent} from './rejected'
import {UserSuperAdminViewComponent} from './user-superadmin-view';
import {RecruiterVerifyEditorComponent} from './recruiter-verifiy-editor';
import {UserWalletComponent} from './user-wallet-info';
import {MatListModule} from '@angular/material/list';
import {SubscriptionComponent} from './subscription';
import {FilterPipe} from './pipe'
import { USAGYMMemberComponent } from './USA-GYM-member.component';

@NgModule({
    imports: [SharedModule.forRoot(), UserManagementRouting,NgxMatSelectSearchModule, RoleModule,ImageCropperModule,MatListModule],
    declarations: [ UserListComponent,FilterPipe,USAGYMMemberComponent,
       RecruiterVerifyEditorComponent,RecruiterrejectedComponent,RecruiterunVerifyComponent,RecruiterVerifiedComponent,UserRecruiterVerifyComponent,SubscriptionComponent,UserWalletComponent,UserSuperAdminViewComponent,UserrejectedComponent,UserVerifiedComponent,UserunVerifyComponent,UserexpiredComponent,UserManagementComponent,UserRegistrationComponent, UserViewComponent,GroupByarrPipe,UserProfieVerifyComponent,
        UserSecurityUpdateComponent, UserSettingComponent, UserPasswordUpdateComponent,JudgeSportEditorComponent,JudgeSportDetailsComponent],
    exports: [UserSecurityUpdateComponent, UserSettingComponent, UserPasswordUpdateComponent],
    providers: [UserService,WalletService]
})

export class UserManagementModule {
}