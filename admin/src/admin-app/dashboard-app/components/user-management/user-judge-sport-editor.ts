import {Component, EventEmitter, Output, OnInit} from '@angular/core';
import {UserService} from "./user.service";
import {RegisterUserModel,JudgeSport} from "./user.model";
import {ValidationService} from "../../../shared/services/validation.service";
import{Config} from "../../../shared/configs/general.config";
import{ImageCanvasSizeEnum} from "../../../shared/configs/enum.config";
import {Validators, FormBuilder, FormGroup, FormControl,FormArray} from "@angular/forms";
import{QUESTION_LIST} from '../../../shared/configs/security-question.config'
import {RoleService} from "../role-management/role.service";
import {RoleModel} from "../role-management/role.model";
import {Response} from "@angular/http";
import Swal from 'sweetalert2';
import {ActivatedRoute, Router } from '@angular/router';
import { SportService } from '../sport/sport.service';
  
@Component({
  selector: 'user-form',
  templateUrl: './user-judge-sport-editor.html'
})

export class JudgeSportEditorComponent implements OnInit {
  // objUser: UserModel = new UserModel();
  userForm: FormGroup;

  isSubmitted: boolean = false;

  docid: string;
  sportObj:any=[];
  levelObj:any=[];
  levelAllObj:any=[];
  selectedsportid:string;
  selectedlevelid:string;
  Sportsdocobj:JudgeSport=new JudgeSport()
  Sportsdoc:any;
  Sportsval:JudgeSport=new JudgeSport()
  MFigureSkating:string = Config.MFigureSkating;
  WFigureSkating:string = Config.WFigureSkating;
  technician:boolean = false;
  judge:boolean = false;
  uploadingFor: boolean = true;
  uploadingForValue: string = '0';
   /* file upload */
   allowedExt: string[] = ['docx','doc','txt','pdf','png','jpg','jpeg','webb'];
   allowedSize: number = 1; //MB
   fileDeleted: boolean = false;
   docfile: File;
   docfileName: string = "";
   docFormControl: FormControl = new FormControl('');
   togglechoose:boolean=true;
   docchanged:boolean=false;
   addmorebutton:boolean=true
   username:string;
   userinfo:RegisterUserModel=new RegisterUserModel()
   isinvalidfile:boolean=false;
  techniciancheck: boolean = false;
  judgecheck: boolean = false;
   /* End File Upload handle */

  /* End File Upload handle */
  constructor(private router: Router, private _objUserService: UserService,private activatedRoute: ActivatedRoute ,private _formBuilder: FormBuilder, private roleService: RoleService ,private sportService:SportService) {
    activatedRoute.params.subscribe(param => this.docid = param['docid']);
    this.activatedRoute.queryParams.subscribe(param=>{
      this.username=param['username'];
    })
    this.userForm = this._formBuilder.group({
        sportdetail: this._formBuilder.array([
          this.intialSport(),
        ])
      }
    );

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

    addMoreSports() {
         const control = <FormArray>this.userForm.controls['sportdetail'];
         control.push(this.intialSport());
      }
      remove(i: number) {
       const control = <FormArray>this.userForm.controls['sportdetail'];
       control.removeAt(i);
      }

      editdoc(){
        this.togglechoose=true;
      }
  ngOnInit() {
    this.getAllSportDetail()
    this.getuserinfonbyuserid();
     if(this.docid){
      this.togglechoose=false;
      this.addmorebutton=false;
      this.getDocDetail();
     
    }
  }
  getuserinfonbyuserid(){
     this._objUserService.getUserDetail(this.username).subscribe(res=>{
        //console.log(res);
        this.userinfo=res
     },err=>{
       console.log(err)
     })
  }
  getDocDetail() {
    this._objUserService.getUsersportDetailbyid(this.docid)
      .subscribe(resUser => {
		//  alert("ewe")
		
        this.userDetailView(resUser)
        
      },
        error => this.errorMessage(error));
  }
  userDetailView(objUser) {
  console.log(objUser)
    const faControl=(<FormArray>this.userForm.controls['sportdetail']).at(0);
	let tempsport=[];
	 tempsport=this.sportObj.filter(item=>item._id==objUser.sportid);
	if(tempsport.length>0){		
		faControl['controls'].sportName.setValue(tempsport[0].sportName);
		this.OnSportChange(tempsport[0].sportName)
	}
   // faControl['controls'].sportName.setValue(objUser.sportName);
    faControl['controls'].level.setValue(objUser.level);
    faControl['controls'].docdescription.setValue(objUser.docdescription);
    this.Sportsdoc=objUser.originalfilename;
    faControl['controls'].username.setValue(objUser.username);
    this.selectedlevelid=objUser.levelid;
    this.selectedsportid=objUser.sportid;
    this.setUploadingForValue(objUser.uploadingfor)

  }
  getAllSportDetail(){
        this.sportService.getSportList(10000,1)
        .subscribe(sportres=>{
            
            this.sportObj=sportres.dataList;
           
        },err=>this.errorMessage(err));

        this.sportService.getLevelList(10000,1)
        .subscribe(levelres=>{
           this.levelAllObj=levelres.dataList;
             
        },err=>{
            this.errorMessage(err);
        })
  }
 
  saveSport(SportObj,val){
    

    if (this.userForm.valid) {
      this._objUserService.saveJudgesSport(SportObj)
        .subscribe(resUser =>{
          if(resUser && val){
            this.saveUserStatusMessage(resUser)
          }         
        } ,
          error =>this.errorMessage(error));
        
    }
    else{
      
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
  setUploadingForValue(value) {
    if(this.selectedsportid == this.MFigureSkating || this.selectedsportid == this.WFigureSkating){
      if(value == '1') {
        this.techniciancheck = true;
        this.technician = true;
      }
      else if(value == '2'){
        this.judgecheck = true;
        this.judge = true;
      }
      else if(value == '3'){
        this.judgecheck = true;
        this.techniciancheck = true;
        this.judge = true;
        this.technician = true;
      }
    }
    else {
      this.judgecheck = false;
        this.techniciancheck = false;
        this.technician = false;
        this.judge = false
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
    }
    else{
      this.uploadingForValue = '0'
    }
  }
 
  saveUser() {
     this.isSubmitted = true;
     this.getUploadingForValue();
    if (this.uploadingFor && this.userForm.valid && !this.isinvalidfile) {
       if(this.docid ){

                 let sportArray=this.userForm.value.sportdetail;
                
                 if(sportArray.length > 0){
                  for(let i=0 ;i<sportArray.length;i++){

                         let temp=sportArray[i];
						 temp.sportid=this.selectedsportid;
						 temp.levelid=this.selectedlevelid;
               temp.uploadingfor = this.uploadingForValue;          
                         if(this.docchanged){
                          this._objUserService.updateJudgesSport(temp,this.docid).subscribe(resUser => this.saveUserStatusMessage(resUser),
                          error => this.errorMessage(error));
                         }
                         else{
                              this._objUserService.UpdatesportDetailbyid(temp,this.docid).subscribe(resUser => this.saveUserStatusMessage(resUser),
                                error => this.errorMessage(error));
                         }
                        // this.saveSport(temp,true);                    
                  }
             }             
       }
       else{
        let sportArray=this.userForm.value.sportdetail;    
                  if(sportArray.length > 0){
                    for(let i=0 ;i<sportArray.length;i++){

                          let temp=sportArray[i];
						    temp.sportid=this.selectedsportid;
						    temp.levelid=this.selectedlevelid;
						    temp.userid=this.username;
                temp.username=this.userinfo.username;
                temp.uploadingfor = this.uploadingForValue;
                          if(i==sportArray.length-1){
                            
                            this.saveSport(temp,true);
                          }else{
                           
                            this.saveSport(temp,false);
                          }               
                    }
              }
       }
       
   
        
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

  saveUserStatusMessage(objResponse: any) {
 
    Swal("Success !", objResponse.message, "success");
    this.triggerCancelForm();
  }

  triggerCancelForm() {
    this.router.navigate(['/user-management']);
  }

 
 

  /* End Image handler */
  
   
  onFileChange($event,i) {
    let file = $event.target.files[0]; // <--- File Object for future use.
  
    if(file.size<5000000){
         this.isinvalidfile=false;
         const faControl=(<FormArray>this.userForm.controls['sportdetail']).at(i);
         faControl['controls'].sportdocname.setValue(file.name);
         faControl['controls'].file.setValue(file);
         this.docchanged=true;
         this.Sportsdoc=file.name;
    }
    else{
      this.isinvalidfile=true;
      const faControl=(<FormArray>this.userForm.controls['sportdetail']).at(i);
      faControl['controls'].sportdocname.setValue(file.name);
      faControl['controls'].file.setValue(file);
      this.docchanged=true;
      this.Sportsdoc=file.name;
	  
      
    }
 
      
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
		// alert("swdd")
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
	
			
	 }
  
}

