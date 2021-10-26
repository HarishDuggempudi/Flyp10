 
import { Component, OnInit, Inject, PLATFORM_ID, APP_ID } from "@angular/core";
import { isPlatformBrowser,DOCUMENT } from '@angular/common';
import { SeoService } from '../../shared/seo.service';
import { TransferState } from '@angular/platform-browser';
import { Services } from '../../shared/services';
import Swal from "sweetalert2";
import {Config} from "../../shared/config/general.config";
import {API_URL} from "../../shared/config/env.config";
import {ActivatedRoute, Router } from '@angular/router';
import {UserService} from "../../../admin-app/dashboard-app/components/user-management//user.service";
import {Validators, FormBuilder, FormGroup, FormControl} from "@angular/forms";
import { HttpClient, HttpParams, HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import {RegisterUserModel} from '../../../admin-app/dashboard-app/components/user-management/user.model';
import { NgxSpinnerService } from 'ngx-spinner';
import {DefaultCard}from "../../../admin-app/dashboard-app/components/wallet/wallet.model"
import { PricingSettingService } from "../../../admin-app/dashboard-app/components/pricing/pricing-setting.service";
import { catchError } from "rxjs/operators";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
@Component({
    selector: 'client-landing-pricing',
    templateUrl: './pricing.html',
    styleUrls: ['./pricing.scss']
})

export class PricingComponent implements OnInit{
    selectedamount:any;
   
    websiteName: string = "Flyp10";
    websiteDescription: string = "Flyp10";
    websiteImage: string = "assets/client/images/red_icon.png";
    defaultCard:DefaultCard =new DefaultCard();
        userId:string;
        txndata:any;
        cardInfo:FormGroup;
        togglePricing:boolean=true;
        desc:string;
        disabled:boolean=false;
        sel:boolean=false;
        showlogin:boolean=false;
        selpackage:string;
        userObj: RegisterUserModel = new RegisterUserModel();
        statelist:any=[
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "abbreviation": "FM"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Guam",
        "abbreviation": "GU"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Palau",
        "abbreviation": "PW"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
]
    credit: any;
    premium: any;
    premiumPlus: any;
    creditOptions: any[];
    amount: any;
    scoreOnly: any[]=[];
    scoreNotes: any[]=[];
	pricelist:any=[];
    sports: any[]=[];
    data: any[]=[];
    constructor(private spinner :NgxSpinnerService,private _http:HttpClient,private _fb: FormBuilder,private _objUserService: UserService,private router: Router,private activatedRoute: ActivatedRoute ,@Inject(DOCUMENT) private document: any,private _service: Services,@Inject(SeoService)private seo: SeoService, @Inject(PLATFORM_ID) private platformId: Object, @Inject(APP_ID) private appId: string, @Inject(TransferState)private state: TransferState,public pricing:PricingSettingService) {
         activatedRoute.params.subscribe(param => this.userId = param['userid']);
   
           this.cardInfo = this._fb.group({
                amount:['',Validators.required],
                promocode:['']              
            })
    }
    termsContent:string;
    ngOnInit() {
        this.getPricing();
        this.getUserDetail();
        this.setSeoTags();
        this.txndata=this._service.gettxndata();
   
        const platform = isPlatformBrowser(this.platformId);
        this.getSportPricing();
    }
   PatchtxnData(){
       this.txndata=this._service.gettxndata();
       if(this.txndata){
             this.cardInfo.patchValue({
                nameOnCard:this.txndata.nameOnCard,
                cardNum: this.txndata.cardNum,
                expiresOn: this.txndata.expiresOn,
                cvv: this.txndata.cvv,
                address: this.txndata.address,
                state: this.txndata.state,
                zipcode: this.txndata.zipcode
            });
       }else{
           //alert("no txnData")
       }
   }

   getUserDetail() {
       this.spinner.show();
      this._objUserService.getsignupuserinfo(this.userId)
      .subscribe(resUser =>{
          if(resUser.length>0){
             // console.log("userdetails",resUser)
              this.userObj=resUser[0];
              if(this.userObj.cardToken){
                  this.getCardInfo();
              }
              
          }
          this.spinner.hide();
         // console.log("userdetails",resUser)
      },
        error => this.errorMessage(error));
    }
    getCardInfo(){
            this._objUserService.getinfobyToken(this.userObj.cardToken).subscribe(result=>{
                        // console.log("Code",result);
                        if(result.response.txn){
                            if(result.response.txn.ssl_result==0){
                                
                                this.pushcarddetails(result.response.txn);                              
                            }
                        }
                    },error=>{
                        this.errorMessage(error);
                    })
    }
    pushcarddetails(response){       
                 this.defaultCard.token=this.userObj.cardToken;
                 this.defaultCard.cardNumber=response.ssl_account_number;
                 this.defaultCard.cardType=response.ssl_card_type;                               
    }
    setSeoTags() {
        this.seo.setTitle("Flyp10 | Pricing");
        this.seo.setSchemaData(this.websiteName, this.websiteDescription, this.websiteImage);
        this.seo.setMetaData(this.websiteName, "Website", this.websiteDescription, "www.Flyp10.com", this.websiteImage);
        this.seo.setTwitterCard("Flyp10", this.websiteName, this.websiteDescription, "Flyp10", this.websiteImage);
    }
    gotoLogin(){
        this.document.location.href = Config.adminurl;
    }
    getStarted(selpackage){
        this.selpackage=selpackage;
        if(selpackage=='0'){
            this.document.location.href = Config.adminurl;
        }else if(selpackage=='1'){
            this.togglePricing=false;
            this.sel=true;
            this.desc="Account fill up";
            //this.cardInfo.controls['promocode'].setValidators(null);  
        }else if(selpackage=='2'){
            this.togglePricing=false;
            this.amount=this.premium
            this.cardInfo.controls["amount"].setValue(this.amount);
            this.disabled=true;
            this.sel=false;
            this.desc="premium"
            //this.cardInfo.controls['promocode'].setValidators(Validators.required)
        }else if(selpackage=='3'){
               this.togglePricing=false;
               this.amount=this.premiumPlus
            this.desc="premium plus";
            this.cardInfo.controls["amount"].setValue(this.amount);
            this.disabled=true;
            this.sel=false;
            //this.cardInfo.controls['promocode'].setValidators(Validators.required)
        }else{
            this.document.location.href = Config.adminurl;
            this.disabled=false;
        }
    }
    makepayment(){
        if(this.cardInfo.valid){
                  Swal({
              title: "Confirm your payment?",
              html: "<div>Package: <span style='font-weight:bold;'>"+this.desc+"</span></div><br><div>Card Number: <span style='font-weight:bold;'>"+this.defaultCard.cardNumber+"</span></div><br>Amount: <span style='font-weight:bold;'>$ "+this.amount+".00</span>",
              type: "question",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes,Confirm"
            }).then(result => {
              if (result.value) {
                var makepayment={
                    token:this.userObj.cardToken,
                    amount:this.amount,
                    description:this.desc,
                    invoiceNumber:"",
                }
                this.spinner.show();
                this._objUserService.makepayment(makepayment).subscribe(res=>{
                    //console.log(res,res.response.txn.ssl_result)
                    if(res.response.txn){
                        if(res.response.txn.ssl_result==0){
                            //Swal("Success !","Amount:$ "+res.response.txn.ssl_amount+".00<br>Transaction ID:"+res.response.txn.ssl_txn_id, "success");
                             this.showlogin=true;
                             this.showSuccessAlert(res.response.txn.ssl_txn_id,res.response.txn.ssl_amount,res.response.txn.ssl_result_message,res.response.txn.ssl_card_number);
                             this.saveResponse(res.response.txn);
                             this.saveTransaction(res.response.txn,this.selpackage);
                             if(this.selpackage=='1'){
                                 this.creditwallet(res.response.txn);
                             }else{
                                 this.addSubscription();
                             }
                             
                        }
                        else if(res.response.txn.errorCode){
                            
                            Swal("Failed !","Error Code:"+res.response.txn.errorCode+"<br>"+res.response.txn.errorName, "error");
                           
                        }else{
                            Swal("Failed !","Transaction ID:"+res.response.txn.ssl_txn_id+"<br>"+res.response.txn.ssl_txn_id, "error");
                        }
                    }
                    else{
                        Swal("Failed !","Transaction failed", "error");
                    }
                    this.spinner.hide();
                },err=>{
                    //console.log(err)
                })
              }
            });
        }else{
            Swal("Alert !", "Amount is required.", "info");
            this.disabled=false;
        }
   
        
     }
      errorMessage(objResponse: any) {
          this.spinner.hide();
        Swal("Alert !", objResponse, "info");
      }
      addSubscription(){
        var start=new Date();
        var aYearFromNow = new Date();
        aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);    
        var convergeObj={
            updateToken:'0',
            subtype:this.selpackage,
            subStart:start.toString(),
            subEnd:aYearFromNow.toString(),
            username:this.userObj.username,
            promocode:this.cardInfo.value.promocode
        }
        this._service.updateConvergeInfo(convergeObj,this.userObj._id)
        .subscribe(res=>{
            // console.log(res);          
        },err=>{
             this.errorMessage(err);  } 
         )
      }
      cancelButton(){
          this.togglePricing=true;
      }
      
      saveResponse(response){
          response.userid=this.userId
         // console.log(response);
         this._service.saveConvergeResponse(response).subscribe(res=>{
            // console.log(res);
         },err=>{
            // console.log(err);
         })
      }
      creditwallet(response){
         if(response.ssl_amount){            
             let walletObj={
               "type" :'c',
              "userid":this.userId,
              "balance":response.ssl_amount
           }
         this._service.creditUserWallet(walletObj).subscribe(res=>{
                 // console.log(res);             
              },err=>{
                 // console.log(err);
          })
        }
          
      }
      saveTransaction(response,selpackage){
          var desc='';
          if(selpackage=='1'){
              desc="Account fllup - $ "+response.ssl_amount+".00"
          }
          else if(selpackage=='2'){
              desc="premium subscription - $ "+response.ssl_amount+".00"
          }
          else if(selpackage=='3'){
              desc="premium plus subscription - $ "+response.ssl_amount+".00"
          }
          var transactionObj={
                                  userid:this.userId,
                                  txn_amount:response.ssl_amount,
                                  txn_type:'c',
                                  txn_id:response.ssl_txn_id,
                                  txn_token:response.ssl_token,
                                  txn_desc:desc,
                                  txn_date:response.ssl_txn_time          
                            }
            this._service.saveTransaction(transactionObj).subscribe(res=>{
                  //console.log(res);             
              },err=>{
                 // console.log(err);
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
    //   https://flyp10.com/pricing/5d0b708e9bf1e105a6ba67ba
    getPricing(){

        this.creditOptions=[]
      
        this.pricing.getPricing().subscribe(data=>{
    
            this.credit=data[0].addCredits;
            this.credit=this.credit.replace(/,/g,'/')
            this.premium=data[0].premium;
            this.premiumPlus=data[0].premiumPlus
            
    
            this.creditOptions=data[0].addCredits;
          this.creditOptions=data[0].addCredits.split(',');
     
             
         
        })
    } 
    formatDollar(val){ 
 
        if(val && val!='N/A'){ 
             var amt=val.toString(); 
             if(amt.indexOf('.')!=-1){ 
                return "$ "+Number(amt).toFixed(2) 
             }else{ 
                 return "$ "+amt+'.00' 
             } 
        } 
        else if(val=='N/A') { 
              return val
        } 
		 else { 
              return '$ 0.00' 
        } 
    }
    onAmountChange(event){

        this.amount=this.selectedamount
      }
getSportPricing(){
   //alert("call")
    this.scoreOnly=[]
    this.scoreNotes=[]
    this.sports=[]
      this._service.getPricingList().subscribe( 
            res =>{
               
               this.pricelist=res
               this.pricelist.sort(function(a,b){
                return a.sport.localeCompare(b.sport);
            })
            },
            error => this.errorMessage(error)
          );
      
}



handleError(error: HttpErrorResponse) {
       
    if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error.message}`);
      }
      // return an ErrorObservable with a user-facing error message
      return new ErrorObservable(error.error.message ? error.error.message :
        'Something bad happened; please try again later.');
}
       
}
