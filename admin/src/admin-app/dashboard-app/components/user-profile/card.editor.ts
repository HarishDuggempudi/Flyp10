  import { Router,ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import {Component, OnInit} from '@angular/core';
import {RegisterUserModel, UserResponse} from "../user-management/user.model";
import {UserService} from "../user-management/user.service";
import {Config} from "../../../shared/configs/general.config";
import {UserModel} from "../user-management/user.model";
import {Validators, FormBuilder, FormGroup, FormControl,FormArray} from "@angular/forms";
import {AccountModel} from "../user-management/user.model";
import { HttpHeaders } from "@angular/common/http";
import {SportService} from "../sport/sport.service";
import {CountryService} from "../countryConfig/country.service"

@Component({
    selector: 'Card-editor',
    templateUrl: './card.editor.html',
    styleUrls:['./user-profile.scss']
})

export class CardEditorComponent implements OnInit {
	
	loginobjUser:RegisterUserModel = new RegisterUserModel();
	objUser:RegisterUserModel = new RegisterUserModel();
	cardForm: FormGroup;
	isSubmitted:boolean=false;
	type:string;
	isChecked:boolean=false;
	cardType:any="unknown"; 
	cvvMask:any="000";
	cardNumMask:any="0000-0000-0000-0000"
	statelist:any=[];
	citylist:any=[];
	ziplist:any=[];
	stateID:any=0;
	cityID:any=0;
	filteredCityOptions:any=[];
	filteredZipOptions:any=[];
	countrylist:any=[];
	constructor(private countryservice:CountryService,private _formBuilder: FormBuilder,private router: Router,private activatedRoute: ActivatedRoute, private _objUserService:UserService,private sportService:SportService){
		let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    	this.loginobjUser = userInfo;
		this.cardForm = this._formBuilder.group({					
					 name:['',Validators.required],
					 cardnumber:['',Validators.required],
					 expdate:['',Validators.required],
					 cvv:['',Validators.required],
					 address:['',Validators.required],
					 state:['',Validators.required],
					 zip:['',Validators.required],
					 city:['',Validators.required],	
					 isdefault:[false],
					 USCitizen:['',Validators.required],
					 country:['']
				 })
		
	}
	ngOnInit() {
		
		 this.getUserDetail();
		 this.getState();
		 this.getCountrylist();
	}
	OnCityzenChange(){
		if(this.cardForm.controls["USCitizen"].value=='N'){
			this.cardForm.controls["country"].setValidators([Validators.required])
			this.cardForm.controls["country"].updateValueAndValidity();
		}else{
			this.cardForm.controls["country"].clearValidators();
			this.cardForm.controls["country"].updateValueAndValidity();
		}
	}
	getCountrylist(){
		this.countryservice.getActivecountryCurrency().subscribe(res=>{
			this.countrylist=res
		},err=>{
			console.log("error")
		})
	}
	OnstateChange(){
		let temp=[];
		//alert('OnstateChange')
		temp=this.statelist.filter(item=>item.abbreviation==this.cardForm.value.state)
		if(temp.length>0){			
			this.stateID=temp[0].StateID;
			//alert(this.stateID)
			this.getCity(this.stateID);
		}
	}
	onCityChange(){
		let temp=[];
		//alert('OnstateChange')
		temp=this.citylist.filter(item=>item.city==this.cardForm.value.city)
		if(temp.length>0){			
			this.cityID=temp[0].CityID;
			this.getZip(this.stateID,this.cityID);
		}
	}
	  
  docityFilter(event){
	this.filteredCityOptions=this.citylist.filter(item=>item.city.toLowerCase().includes(event.toLowerCase()))
  }
  
    dozipFilter(event){
	
	this.filteredZipOptions=this.ziplist.filter(item=>item.Zip.toString().toLowerCase().includes(event.toString().toLowerCase()))
  }
	getState(){
		this.sportService.getState().subscribe(res=>{
			this.statelist=res;
		},err=>{
			
		})
	}
	getCity(sid){
		this.sportService.getCity(sid).subscribe(res=>{
			this.citylist=res;
			//this.filteredCityOptions=this.citylist
			//console.log(this.citylist)
		},err=>{
			
		})
	}
	getZip(sid,cid){
		this.sportService.getZip(sid,cid).subscribe(res=>{
			this.ziplist=res;
			this.filteredZipOptions=this.ziplist;
			//console.log(this.ziplist)
		},err=>{
			
		})
	}
	   getUserDetail() {
         this._objUserService.getUserDetail(this.loginobjUser._id)
            .subscribe(resUser => {
				  
				   this.objUser=resUser;
				},
                error => this.errorMessage(error));
       }
     getToken(){
		 this.isSubmitted=true;
		 if(this.cardForm.valid){
			
			  this.generateToken(this.cardForm.value);
		 }else{
			 
		 }
	 }
	 generateToken(value){
		   const httpOptions = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/x-www-form-urlencoded',
                        "Accept": "application/xml"
                    })

              };
			      var fullname=value.name;
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
					   firstname=value.name;
				   }
			    const valCard = {                  
                    ssl_transaction_type:"CCVERIFY",
                    ssl_card_number:value.cardnumber,
                    ssl_exp_date:value.expdate,
                    firstname:firstname,
                    lastname:lastname,
					email:this.objUser.email,
                    ssl_test_mode:"True",
                    ssl_cvv2cvc2:value.cvv,
                    ssl_avs_address:value.address,
                    ssl_city:value.city,
                    ssl_state:value.state,
                    ssl_avs_zip:value.zip,
                    ssl_country:value.USCitizen=='N'?value.country:'United States'
                }
                 this._objUserService.validateCreditCardByConverge(valCard, httpOptions).subscribe(
                    result => {
                      
                        if(result.response){
                            if(result.response.txn){
                                if(result.response.txn.ssl_result==0 && result.response.txn.ssl_result_message==="APPROVAL" || result.response.txn.ssl_result_message==="APPROVED"){									  
                                      this.getTokenafterVerify(valCard,httpOptions)
									  this.saveResponse(result.response.txn)
                                }else if(result.response.txn.errorCode){                                   
                                    Swal(result.response.txn.errorName , result.response.txn.errorMessage,"error");
                                    this.saveConvergeErrorResponse(result.response.txn);
 							   }
								else if(result.response.txn.ssl_result_message){
									
                                    Swal("Alert!" , result.response.txn.ssl_result_message,"error");
									this.saveResponse(result.response.txn)
								}
								else {
									Swal("Alert !" , "Something bad happened; please try again later." ,"error");
									
								}
                            }
                        }
                    },err=>{
						this.errorMessage(err)
					}
                )
		    
	 }  
	 getTokenafterVerify(valCard,httpOptions){
		  this._objUserService.getToken(valCard,httpOptions).subscribe(res=>{				 
				
				     if(res.response){
                            if(res.response.txn){
                                if(res.response.txn.ssl_result==0 && res.response.txn.ssl_token_response=='SUCCESS'){
									  this.saveResponse(res.response.txn)
                                      this.PostToken(res.response.txn)
                                }else if(res.response.txn.errorCode){                                   
                                    Swal(res.response.txn.errorName , res.response.txn.errorMessage,"error");
                                    this.saveConvergeErrorResponse(res.response.txn);
 							   }
								else if(res.response.txn.ssl_token_response){								
                                    Swal("Alert!" , res.response.txn.ssl_result_message,"error");
									this.saveResponse(res.response.txn)
								}
								else {
									Swal("Alert !" , "Something bad happened; please try again later." ,"error");
									
								}
                            }
                        }
				
				 else{
					
					//Swal("Alert!","Card authorization failed.", "info");
				 }
			    				  
		 },err=>{
			
		 })
	 }
	PostToken(response){

		if(response.ssl_token){
			let tokenObj={
				token:response.ssl_token,
				userid:this.objUser._id,
				isdefault:this.cardForm.value.isdefault			
			}
			this._objUserService.postCCinfo(tokenObj).subscribe(res=>{
				 
				   Swal("Success!" , res.message,"success");
				   this.triggerCancelForm();
			 },err=>{
				
				 this.errorMessage(err);
			 })
		}else{
			Swal("Info" , "Unable to retrive card token.","info");
		}

	
	}
	saveResponse(response){
		  response.userid=this.objUser._id
		
		 this._objUserService.saveConvergeResponse(response).subscribe(res=>{
			 
		 },err=>{
			
		 })
	  }
	 saveConvergeErrorResponse(response){
		   response.userid=this.objUser._id
		 
		 this._objUserService.saveConvergeErrorResponse(response).subscribe(res=>{
			  
		 },err=>{
			
		 })
	 }
	 errorMessage(objResponse:any) {
			if(objResponse.message){
				Swal("Alert !", objResponse.message, "info");
			}else{
				Swal("Alert !", objResponse, "info");
			}
             
       }  
	 triggerCancelForm() {
      this.router.navigate(['/profile/cards']);
	 }
	 
  	 returnCardType(event){
		 
		 this.cardType = this.cc_brand_id(this.cardForm.value.cardnumber);
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
		 this.cvvMask="000"
		 this.cardNumMask="0000-0000-0000-0000";
        if (cur_val.match(jcb_regex)) {
          sel_brand = "jcb";
		  this.cvvMask="000"
		  this.cardNumMask="0000-0000-0000-0000";
        } else if (cur_val.match(amex_regex)) {
          sel_brand = "amex";
		  this.cvvMask="0000";
		  this.cardNumMask="0000-000000-00000";
        } else if (cur_val.match(diners_regex)) {
          sel_brand = "diners";
		   this.cvvMask="000"
		   this.cardNumMask="0000-0000-0000-0000";
        } else if (cur_val.match(visa_regex)) {
          sel_brand = "visa";
		   this.cvvMask="000"
		   this.cardNumMask="0000-0000-0000-0000";
        } else if (cur_val.match(mastercard_regex)) {
          sel_brand = "mastercard";
		   this.cvvMask="000"
		   this.cardNumMask="0000-0000-0000-0000";
        } else if (cur_val.match(discover_regex)) {
          sel_brand = "discover";
		   this.cvvMask="000";
		   this.cardNumMask="0000-0000-0000-0000";
        } else if (cur_val.match(maestro_regex)) {
          if (cur_val[0] == '5') { //started 5 must be mastercard
            sel_brand = "mastercard";
			 this.cvvMask="000";
			 this.cardNumMask="0000-0000-0000-0000";
          } else {
            sel_brand = "maestro"; //maestro is all 60-69 which is not something else, thats why this condition in the end
            this.cvvMask="000";
			this.cardNumMask="0000-0000-0000-0000";
		  }
        }      
        return sel_brand;
      }	 
	 whatisCVV(){
		 Swal({
		  type: 'info',
		  title: 'What is a security code?',
		  html: "The security code can be a three-digit or four-digit number, printed on either on the back of the card or the front<r>"+
		   "<img class='img-responsive' src='assets/client/images/cvv.png'>"
		  //footer: '<a href>Why do I have this issue?</a>'
		})
	}	  
   
}