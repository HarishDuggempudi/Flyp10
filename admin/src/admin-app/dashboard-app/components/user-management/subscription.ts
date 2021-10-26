 import{Component, OnInit}from'@angular/core';
 import {Config} from "../../../shared/configs/general.config";
 import {RegisterUserModel, UserResponse, JudgeSportModel} from "./user.model";
 import {UserService} from "./user.service";
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment';
@Component({
    selector: 'subscription',
    templateUrl: './subscription.html'
})
export class SubscriptionComponent implements OnInit {
    objUser: RegisterUserModel = new RegisterUserModel();
    objResponse: UserResponse = new UserResponse();
	selectedPackage:any='0'
	userId:string;
	subStart:any;
	subEnd:any;
    constructor(private router: Router, private activatedRoute: ActivatedRoute,private _objUserService: UserService) {
       activatedRoute.params.subscribe(param => {this.userId = param['userId']});
    }

  ngOnInit() {
      this.getUserDetail()
    }
	formatdate(date){
	   if(date){
		   return moment(new Date(date)).format('L');
	   }else{
		   return "";
	   }
	   
   }
   getUserDetail() {
     this._objUserService.getUserDetail(this.userId)
      .subscribe(resUser => {
        
         this.objUser=resUser;
		 this.selectedPackage=this.objUser.subtype;
		 if(this.objUser.subtype!='0'){
			 this.subStart=moment(new Date(this.objUser.subStart)).format();
			 this.subEnd= moment(new Date(this.objUser.subEnd)).format();
			
		 }
       
      },
        error => this.errorMessage(error));
   }
    errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }
  updateSubType(){
	 
		  if(this.selectedPackage!='0'){
			    if(this.subStart && this.subEnd ){
					let data={
				  admin:"superadmin",
				  subtype:this.selectedPackage,
				  subStart:this.subStart,
				  subEnd:this.subEnd
					  }
					  this._objUserService.updateSub(data,this.userId).subscribe(
						res=>{
							  
							   Swal("Success", res.message, "success");
							   this.triggerCancelForm();
							},err=>this.errorMessage(err))
				}else{
					Swal("Alert !", "All fields are required", "info");
				}
					  
		  }else{
			   let data={
				  admin:"superadmin",
				  subtype:this.selectedPackage,
				  subStart:moment(new Date()).format(),
				  subEnd:moment(new Date()).format()
			  }
			  this._objUserService.updateSub(data,this.userId).subscribe(
				res=>{
					  
					   Swal("Success", res.message, "success");
					   this.triggerCancelForm();
					},err=>this.errorMessage(err))
		  }
		  
	 
	  
  }
  triggerCancelForm(){
	   this.router.navigate(["/user-management/detail/"+this.userId+"/advance"])
  }
}

