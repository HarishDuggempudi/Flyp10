import { NgModule } from "@angular/core";
import { SeoService } from "./seo.service";
import { ImageUploader } from './components/image-uploader.component';
import { CommonModule } from '@angular/common';
import { FormControlMessages } from "./components/control-validation-message.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    declarations: [
        ImageUploader,
        FormControlMessages
    ],
    exports: [
        ImageUploader,
        CommonModule,
        FormControlMessages,
        FormsModule, 
        ReactiveFormsModule
    ],
    providers: [SeoService]
})

export class ClientSharedModule {
    
}