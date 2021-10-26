import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {Component, OnInit,ViewChild} from '@angular/core';
import {RegisterUserModel, UserResponse} from "../user-management/user.model";
import {UserService} from "../user-management/user.service";
import {Config} from "../../../shared/configs/general.config";
import { SportService } from '../sport/sport.service';
import {Validators, FormBuilder, FormGroup, FormControl,FormArray} from "@angular/forms";
import {JudgeSportModel} from '../user-management/user.model'
import { MatCheckbox } from '@angular/material';
@Component({
    selector: 'user-sport-profile',
    templateUrl: './user-sport-profile.html',
    styleUrls:['./user-profile.scss']
})

export class UserSportProfileComponent implements OnInit {
    userId:string;  
    objUser:RegisterUserModel = new RegisterUserModel();
	
    isSubmitted: boolean = false;
    objResponse:UserResponse = new UserResponse();
    imageSrc:string=Config.DefaultAvatar;
    usersportObj:any=[]; 
    sportObj:any=[];
    levelObj:any=[];
	levelAllObj:any=[];
	selectedsportid:string;
  selectedlevelid:string;
  MFigureSkating:string = Config.MFigureSkating;
  WFigureSkating:string = Config.WFigureSkating;
    SportjudgeForm: FormGroup;   
    loginobjUser:RegisterUserModel = new RegisterUserModel();
    sportval:JudgeSportModel =new JudgeSportModel()
    SportForm: FormGroup;
	Sportsdoc:any;
	  /* file upload */
	   allowedExt: string[] = ['docx','doc','txt','pdf','png','jpg','jpeg','webb'];
	   allowedSize: number = 1; //MB
	   fileDeleted: boolean = false;
	   docfile: File;
	   docfileName: string = "";
	   docFormControl: FormControl = new FormControl('',Validators.required);
	   togglechoose:boolean=true;
	   docchanged:boolean=false;
	   addmorebutton:boolean=true
	   username:string;
	   isinvalidfile:boolean=false;
	   groupBysport:any = {};
   /* End File Upload handle */
    @ViewChild('f') myNgForm;
    //@ViewChild('technician') private technician: MatCheckbox;
    //@ViewChild('judge') private judge: MatCheckbox;
    technician:boolean = false;
    judge:boolean = false;
  uploadingFor: boolean = true;
  uploadingForValue: string = '0';
  
	//@ViewChild('sf') myNgForm;
    constructor(private _objUserService:UserService,private sportService:SportService, private router: Router,private _formBuilder:FormBuilder) {
        let userInfo:RegisterUserModel = JSON.parse(Config.getUserInfoToken());
        this.userId = userInfo._id;
        this.loginobjUser=userInfo;
        
        this.SportForm=this._formBuilder.group({
            sportName: ['',Validators.required],
            level: ['',Validators.required],
       
            
          });
          this.SportjudgeForm = this._formBuilder.group({
			  sportdetail: this._formBuilder.array([
			  this.intialSport(),
      ]),
     
         }
    );
        //this.tfaEnabled = userInfo.twoFactorAuthEnabled;
    }
	  intialSport() {
    return this._formBuilder.group({
      sportName: ['',Validators.required],
      level: ['',Validators.required],
      sportdocname:this.docFormControl,
      file:[''],
      docdescription:[''],
      username:[''],
      uploadingfor:['']
    });
    }
    ngOnInit() {
        this.getUserDetail();
        this.getJudgesSport(this.loginobjUser._id);
        this.getAllSportDetail();
    }
    addSportdetail(){
	  if(this.SportForm.valid){
		  this.sportval.sportName=this.SportForm.value.sportName;
        this.sportval.level=this.SportForm.value.level;
        this.sportval.username=this.loginobjUser.username;
	    this.sportval.sportid=this.selectedsportid;
        this.sportval.levelid=this.selectedlevelid;
        this.sportval.userid=this.loginobjUser._id;
        this.sportval.docdescription=" ";
        this.sportval.active=true;
       
        this._objUserService.saveuserSport(this.sportval)
        .subscribe(resUser => this.saveUserStatusMessage(resUser),
        error => this.errorMessage(error));
	  }
        
  }
    triggerCancelForm(){
        this.myNgForm.resetForm();
		if(this.loginobjUser.userRole=='2'){
			 this.remove(0);
			   this.addMoreSports();
		}
    }
    
    saveUserStatusMessage(objResponse: any) {
      
        Swal("Success !", "Sport Details Added Successfully", "success");
        this.getJudgesSport(this.loginobjUser._id);
        this.triggerCancelForm();
      }
    getUserDetail() {
        this._objUserService.getUserDetail(this.userId)
            .subscribe(resUser => {
                this.bindDetail(resUser)
            },
                error => this.errorMessage(error));
    }
    delete(docId:string) {
        Swal({
          title: "Are you sure?",
          text: "You will not be able to recover this Sport !",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!"
        }).then(result => {
          if (result.value) {
            let objTemp: JudgeSportModel = new JudgeSportModel();
             objTemp._id = docId
             objTemp.deleted = true;
            this._objUserService.deleteUsersportDetailbyid(objTemp).subscribe(
              res => {
                this.getJudgesSport(this.loginobjUser._id);
                Swal("Deleted!", res.message, "success");
              },
              error => {
              
                Swal("Alert!", error, "info");
              }
            );
          }
        });
      }
    getAllSportDetail(){
        this.sportService.getSportList(1000,1)
        .subscribe(sportres=>{
            
            this.sportObj=sportres.dataList;
           
        },err=>this.errorMessage(err));

        this.sportService.getLevelList(1000,1)
        .subscribe(levelres=>{
           this.levelAllObj=levelres.dataList;
          
        },err=>{
            this.errorMessage(err);
        })
  }
  OnLevelChange(event){
	   var tempsport=[];
		  tempsport=this.levelAllObj.filter(item=>item.level.toLowerCase()==event.toLowerCase());
		  if(tempsport.length>0){
			  this.selectedlevelid=tempsport[0]._id;
			 
		  }
  }
  OnSportChange(event){
		this.levelObj=[];
		  var tempsport=[];
		  tempsport=this.sportObj.filter(item=>item.sportName.toLowerCase()==event.toLowerCase());
		  if(tempsport.length>0){
			  this.selectedsportid=tempsport[0]._id;
			  	this.sportService.getSportDetailsbyMapping(this.selectedsportid).subscribe(
							   res=>{
							
								 if(res.length>0){
									 let temp=res[0];
									 let level=[];
									 level=temp.level;
									    for(let j=0;j<level.length;j++){
											   let templevelid=level[j];
											 for(let i=0;i<this.levelAllObj.length;i++){
												 
												 if(this.levelAllObj[i]._id==templevelid){
													  let obj={"level":this.levelAllObj[i].level} ;
													  this.levelObj.push(obj);
													 // console.log(this.levelObj)
												 }
												 
											 }
										 }
								 }
								 else{}
							   },err=>{
											 this.errorMessage(err)
							 })
			 
		  }
	/* 	  this.sportService.getSportDetailsbyMapping(event).subscribe(
		   res=>{
		
			 if(res.length>0){
				 let temp=res[0];
				 let level=[];
				 level=temp.level;
				 for(let i=0;i<level.length;i++){
					 let obj={"level":level[i]} ;
					 this.levelObj.push(obj);
				 }
			 }
			 else{}
		   },err=>{
						 this.errorMessage(err)
		 }) */
			
	 }
    getJudgesSport(resUser){
      
        this._objUserService.getJudgesSport(resUser)
        .subscribe(resSport => {
           this.usersportObj=resSport;
               console.log(this.usersportObj)
			
        },
          error => {
              this.errorMessage(error)
              
            }); 
      }
    errorMessage(objResponse:any) {
	
		if(objResponse.message){
			Swal("Alert !", objResponse.message, "info");
		}else{
			Swal("Alert !", objResponse, "info");
		}
        
    }

    bindDetail(objRes:RegisterUserModel) {

        this.objUser = objRes;
       
    }
    addMoreSports() {
         const control = <FormArray>this.SportjudgeForm.controls['sportdetail'];
         control.push(this.intialSport());
      }
      remove(i: number) {
       const control = <FormArray>this.SportjudgeForm.controls['sportdetail'];
       control.removeAt(i);
      }
    onShowEdit() {
        this.router.navigate(['/profile/edit', this.userId]);
    }
    RedirecttoPage(link){
        if(link!='sports'){
            this.router.navigate(['/profile/edit', this.userId]);
        }else{
            this.router.navigate(['/profile/sport']);    
         }
    }
    Onuploadingfor(value){
      if(value == 'technician'){
        this.technician = !this.technician;
      }
      else if(value == 'judge'){
        this.judge = !this.judge;
      }
      if(this.judge  || this.technician){
        this.uploadingFor = true
       }
       else {
        this.uploadingFor = false
      }
    }
    getUploadingForValue() {
      if(this.selectedsportid == this.MFigureSkating || this.selectedsportid == this.WFigureSkating){
        
      if(this.judge && this.technician){
        this.uploadingForValue = '3'
      }
      else if(this.judge){
        this.uploadingForValue = '2'
      }
      else if(this.technician){
        this.uploadingForValue = '1'
      }
      else {
        this.uploadingFor = false
      }
      }
      else{
        this.uploadingForValue = '0'
      }
    }
    UploadingValidation() {
      console.log(this.technician,this.judge,this.SportjudgeForm.value.judge,this.SportjudgeForm.value.technician)
      if(this.selectedsportid == this.MFigureSkating || this.selectedsportid == this.WFigureSkating){
        this.getUploadingForValue();
        if(this.judge  || this.technician){
          this.uploadingFor = true
      }
      else {
        this.uploadingFor = false
      }
    }
    else {
      this.uploadingFor = true
    }

    }
  
	saveUser() {
     this.isSubmitted = true;
    this.getUploadingForValue();
    
    if (this.uploadingFor && this.SportjudgeForm.valid && !this.isinvalidfile) {

        let sportArray=this.SportjudgeForm.value.sportdetail;    
                  if(sportArray.length > 0){
                    for(let i=0 ;i<sportArray.length;i++){

                          let temp=sportArray[i];
						  	temp.sportid=this.selectedsportid;
							temp.levelid=this.selectedlevelid;
							temp.userid=this.loginobjUser._id;
               temp.username=this.loginobjUser.username;
               temp.uploadingfor = this.uploadingForValue;
                          if(i==sportArray.length-1){
                            this.saveSport(temp,true);
                          }else{
                            this.saveSport(temp,false);
                          }               
                    }
              }     
    }
	
    else{
     
    }
  }
  
  saveSport(SportObj,val){
   

    if (this.SportjudgeForm.valid) {
      this._objUserService.saveJudgesSport(SportObj)
        .subscribe(resUser =>{
          if(resUser && val){
            this.saveUserStatusMessage(resUser);
			   this.remove(0);
			   this.addMoreSports();
          }         
        } ,
          error =>this.errorMessage(error));
       
    }
    else{
      
    }
  }
   onFileChange($event,i) {
    let file = $event.target.files[0]; // <--- File Object for future use.
  
    if(file.size<5000000){
         this.isinvalidfile=false;
         const faControl=(<FormArray>this.SportjudgeForm.controls['sportdetail']).at(i);
         faControl['controls'].sportdocname.setValue(file.name);
         faControl['controls'].file.setValue(file);
         this.docchanged=true;
         this.Sportsdoc=file.name;
    }
    else{
      this.isinvalidfile=true;
      const faControl=(<FormArray>this.SportjudgeForm.controls['sportdetail']).at(i);
      faControl['controls'].sportdocname.setValue(file.name);
      faControl['controls'].file.setValue(file);
      this.docchanged=true;
      this.Sportsdoc=file.name;
     
    }
 
      
}
}

