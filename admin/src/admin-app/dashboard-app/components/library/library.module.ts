import {NgModule}      from '@angular/core';
import {LibraryListComponent} from "./library-list-component";
import {LibraryComponent} from "./library-component";
import {LibraryEditorComponent}from "./library-editor-component";
import {LibraryRouting} from './library.route';
import {SharedModule} from '../../../shared/shared.module';
import { XhrService } from '../../../shared/services/xhr.service';
import {LibraryService} from './library.service';
import {RELibraryComponent} from '../library/relibrary-component'
import { NgxSpinnerModule } from '../../../../../node_modules/ngx-spinner';

@NgModule({
    imports: [SharedModule.forRoot(),LibraryRouting,NgxSpinnerModule],
    declarations: [LibraryListComponent, LibraryComponent,LibraryEditorComponent,RELibraryComponent],
    providers: [LibraryService,XhrService]
})

export class LibraryModule {
}