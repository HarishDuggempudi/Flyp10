 import {Component, EventEmitter, Output, OnInit} from '@angular/core';
import {UserService} from "./user.service";
import {RegisterUserModel,JudgeSport,JudgeSportModel} from "./user.model";
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
import * as moment from 'moment'; 

@Component({
  selector: 'user-sport-details',
  templateUrl: './user-sport-details.html',
  styleUrls:['./user-view.scss']
})

export class JudgeSportDetailsComponent implements OnInit {

   docid:any;
   docInfo:JudgeSportModel=new JudgeSportModel();
   expiredate:any;
   userObj:any={}
   userid:any;
   judgeDetails:any={}
    uploadingFor: string;
    MFigureSkating:string = Config.MFigureSkating;
  WFigureSkating:string = Config.WFigureSkating;
  /* End File Upload handle */
  constructor(private router: Router, private _objUserService: UserService,private activatedRoute: ActivatedRoute ,private _formBuilder: FormBuilder, private roleService: RoleService ,private sportService:SportService) {
    activatedRoute.params.subscribe(param => {
        this.docid = param['docid']
      }          
    );
	
	   this.activatedRoute.queryParams.subscribe(param=>{
			  this.userid=param['userid'];
			})
  }



  ngOnInit() {
		
     if(this.docid){    
      this.getDocDetail();
       
    }
  }

  getDocDetail() {
     // console.log(this.docid,this.userid)
    this._objUserService.getUsersportDetailbyid(this.docid)
      .subscribe(resUser => {
						 this.docInfo=resUser;
                    console.log(this.docInfo)	
                    if(this.docInfo.uploadingfor == '1'){
                        this.uploadingFor = 'Technician'
                    }
                    else if(this.docInfo.uploadingfor == '2'){
                        this.uploadingFor = 'Judge'
                    }
                    else if(this.docInfo.uploadingfor == '3'){
                        this.uploadingFor = 'Technician & Judge'
                    }
			 if(this.docInfo.expdate){
				 if(this.docInfo.status=='1'){
					     var compareTo = moment();				 
						 var then = moment(this.docInfo.expdate);
						
						if (compareTo > then && compareTo!=then) {
														
                            this.setExpire();						
						} else {
								
						}
				 }
				 
			 }
			    this.getUserInfo();
				
      },
        error => this.errorMessage(error));
  }

   getUserInfo(){
     
	   this._objUserService.getUserDetail(this.docInfo.userid)
      .subscribe(resUser => {
		  
		  if(resUser){
             
              this.judgeDetails=resUser
            //   this.createPaymentProviderCustomerObject()
		  }
		  
	  },err=>{
		  this.errorMessage(err)
	   })
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
	  if(this.userid){
		 //  this.router.navigate(['/user-management/detail',this.userid]);
	  }else{
		  //this.router.navigate(['/user-management/verifyjudges']);
	  }
   
  }

 
 download(name){
	 window.open('/api/user/judge/downloadfile/'+name);
 }

 verify(){
	  if(this.expiredate){
		  
		  if(this.judgeDetails.firstName){
			        
				  var expdate=moment(new Date(this.expiredate)).format('L');
				  
				   this.docInfo.status='1';
				   this.docInfo.expdate=expdate.toString();
				   
					 this._objUserService.VerifyJudgesportDetailbyid(this.docInfo,this.docid).subscribe(resUser => this.saveUserStatusMessage(resUser),
					error => this.errorMessage(error), () => {
                        // Creates a new customer object in payment providers system if the user is new and unverified
                        this.createPaymentProviderCustomerObject()
					});
							 
		  }
		
	  }
	  else{
		 Swal("Alert !", "Expiredate is required.", "info");
	  }
 }

 createPaymentProviderCustomerObject(){
   
    // alert('called');
    this._objUserService.getUserDetailsByUsername(this.judgeDetails.username).subscribe( res => {
        
        let judgeDetails = res.reqData[0];                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
         console.log('judge details ', judgeDetails.paylianceCID);
        if(judgeDetails.paylianceCID == '0'){
            this._objUserService.createCusObj(judgeDetails).subscribe(
                res => {                    
                    if(res.success == true){
                        judgeDetails.paylianceCID = res.CID;
                        this._objUserService.updateCID(judgeDetails,judgeDetails._id).subscribe(
                            res => {
                               console.log("PAYOBJ created successfully");                              
                            },err=>{
                                console.log("PAYOBJ err",err); 
                            }
                        )
                    }                
                }
            )
        }
        
    })
}
   unverify(){	
		
        this.docInfo.status='2';
	  
		 this._objUserService.UpdatesportDetailbyid( this.docInfo,this.docid).subscribe(resUser => this.saveUserStatusMessage(resUser),
                 error => this.errorMessage(error));	  	
  }
  setExpire(){
	   this.docInfo.status='3';
	  
		 this._objUserService.UpdatesportDetailbyid( this.docInfo,this.docid).subscribe(
		 resUser => {},
                 error => this.errorMessage(error));	  
  }
 activate(){
	  this.docInfo.status='1';
	   
		 this._objUserService.UpdatesportDetailbyid( this.docInfo,this.docid).subscribe(resUser => this.saveUserStatusMessage(resUser),
                 error => this.errorMessage(error));	
 }
 reNew(){
		  if(this.expiredate){
			  var compareTo = moment();				 
			  var then = moment(this.expiredate);
			if (compareTo > then) {
					Swal("Alert !", "Expire date should be greater then today date.", "info");													
			} else {
			
			    var expdate=moment(new Date(this.expiredate)).format('L');
			   
			   this.docInfo.status='1';
			   this.docInfo.expdate=expdate.toString();
			  
				 this._objUserService.UpdatesportDetailbyid( this.docInfo,this.docid).subscribe(resUser => this.saveUserStatusMessage(resUser),
						 error => this.errorMessage(error));				
				}
			
	    }
	  else{
		 Swal("Alert !", "Expire date is required.", "info");
	  }				
 }
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
}

