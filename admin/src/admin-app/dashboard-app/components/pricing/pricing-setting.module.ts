import {NgModule} from '@angular/core';
import { PricingSettingService } from "./pricing-setting.service";
import { PricingSettingComponent } from "./pricing-setting.component";
import{SharedModule} from '../../../shared/shared.module';
import{PricingSettingRouting} from './pricing-setting.routing';

@NgModule({
  imports: [SharedModule.forRoot(),PricingSettingRouting],
  declarations: [PricingSettingComponent],
  providers: [PricingSettingService]
})

export class PricingSettingModule {
}
