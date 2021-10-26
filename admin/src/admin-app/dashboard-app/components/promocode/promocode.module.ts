import { PromocodeComponent } from './promocode';
import {NgModule}      from '@angular/core';
import {PromocodeService} from"./promocode.service";

import {SharedModule} from '../../../shared/shared.module';
import {PromocodeRoutes} from './promocode.route';

@NgModule({
    imports: [SharedModule.forRoot(), PromocodeRoutes],
    declarations: [PromocodeComponent,],
    providers: [PromocodeService]
})

export class PromocodeModule {
    
}