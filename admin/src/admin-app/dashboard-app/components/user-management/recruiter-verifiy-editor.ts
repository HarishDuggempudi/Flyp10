import Swal from 'sweetalert2';
import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {RegisterUserModel, UserResponse, JudgeSportModel} from "./user.model";
import {UserService} from "./user.service";
import {Config} from "../../../shared/configs/general.config";
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'verify-view',
  templateUrl: './recruiter-verifiy-editor.html',
  styleUrls:['./user-view.scss']

})

export class RecruiterVerifyEditorComponent implements OnInit {
  userId: string;
  objUser: RegisterUserModel = new RegisterUserModel();
  objResponse: UserResponse = new UserResponse();
  imageSrc: string = Config.DefaultAvatar;
  SportDetails:any=[];
  userid:any;
 
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private _objUserService: UserService) {
     this.activatedRoute.queryParams
      .filter(params => params.userId)
      .subscribe(params => {
     
        this.userId = params.userId;
        
      });
  }
    formatdate(date){
	   if(date){
		   return moment(new Date(date)).format('L');
	   }else{
		   return "";
	   }
	   
   }
    ngOnInit() {
    this.getUserDetail();
  }

  getUserDetail() {
    this._objUserService.getRecruiterDetailsByID(this.userId)
      .subscribe(resUser => {
        
        this.bindDetail(resUser)
        
      },
        error => this.errorMessage(error));
  }

  errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }

  bindDetail(objUser: RegisterUserModel) {
	 
    this.objUser = objUser;
    if (!this.objUser.imageName)
      this.imageSrc = Config.DefaultAvatar;
    else {
      let cl = Config.Cloudinary;
     // this.imageSrc = cl.url(this.objUser.imageName);
	   this.imageSrc ="https://flyp10.com/public/uploads/images/users/"+this.objUser.imageName;
    }
  }

  triggerCancelView() {
    this.router.navigate(['/user-management/verifyrecruiter/verified']);
  }

VerifyRecruiter(){
	Swal({
      title: "Are you sure?",
      text: "You want to verify this recruiter !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, Verify!"
    }).then(result => {
      if (result.value) {
          this._objUserService.updateRecruiterStatus(this.userId,'1').subscribe(res=>{
			  Swal("Success", "Recruiter status updated successfully." , "success");
			  this.getUserDetail();
		  },err=>{
			  Swal("Alert!", "Unable to update recruiter status." , "info");
			  this.getUserDetail();
		  })
      }
    });
}
RejectRecruiter(){
	Swal({
      title: "Are you sure?",
      text: "You want to reject this recruiter !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, Reject!"
    }).then(result => {
      if (result.value) {
          this._objUserService.updateRecruiterStatus(this.userId,'2').subscribe(res=>{
			  Swal("Success", "Recruiter status updated successfully." , "success");
			  this.getUserDetail();
		  },err=>{
			  Swal("Alert!", "Unable to update recruiter status." , "info");
			  this.getUserDetail();
		  })
      }
    });
}
  triggerDelete(){
    Swal({
      title: "Are you sure?",
      text: "You will not be able to recover this User !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        let objTemp: RegisterUserModel = new RegisterUserModel();
         objTemp._id = this.userId;
         objTemp.deleted = true;
        this._objUserService.deleteUser(objTemp).subscribe(
          res => {
            this.triggerCancelView();
            Swal("Deleted!", res.message, "success");
          },
          error => {
           
            Swal("Alert!", error, "info");
          }
        );
      }
    });
  }

}

