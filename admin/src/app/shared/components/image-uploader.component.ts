import {
    Component,
    AfterViewInit,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    ViewChild
  
  } from "@angular/core";
  import {ValidationService} from "../services/validation.service";
  import {ImageCanvasSizeEnum} from "../config/enum.config";
  import {Config} from "../config/general.config";
  import {FormControl} from "@angular/forms";
  @Component({
    selector: 'image-uploader',
    template: `<div class="row">
    <div class="col-md-4">
        <canvas #previewCanvas></canvas>
    </div>
    <div class="col-md-8">
        <a class="custom-file-btn delete-file" style="margin-left: 55px; margin-top: 30px;" *ngIf="imageName && isValidImage && allowDelete" href="javascript:void(0)" (click)="onDeleteFile()">
        <i class="fa fa-trash"aria-hidden="true"></i> Remove</a>
        <div class="custom-file-wrap">
        <input type="file" class="custom-file-input" id="file" #inputFile (change)="onFileSelect($event)">
        <label class="custom-file-btn" for="file" style="margin-top: 25px; margin-left: 55px;"><i class="fa fa-upload" aria-hidden="true"></i> {{imageName?imageName:"Choose avatar"}}</label>
        </div>
        <div class="error-msg" *ngIf="!isValidImage">*Supported Extensions : {{allowedExtMessage}} and max size : {{allowedSize}} MB</div>              
        <control-messages [isSubmitted]="isSubmitted" [control]="imageFormControl"></control-messages>
    </div>
</div>`,
        styles: [`
        .custom-file-wrap{
          position: relative;
          overflow: hidden;
        }
        .custom-file-input{
          visibility: hidden;
          position: absolute;
          top: -999px;
          left: -999px;
        }
        .custom-file-btn{
          border: 2px solid #222;
          color: #222;
          background-color: #fff;
          padding: 4px 20px;
          border-radius: 2px;
          font-size: 16px;
          font-weight: 400;
          cursor: pointer;
          display: inline-block;
          vertical-align: top;
        }
        .custom-file-btn.delete-file{
          border: 2px solid #f44336;
          color: #f44336;
          margin-bottom: 3px;
        }
          `]
  
  
  })
  export class ImageUploader implements AfterViewInit,OnChanges {
    @Input() imageFormControl: FormControl;
    @Input() imageName: string;
    @Input() drawImagePath: string;
    @Input() isSubmitted: boolean;
    @Input() canvasSize: number;
    @Input() allowDelete: boolean = false;
    @Output() fileSelectedEvent: EventEmitter<any> = new EventEmitter();
    @Output() deleteImageEvent: EventEmitter<any> = new EventEmitter();
    @ViewChild('previewCanvas') previewCanvas: any;
    @ViewChild('inputFile') inputFile: any;
    defaultImage: string;
    context: CanvasRenderingContext2D;
    file: File;
    isValidImage: boolean = true;
    private canvasWidth: number;
    private canvasHeight: number;
    private isFresh: boolean = false;
    private allowedExt: string[] = ['jpeg', 'jpg', 'png', 'webp'];
    private allowedSize: number = 1; // In MB
    allowedExtMessage: string;
  
    constructor() {
    }
  
    ngAfterViewInit() {
      this.allowedExtMessage = this.allowedExt.join(',');
      if (this.drawImagePath)
        switch (this.canvasSize) {
          case ImageCanvasSizeEnum.small:
            this.canvasHeight = 170;
            this.canvasWidth = 150;
            this.defaultImage = Config.DefaultImage;
            break;
          case ImageCanvasSizeEnum.wide:
            this.canvasHeight = 170;
            this.canvasWidth = 300;
            this.defaultImage = Config.DefaultWideImage;
            break;
          default:
            this.canvasHeight = 170;
            this.canvasWidth = 150;
            this.defaultImage = Config.DefaultAvatar;
            break;
        }
      this.drawImageToCanvas(this.drawImagePath);
    }
  
    /*Image handler */
    drawImageToCanvas(path: string) {
      let canvas = this.previewCanvas.nativeElement;
      this.context = canvas.getContext("2d");
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
      var ctx = this.context;
      var img = new Image();
      img.onload = function () {
        var hRatio = canvas.width / img.width;
        var vRatio = canvas.height / img.height;
        var ratio = Math.min(hRatio, vRatio);
        var centerShift_x = ( canvas.width - img.width * ratio ) / 2;
        var centerShift_y = ( canvas.height - img.height * ratio ) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height,
          centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
      };
      img.src = path;//http://res.cloudinary.com/bitsbeat-it-solution/image/upload/c_fill,h_150,w_300/imageName-1465885928713.webp";
    }
  
  
    onFileSelect(e: any) {
      this.file = e.target.files[0];
      this.isValidImage = ValidationService.imageValidation(this.file, this.allowedExt, this.allowedSize);
      let canvas = this.previewCanvas.nativeElement;
      this.context = canvas.getContext("2d");
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
      var ctx = this.context;
      var reader = new FileReader();
      if (this.isValidImage) {
        this.imageFormControl.patchValue(this.file.name);
        if (!this.imageName)
          this.isFresh = true;
        this.imageName = this.file.name;
        reader.onload = (event: any) => {
          var img = new Image();
          img.onload = function () {
            var hRatio = canvas.width / img.width;
            var vRatio = canvas.height / img.height;
            var ratio = Math.min(hRatio, vRatio);
            var centerShift_x = ( canvas.width - img.width * ratio ) / 2;
            var centerShift_y = ( canvas.height - img.height * ratio ) / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, img.width, img.height,
              centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
        this.fileSelectedEvent.emit(this.file);
      }
      else {
        this.imageFormControl.patchValue("");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawImageToCanvas(Config.InvalidImage);
      }
    }
  
    onDeleteFile(imageId: string) {
      if (!this.isFresh)
        this.deleteImageEvent.emit(imageId);
      else {
        this.clearPreview();
        this.fileSelectedEvent.emit("");
      }
  
  
    }
  
    clearPreview() {
      this.file = null;
      this.imageName = "";
      this.imageFormControl.patchValue("");
      this.inputFile.nativeElement.value = "";
      if (this.defaultImage)
        this.drawImageToCanvas(this.defaultImage);
    }
  
    ngOnChanges() {
      if (this.imageName)
        this.imageFormControl.patchValue(this.imageName);
      else if (this.imageName == "")
        this.clearPreview();
      if (this.previewCanvas && !this.isSubmitted)
        this.drawImageToCanvas(this.drawImagePath);
    }
    
    /* End ImageHandler */

    static
  imageValidation(file: File, allowedExt: string[], allowedSize: number) {
    let fileName = file.name;
    let fileSize = file.size;
    let fileExt = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
    let validExt: string[] = allowedExt.map(function (row) {
      return row.toLowerCase();
    });
    let fileLimit = 1024 * 1024 * allowedSize; // 1 MB
    return (allowedExt.indexOf(fileExt) != -1 && fileSize <= fileLimit);

  }
  }
  