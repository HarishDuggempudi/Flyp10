
import { Component, OnInit, Inject, PLATFORM_ID, APP_ID ,ViewChild,ElementRef} from "@angular/core";
import {ActivatedRoute, Router } from '@angular/router';
import {UserService} from "../../../admin-app/dashboard-app/components/user-management//user.service";
import {RegisterUserModel} from '../../../admin-app/dashboard-app/components/user-management/user.model';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from "sweetalert2";
@Component({
    selector: 'activation-page',
	templateUrl: './activation.component.html',
	styleUrls:['./activation.scss']
   
})

export class ActivationComponent implements OnInit{
 
   userId:string;
   userObj: RegisterUserModel = new RegisterUserModel();
   alreadyActivated:boolean=false;
    constructor(private spinner :NgxSpinnerService,private _objUserService: UserService,private router: Router,private activatedRoute: ActivatedRoute) { 
         activatedRoute.params.subscribe(param => this.userId = param['userid']);
		 //console.log("swdsdsds",this.userId)
    }
   
    ngOnInit() {
		
         this.getUserDetail();
    }

    ngAfterViewInit() {
        
    }
	
	 confirmUser(userId,user){
		 this._objUserService.updateUserConfirmed(userId,user).subscribe(res=>{
			// console.log(res)
			 this.getUserinfo();
		 },err=>{
			 this.errorMessage(err);
		 })
	 }
	 
	getUserinfo() {
	   this.spinner.show();
      this._objUserService.getsignupuserinfo(this.userId)
      .subscribe(resUser =>{
		  if(resUser.length>0){
			  //console.log("userdetails",resUser)
			   this.userObj=resUser[0];
			    this.spinner.hide();
              		  
		  }		  
		
	  },
        error => this.errorMessage(error));
    }
      getUserDetail() {
	   this.spinner.show();
      this._objUserService.getsignupuserinfo(this.userId)
      .subscribe(resUser =>{
		  if(resUser.length>0){
			 // console.log("userdetails",resUser)
			   this.userObj=resUser[0];
			   if(this.userObj.userConfirmed==false){
				    this.confirmUser(this.userId,this.userObj);
			   }else{
					this.spinner.hide();
					this.alreadyActivated=true;
			   }

               			  
		  }
		  
		 // console.log("userdetails",resUser)
	  },
        error => this.errorMessage(error));
    }
	errorMessage(objResponse: any) {
		  this.spinner.hide();
		 
        Swal("Alert !", objResponse, "info");
      }
}