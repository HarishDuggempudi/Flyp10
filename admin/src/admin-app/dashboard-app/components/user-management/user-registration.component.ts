import {Component, EventEmitter, Output, OnInit,ViewChild} from '@angular/core';
import {UserService} from "./user.service";
import {RegisterUserModel,JudgeSport,UserModel} from "./user.model";
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
import {Location} from '@angular/common';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ImageCroppedEvent } from "ngx-image-cropper/src/image-cropper.component";
import { ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import { CountryService } from '../countryConfig/country.service';
@Component({
  selector: 'user-form',
  templateUrl: './user-registration-form.html'
})

export class UserRegistrationComponent implements OnInit {
  // objUser: UserModel = new UserModel();
  userForm: FormGroup;
  MemberForm:FormGroup;
  userAvailability: number=0;
  isSubmitted: boolean = false;
  objRoleList: RoleModel[] = [];
  userObj: RegisterUserModel = new RegisterUserModel();
  logineduserObj: UserModel = new UserModel();
  private _onDestroy = new Subject<void>();
  /* Image Upload Handle*/
  imageDeleted: boolean = false;
  file: any;
  fileName: string = "";
  drawImagePath: string = Config.DefaultAvatar;
  imageFormControl: FormControl = new FormControl('');
  canvasSize: number = ImageCanvasSizeEnum.small;
  /* End Image Upload handle */
  questionlist: string[] = QUESTION_LIST;
  imageExtension: string;
  imagePath: string;
  userId: string;
  sportObj:any=[];
  levelObj:any=[];
  levelAllObj:any=[];
  selectedsportid:string;
  selectedlevelid:string;
  startDate:any=new Date();
  Sportsdocobj:JudgeSport=new JudgeSport()
  Sportsdoc:any=[this.Sportsdocobj]
  Sportsval:JudgeSport=new JudgeSport()
  editUserObj: RegisterUserModel = new RegisterUserModel();
   /* file upload */
   allowedExt: string[] = ['docx','doc','txt','pdf','png','jpg','jpeg','webb'];
   allowedSize: number = 1; //MB
   fileDeleted: boolean = false;
   docfile: File;
   docfileName: string = "";
   docFormControl: FormControl = new FormControl('');
   isinvalidfile:boolean=false;
   isaddUSAGID :boolean = false;
   /* End File Upload handle */
   usernameVal:string=""
   
   /*crooper variable declaration*/
    @ViewChild('cropper', undefined)
    cropper:ImageCropperComponent;
    cropped:boolean;
    cropperSettings: CropperSettings;
	imageChangedEvent: any = '';
    croppedImage: any = '';
	editimagesrc:any='';
    statelist:any=[
   
]
  memberObj: any ={};
  countrylist: any;
  isSelectState: boolean = false;
  filteredCountry: any =[];
  /* End File Upload handle */
  constructor(private countryservice:CountryService,private location:Location,private router: Router, private _objUserService: UserService,private activatedRoute: ActivatedRoute ,private _formBuilder: FormBuilder, private roleService: RoleService ,private sportService:SportService) {
    activatedRoute.params.subscribe(param => this.userId = param['userId']);
    let userInfo:UserModel = JSON.parse(Config.getUserInfoToken());
    this.logineduserObj=userInfo;
    this.getCountrylist();
	 this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.canvasWidth = 425;
        this.cropperSettings.canvasHeight = 300;
        // this.MemberForm = this._formBuilder.group({
        //   "MemberID": ['', Validators.required]
        // })
        var emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
    this.userForm = this._formBuilder.group({
        "firstName": ['', Validators.required],
        "lastName": ['', Validators.required],
        "username":['', Validators.required],
        "email": ['', Validators.compose([Validators.required, Validators.pattern(emailRegEx)])],
        "phoneNumber": ['', Validators.compose([ValidationService.numberValidatorwithDash])],
        "securityQuestion": [''],
        "securityAnswer": [''],
        "password": ['', Validators.compose([Validators.required, ValidationService.passwordValidator])],
        "confirmPassword": ['', Validators.required],
        "passphrase": ['',Validators.required],
        "package":[''],
        "dob":['',Validators.required],
        address:['',Validators.required],
        country:['',Validators.required],
        imageFormControl: this.imageFormControl,
        middleName: [''],
        userRole: [''],
        active:[''],
        alwaysSharedRoutine:[''],
        "inputCountry":[''] ,
        sportdetail: this._formBuilder.array([
          this.intialSport(),
        ]),
        EligibleJudgeForMyFlyp10Routine :['']
      },
      {
        validator: ValidationService.matchingPasswords('password', 'confirmPassword')
      }
    );
    this.userForm.controls.inputCountry.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
        
      this.filterCountry();
     
    });
  }
  onsharedRoutine() {

  }
  getCountrylist(){
    this.countryservice.getCountry().subscribe(res=>{
      //console.log("res",res);
      if(res && res.data.length>0){
         this.countrylist=res.data
         this.countrylist.sort((a, b) => a.Name.localeCompare(b.Name))
         this.filteredCountry = this.countrylist
      }else{
        Swal("Alert","Unable to load  country.","info")
      }
  },err=>{
     Swal("Alert",err,"info")
  })
  }
  OnCountryChange(country,val){
    
    var country = country
    if(country == 'United States' || country == 'Canada'){
      var c = country == 'United States'?'US':'Canada';
      this.isSelectState = true
      this.getStateForCountry(c)
    }
    else {
      if(val == 1)
      this.userForm.controls['address'].setValue('')
      this.isSelectState = false
    }
  

  }
  getStateForCountry(country) {
    this.sportService.getStateForCountry(country).subscribe(
      res=>{
       // console.log(res)
        this.statelist=res.data
        this.statelist.sort((a, b) => a.name.localeCompare(b.name))
      },err=>{
      
    })
  }
  filterCountry(){
    if (!this.countrylist) {
 return;
}
// get the search keyword
let search = this.userForm.controls.inputCountry.value;
if (!search) {
 this.filteredCountry=this.countrylist.slice();
 return;
} else {
 search = search.toLowerCase();
}
// filter the banks
this.filteredCountry=this.countrylist.filter(event => event.Name.toLowerCase().indexOf(search) > -1)

}
  intialSport() {
    return this._formBuilder.group({
      sportName: [''],
      level: [''],
      sportdocname:this.docFormControl,
      file:[''],
      username:['']
    });
    }
    addUSAGM() {
      this.isaddUSAGID = !this.isaddUSAGID;
    }

    checkUsername(ev){
      this.usernameVal = ev;
   
      if(this.userId){

        if(this.editUserObj.username != ev){
          if(ev.length > 3){
            this._objUserService.getUserDetailsByUsername(ev).subscribe( data => {
              
              if(data["reqData"].length){
                if(data["reqData"][0].username === ev){
                  this.userAvailability = 1;
                
                  
                }
              }else{
                this.userAvailability = 2;
              }
            })
          }else{
            this.userAvailability = 0;
          }
        }else{

        }
      }else{
        if(ev.length > 3){
          this._objUserService.getUserDetailsByUsername(ev).subscribe( data => {
            
            if(data["reqData"].length){
              if(data["reqData"][0].username === ev){
                this.userAvailability = 1;
              
                
              }
            }else{
              this.userAvailability = 2;
            }
          })
        }else{
          this.userAvailability = 0;
        }
      }
      
    }

    addMoreSports() {
         const control = <FormArray>this.userForm.controls['sportdetail'];
         control.push(this.intialSport());
      }
      remove(i: number) {
       const control = <FormArray>this.userForm.controls['sportdetail'];
       control.removeAt(i);
      }
  ngOnInit() {
     if(this.userId){
      this.getUserDetail();
    }else{
      this.userForm.patchValue({
        passphrase: 'not set'
      })
      this.getRoleList();
      this.getAllSportDetail();
    }
  }

  getUserDetail() {
    this._objUserService.getUserDetail(this.userId)
      .subscribe(resUser => this.userDetailView(resUser),
        error => this.errorMessage(error));
  }
  userDetailView(objUser: RegisterUserModel) {
   
    this.editUserObj=objUser;
    this.imageExtension = objUser.imageProperties ? objUser.imageProperties.imageExtension : '';
    this.imagePath = objUser.imageProperties ? objUser.imageProperties.imagePath : '';
	
	if(objUser.userRole=='3'){
		
		  this.userForm.patchValue({
      firstName: objUser.firstName,
      lastName: objUser.lastName,
      email: objUser.email,
      phoneNumber: objUser.phoneNumber,
      alwaysSharedRoutine:objUser.alwaysSharedRoutine?objUser.alwaysSharedRoutine:'N',
      dob:objUser.dob,
      password:"asaaaa@123",
      confirmPassword:"asaaaa@123",
      passphrase: objUser.passphrase,
      userRole: objUser.userRole,
      username:objUser.username,
      address:objUser.address,
      active:objUser.active,
      country:objUser.country,
      EligibleJudgeForMyFlyp10Routine:false
    });
	 this.userForm.get('dob').setValidators([Validators.required]);
     this.userForm.get('dob').updateValueAndValidity();  
   this.userObj.dob=objUser.dob
   this.OnCountryChange(this.userForm.value.country,0)
	
	}
	else{
		  this.userForm.patchValue({
		  firstName: objUser.firstName,
		  lastName: objUser.lastName,
		  email: objUser.email,
		  phoneNumber: objUser.phoneNumber,
		  dob:objUser.dob,
		  password:"password@123",
		  confirmPassword:"password@123",
		  passphrase:"not yet set",
		  userRole: objUser.userRole,
		  username:objUser.username,
		  address:objUser.address,
      active:objUser.active,
      country:objUser.country,
      EligibleJudgeForMyFlyp10Routine:objUser.EligibleJudgeForMyFlyp10Routine?objUser.EligibleJudgeForMyFlyp10Routine:false
		});
		  this.userForm.get('dob').clearValidators();
          this.userForm.get('dob').updateValueAndValidity();
          this.OnCountryChange(this.userForm.value.country,0)
		 
	}
   
    this.fileName = objUser.imageName;
    (<FormControl>this.userForm.controls['imageFormControl']).patchValue(this.fileName);
    let path: string = "";
    if (objUser.userRole == "superadmin") {
      // this.userForm.controls["userRole"].reset({value: objUser.userRole, disabled: true})
      this.userForm.controls["userRole"].patchValue(objUser.userRole);
    }
    if (this.fileName) {
      var cl = Config.Cloudinary;
      // path = cl.url(this.fileName);
      path="https://flyp10.com/public/uploads/images/users/"+this.fileName;
     
	   this.editimagesrc=path
      this.drawImageToCanvas(path);
    }
    // path = "/uploads/avatars/" + this.objUser.imageName;
    else{
		 path = Config.DefaultAvatar;
		 this.editimagesrc=path
         this.drawImageToCanvas(path);
	}
     
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
   OnSportChange(event){
		this.levelObj=[];
		let tempsport=[];
		 tempsport=this.sportObj.filter(item=>item.sportName.toLowerCase()==event.toLowerCase());
	
		  if(tempsport.length>0){
			  this.selectedsportid=tempsport[0]._id;
			  
		  }
		  this.sportService.getSportDetailsbyMapping(this.selectedsportid).subscribe(
		   res=>{
		
			//  if(res.length>0){
			// 	 let temp=res[0];
			// 	 let level=[];
			// 	 level=temp.level;
			// 	 for(let i=0;i<level.length;i++){
			// 		 let obj={"level":level[i]} ;
			// 		 this.levelObj.push(obj);
			// 	 }
      //  }
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
 OnlevelChange(event){
	 let tempsport=[];
		 tempsport=this.levelAllObj.filter(item=>item.level.toLowerCase()==event.toLowerCase());
		 
		  if(tempsport.length>0){
			  this.selectedlevelid=tempsport[0]._id;
			  
		  }
 }
  getRoleList() {
    this.roleService.getRoleList(true) /*get active role*/
      .subscribe(objRes => this.objRoleList = objRes,
        err=>this.errorMessage(err));
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
  onuserRoleChange(){
	 // alert("eee")
     if(this.userObj.userRole!='2'){
         this.isinvalidfile=false;
     }
	 if(this.userObj.userRole!='3'){
		  this.userForm.get('dob').clearValidators();
          this.userForm.get('dob').updateValueAndValidity();
	 }
	 else{
		    this.userForm.get('dob').setValidators([Validators.required]);
            this.userForm.get('dob').updateValueAndValidity();
	   }
  }
  saveUser() {
    this.isSubmitted = true;
   
    if (this.userForm.valid &&  !this.isinvalidfile) {
       if(!this.userId){
         if(this.userAvailability===2){
          this._objUserService.registerUser(this.userForm.value, this.file)
          .subscribe(resUser => {
            // if(this.isaddUSAGID){
            //   this.verifyUSAGMemberID(resUser.res[0]._id);
            //   }
            if(resUser.val==1 && this.userForm.controls['userRole'].value!=2 ){
              this.saveUserStatusMessage(resUser)
            }
            else{
              
                   let sportArray=this.userForm.value.sportdetail;
                  
                   if(sportArray.length > 0){
                         for(let i=0 ;i<sportArray.length;i++){
  
                                let temp=sportArray[i];
                            
                                temp.username=this.userForm.value.username;
								temp.userid=resUser.res[0]._id;
							
								temp.sportid=this.selectedsportid;
								temp.levelid=this.selectedlevelid;
                                if(i==sportArray.length-1){
                                  this.saveSport(temp,true);
                                }else{
                                  this.saveSport(temp,false);
                                }
                         }
                    }
                   
              }
              
          } ,
            error =>this.errorMessage(error));
         }else{
          Swal("Username already taken!","Selected username is unavailable. Please choose a different username and try again!", "info");
         }
       }
       else{
              
              this._objUserService.updateUser(this.userForm.value, this.file, this.imageDeleted, this.userId)
              .subscribe(resUser =>{		
                // if(this.isaddUSAGID){
                //   this.verifyUSAGMemberID(this.userId);
                //   }
                     this.setUserDetail();			  
				     this.saveUserStatusMessage(resUser)
				  },
                error => this.errorMessage(error));
       }
       
   
        
    }
    else{
     
      if(this.isinvalidfile){
         Swal("Alert !","Verfication document size should be less then 1MB", "info");
       }
    }
  }
  verifyUSAGMemberID(userid){
    this.memberObj['MemberID'] = this.MemberForm.value.MemberID;
    this.memberObj['Flyp10UserID'] = userid
    this._objUserService.verifyMembership(this.memberObj).subscribe((res)=>{
      console.log(res)
  })
  }
  
  setUserDetail() {
    this._objUserService.getUserDetail(this.userId)
      .subscribe(resUser =>{
		
		   if(this.logineduserObj._id==resUser._id){
			  
			    this.logineduserObj.imageName=resUser.imageName;
			    Config.setLoggedinuserinfo( this.logineduserObj);
			    Config.setchanges('1');
			   
			    this.location.back();
			   
		   }
		   
	  },
      error => this.errorMessage(error));
  }
  errorMessage(objResponse: any) {
    
    Swal("Alert !", objResponse.message, "info");
  }

  saveUserStatusMessage(objResponse: any) {
  
    Swal("Success !", objResponse.message, "success");
	if(this.logineduserObj._id!=this.userId){
		this.triggerCancelForm();
	}  
  }

  triggerCancelForm() {
    //this.router.navigate(['/user-management']);
    this.location.back();
  }

  /*Image handler */

  changeFile(args: any) {
 
    this.file = args;
    this.fileName = this.file.name;
  }




  drawImageToCanvas(path: string) {
    this.drawImagePath = path;
    
  }

  deleteImage() {
  Swal({
        title: "Are you sure?",
        text: "You will not be able to recover the image  !",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!"
      })
      .then((result)=> {
        if(result.value){
          this._objUserService.deleteImage(this.fileName, this.imageExtension, this.imagePath)
          .subscribe(resUser => {
             this.imageDeleted = true;
             this.fileName = "";
			let path = Config.DefaultAvatar;
		     this.editimagesrc=path
            this.handleDeleteSuccess(resUser);
            Swal("Deleted!", resUser.message, "success");
          },
            error => {
              Swal("Alert!", error, "info");
            });
          }
      });

  }

  handleDeleteSuccess(resUser: Response) {
    this.imageDeleted = true;
    this.userObj.imageName = "";
    let path = Config.DefaultAvatar;
    this.drawImageToCanvas(path);
  }

  /* End Image handler */
  
   /*image Cropper function start here*/
       fileChangeEvent(event: any): void {
			this.imageChangedEvent = event;
			this.cropped=true;
		}
	imageCropped(event: ImageCroppedEvent) {
		
		this.croppedImage = event.base64;
		const url = this.croppedImage;
		
		const b64Data = url.split("base64,")[1];
		//console.log(b64Data)
		const blob = this.b64toBlob(b64Data,"png");
		//console.log(blob)
		this.file=blob
		/* try{
			const file = new File([blob], "png")
		    console.log(file) 
			this.file=file;
		}catch(ex){
			alert(ex.message)
		} */
		
		/* fetch(url)
		  .then(res => res.blob())
		  .then(blob => {
			const file = new File([blob], "png")
			this.file=file;
			console.log(this.file)
		  },err=>{
			  alert(err)
		  }) */
		 
	}
	
   b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
   const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }  

   const blob = new Blob(byteArrays, {type: contentType});
  return blob; 
  /*  var file = new File(byteArrays, "userprfile.png", { type:'image/png'});
    return file; */
}
		imageLoaded() {
			// show cropper
		}
		loadImageFailed() {
			// show message
		}
		  

    onCropClick(){
        this.cropped=!this.cropped;
    }
   /*image Cropper function end here*/	
  onFileChange($event,i) {
    let file = $event.target.files[0]; // <--- File Object for future use.
    if(file.size<1000000){
      this.isinvalidfile=false;
      const faControl=(<FormArray>this.userForm.controls['sportdetail']).at(i);
      faControl['controls'].sportdocname.setValue(file.name);
      faControl['controls'].file.setValue(file);
    }
    else{
      this.isinvalidfile=true;
      const faControl=(<FormArray>this.userForm.controls['sportdetail']).at(i);
      faControl['controls'].sportdocname.setValue(file.name);
      faControl['controls'].file.setValue(file);
    }
   
      
}
 


}

