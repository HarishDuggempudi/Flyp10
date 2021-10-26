import {NgModule}      from '@angular/core';
import {FaqListComponent} from "./faq-list-component";
import {FaqComponent} from "./faq-component";
import {FaqEditorComponent}from "./faq-editor-component";
import {FaqRouting} from './faq.route';
import {SharedModule} from '../../../shared/shared.module';
import { XhrService } from '../../../shared/services/xhr.service';
import {FaqService} from './faq.service';
@NgModule({
    imports: [SharedModule.forRoot(),FaqRouting],
    declarations: [FaqListComponent, FaqComponent,FaqEditorComponent],
    providers: [FaqService,XhrService]
})

export class FaqModule {
}