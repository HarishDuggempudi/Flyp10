import {NgModule}      from '@angular/core';
import {FundsService} from "./funds.service";
import {FundsEditorComponent} from "./funds-editor.component";
import {FundsTransactionComponent} from "./funds-transaction.component";
import {FundsRequestComponent, RejectModal} from "./funds-request.component";
import {FundsJudgesComponent} from "./funds-judges.component";
import {FundsTransferComponent} from "./funds.components";
import {FundsRouting} from './funds.route';
import {SharedModule} from '../../../shared/shared.module';
import { XhrService } from '../../../shared/services/xhr.service';
import {MatListModule} from '@angular/material/list';
import {MatSliderModule} from '@angular/material/slider';
import {NgxMaskModule} from 'ngx-mask';
@NgModule({
    imports: [SharedModule.forRoot(),FundsRouting,MatListModule,MatSliderModule,NgxMaskModule.forRoot()],
    declarations: [FundsTransferComponent,RejectModal,FundsJudgesComponent,FundsRequestComponent,FundsRequestComponent,FundsTransactionComponent, FundsEditorComponent],
    providers: [FundsService, XhrService],
    entryComponents:[RejectModal]
})

export class  FundsModule {
    
} 