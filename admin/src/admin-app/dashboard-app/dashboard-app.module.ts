import {NgModule} from '@angular/core';
import {ApplicationLogModule} from './components/application-log/application-log.module';
import{BlogModule} from './components/blog/blog.module';
import{CloudinaryModule} from './components/cloudinary/cloudinary.module';
import{CommentSettingModule} from './components/comment-setting/comment-setting.module';
import{DashboardModule} from './components/dashboard/dashboard.module';
import{ContactModule} from './components/contact/contact.module';
import{EmailServiceModule} from './components/email-service/email-service.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import{EmailTemplateModule} from './components/email-template/email-template.module';
import{EventManagementModule} from './components/event-management/event-managment.module';
import{GoogleAnalyticsModule} from './components/google-analytics/google-analytics.module';
import {GoogleMapModule} from './components/google-map/google-map.module';
import{HtmlContentModule} from './components/html-content/html-content.module';
import{ImageGalleryModule} from './components/image-gallery/image-gallery.module';
import{ImageSlideModule} from './components/image-slider/image-slider.module';
import{NewsModule}from'./components/news/news.module';
import {SportModule} from './components/sport/sport.module';
import{OrganizationInformationModule} from './components/organization-information/organization-information.module';
import{TeamManagementModule} from './components/team-management/team-management.module';
import{TestimonialModule} from './components/testimonial/testimonial.module';
import{UserManagementModule} from './components/user-management/user-managment.module';
import{UserProfileModule} from './components/user-profile/user-profile.module';
import{DashboardAppComponent} from './dashboard-app.component';
import{DashboardAppRouting} from './dashboard-app.route'; 
import {SpinnerComponent} from '../shared/components/spinner/spinner.component';
import {SidebarCmp} from './components/sidebar/sidebar'
import {TopNavCmp}from './components/topnav/topnav';
import {SharedModule} from "../shared/shared.module";
import {PartnerModule} from "./components/partner/partner.module";
import {CountryListService} from "../shared/services/countrylist.service";
import {RoleModule} from "./components/role-management/role.module";
import {TokenModule} from "./components/token-management/token-management.module";
import {RoutineModule} from "./components/my-routines/routine.module";
import {RoutineModule as JudgesRoutineModule} from "./components/judges-routines/routines.module";
import {TeammateModule} from "./components/teammate/teammate.module";
import {NotificationModule} from "./components/notification/notification.module";
import {HelpComponent} from './components/help/help-component'
import {FaqComponent} from './components/faq/faq-component';
import {LogoutComponent} from './components/logout/logout.component';
import { FaqModule} from './components/faq/faq.module'
import {MatSliderModule} from '@angular/material';
import {videoUploadComponent} from '../dashboard-app/components/videoUploadPage/video.upload.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventsModule } from './components/events/events.module';
import {PricingSettingModule} from './components/pricing/pricing-setting.module'
import {LibraryModule} from '../../admin-app/dashboard-app/components/library/library.module'
import {RELibraryComponent} from '../../admin-app/dashboard-app/components/library/relibrary-component'
import {NotificationListComponent} from "../dashboard-app/components/notification/notification-list.component";
import {VideoModule} from '../../admin-app/dashboard-app/components/videoUploadPage/video.module';
import {WalletModule} from '../../admin-app/dashboard-app/components/wallet/wallet.module';
import {FundsModule} from '../../admin-app/dashboard-app/components/funds/funds.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import { NgxSpinnerModule } from 'ngx-spinner';
import {ScoreCardComponent} from './components/scorecard/scorecard'
import {AdminRoutineModule} from './components/my-routines/admin-routine/Admin-routine.module'
import {CountryconfigModule} from  '../../admin-app/dashboard-app/components/countryConfig/countryconfig.module';
import {EventsMeetModule} from '../../admin-app/dashboard-app/components/events-meet/events-meet.module'
import { EventMeetCoachMappingModule } from './components/event-meet-coach-mapping/event-meet-coach-mapping.module';
import { SendNotificationModule } from './components/send-notifications/sendnotification.module';
import { EventMeetGroupModule } from './components/event-meet-grouping/event-meet-group.module';
import { DataExportModule } from './components/data-export/data-export.module';
import { AddCreditModule } from './components/add-credits/add-credit.module';

import { EventMeetJudgeMappingModule } from './components/eventmeet-judge-mapping/eventmeet-judge-mapping.module';
import { USAGRoutineModule } from './components/my-routines/usag-organizer-routines/usag-organizer.module';
import { TeammateRoutineModule } from './components/teammate-routines/teammate-routine.module';
import { USAGSanctionModule } from './components/admin-usag-sanction/usag-sanction.module';
@NgModule({
  imports: [FormsModule,
    DashboardAppRouting,ReactiveFormsModule,
    ApplicationLogModule,
    BlogModule,
    CloudinaryModule,
  ContactModule,
  NgxSpinnerModule,
    CommentSettingModule,LibraryModule,
    DashboardModule,NgbModule.forRoot(),
    EmailServiceModule,
    EmailTemplateModule,
	MatAutocompleteModule,
    EventManagementModule,
    GoogleAnalyticsModule,
    GoogleMapModule,
    HtmlContentModule,
    ImageGalleryModule,
    ImageSlideModule,
    NewsModule,
    OrganizationInformationModule,
    TeamManagementModule, 
    TestimonialModule,
    UserManagementModule,
    PartnerModule,
    UserProfileModule,
    RoleModule,
    TokenModule,
    SportModule,
    RoutineModule,
    JudgesRoutineModule,
    USAGSanctionModule,
    TeammateModule,
    NotificationModule,
    FaqModule,MatSliderModule,MatProgressBarModule,
    EventsModule,
    AdminRoutineModule,
    USAGRoutineModule,
	VideoModule,
	WalletModule,
  FundsModule,
  CountryconfigModule,
  EventsMeetModule,
  EventMeetGroupModule,
  EventMeetJudgeMappingModule,
  EventMeetCoachMappingModule,
  SendNotificationModule,
  DataExportModule,
  AddCreditModule,
  TeammateRoutineModule,
    SharedModule.forRoot()
  ],
  declarations: [videoUploadComponent,ScoreCardComponent,DashboardAppComponent, SpinnerComponent, SidebarCmp, TopNavCmp,HelpComponent,LogoutComponent],
  providers: [CountryListService,NotificationListComponent]

})

export class DashboardAppModule {
}
