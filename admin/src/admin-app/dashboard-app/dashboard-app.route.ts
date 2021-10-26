import {Routes, RouterModule} from '@angular/router';
import {AuthGuardService} from "../login-app/auth.guard.service";
import {RoleGuardService} from "../login-app/role.guard.service";
import {NgModule} from "@angular/core";
import { DashboardAppComponent } from './dashboard-app.component';
import {HelpComponent} from './components/help/help-component';
import {FaqComponent} from './components/faq/faq-component';
import {LogoutComponent} from './components/logout/logout.component';
import {videoUploadComponent} from '../dashboard-app/components/videoUploadPage/video.upload.component'
import {LibraryComponent} from '../../admin-app/dashboard-app/components/library/library-component'
import { RELibraryComponent } from './components/library/relibrary-component';
import { Analytics } from './components/dashboard/anlytics';
import {ScoreCardComponent} from './components/scorecard/scorecard'


//import {}'./components/my-routines/routine.module'
// export function dashboardModule() {
//   return DashboardModule;
// }

export const dashboardAppRoute: Routes = [
  {
    path: '',
    component: DashboardAppComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuardService],
        children: [
          {path: '', redirectTo: 'dashboard', pathMatch: "full"},
          {path: 'dashboard', loadChildren: './components/dashboard/dashboard.module#DashboardModule', data: {breadcrumb: 'Dashboard'}},
          {path: 'user-management', loadChildren: './components/user-management/user-managment.module#UserManagementModule', data: {breadcrumb: 'User Management'}},    
          {path: 'admin-routine', loadChildren: './components/my-routines/admin-routine/Admin-routine.module#AdminRoutineModule', data: {breadcrumb: 'Routine'}},                
          {path: 'teammate-routine', loadChildren: './components/teammate-routines/teammate-routine.module#TeammateRoutineModule', data: {breadcrumb: 'Teammate Routine'}},                
          {path: 'usag-admin-routine', loadChildren: './components/my-routines/usag-organizer-routines/usag-organizer.module#USAGRoutineModule', data: {breadcrumb: 'Routine'}},                
          {path: 'role', loadChildren: './components/role-management/role.module#RoleModule', data: {breadcrumb: 'Role'}},          
          {path: 'contact', loadChildren: './components/contact/contact.module#ContactModule', data: {breadcrumb: 'Contact'}},
		      {path: 'blog', loadChildren: './components/blog/blog.module#BlogModule', data: {breadcrumb: 'Blog'}},
          {path: 'sport', loadChildren: './components/sport/sport.module#SportModule', data: {breadcrumb: 'Sport'}},
          {path: 'analytics', loadChildren: './components/google-analytics/google-analytics.module#GoogleAnalyticsModule', data: {breadcrumb: 'Google Analytics'}},
          {path: 'organization', loadChildren: './components/organization-information/organization-information.module#OrganizationInformationModule', data: {breadcrumb: 'Organization Information'}},
          {path: 'googlemap', loadChildren: './components/google-map/google-map.module#GoogleMapModule', data: {breadcrumb: 'Google Map'}},
          {path: 'testimonial', loadChildren: './components/testimonial/testimonial.module#TestimonialModule', data: {breadcrumb: 'Testimonial'}},
          {path: 'imagegallery', loadChildren: './components/image-gallery/image-gallery.module#ImageGalleryModule', data: {breadcrumb: 'Image Gallery'}},
          //{path: 'team', loadChildren: './components/team-management/team-management.module#TeamManagementModule', data: {breadcrumb: 'Team Management'}},
          // {path: 'errorlog', loadChildren: './components/application-log/application-log.module#ApplicationLogModule', data: {breadcrumb: 'Error Log'}},
          {path: 'email-service', loadChildren:'./components/email-service/email-service.module#EmailServiceModule', data: {breadcrumb: 'Email Service'}},
          {path: 'cloudinary', loadChildren: './components/cloudinary/cloudinary.module#CloudinaryModule', data: {breadcrumb: 'Cloudinary'}},
          {path: 'news', loadChildren:'./components/news/news.module#NewsModule', data: {breadcrumb: 'News'}},
          {path: 'imageslider',loadChildren:'./components/image-slider/image-slider.module#ImageSlideModule', data: {breadcrumb: 'Image Slider'}},
          {path: 'email-template', loadChildren:'./components/email-template/email-template.module#EmailTemplateModule', data: {breadcrumb: 'Email Template'}},
          {path: 'html', loadChildren:'./components/html-content/html-content.module#HtmlContentModule', data: {breadcrumb: 'Html Content'}},
          {path: 'event', loadChildren:'./components/event-management/event-managment.module#EventManagementModule', data: {breadcrumb: 'Event Management'}},
          {path: 'partner', loadChildren:'./components/partner/partner.module#PartnerModule', data: {breadcrumb: 'Partner'}},
          {path: 'comment', loadChildren:'./components/comment-setting/comment-setting.module#CommentSettingModule', data: {breadcrumb: 'Comment'}},
          {path: 'profile', loadChildren: './components/user-profile/user-profile.module#UserProfileModule', data: {breadcrumb: 'User Profile'}},
          {path: 'token', loadChildren: './components/token-management/token-management.module#TokenModule', data: {breadcrumb: 'Token'}},
          {path: 'events', loadChildren: './components/events/events.module#EventsModule', data: {breadcrumb: 'Events'}},
          {path: 'country', loadChildren:'./components/countryConfig/countryconfig.module#CountryconfigModule', data: {breadcrumb: 'country Management'}},
          {path: 'funds',loadChildren: './components/funds/funds.module#FundsModule', data: {breadcrumb: 'Funds Transfer'}},
          /* User Routes start here*/
          {path: 'routine', loadChildren: './components/my-routines/routine.module#RoutineModule', data: {breadcrumb: 'My Routine', expectedRole: "3"}, canActivate: [RoleGuardService]},
          {path: 'routines', loadChildren: './components/judges-routines/routines.module#RoutineModule', data: {breadcrumb: 'Routines to judge', expectedRole: "2"}, canActivate: [RoleGuardService]},
          {path: 'team', loadChildren: './components/teammate/teammate.module#TeammateModule', data: {breadcrumb: 'Team Management', expectedRole: "3"}, canActivate: [RoleGuardService]},
          {path: 'notification', loadChildren: './components/notification/notification.module#NotificationModule', data: {breadcrumb: 'Notification'}},  
          {path: 'help', component: HelpComponent, data: { breadcrumb: 'Help & Support'}},
          {path: 'faq',loadChildren:'./components/faq/faq.module#FaqModule',data:{breadcrumb:'faq'}},
          {path: 'logout',component:LogoutComponent},
          {path: 'videoUpload',loadChildren:'./components/videoUploadPage/video.module#VideoModule',data:{breadcrumb:'Banner'}},
		  {path: 'price-setting',loadChildren:'./components/pricing/pricing-setting.module#PricingSettingModule',data:{breadcrumb:'Banner'}},
		  {path: 'wallet',loadChildren:'./components/wallet/wallet.module#WalletModule',data:{breadcrumb:'My Wallet'}},
          {path: 'library',component:LibraryComponent},
          {path: 'library/:id',component:LibraryComponent},
          {path: 'relibrary',component:RELibraryComponent},
          {path: 'reporting',component:Analytics},
         {path: 'scorecard-config',component:ScoreCardComponent},
         {path: 'sanction',loadChildren:'./components/admin-usag-sanction/usag-sanction.module#USAGSanctionModule',data:{breadcrumb:'USAG-Sanction'}},
         {path: 'event-meets',loadChildren:'./components/events-meet/events-meet.module#EventsMeetModule',data:{breadcrumb:'Event-Meet'}},
         {path: 'event-meets-coach-mapping',loadChildren:'./components/event-meet-coach-mapping/event-meet-coach-mapping.module#EventMeetCoachMappingModule',data:{breadcrumb:'Event-Meet-Coach-Mapping'}},
         {path: 'event-meets-grouping',loadChildren:'./components/event-meet-grouping/event-meet-group.module#EventMeetGroupModule',data:{breadcrumb:'Event-Meet-Grouping'}},
         {path: 'event-meets-judge-mapping',loadChildren:'./components/eventmeet-judge-mapping/eventmeet-judge-mapping.module#EventMeetJudgeMappingModule',data:{breadcrumb:'Event-Meet-Judge-Mapping'}},
         {path: 'export-data-csv',loadChildren:'./components/data-export/data-export.module#DataExportModule',data:{breadcrumb:'Data Export'}},
         //{path: 'data-export',loadChildren:'./components/data-export/data-export.module#DataExportModule',data:{breadcrumb:'Data-Export'}},
         {path: 'add-credits',loadChildren:'./components/add-credits/add-credit.module#AddCreditModule',data:{breadcrumb:'Add-Credit'}},
         {path: 'send-notifications',loadChildren:'./components/send-notifications/sendnotification.module#SendNotificationModule',data:{breadcrumb:'Notifications'}}

         
		    
        ]
      }
    ]
  }
 
];

@NgModule({
  imports: [
    RouterModule.forChild(dashboardAppRoute)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardAppRouting {
}
