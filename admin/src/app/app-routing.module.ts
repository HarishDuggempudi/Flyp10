import { LandingComponent } from './components/landing/landing.component';
import {TermsComponent} from './components/landing/terms.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './components/landing/blog-component';
import {BlogDetailComponent} from './components/landing/blog-detail-component';
import { SignupComponent } from './components/landing/signup';
import {FaqComponent} from '../app/components/landing/faq.component'
import {SharePage} from '../app/components/landing/sharepage.component'
import {PricingComponent} from '../app/components/landing/pricing';
import {PrivacyPage} from '../app/components/landing/privacy.component';
import {PrivacyPolicyPage} from '../app/components/landing/privacyPage';
import { ActivationComponent } from './components/landing/activation.component';
import { HelpComponent } from './components/landing/help-component';
import {WgynasticComponent} from '../app/components/sport-pages/wgymnastic';
import {MgynasticComponent} from '../app/components/sport-pages/Mgymnastic';
import {IrishdanceComponent} from '../app/components/sport-pages/irishdance';
import { USAGComponent } from './components/virtual/usag.component';
const routes: Routes = [
  {
    path: '', component: LandingComponent
  },
  { path:'home',component:LandingComponent},
  { path:'terms',component:TermsComponent},
  { path:'blog',component:BlogComponent},
  { path:'blog/:blogid/:blogname',component:BlogDetailComponent},
  { path:'blog/tag/:tagid/:tagname',component:BlogComponent},
  { path:'blog/category/:categoryid/:categoryname',component:BlogComponent},
  { path:'blogdetail',component:BlogDetailComponent},
  { path:'signup/:userRole',component:SignupComponent},
  { path:'faq',component:FaqComponent},
  { path:'privacy',component:PrivacyPage},
  { path:'sports/Wgymnastics',component:WgynasticComponent},
  { path:'sports/Mgymnastics',component:MgynasticComponent},
  { path:'sports/irish-dance',component:IrishdanceComponent},
  { path:'virtual/usag',component:USAGComponent},
  { path:'privacypolicy',component:PrivacyPolicyPage},
  { path:'activation/:userid',component:ActivationComponent},
  // { path:'faq',component:FaqComponent},
  { path:'pricing/:userid',component:PricingComponent}, 
  {
    path: 'test', loadChildren: 'app/components/test/test.module#TestModule'
  },{ path:'share/:routineId',component:SharePage},
  { path:'support',component:HelpComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
