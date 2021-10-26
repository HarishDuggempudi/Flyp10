import{Component, OnInit}from'@angular/core';
import {Validators, FormBuilder, FormGroup, FormControl,FormArray} from "@angular/forms";
import {VideoModel} from "./video.model";
import {RoutineService} from "../my-routines/routines.service";
import Swal from 'sweetalert2';
@Component({
    selector: 'videoUpload',
    templateUrl: './video.upload.html',
    styleUrls:['./video.upload.scss']
})
export class videoUploadComponent{
    isinvalidfile:boolean;
    videoObj:VideoModel=new VideoModel();
    videoForm: FormGroup;
    isSubmitted:boolean=false;
    file:File;
    filemessage:string="* InValid file"
    showDoc:boolean=false;
    editDoc:boolean=true;
    constructor(private _formBuilder: FormBuilder,private routineservices:RoutineService){
        this.videoForm = this._formBuilder.group({
            "title": ['', Validators.required],
            "subtitle": ['', Validators.required],
            "filename": ['', Validators.required],
            "active":['']
        });
        this.getBanner();
    }
    editdoc(){
        this.editDoc=true;  
    }
    onFileChange($event,i) {
        let file = $event.target.files[0]; // <--- File Object for future use.
     
        this.file=file
        let filetype=file.type;
        var index = filetype.indexOf("video");
        if(file.size<600000000 && index!=-1){
             this.isinvalidfile=false;
            this.videoForm.controls['filename'].setValue(this.file.name);
        }
        else{
          this.isinvalidfile=true;
          if(index!=-1){
            this.filemessage="file size should be less then 1MB"
          }
          
          
        }
     
          
    }
    getBanner(){
        this.routineservices.getBanner().subscribe(
            res=>{
               
                if(res.length>0){
                    this.videoObj=res[0];
                    this.videoForm.controls['filename'].setValue(this.videoObj.filename);
                    this.showDoc=true;
                    this.editDoc=false;
                }else{
                    this.showDoc=false;
                    this.editDoc=true;
                }
               
            },err=>{
                
            }
        )
    }
    saveVideo(){
        this.isSubmitted=true
        if(this.videoForm.valid && !this.isinvalidfile){
        
            this.routineservices.uploadBannerVideo(this.videoObj,this.file).subscribe(
                res=>{
                    this.getBanner();
                    Swal("Success !", "Video uploaded successfully", "info");
                },err=>{
                     this.errorMessage(err);
                }
            )
        }
        else{
           
        }
    }
    errorMessage(objResponse: any) {
    
        if(objResponse.message){
          Swal("Alert !", objResponse.message, "info");
        }
        else{
          Swal("Alert !", objResponse, "info");
        }
       
      }
}
