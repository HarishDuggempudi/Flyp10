import {NgModule}      from '@angular/core';
import {UserProfileManagementComponent} from "./user-management.component";
import {UserProfileComponent} from"./user-profile.component";
import {UserManagementModule} from "../user-management/user-managment.module";
import {SharedModule} from '../../../shared/shared.module';
import {UserProfileRouting} from './user-profile.route';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {UserSportProfileComponent} from './user-sport-profile';
import {GroupByPipe} from './groupby'
import {AccountListComponent} from './account-list';
import {AccountEditorComponent} from './account-editor';
import {CardListComponent} from './card.list';
import {CardEditorComponent} from './card.editor';
import {NgxMaskModule} from 'ngx-mask'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import { USAGYMMemberComponent } from './USA-GYM-member.component';
@NgModule({
    imports: [SharedModule.forRoot(), UserProfileRouting, UserManagementModule,MatProgressBarModule,MatSlideToggleModule,NgxMaskModule.forRoot(),MatAutocompleteModule],
    declarations: [CardListComponent,USAGYMMemberComponent,CardEditorComponent,AccountEditorComponent,UserProfileManagementComponent, UserProfileComponent,UserSportProfileComponent,GroupByPipe,AccountListComponent]
})

export class UserProfileModule {
}