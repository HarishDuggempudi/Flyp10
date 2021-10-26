import Swal from 'sweetalert2';
import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {RegisterUserModel, UserResponse, JudgeSportModel} from "./user.model";
import {UserService} from "./user.service";
import {Config} from "../../../shared/configs/general.config";
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'user-view',
  templateUrl: './user-view.html',
  styleUrls:['./user-view.scss']

})

export class UserViewComponent implements OnInit {
  userId: string;
  objUser: RegisterUserModel = new RegisterUserModel();
  objResponse: UserResponse = new UserResponse();
  imageSrc: string = Config.DefaultAvatar;
  SportDetails:any=[];
  userid:any;
  USAGMemberID: any;
  isaddUSAG: boolean = true;
  async ngOnInit() {
    this.getUserDetail();
    await this.getUSAGMember();
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private _objUserService: UserService) {
    activatedRoute.parent.params.subscribe(param => {this.userId = param['userId']});
  }
    formatdate(date){
	   if(date){
		   return moment(new Date(date)).format('L');
	   }else{
		   return "";
	   }
	   
   }
   editusag(){
    this.router.navigate(['/user-management/usa-gym-member'],{queryParams:{username:this.objUser._id}});
}
   getUSAGMember() {
    return new Promise((reject,resolve)=>{
        this._objUserService.getUSAGMember(this.userId).subscribe((res)=>{
            if(res.success){
                if(res.data.MemberID){
                    this.USAGMemberID = res.data.MemberID
                    this.isaddUSAG = false;
                    resolve()
                }
              
            }
            else {
                this.isaddUSAG = true
                resolve()
            }
        })
    })
  
}
  getUserDetail() {
    this._objUserService.getUserDetail(this.userId)
      .subscribe(resUser => {
        
        this.bindDetail(resUser)
        if(resUser.userRole!="1"){
           this.getJudgesSport(resUser);
        }
      },
        error => this.errorMessage(error));
  }

  errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }
  getJudgesSport(resUser){
    this._objUserService.getJudgesSport(resUser._id)
    .subscribe(resSport => {
       this.SportDetails=resSport;
	  // console.log( this.SportDetails)
      
    },
      error => this.errorMessage(error));
  }
  bindDetail(objUser: RegisterUserModel) {
	  
    this.objUser = objUser;
    if (!this.objUser.imageName)
      this.imageSrc = Config.DefaultAvatar;
    else {
      let cl = Config.Cloudinary;
      //this.imageSrc = "http://localhost:3005/public/uploads/images/users/"+this.objUser.imageName;
	   this.imageSrc ="https://flyp10.com/public/uploads/images/users/"+this.objUser.imageName;
    }
  }

  triggerCancelView() {
    this.router.navigate(['/user-management']);
  }
  triggerCanceldetailview(){
    this.router.navigate(['/user-management/detail',this.userId]);
  }
  edit(docId: string) {
    this.router.navigate(["/user-management/detail/sportedititor/", docId]);
  }
  view(docId: string) {
    this.router.navigate(["/user-management/judgeSportdetails/", docId],{queryParams:{userid:this.userId}});
  }
  addNewSport(){
    
    this.router.navigate(["/user-management/sportedititor"],{queryParams:{username:this.objUser._id}});
  }
  addUSAGMemberID() {
    this.router.navigate(["/user-management/usa-gym-member"],{queryParams:{username:this.objUser._id}});
  }
  delete(docId:string) {
    Swal({
      title: "Are you sure?",
      text: "You will not be able to recover this Sport !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        let objTemp: JudgeSportModel = new JudgeSportModel();
         objTemp._id = docId
         objTemp.deleted = true;
        this._objUserService.deleteUsersportDetailbyid(objTemp).subscribe(
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
  triggerEdit() {
    this.router.navigate(['/user-management/editor', this.userId]);
  }
  downloadfile(filename){
     this._objUserService.getJudgesSportdoc(filename).subscribe(
      res => {
        this.triggerCancelView();
        Swal("Deleted!", res.message, "success");
      },
      error => {
       
        Swal("Alert!", error, "info");
      }
    );
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

