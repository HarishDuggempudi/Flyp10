import {NgModule}      from '@angular/core';
import {WalletService} from "./wallet.service";
import {WalletEditorComponent} from "./wallet-editor.component";
import {WalletComponent} from "./wallet-list.component";
import {WalletRouting} from './wallet.route';
import {SharedModule} from '../../../shared/shared.module';
import { XhrService } from '../../../shared/services/xhr.service';
import {MatListModule} from '@angular/material/list';
import {MatSliderModule} from '@angular/material/slider';
import {NgxMaskModule} from 'ngx-mask';
import {JudgesHistoryTableComponent} from './judges-history-table.component';
import {RemittanceHistoryComponent} from './remittance-history.component';
import {TransactionHistoryComponent} from './transaction-history.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import { PricingSettingService } from '../pricing/pricing-setting.service';
import { PromocodeService } from '../promocode/promocode.service';
import { PromocodeComponent } from '../promocode/promocode';
@NgModule({
    imports: [SharedModule.forRoot(),WalletRouting,MatListModule,MatSliderModule,NgxMaskModule.forRoot(),MatAutocompleteModule],
    declarations: [WalletComponent, WalletEditorComponent,JudgesHistoryTableComponent,RemittanceHistoryComponent,TransactionHistoryComponent,PromocodeComponent],
    providers: [WalletService, XhrService,PricingSettingService,PromocodeService],
    entryComponents:[PromocodeComponent]
})

export class WalletModule {
} 