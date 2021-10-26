
import { Component, OnInit, Inject, PLATFORM_ID, APP_ID, ViewChild } from "@angular/core";
import { isPlatformBrowser,DOCUMENT} from '@angular/common';
import { SeoService } from '../../shared/seo.service';
import { TransferState } from '@angular/platform-browser';
import {Validators, FormBuilder, FormGroup, FormControl} from "@angular/forms";
import {ImageCanvasSizeEnum} from "../../shared/config/enum.config";
import {Config} from "../../shared/config/general.config";
import Swal from 'sweetalert2';
import {ValidationService} from "../../../admin-app/shared/services/validation.service";
import {UserService} from "../../../admin-app/dashboard-app/components/user-management//user.service";
import {SportService} from "../../../admin-app/dashboard-app/components/sport/sport.service";
import {CountryService} from "../../../admin-app/dashboard-app/components/countryConfig/country.service";
import { NgxSpinnerService } from 'ngx-spinner';
import {RegisterUserModel,JudgeSportModel} from '../../../admin-app/dashboard-app/components/user-management/user.model';
import { ActivatedRoute,Router } from "@angular/router";
import {DefaultCard}from "../../../admin-app/dashboard-app/components/wallet/wallet.model"
import { ImageCroppedEvent } from "ngx-image-cropper/src/image-cropper.component";
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import { HttpHeaders } from "@angular/common/http";
import { Services } from '../../shared/services';
import * as $ from 'jquery';
@Component({
    selector: 'signup',
    templateUrl: './signup.html',
    styleUrls: ['./signup.scss'],
    
})

export class SignupComponent implements OnInit{
    data:any;
 
    @ViewChild('cropper', undefined)
    cropper:ImageCropperComponent;
    cropped:boolean;
    cropperSettings: CropperSettings;
    websiteName: string = "Flyp10";
    websiteDescription: string = "Flyp10";
    websiteImage: string = "assets/client/images/red_icon.png";
    imageExtension: any;
    imagePath: any;
    isSubmitted:boolean = false;
    basicInfoSubmitted:boolean = false;
    contactInfoSubmitted:boolean = false;
    sportInfoSubmitted:boolean = false;
    date:any;
    /* Image Upload Handle*/
    imageDeleted:boolean = false;
    file:any;
    fileName:string = "";
    sportInfo:FormGroup;
    basicInfo:FormGroup;
    contactInfo: FormGroup;
    cardInfo:FormGroup;
    cardType:any="unknown"; 
	cvvMask:any="000";
	cardNumMask="0000-0000-0000-0000";
    drawImagePath:string = Config.DefaultAvatar;
    imageFormControl:FormControl = new FormControl('');
    canvasSize:number = ImageCanvasSizeEnum.small;
    userObj: RegisterUserModel = new RegisterUserModel();
    sportval:JudgeSportModel= new JudgeSportModel();
    submitted:boolean=false;
    cardInfoSubmitted:boolean=false;
	isChecked:boolean=false;
    /* End Image Upload handle */
    sportObj:any=[];
    levelObj:any=[];
    usernameVal:string="";
    userAvailability:any=0;
    userRole:any;
    imageChangedEvent: any = '';
    croppedImage: any = '';
	stateCode:string='';
	stateID:any=0;
  cityID:any=0;
  captchaSiteKey = Config.captchaSiteKey
  countrylist:any=[];
	public ZipCodelist:any=[];
	public statelist:any=[];
	public Citylist:any=[];
    isPwdMatch: boolean=true;
  isCaptchaVerify: boolean = true;
  isCaptchaInvalid: boolean = false;
  isSelectState: boolean = false;
    constructor(private countryservice:CountryService,private _service:Services,private router: Router,private activatedRoute: ActivatedRoute ,@Inject(NgxSpinnerService) private spinner: NgxSpinnerService,@Inject(DOCUMENT) private document: any,@Inject(SeoService)private seo: SeoService, @Inject(PLATFORM_ID) private platformId: Object, @Inject(APP_ID) private appId: string, @Inject(TransferState)private state: TransferState, private _fb: FormBuilder,private _objUserService: UserService,private sportService:SportService) { 
        activatedRoute.params.subscribe(param => this.userRole = param['userRole']);
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.canvasWidth = 425;
        this.cropperSettings.canvasHeight = 300;
        this.data = {};
        
        if(this.userRole=='judge' || this.userRole=='recruiter' ){
            this.basicInfo = this._fb.group({
                fname: ['', Validators.required],
                lname: ['', Validators.required],
               
                imageFormControl: this.imageFormControl,
                username: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
                pwd: ['',Validators.compose([Validators.required, ValidationService.passwordValidator])],
                repwd: ['',Validators.compose([Validators.required])]
            })
            
            this.contactInfo = this._fb.group({
                email: ['', Validators.email],
                phone: [''],
                address: ['', Validators.required],
                USCitizen: ['Y', Validators.required],
                country:['']
            })
    
            this.sportInfo = this._fb.group({
                sportName: ['', Validators.required],
                level: ['', Validators.required]
            })
    
            this.cardInfo = this._fb.group({
                nameOnCard: ['', Validators.required],
                cardNum: ['', Validators.required],
                expiresOn: ['', Validators.required],
                cvv: ['', Validators.required]
            })
        }else if(this.userRole=='competitor'){
            this.basicInfo = this._fb.group({
                fname: ['', Validators.required],
                lname: ['', Validators.required],
                dob: ['',Validators.required],
                imageFormControl: this.imageFormControl,
                username: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
                pwd: ['',Validators.compose([Validators.required, ValidationService.passwordValidator])],
                repwd: ['',Validators.compose([Validators.required])],
                referralType: [''],
                referrer: ['']

                
            })
            
            this.contactInfo = this._fb.group({
              email: ['', Validators.email],
              phone: [''],
              address: ['', Validators.required],
              USCitizen: ['Y', Validators.required],
              country:['']          
            })
    
            this.sportInfo = this._fb.group({
                sportName: ['', Validators.required],
                level: ['', Validators.required]
            })
    
            this.cardInfo = this._fb.group({
                nameOnCard: ['', Validators.required],
                cardNum: ['', Validators.required],
                expiresOn: ['', Validators.required],
                cvv: ['', Validators.required],
                address: ['', Validators.required],
                USCitizen: ['Y', Validators.required],
                state: ['', Validators.required],
				        city: ['', Validators.required],
                zipcode: ["", Validators.required],
                country:['']
            })
        }
        this.getCountrylist();
    }
    getCountrylist(){
      // this.countryservice.getActivecountryCurrency().subscribe(res=>{
      //     //console.log("res",res);
      //     if(res.length>0){
      //        this.countrylist=res
      //     }else{
      //       Swal("Alert","Unable to load  country.","info")
      //     }
      // },err=>{
      //    Swal("Alert",err,"info")
      // })
       this.countryservice.getCountry().subscribe(res=>{
          //console.log("res",res);
          if(res && res.data.length>0){
             this.countrylist=res.data
             this.countrylist.sort((a, b) => a.Name.localeCompare(b.Name))
          }else{
            Swal("Alert","Unable to load  country.","info")
          }
      },err=>{
         Swal("Alert",err,"info")
      })
    }
    OnCountryChange(ev){
      var country = ev.target.value;
      if(country == 'United States' || country == 'Canada'){
        var c = country == 'United States'?'US':'Canada';
        this.isSelectState = true
        this.getStateForCountry(c)
      }
      else {
        this.contactInfo.controls['address'].setValue('')
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
    onDateChanged(ev){
       //console.log(ev.formatted);
       
     
    }
    
    captchaVerification() {
      return new Promise((resolve, reject) => {
      this.isCaptchaInvalid = false;
      var captchResponse = $('#g-recaptcha-response').val();
      if(captchResponse == ''){
        this.isCaptchaVerify = false;
        this.isCaptchaInvalid = true;
        resolve()
      }
      else{
        this._service.postCaptcha(captchResponse).subscribe((res)=>{
          console.log(res)
          let response = JSON.parse(res.data);
          if(response.success){
            this.isCaptchaVerify = true;
            resolve();
          }
          else {
            this.isCaptchaVerify = false;
            resolve();
          }
        })
      }
    })
    
          //user is a
    }
    onjudgeCitizenchange(){
      let citizen=this.contactInfo.controls['USCitizen'].value;
      if(citizen=='Y'){
        this.contactInfo.controls['country'].clearValidators();      
        this.contactInfo.controls['country'].updateValueAndValidity();
        
      
      }
      else{
        this.contactInfo.controls['country'].setValidators([Validators.required]);
        this.contactInfo.controls['country'].updateValueAndValidity();

      }
   } 
    onCitizenchange(){
       let citizen=this.cardInfo.controls['USCitizen'].value;
       if(citizen=='Y'){
         this.cardInfo.controls['country'].clearValidators();      
         this.cardInfo.controls['country'].updateValueAndValidity();
         
       
       }
       else{
         this.cardInfo.controls['country'].setValidators([Validators.required]);
         this.cardInfo.controls['country'].updateValueAndValidity();

       }
    }
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
	  
	  whatisCvv(){
		// Swal("What is a security code?","The security code can be a three-digit or four-digit number, printed on either on the back of the card or the front","info") 
	    Swal({
		  type: 'info',
		  title: 'What is a security code?',
		  html: "The security code can be a three-digit or four-digit number, printed on either on the back of the card or the front<r>"+
		   "<img class='img-responsive' src='assets/client/images/cvv.png'>"
		  //footer: '<a href>Why do I have this issue?</a>'
		})
	 }
    onCropClick(){
        this.cropped=!this.cropped;
    }

    returnCardType(ev){
        //console.log('card input number ', ev.target.value);
        this.cardType = this.cc_brand_id(ev.target.value);
    }

    cc_brand_id(cur_val) {
        // the regular expressions check for possible matches as you type, hence the OR operators based on the number of chars
        // regexp string length {0} provided for soonest detection of beginning of the card numbers this way it could be used for BIN CODE detection also
        
		 if(cur_val){
			  
			  if(cur_val.length>1){
				  this.isChecked=true;
			  }
			  else{
				  this.isChecked=false;
			  }
		 }else{
			  this.isChecked=false;
		 }
        //JCB
        var jcb_regex = new RegExp('^(?:2131|1800|35)[0-9]{0,}$'), //2131, 1800, 35 (3528-3589)
        // American Express
        amex_regex = new RegExp('^3[47][0-9]{0,}$'), //34, 37*
        // Diners Club
        diners_regex = new RegExp('^3(?:0[0-59]{1}|[689])[0-9]{0,}$'), //300-305, 309, 36, 38-39
        // Visa
        visa_regex = new RegExp('^4[0-9]{0,}$'), //460*
        // MasterCard
        mastercard_regex = new RegExp('^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$'), //2221-2720, 51-55*
        maestro_regex = new RegExp('^(5[06789]|6)[0-9]{0,}$'), //always growing in the range: 60-69, started with / not something else, but starting 5 must be encoded as mastercard anyway
        //Discover
        discover_regex = new RegExp('^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$');
        ////6011, 622126-622925, 644-649, 65*
      
      
        // get rid of anything but numbers
        cur_val = cur_val.replace(/\D/g, '');
      
        // checks per each, as their could be multiple hits
        //fix: ordering matter in detection, otherwise can give false results in rare cases
        var sel_brand = "unknown";
		this.cvvMask="000";
		this.cardNumMask="0000-0000-0000-0000";
        if (cur_val.match(jcb_regex)) {
          sel_brand = "jcb";
        } else if (cur_val.match(amex_regex)) {
          sel_brand = "amex";
		  this.cvvMask="0000"
		  this.cardNumMask="0000-000000-00000";
        } else if (cur_val.match(diners_regex)) {
          sel_brand = "diners";
        } else if (cur_val.match(visa_regex)) {
          sel_brand = "visa";
        } else if (cur_val.match(mastercard_regex)) {
          sel_brand = "mastercard";
        } else if (cur_val.match(discover_regex)) {
          sel_brand = "discover";
        } else if (cur_val.match(maestro_regex)) {
          if (cur_val[0] == '5') { //started 5 must be mastercard
            sel_brand = "mastercard";
          } else {
            sel_brand = "maestro"; //maestro is all 60-69 which is not something else, thats why this condition in the end
          }
        }      
        return sel_brand;
      }
    
    ngOnInit() {
        this.setSeoTags();
        const platform = isPlatformBrowser(this.platformId);    
        this.getAllSportDetail(); 
		this.getState();
    }
    onStateChange(val){
		//alert(val)
		let temp=[];
		temp=this.statelist.filter(item=>item.name==this.cardInfo.value.state);
		if(temp.length>0){
			this.stateCode=temp[0].abbreviation;
			this.stateID=temp[0].StateID;
			this.getCity(this.stateID);
			//alert(this.stateCode)
		}
		
	}
	onCityChange(){
		let temp=[];
		temp=this.Citylist.filter(item=>item.city==this.cardInfo.value.city);
		if(temp.length>0){
			
			this.cityID=temp[0].CityID;
			this.getZip(this.stateID,this.cityID);
			//alert(this.stateCode)
		}
	}
    checkUsername(ev){
        this.usernameVal = ev;
       // console.log('username input ', ev);
        if(ev.length > 2){
          this._objUserService.getUserDetailsByUsername(ev).subscribe( data => {
           // console.log('service data ', data)
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
	getState(){
		this.sportService.getState().subscribe(
		  res=>{
			 // console.log(res)
			  this.statelist=res
		  },err=>{
			
		})
	}
    getCity(sid){
		this.spinner.show()
		this.sportService.getCity(sid).subscribe(
		  res=>{
			  console.log(res)
			  this.spinner.hide()
			  this.Citylist=res
		  },err=>{
			this.spinner.hide()
		})
	}
  getZip(sid,cid){
	  this.spinner.show()
		this.sportService.getZip(sid,cid).subscribe(
		  res=>{
			  console.log(res)
			  this.spinner.hide()
			  this.ZipCodelist=res
		  },err=>{
			this.spinner.hide()
		})
  }
    getAllSportDetail(){
        this.sportService.getSportList(10000,1)
        .subscribe(sportres=>{
            
            this.sportObj=sportres.dataList;
            //console.log(this.sportObj);
        },err=>this.errorMessage(err));

        this.sportService.getLevelList(10000,1)
        .subscribe(levelres=>{
           this.levelObj=levelres.dataList;
          // console.log("levelres",levelres)    
        },err=>{
            this.errorMessage(err);
        })
  }
    selectSportVal(ev){
       // console.log('sel cval ', ev);
        this.sportInfo.patchValue({ sportName: ev.target.value });
       // console.log('sport info form ', this.sportInfo.value);
    }
    whyThis(){
		  Swal("Why does Flyp10 need this?", "Flyp10 is all about fun, skill development and safety.  Parental supervision is an essential component of our focus on safety. Entering a valid card number is our best assurance that an adult is participating in a child’s account.  Signup is free and no charges will be made until you choose to add to your wallet or purchase a premium subscription.","info");
	}
    selectLevelVal(ev){
       // console.log('sel dval ', ev);
        this.sportInfo.patchValue({ level: ev.target.value });
       // console.log('sport info form ', this.sportInfo.value);
    }

    enterSecondStep(ev){
    //  this.captchaVerification()
      
          this.basicInfoSubmitted = true;
       

       
    //     if(this.basicInfo.valid )
    //    // console.log(this.basicInfo);
         
    }
    
    enterThirdStep(ev){
        this.contactInfoSubmitted = true;
    //     if(this.contactInfo.valid)
    //    // console.log(ev);
    }

    enterFinalStep(ev){
        this.contactInfoSubmitted = true;
        // if(this.contactInfo.valid)
        // console.log(ev);
    }

    enterFouthStep(ev){
        this.sportInfoSubmitted = true;
        // if(this.sportFormValid())
        // console.log(ev);
    }
    addSportdetail(){
          this.sportval.sportName=this.sportInfo.value.sportName;
          this.sportval.level=this.sportInfo.value.level;
          this.sportval.username=this.basicInfo.value.username;
          this.sportval.active=true;
         // console.log("this.sportval",this.sportval)
          this._objUserService.saveuserSport(this.sportval)
          .subscribe(resUser => this.saveUserStatusSportMessage(resUser),
          error => this.errorMessage(error));
    }
    async userFormSubmit(){
        this.submitted=true;
        this.contactInfoSubmitted=true;
        this.cardInfoSubmitted=true;
        var captchResponse = $('#g-recaptcha-response').val();
         if(captchResponse == ''){
        this.isCaptchaVerify = false;
         }
        await this.captchaVerification()
        
       console.log('basic info ', this.basicInfo.value);
       console.log('contact info ', this.contactInfo.value);
       console.log('card info ', this.cardInfo.value);
        this.userObj.firstName=this.basicInfo.value.fname;
        this.userObj.lastName=this.basicInfo.value.lname;
        this.userObj.password=this.basicInfo.value.pwd;
        this.userObj.email=this.contactInfo.value.email;
        this.userObj.phoneNumber=this.contactInfo.value.phone;
        this.userObj.country = this.contactInfo.value.country;
        
        if(this.userRole=='competitor'){
            this.userObj.dob=this.basicInfo.value.dob.formatted;
            // this.userObj.address=this.cardInfo.value.address;
            // this.userObj.isUSCitizen=this.cardInfo.value.USCitizen=='Y'?'1':'0';
            // this.userObj.country=this.cardInfo.value.country;
            this.userObj.referrer = this.basicInfo.value.referrer
            this.userObj.referralType = this.basicInfo.value.referralType
        }        
        this.userObj.username=this.basicInfo.value.username;
        
        if(this.userRole=='judge'){
            this.userObj.userRole='2';
            this.userObj.address=this.contactInfo.value.address;
        }else if(this.userRole=='competitor'){
            this.userObj.userRole='3';
            this.userObj.address=this.contactInfo.value.address;
        }else  if(this.userRole=='recruiter'){
            this.userObj.userRole='4';
            this.userObj.address=this.contactInfo.value.address;
        }
        
        this.userObj.addedBy='self';
        this.userObj.active=true;

//         if(this.userRole=='competitor'){
//             if(this.isCaptchaVerify && this.basicInfo.valid && this.contactInfo.valid && this.cardInfo.valid && this.cardType !== "unknown" && this.userAvailability == 2 && this.isPwdMatch){
// console.log(this.userObj)
//                 const httpOptions = {
//                     headers: new HttpHeaders({
//                         'Content-Type': 'application/x-www-form-urlencoded',
//                         "Accept": "application/xml"
//                     })

//                 };

   
				
// 				/**
// 				  find firstname and lastname dfrom name on card
// 				*/
//                   var fullname=this.cardInfo.value.nameOnCard;
// 				  var tempnameArray=[];
// 				  var firstname="";
// 				  var lastname=""
// 				  tempnameArray=fullname.split(" ");
// 					  if(tempnameArray.length!==0){
// 						  if(tempnameArray.length>1 && tempnameArray.length>0){
// 						  firstname=tempnameArray[0];
// 						  lastname=tempnameArray[tempnameArray.length-1];
// 					  }
// 					  else{
// 						  firstname=tempnameArray[0];
// 					  }
// 				   }else{
// 					   firstname=this.cardInfo.value.nameOnCard;
// 				   }
				  
//                 const valCard = {
                
//                     ssl_transaction_type:"CCVERIFY",
//                     ssl_card_number:this.cardInfo.value.cardNum,
//                     ssl_exp_date:this.cardInfo.value.expiresOn,
//                     ssl_first_name:firstname,
//                     ssl_last_name:lastname,
//                     ssl_test_mode:"True",
//                     ssl_cvv2cvc2:this.cardInfo.value.cvv,
//                     ssl_avs_address:this.cardInfo.value.address,
//                     ssl_city:this.cardInfo.value.city,
//                     ssl_state:this.stateCode,
//                     ssl_avs_zip:this.cardInfo.value.zipcode,
//                     ssl_country:this.cardInfo.value.USCitizen=='N'?this.cardInfo.value.country:"USA"
//                 }
//                 this.spinner.show();
         
//                 this._objUserService.validateCreditCardByConverge(valCard, httpOptions).subscribe(
//                     result => {
//                         //console.log('response from converge API ', result);
//                         if(result.response){
//                             if(result.response.txn){
//                                 if(result.response.txn.ssl_result==0 && result.response.txn.ssl_result_message==="APPROVAL" || result.response.txn.ssl_result_message==="APPROVED" ){
//                                       this.generateToken();
//                                 }else if(result.response.txn.errorCode){
//                                     this.spinner.hide();
//                                     Swal(result.response.txn.errorName , result.response.txn.errorMessage,"error");
//                                 }
// 								else if(result.response.txn.ssl_result_message){
// 									this.spinner.hide();
//                                     Swal("Alert!" , result.response.txn.ssl_result_message,"error");
// 								}
// 								else {
// 									Swal("Alert !" , "Something bad happened; please try again later." ,"error");
// 									this.spinner.hide();
// 								}
//                             }
//                         }
//                     },err=>{
// 						this.errorMessage(err)
// 					}
//                 )

//             }
// 			else{
// 				//console.log("not valid")
// 			}
//         }
         if(this.userRole=='judge' || this.userRole=='recruiter' || this.userRole=='competitor'){
            if(this.isCaptchaVerify && this.basicInfo.valid && this.contactInfo.valid  && this.userAvailability == 2 && this.isPwdMatch){
                this.spinner.show();
                this._objUserService.signUpuser(this.userObj, this.file)
                .subscribe(resUser => {
                  if(resUser)
    
                  //  this.addSportdetail();
                   this.saveUserStatusMessage(resUser)
                                     
                } ,
                  error =>this.errorMessage(error));
            }

        }

        
        else{

        }
      
    }
    errorMessage(objResponse: any) {
        this.spinner.hide();
        //console.log(objResponse)
        if(objResponse.message){
            Swal("Alert !", objResponse.message, "info");
        }
        else{
            Swal("Alert !", objResponse,"info");
        }
       
      }
      CheckPwd(){
        if(this.basicInfo.value.pwd==this.basicInfo.value.repwd){
            this.isPwdMatch=true;
        }
        else{
            this.isPwdMatch=false;
        }
}
     generateToken(){
		   const httpOptions = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/x-www-form-urlencoded',
                        "Accept": "application/xml"
                    })

              };
			      var fullname=this.cardInfo.value.nameOnCard;
				  var tempnameArray=[];
				  var firstname="";
				  var lastname=""
				  tempnameArray=fullname.split(" ");
					  if(tempnameArray.length!==0){
						  if(tempnameArray.length>1 && tempnameArray.length>0){
						  firstname=tempnameArray[0];
						  lastname=tempnameArray[tempnameArray.length-1];
					  }
					  else{
						  firstname=tempnameArray[0];
					  }
				   }else{
					   firstname=this.cardInfo.value.nameOnCard;
				   }
			    const valCard = {
                    ssl_merchant_ID:"009366",
                    ssl_user_id:"webpage",
                    ssl_pin:"ADC68F",
                    ssl_transaction_type:"CCVERIFY",
                    ssl_card_number:this.cardInfo.value.cardNum,
                    ssl_exp_date:this.cardInfo.value.expiresOn,
                    firstname:firstname,
                    lastname:lastname,
				          	email:this.contactInfo.value.email,
                    ssl_test_mode:"True",
                    ssl_cvv2cvc2:this.cardInfo.value.cvv,
                    ssl_avs_address:this.cardInfo.value.address,
                    ssl_city:this.cardInfo.value.city,
                    ssl_state:this.stateCode,
                    ssl_avs_zip:this.cardInfo.value.zipcode,
                    ssl_country:this.cardInfo.value.USCitizen=='N'?this.cardInfo.value.country:"USA"
                }
                this.spinner.show();
		     this._objUserService.getToken(valCard,httpOptions).subscribe(res=>{				 
				 //console.log("sdsdsds",res);
				 if(res.response.txn.ssl_result==0 &&res.response.txn.ssl_token_response=='SUCCESS'){
					   this.userObj.cardToken=res.response.txn.ssl_token.toString();
					  this._objUserService.signUpuser(this.userObj,this.file)
                             .subscribe(resUser => {
                                      if(resUser)
                                       this.saveUserStatusMessage(resUser)
                                        this.spinner.hide();    
                                        
                        } ,
                       error =>this.errorMessage(error));
				 }
				 else{
					this.spinner.hide();
					Swal("Alert!","Card authorization failed.", "info");
				 }
			    				   /*   this._service.settxndata(this.cardInfo.value);
                            */
		 },err=>{
			 //console.log(err);
		 })
	 }
      saveUserStatusMessage(objResponse: any) {
       // console.log(objResponse);
        this.spinner.hide();
        Swal("You have signed up successfully !", "Thank you for choosing Flyp10, Please check your email for activation ", "success");
       
        Swal({
                  title: "You have signed up successfully !",
                  text: "Thank you for choosing Flyp10, Please check your email for activation ",
                  type: "success",
                  showCancelButton: false,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Ok",
                  allowOutsideClick:false,
                })
                .then((result)=> {
                  if(result.value){
                    if(objResponse.res.length){
                        // this.document.location.href = "https://flyp10.com/";
                  }   }         
                });
        if(objResponse.res.length){
            // this.document.location.href = "https://flyp10.com/";
			if(this.userRole=='judge' || this.userRole=='recruiter'){
				//  this.document.location.href = Config.adminurl;
			}else{
			//	let temp=objResponse.res[0];
			//	this.PostToken(this.userObj.cardToken,temp._id)
			    // this.router.navigate(['/pricing/'+temp._id]);
			}
			
		}
      }
      saveUserStatusSportMessage(objResponse: any) {
        //console.log(objResponse);
        this.spinner.hide();
        Swal("Success !", objResponse.message, "success");
       
      }
     PostToken(token,userid){
		let tokenObj={
			token:token,
			userid:userid,
			isdefault:true			
		}
		//console.log("post  token",tokenObj)
		this._objUserService.postCCinfo(tokenObj).subscribe(res=>{
			  //console.log(res);		   
		 },err=>{
			 //console.log(err);
			 this.errorMessage(err);
		 })
		
	}
      triggerCancelForm() {
        //this.router.navigate(['/']);
        this.document.location.href = Config.adminurl;
      }
    cancelButton(){
     
		this.document.location.href ="https://flyp10.com";
	}
    sportFormValid(){
        let sportFormVal = this.sportInfo.value;
        let sportName = sportFormVal['sportName'];
        let level = sportFormVal['level'];
        //console.log('sport name is ', sportFormVal['sportName'])
        if(sportName !== '' && level !== ''){
            return true;
        }else{
            return false;
        }
    }

    setSeoTags() {
        this.seo.setTitle("Flyp10 | Signup");
        this.seo.setSchemaData(this.websiteName, this.websiteDescription, this.websiteImage);
        this.seo.setMetaData(this.websiteName, "Website", this.websiteDescription, "www.Flyp10.com", this.websiteImage);
        this.seo.setTwitterCard("Flyp10", this.websiteName, this.websiteDescription, "Flyp10", this.websiteImage);
    }

    deleteImage(id:string) {
        // Swal({
        //       title: "Are you sure?",
        //       text: "You will not be able to recover this Image !",
        //       type: "warning",
        //       showCancelButton: true,
        //       confirmButtonColor: "#DD6B55",
        //       confirmButtonText: "Yes, delete it!",
        //     })
        //     .then((result)=> {
        //       if(result.value){
        //       this._objService.deleteImage(this.fileName, this.imageExtension, this.imagePath)
        //       .subscribe(res=> {
        //           this.imageDeleted = true;
        //           this.fileName = "";
        //           this.drawImageToCanvas(Config.DefaultImage);
        //           Swal("Deleted!", res.message, "success");
        //         },
        //         error=> {
        //           Swal("Alert!", error, "info");
        //         });
        //       }            
        //     });
        }
      
        changeFile(args: any) {
          this.file = args;
          this.fileName = this.file.name;
        }

   

 
}