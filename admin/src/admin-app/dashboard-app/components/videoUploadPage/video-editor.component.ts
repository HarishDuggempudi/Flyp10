import{Component, OnInit}from'@angular/core';
import {Validators, FormBuilder, FormGroup, FormControl,FormArray} from "@angular/forms";
import {VideoModel} from "./video.model";
import {VideoService} from "./video.service";
import Swal from 'sweetalert2';
import { Router,ActivatedRoute } from "@angular/router";
@Component({
    selector: 'videoUpload',
    templateUrl: './video-editor.html',
    styleUrls:['./video.upload.scss']
})
export class VideoEditorComponent{
    isinvalidfile:boolean;
    videoObj:VideoModel=new VideoModel();
    videoForm: FormGroup;
    isSubmitted:boolean=false;
    file:File;
    filemessage:string="* InValid file"
    showDoc:boolean=false;
    editDoc:boolean=true;
	bannerid:string;
	filechanged:boolean=false;
    constructor(private _formBuilder: FormBuilder,private videoservices:VideoService,private router: Router,private activatedRoute: ActivatedRoute){
        activatedRoute.params.subscribe(param => {      
            this.bannerid = param['bannerid']}
        );
		
		this.videoForm = this._formBuilder.group({
            "title": ['',Validators.required],
            "subtitle": ['',Validators.required],
            "filename": ['',Validators.required],
			 "type":['',Validators.required],
            "active":['']
        });
        //this.getBanner();
    }
	ngOnInit() {
       
        if (this.bannerid){
			 this.getbannerDetaiByid();
		}
        

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
			this.filechanged=true;
        }
        else{
          this.isinvalidfile=true;
          if(index!=-1){
            this.filemessage="file size should be less then 1MB"
          }
          
          
        }
     
          
    }
	
    getbannerDetaiByid(){
        this.videoservices.getBannerbybannerID(this.bannerid).subscribe(
            res=>{
               
                    this.videoObj=res
                    this.videoForm.controls['filename'].setValue(this.videoObj.filename);
                    this.showDoc=true;
                    this.editDoc=false;
               
               
            },err=>{
                
            }
        )
    }
	 triggerCancelForm() {
      this.router.navigate(['/videoUpload']);
	 }
    saveVideo(){
        this.isSubmitted=true
	 if(!this.bannerid){
		  if(this.videoForm.valid && !this.isinvalidfile){
         
            this.videoservices.uploadBannerVideo(this.videoObj,this.file).subscribe(
                res=>{
                    this.triggerCancelForm();				
                    Swal("Success !", "Video uploaded successfully", "info");
                },err=>{
                     this.errorMessage(err);
                }
            )
        }
        else{
           
        }
	 }else{
	  if(!this.filechanged){
		      /**this.videoservices.deleteBanner method  do two opreration like delete and update here it will perform upedte*/
				 this.videoservices.deleteBanner(this.videoObj).subscribe(
				  res => {
					 this.triggerCancelForm();
					Swal("Success!", res.message, "success");
				  },
				  error => {
					  this.errorMessage(error);
					//Swal("Alert!", error, "info");
				  }
				);
		 }else{
			 this.videoservices.updatebanner(this.videoObj,this.file,this.bannerid).subscribe(
			  res=>{
				    this.triggerCancelForm();
					Swal("Success!", res.message, "success");
			  },
				  error => {
					 this.errorMessage(error);
				  }
			 )
		 }

	  }
        
    }
    errorMessage(objResponse: any) {
       
        if(objResponse.message){
          Swal("Alert !", objResponse.message, "info");
		  this.triggerCancelForm();	
        }
        else{
          Swal("Alert !", objResponse, "info");
		  this.triggerCancelForm();		
        }
       
      }
}


