import { FileOperrationService } from '../admin-app/shared/services/fileOperation.service';
import { HttpClientModule } from '@angular/common/http';
import { BlogService } from '../admin-app/dashboard-app/components/blog/blog.service';
import { NgModule, Inject, PLATFORM_ID, APP_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { LandingComponent } from './components/landing/landing.component';
import {PrivacyPage} from './components/landing/privacy.component';
import { isPlatformBrowser } from '@angular/common';
import { httpInterceptorProviders } from '../admin-app/shared/services/interceptors/interceptor.index';
import { ClientSharedModule } from './shared/shared.module';
import { CloudinaryService } from '../admin-app/dashboard-app/components/cloudinary/cloudinary.service';
import { TermsComponent } from './components/landing/terms.component';
import { BlogComponent } from './components/landing/blog-component';
import {BlogDetailComponent} from './components/landing/blog-detail-component';
import { StripHtmlPipe } from './pipes/striphtml';
import { ReplaceSpaceWithHyphen } from './pipes/replaceSpaceWithHyphen';
import { Services } from  './shared/services';
import { OwlModule } from 'ngx-owl-carousel';
import { SignupComponent } from './components/landing/signup';
import { ArchwizardModule } from 'angular-archwizard';
import {NgxMaskModule} from 'ngx-mask';
import { PagerService }from './shared/pagerservice';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import {UserService} from "../admin-app/dashboard-app/components/user-management/user.service";
import {SportService} from "../admin-app/dashboard-app/components/sport/sport.service";
import {CountryService} from "../admin-app/dashboard-app/components/countryConfig/country.service";
import { XhrService } from "../admin-app/shared/services/xhr.service";
import {FaqService} from '../admin-app/dashboard-app/components/faq/faq.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import {FaqComponent} from '../app/components/landing/faq.component';
import {TermsPage} from '../app/components/landing/conditons.component';
import {MatSliderModule} from '@angular/material/slider';
import {SharePage} from '../app/components/landing/sharepage.component'
import {RoutineService} from '../admin-app/dashboard-app/components/my-routines/routines.service';
import {VideoService} from '../admin-app/dashboard-app/components/videoUploadPage/video.service';
import { ImageCropperModule } from 'ngx-image-cropper';
import {WgynasticComponent} from '../app/components/sport-pages/wgymnastic'
import {MgynasticComponent} from '../app/components/sport-pages/Mgymnastic';
import {IrishdanceComponent} from '../app/components/sport-pages/irishdance';
import {PrivacyPolicyPage} from '../app/components/landing/privacyPage';
import {NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';
import {ActivationComponent} from'../app/components/landing/activation.component'
import {HelpComponent} from'../app/components/landing/help-component'
import { PricingSettingService } from '../admin-app/dashboard-app/components/pricing/pricing-setting.service';
import { PricingComponent } from '../app/components/landing/pricing';
import { GroupByarrPipe } from './components/landing/groupby';
import { USAGComponent } from './components/virtual/usag.component';
const cookieConfig:NgcCookieConsentConfig = {
  "cookie": {
    "domain": "flyp10.com"
  },
  "position": "bottom",
  "theme": "classic",
  "palette": {
    "popup": {
      "background": "#323232",
      "text": "#ffffff",
      "link": "#ffffff"
    },
    "button": {
      "background": "#2e3192",
      "text": "#ffffff",
      "border": "transparent"
    }
  },
  "type": "info",
  "content": {
    "message": "In order to give you the best experience we have set our website to allow cookies. By continuing, you agree that you are happy for us to use these cookies. To get more details please select",
    "dismiss": "Accept and Continue",
    "deny": "Refuse cookies",
    "link": "Our Privacy Policy",
    "href": "https://flyp10.com/privacypolicy"
  }
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'nodebeats-v3' }),
    NgcCookieConsentModule.forRoot(cookieConfig),
    AppRoutingModule,
    HttpClientModule,ImageCropperModule,
    BrowserTransferStateModule,
    ClientSharedModule,
    OwlModule,
    ArchwizardModule,
    NgxMyDatePickerModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxSpinnerModule,MatSliderModule
  ],
  declarations: [GroupByarrPipe,PrivacyPolicyPage,HelpComponent,TermsPage,AppComponent,ActivationComponent, LandingComponent,PrivacyPage,TermsComponent,BlogComponent,BlogDetailComponent,StripHtmlPipe,ReplaceSpaceWithHyphen,SignupComponent,FaqComponent,SharePage,PricingComponent,
    WgynasticComponent,MgynasticComponent,IrishdanceComponent ,USAGComponent],
  providers: [CountryService,VideoService,RoutineService,PricingSettingService,FaqService,BlogService,UserService,SportService,XhrService,FileOperrationService, httpInterceptorProviders, CloudinaryService, Services,PagerService],
  bootstrap: [AppComponent]                                         
})

export class AppModule { 
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}

