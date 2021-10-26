import Swal from 'sweetalert2';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {ImageCanvasSizeEnum} from "../../../shared/configs/enum.config";
import {Config} from "../../../shared/configs/general.config";
import {Validators, FormBuilder, FormGroup, FormControl} from "@angular/forms";
import {ValidationService} from "../../../shared/services/validation.service";
import { SportService } from "./sport.service";
import { SportModel } from './sport.model';
import {Location} from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/of';

@Component({
  selector: "sport-editor",
  templateUrl: "./sport-editor.html",
  styleUrls: ['./sport-editor.scss']
})
export class SportEditorComponent implements OnInit {
  @Input() itemsCopy = '';

  levelList:Array<any>;
  item:any;
  imageExtension: any;
  imagePath: any;
  sportId:string;
  isSubmitted:boolean = false;
  toggleEvent:boolean;
  toggleLevel:boolean;
  toggleCategory:boolean;
  toggleElement:boolean;
  toggleElementGroup:boolean;
  toggleBase:boolean;

  /* Image Upload Handle*/
  imageDeleted:boolean = false;
  file:File;
  fileName:string = "";
  sportForm:FormGroup;
  drawImagePath:string = Config.DefaultAvatar;
  imageFormControl:FormControl = new FormControl('', Validators.required);
  canvasSize:number = ImageCanvasSizeEnum.small;
  /* End Image Upload handle */

  constructor(private location: Location, private activatedRoute: ActivatedRoute,private router:Router, private _formBuilder: FormBuilder, private _objService: SportService) {
    activatedRoute.params.subscribe(param => this.sportId = param['sportId']);
  
    this.item = this.itemsCopy.split(/[ ,]+/);
    this.levelList = this.item;
    this.levelList.splice(0,1);
    this.sportForm = this._formBuilder.group({
      'sportName': ['', Validators.required],
      'active': [''],
      'addnotes':[false],
      'imageFormControl': this.imageFormControl,
      'eventMapping': [false],
      'levelMapping': [false],
      'categoryMapping': [false],
      'elementMapping': [false],
      'elementGroupMapping': [false],
      'baseMapping': [false]     
    });
  }

  onItemAdded(event){
    
    this.levelList.push(event.value);
    for(var i = 0; i <= this.levelList.length; i++){
      if(typeof this.levelList[i] !== "string"){
        this.levelList.splice(i,1);
      }
    }
    
  }

  ngAfterViewInit() {
    if(!this.sportId)
      this.drawImageToCanvas(Config.DefaultAvatar);
  }

  ngOnInit() {
    if(this.sportId){
      this.getSportDetail()
    }
  }

  toggleEventCheckbox(ev){    
    this.toggleEvent = ev.checked;
  }
  
  toggleLevelCheckbox(ev){    
    this.toggleLevel = ev.checked;
  }
  
  toggleCategoryCheckbox(ev){    
    this.toggleCategory = ev.checked;
  }
  
  toggleElementCheckbox(ev){    
    this.toggleElement = ev.checked;
  }
  
  toggleElementGroupCheckbox(ev){    
    this.toggleElementGroup = ev.checked;
  }

  toggleBaseCheckbox(ev){    
    this.toggleBase = ev.checked;
  }

  public obsItems = (text: string): Observable<string[]> => {
    return Observable.of([
        'item1', 'item2', 'item3'
    ]);
};

  saveSport() {
    this.isSubmitted = true;
  
    if (this.sportForm.valid) {
      if (!this.sportId) {
        this._objService.saveSport(this.sportForm.value, this.file)
          .subscribe(res => this.resStatusMessage(res),
            error => this.errorMessage(error));
      }
      else {
        this._objService.updateSport(this.sportForm.value, this.file, this.imageDeleted, this.sportId)
          .subscribe(res => this.resStatusMessage(res),
            error => this.errorMessage(error));
      }
    }
  }

  resStatusMessage(objSave:any) {
    this.location.back();
    Swal("Success !", objSave.message, "success")
  }

  triggerCancelForm() {
    this.location.back();
  }

  errorMessage(objResponse:any) {
   
    if(objResponse.message){
      Swal("Alert !", objResponse.message, "info");
    }
    else{
      Swal("Alert !", objResponse, "info");
    }
    
  }

  getSportDetail() {
    this._objService.getSportDetail(this.sportId)
      .subscribe(res =>this.bindDetail(res),
        error => this.errorMessage(error));
       
  }

  formatTag(arr){
    
    var tempArr= [];
    
    var tagVal = arr[0];
    var tagArr = tagVal.split(',');
    for(var i=0; i<tagArr.length; i++){
      var tempObj = { 'display': tagArr[i], 'value': tagArr[i] }
      tempArr.push(tempObj);
    }
    return tempArr;
  }

  bindDetail(objRes:SportModel) {
    
    this.imageExtension = objRes.imageProperties? objRes.imageProperties.imageExtension: '';
    this.imagePath = objRes.imageProperties? objRes.imageProperties.imagePath : '';
   
    this.sportForm.patchValue({
      sportName: objRes.sportName,
      active: objRes.active,
      addnotes:objRes.addnotes,
      eventMapping: objRes.fieldsConfig.eventMapping.added,
      levelMapping: objRes.fieldsConfig.levelMapping.added,
      categoryMapping: objRes.fieldsConfig.categoryMapping.added,
      elementMapping: objRes.fieldsConfig.elementMapping.added,
      elementGroupMapping: objRes.fieldsConfig.elementGroupMapping.added,
      baseMapping: objRes.fieldsConfig.baseMapping.added 
    });

    // 'eventMapping': [false],
    //   'levelMapping': [false],
    //   'categoryMapping': [false],
    //   'elementMapping': [false],
    //   'elementGroupMapping': [false],
    //   'baseMapping': [false] 

    (<FormControl>this.sportForm.controls['imageFormControl']).patchValue(this.fileName);
    this.fileName = objRes.imageName;

    let path:string = "";
    if (objRes.imageName) {
      var cl = Config.Cloudinary;
      path = cl.url(objRes.imageName);
    }
    else
      path = Config.DefaultAvatar;
    this.drawImageToCanvas(path);
  }

  /*Image handler */

  deleteImage(id:string) {
    Swal({
          title: "Are you sure?",
          text: "You will not be able to recover this Image !",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
        })
        .then((result)=> {
          if(result.value){
          this._objService.deleteImage(this.fileName, this.imageExtension, this.imagePath)
          .subscribe(res=> {
              this.imageDeleted = true;
              this.fileName = "";
              this.drawImageToCanvas(Config.DefaultImage);
              Swal("Deleted!", res.message, "success");
            },
            error=> {
              Swal("Alert!", error, "info");
            });
          }            
        });
    }
  
    changeFile(args: any) {
      this.file = args;
      this.fileName = this.file.name;
    }
  
    drawImageToCanvas(path:string) {
      this.drawImagePath = path;
    }
    /* End ImageHandler */

}
