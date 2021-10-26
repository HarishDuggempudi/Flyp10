import {NgModule}      from '@angular/core';
import {VideoService} from "./video.service";
import {VideoEditorComponent} from "./video-editor.component";
import {VideoComponent} from "./video-list.component";
import {VideoRouting} from './video.route';
import {SharedModule} from '../../../shared/shared.module';
import { XhrService } from '../../../shared/services/xhr.service';

@NgModule({
    imports: [SharedModule.forRoot(),VideoRouting],
    declarations: [VideoComponent, VideoEditorComponent],
    providers: [VideoService, XhrService]
})

export class VideoModule {
}