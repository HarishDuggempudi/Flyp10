import{Component, OnInit}from'@angular/core';
import {Validators, FormBuilder, FormGroup, FormControl,FormArray} from "@angular/forms";
import Swal from 'sweetalert2';
import { Router,ActivatedRoute } from "@angular/router";
import {RegisterUserModel, UserResponse} from "../user-management/user.model";
import {DefaultCard}from "./wallet.model"
import {Config} from "../../../shared/configs/general.config";
import {UserService} from "../user-management/user.service";
import {SportService} from "../sport/sport.service";
import {WalletService} from "./wallet.service";
import * as moment from 'moment';
import { HttpHeaders } from "@angular/common/http";
import { PricingSettingService } from '../pricing/pricing-setting.service';
import { CountryService } from '../countryConfig/country.service';
@Component({
    selector: 'Wallet-editor',
    templateUrl: './wallet-editor.html',
    styleUrls:['./wallet.scss']
})
export class WalletEditorComponent{
    loginobjUser:RegisterUserModel = new RegisterUserModel();
	objUser:RegisterUserModel = new RegisterUserModel();
	cardForm: FormGroup;
	tokenForm: FormGroup;
	isSubmitted:boolean=false;
	type:string;
	CardDetails:any=[];
	isChecked:boolean=false;
	cardType:any="unknown"; 
	cvvMask:any="000";
	togglechooseCard:boolean=false;
	toggleNewCard:boolean=false;
	toggleTokenCard:boolean=false;
	usmdefault:boolean=false;
	addnew:boolean=false;
	public statelist:any=[];
	public citylist:any=[];
	public ziplist:any=[];
	filteredCityOptions:any=[];
	filteredZipOptions:any=[];
	stateID:any=0;
	cityID:any=0
	defaultCard:DefaultCard =new DefaultCard();
	cardNumMask:any="0000-0000-0000-0000"
	credit: any;
	subscription: any[];
	amount: any;
	subtype: string;
	countrylist:any;
    constructor(public countryservice:CountryService,public pricing:PricingSettingService,private walletservice : WalletService,private _formBuilder: FormBuilder,private router: Router,private activatedRoute: ActivatedRoute,private _objUserService:UserService,private sportService:SportService){
		activatedRoute.params.subscribe(param => this.type = param['type']);
		
		let userInfo:RegisterUserModel = JSON.parse(Config.getUserInfoToken());
         this.loginobjUser=userInfo;
				 if(this.type!='1'){
					 this.tokenForm = this._formBuilder.group({
					 
					 selectedpackage:['2'],
					 promocode:['']
				 })
				 this.cardForm = this._formBuilder.group({
					 
					 name:['',Validators.required],
					 cardnumber:['',Validators.required],
					 expdate:['',Validators.required],
					 cvv:['',Validators.required],
					 address:['',Validators.required],
					 state:['',Validators.required],
					 zip:['',Validators.required],
					 city:['',Validators.required],
					 selectedpackage:['2'],
					 promocode:['']
				 })
		 }else{
				 this.tokenForm = this._formBuilder.group({
				 amount:['',Validators.required],
				 selectedpackage:['2'],
				 promocode:['']
			 })
			 this.cardForm = this._formBuilder.group({
				 amount:['',Validators.required],
				 name:['',Validators.required],
				 cardnumber:['',Validators.required],
				 expdate:['',Validators.required],
				 cvv:['',Validators.required],
				 address:['',Validators.required],
				 state:['',Validators.required],
				 zip:['',Validators.required],
				 city:['',Validators.required],
				 selectedpackage:['2'],
				 promocode:['']
			 })
		 }
		 
    }
	ngOnInit() {
		this.getPricing()
	   this.getccinfo()
       this.getUserDetail();
	//    if(this.type=='2'){
	// 	   this.tokenForm.controls['amount'].setValue(this.amount);
	// 	   this.cardForm.controls['amount'].setValue(this.amount);
	//    }
	   this.getState();
	   this.getCountrylist();
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
	getCountrylist(){
		this.countryservice.getActivecountryCurrency().subscribe(res=>{
			this.countrylist=res
		},err=>{
			console.log("error")
		})
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
	   addnewclicked(){
		   if(this.addnew){
			   this.togglechooseCard=false;
	           this.toggleNewCard=true;
		   }
	   }
	   usemyclicked(){
		   if(this.usmdefault){
			   this.togglechooseCard=false;
	           this.toggleTokenCard=true;
		   }
	   }
	   chosseCard(response){
		   this.togglechooseCard=false;
	       this.toggleTokenCard=true;
		   this.defaultCard.token=response.token;
		   this.defaultCard.cardNumber=response.ssl_account_number;
		   this.defaultCard.cardType=response.ssl_card_type;
           
	   }
       getUserDetail() {
         this._objUserService.getUserDetail(this.loginobjUser._id)
            .subscribe(resUser => {
				  
				   this.objUser=resUser;
				},
                error => this.errorMessage(error));
       }
	   
	 /** method  getccinfo retrive saved card details*/  
	 getccinfo(){
		this.CardDetails=[];
		this._objUserService.getccinfo(this.loginobjUser._id).subscribe(res=>{
		
			if(res.length>0){
				for(let i=0;i<res.length;i++){
					this._objUserService.getinfobyToken(res[i].token).subscribe(result=>{
						
						if(result.response.txn){
							if(result.response.txn.ssl_result==0){
								
							    this.pushcarddetails(result.response.txn,res[i].isdefault,res[i]._id,res[i].token);								
							}
						}
					},error=>{
						this.errorMessage(error);
					})
				}
			}else{
				this.togglechooseCard=false;
				this.toggleNewCard=true;
			}
		},err=>this.errorMessage(err))
	}
	pushcarddetails(response,isdefault,docid,token){
		 response.isdefault=isdefault;
		 response.docid=docid;
		 response.token=token;
		 this.CardDetails.push(response);
		 if(isdefault){			
				 this.defaultCard.token=token;
				 this.defaultCard.cardNumber=response.ssl_account_number;
				 this.defaultCard.cardType=response.ssl_card_type;	
                 this.togglechooseCard=false;
	             this.toggleTokenCard=true;				 
		 }
	}
	   onPackageChange(event){
		  

		this.amount=event.value
		
		
		//    if(event.value=='3'){
		// 	   this.tokenForm.controls['amount'].setValue('100');
		//        this.cardForm.controls['amount'].setValue('100');
		//    }else{
		// 	   this.tokenForm.controls['amount'].setValue('35');
		//        this.cardForm.controls['amount'].setValue('35');
		//    }
	   }
	   onAmountChange(event){		
		this.amount=event.value
			
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
                    ssl_country:"USA"
                }
               
		     this._objUserService.getToken(valCard,httpOptions).subscribe(res=>{				 
				
				 if(res.response.txn.ssl_result==0 && res.response.txn.ssl_token_response=='SUCCESS'){
					   this.PostToken(res.response.txn.ssl_token);
					 
				 }
				 else{
					
					//Swal("Alert!","Card authorization failed.", "info");
				 }
			    				   /*   this._service.settxndata(this.cardInfo.value);
                            */
		 },err=>{
			 
		 })
	 }
	   updateUserToken(token){
		   //alert("tokennnnnnnnnnnnnnnn"+token)
		   var convergeObj={
			   updateToken:'1',
			   cardToken:token,
			   username:this.objUser.username
		   }
		   this.walletservice.updateConvergeInfo(convergeObj,this.objUser._id)
		   .subscribe(res=>{
			    
		   },err=>{
		   this.errorMessage(err);}
			)
	   }
	 PostToken(response){
		let tokenObj={
			token:response,
			userid:this.objUser._id,
			isdefault:true			
		}
		
		this._objUserService.postCCinfo(tokenObj).subscribe(res=>{
			    
		 },err=>{
			
			 this.errorMessage(err);
		 })
		
	}
	   addSubscription(){
		if(this.amount==this.subscription[0]){
			this.subtype='2'
		}else if(this.amount==this.subscription[1]){
			this.subtype='3'
		}
		   var type='';
		   var start=new Date();
		   var aYearFromNow = new Date();
		   var promocode=''
           aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
		   if(this.objUser.cardToken){
			   type=this.subtype;
			   promocode=this.tokenForm.value.promocode;
		   }else{
			   type=this.subtype;
			   promocode=this.cardForm.value.promocode;
		   }
		   var convergeObj={
			   updateToken:'0',
			   subtype:type,
			   subStart:start.toString(),
			   subEnd:aYearFromNow.toString(),
			   username:this.objUser.username,
			   promocode:promocode
		   }
		 
		   this.walletservice.updateConvergeInfo(convergeObj,this.objUser._id)
		   .subscribe(res=>{

			
			 
				this.triggerCancelForm();
		   },err=>{
		   this.errorMessage(err);
		   this.triggerCancelForm();}
			)
	   }
	   makeTokenPayment(){
		    this.isSubmitted=true;
			
			if(this.tokenForm.valid){
				var desc=''
				   if(this.type=='1'){
					  desc="Account fill up"
				   }else{
					   desc="upgrade Now"
				   }
				Swal({
					  title: "Confirm your payment?",
					  html: "Card Number:<span style='font-weight:bold;'>"+this.defaultCard.cardNumber+"</span><br>Amount: <span style='font-weight:bold;'>$ "+this.amount+".00</span>",
					  type: "question",
					  showCancelButton: true,
					  confirmButtonColor: "#DD6B55",
					  confirmButtonText: "Yes,Confirm"
					}).then(result => {
					  if (result.value) {
						var makepayment={
							token:this.defaultCard.token,
							amount:this.amount,
							description:desc,
							invoiceNumber:"",
						}
						this.walletservice.makepayment(makepayment).subscribe(res=>{
						
							if(res.response.txn){
								if(res.response.txn.ssl_result==0){									
									 this.showSuccessAlert(res.response.txn.ssl_txn_id,res.response.txn.ssl_amount,res.response.txn.ssl_result_message,res.response.txn.ssl_card_number);
									 this.saveResponse(res.response.txn);
									 let promocode='0'
									 if(this.objUser.cardToken){		
										promocode=this.tokenForm.value.promocode?this.tokenForm.value.promocode:'0';
									  }else{									
										promocode=this.cardForm.value.promocode?this.cardForm.value.promocode:'0';
									  }
									 this.saveTransaction(res.response.txn,this.type,promocode);
									 
									 if(this.type=='1'){
										 this.creditwallet(res.response.txn);
									 }else{
										 this.addSubscription();
									 }
									 this.triggerCancelForm();
								}
								else if(res.response.txn.errorCode){
							        this.saveConvergeErrorResponse(res.response.txn);
									Swal("Failed !","Error Code:"+res.response.txn.errorCode+"<br>"+res.response.txn.errorName, "error");
								   
								}
								else{
									if(res.response.txn.ssl_txn_id){
										this.saveResponse(res.response.txn);
									}
									 
									Swal("Failed !","Transaction ID:"+res.response.txn.ssl_txn_id+"<br>Status:"+res.response.txn.ssl_result_message, "error");
								   
								}
							}
							else{
								Swal("Failed !","Transaction failed", "error");
							}
							
						},err=>{
							
						})
					  }
				});
			}
	   }
	   makePayment(){
		   this.isSubmitted=true;
		   if(this.cardForm.valid){
			      var fullname=this.cardForm.value.name;
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
					   firstname=this.cardForm.value.name;
				   }
				   var desc=''
				   if(this.type=='1'){
					  desc="Account fill up"
				   }else{
					   desc="upgrade Now"
				   }
			   var paymentObj={
				   firstName:firstname,
				   lastName:lastname, 
				   email:this.objUser.email,
				   cardNumber:this.cardForm.value.cardnumber, 
				   expirationDate:this.cardForm.value.expdate,
				   cvv:this.cardForm.value.cvv,
				   amount:this.amount, 
				   invoiceNumber:"",
				   description:desc,
				   address:this.cardForm.value.address,
				   state:this.cardForm.value.state,
				   city:this.cardForm.value.city,
				   zip:this.cardForm.value.zip
			    }
			
				 Swal({
				  title: "Confirm your payment?",
				  html: "Card Number:<span style='font-weight:bold;'>"+this.cardForm.value.cardnumber+"</span><br>Amount: <span style='font-weight:bold;'>$ "+this.amount+".00</span>",
				  type: "question",
				  showCancelButton: true,
				  confirmButtonColor: "#DD6B55",
				  confirmButtonText: "Yes,Confirm"
				}).then(result => {
				  if (result.value) {
					 this.walletservice.generateTokenAfterPayment(paymentObj).subscribe(res=>{
							if(res.response.txn){
							if(res.response.txn.ssl_result==0){							
								 this.showSuccessAlert(res.response.txn.ssl_txn_id,res.response.txn.ssl_amount,res.response.txn.ssl_result_message,res.response.txn.ssl_card_number);
								 this.saveResponse(res.response.txn);
								 let promocode='0'
								 if(this.objUser.cardToken){		
									promocode=this.tokenForm.value.promocode?this.tokenForm.value.promocode:'0';
								  }else{									
									promocode=this.cardForm.value.promocode?this.cardForm.value.promocode:'0';
								  }
								 this.saveTransaction(res.response.txn,this.type,promocode);
								 if(res.response.txn.ssl_token_response=="SUCCESS"){
									 this.generateToken(this.cardForm.value);
								 }
								 
								 if(this.type=='1'){
									 this.creditwallet(res.response.txn);
								 }else{
									 this.addSubscription();
								 }
								 
							}else if(res.response.txn.errorCode){
							         this.saveConvergeErrorResponse(res.response.txn);
									Swal("Failed !","Error Code:"+res.response.txn.errorCode+"<br>"+res.response.txn.errorName, "error");
								   
								}
							else{
								if(res.response.txn.ssl_txn_id){
										this.saveResponse(res.response.txn);
									}
								Swal("Failed !","Transaction ID:"+res.response.txn.ssl_txn_id+"<br>Status:"+res.response.ssl_result_message, "error");
							   
							  }
							}
							else{
								Swal("Failed !","Transaction failed", "error");
							}
					},err=>{
						this.errorMessage(err);
					})
					  
				  }
				  
				})

		   }
	   }
	   onsubmitTokenPayment(){
		if(this.objUser.isUSCitizen=='0'){
		   let tempnameArray=[];
		   tempnameArray=this.countrylist.filter(item=>item.Country==this.objUser.country)
		   if(tempnameArray.length>0){
			   let currency=tempnameArray[0].Currency?tempnameArray[0].Currency:'N/A'
			   if(currency!='N/A'){
				   this.makeMCCTokenPayment(currency)
			   }else{
				   Swal("Alert!","We are unable to process your request at this moment. Please try again.","info")
			   }
		   }else{
			   Swal("Alert!","We are unable to process your request at this moment. Please try again.","info")
		   }
		}else{
			this.makeTokenPayment();
		}
	  }
	  makeMCCTokenPayment(currency){
		this.isSubmitted=true;
		
		if(this.tokenForm.valid){
			var desc=''
			   if(this.type=='1'){
				  desc="Account fill up"
			   }else{
				   desc="upgrade Now"
			   }
			Swal({
				  title: "Confirm your payment?",
				  html: "Card Number:<span style='font-weight:bold;'>"+this.defaultCard.cardNumber+"</span><br>Amount: <span style='font-weight:bold;'>$ "+this.amount+".00</span>",
				  type: "question",
				  showCancelButton: true,
				  confirmButtonColor: "#DD6B55",
				  confirmButtonText: "Yes,Confirm"
				}).then(result => {
				  if (result.value) {
					var makepayment={
						token:this.defaultCard.token,
						amount:this.amount,
						description:desc,
						invoiceNumber:"",
						currency:currency
					}
					this.walletservice.makeMCCTokenPayment(makepayment).subscribe(res=>{
					
						if(res.response.txn){
							if(res.response.txn.ssl_result==0){									
								 this.showSuccessAlert(res.response.txn.ssl_txn_id,res.response.txn.ssl_amount,res.response.txn.ssl_result_message,res.response.txn.ssl_card_number);
								 this.saveResponse(res.response.txn);
								 let promocode='0'
								 if(this.objUser.cardToken){		
									promocode=this.tokenForm.value.promocode?this.tokenForm.value.promocode:'0';
								  }else{									
									promocode=this.cardForm.value.promocode?this.cardForm.value.promocode:'0';
								  }
								 this.saveTransaction(res.response.txn,this.type,promocode);
								 
								 if(this.type=='1'){
									 this.creditwallet(res.response.txn);
								 }else{
									 this.addSubscription();
								 }
								 this.triggerCancelForm();
							}
							else if(res.response.txn.errorCode){
								this.saveConvergeErrorResponse(res.response.txn);
								Swal("Failed !","Error Code:"+res.response.txn.errorCode+"<br>"+res.response.txn.errorName, "error");
							   
							}
							else{
								if(res.response.txn.ssl_txn_id){
									this.saveResponse(res.response.txn);
								}
								 
								Swal("Failed !","Transaction ID:"+res.response.txn.ssl_txn_id+"<br>Status:"+res.response.txn.ssl_result_message, "error");
							   
							}
						}
						else{
							Swal("Failed !","Transaction failed", "error");
						}
						
					},err=>{
						
					})
				  }
			});
		}
     }
	 creditwallet(response){
		 if(response.ssl_amount){			 
			 let walletObj={
			  "type" :'c',
			  "userid":this.objUser._id,
			  "balance":response.ssl_amount
		   }
		 this.walletservice.creditUserWallet(walletObj).subscribe(res=>{
				 
                   this.triggerCancelForm();				  
			  },err=>{
				 
				  this.triggerCancelForm();
		  })
		}
		  
	  }
	  saveConvergeErrorResponse(response){
		   response.userid=this.objUser._id
		 
		 this.walletservice.saveConvergeErrorResponse(response).subscribe(res=>{
			 
		 },err=>{
			
		 })
	  }
	  saveTransaction(response,selpackage,promocode){
		  var desc='';
		  if(selpackage=='1'){
			  desc="Account fllup - $ "+response.ssl_amount+".00"
		  }
		  else if(selpackage=='2'){
			  
			  if(this.objUser.cardToken){
				  var ptype=this.tokenForm.value.selectedpackage;
				   if(ptype=='2'){
					   desc="premium subscription - $ "+response.ssl_amount+".00"
				   }
				   else{
					    desc="premium plus subscription - $ "+response.ssl_amount+".00"
				   }
			  }else{
				  var ptype=this.cardForm.value.selectedpackage
				    if(ptype=='2'){
					   desc="premium subscription - $ "+response.ssl_amount+".00"
				   }
				   else{
					    desc="premium plus subscription - $ "+response.ssl_amount+".00"
				   }
			   }
			  
		  }
		  else{
			  desc=selpackage
		  }
		  var transactionObj={
								  userid:this.objUser._id,
								  txn_amount:response.ssl_amount,
								  txn_type:'c',
								  txn_id:response.ssl_txn_id,
								  txn_token:response.ssl_token,
								  txn_desc:desc,
								  txn_date:response.ssl_txn_time,
								  promocode:promocode		  
		                    }
			this.walletservice.saveTransaction(transactionObj).subscribe(res=>{
				 		  
			  },err=>{
				  
		     })			  
	  }
	  saveResponse(response){
		  response.userid=this.objUser._id
		 
		 this.walletservice.saveConvergeResponse(response).subscribe(res=>{
			 
		 },err=>{
			 
		 })
	  }
	   showSuccessAlert(id,amount,status,number){
		  Swal({
			  title: '<strong>Success</u></strong>',
			  type: 'success',
			  html:
			    '<div">'+
				'<div class="row"><label class="col-md-4" style="font-size:14px;">Card Number :</label><b class="col-md-8" style="font-size:14px;text-align:right;">'+number+'</b></div><br>'+
				'<div class="row"><label class="col-md-4" style="font-size:14px;">Amount :</label><b class="col-md-8" style="font-size:14px;text-align:right;">$ '+amount+'.00</b></div><br> ' +
				'<div class="row"><label class="col-md-4" style="font-size:14px!important;">Transaction ID :</label><b class="col-md-8" style="font-size:14px;text-align:right;">'+id+'</b></div><br> ' +
				'<div class="row"><label class="col-md-4" style="font-size:14px;">Status :</label><b class="col-md-8" style="font-size:14px;text-align:right;">'+status+'</b></div></div> ' 
				,
			  showCloseButton: false,
			  showCancelButton: false,
			  focusConfirm: false,
			  confirmButtonText:'OK',
			  confirmButtonAriaLabel: 'OK',
			  
			})
	  }
	  triggerCancelForm() {
        this.router.navigate(['/wallet']);  
       }
	   
	    errorMessage(objResponse:any) {
			if(objResponse.message){
				Swal("Alert !", objResponse.message, "info");
			}else{
				Swal("Alert !", objResponse, "info");
			}
             
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
getPricing(){
	this.subscription=[]
	this.credit=[]
	this.pricing.getPricing().subscribe(data=>{

		this.credit=data[0].addCredits;
		this.credit=this.credit.split(',');
		this.subscription.push(data[0].premium,data[0].premiumPlus)

		this.amount=data[0].premium
		

	})
}
formatDollar(val){ 
 
    if(val){ 
         var amt=val.toString(); 
         if(amt.indexOf('.')!=-1){ 
            return "$ "+Number(amt).toFixed(2) 
         }else{ 
             return "$ "+amt+'.00' 
         } 
    } 
    else{ 
          return '$ 0.00' 
	} 
}


}
     
  
   
	
  



