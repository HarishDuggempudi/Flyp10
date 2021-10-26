import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { PricingSettingComponent } from "./pricing-setting.component";


export const PricingSettingRoute: Routes = [
  {path:'', component: PricingSettingComponent, data:{breadcrumb: 'Pricing Setting'}}
  
];

@NgModule({
  imports: [RouterModule.forChild(PricingSettingRoute)],
  exports: [RouterModule],
})

export class PricingSettingRouting { }