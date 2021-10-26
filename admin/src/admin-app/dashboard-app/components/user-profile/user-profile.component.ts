import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {Component, OnInit} from '@angular/core';
import {RegisterUserModel, UserResponse} from "../user-management/user.model";
import {UserService} from "../user-management/user.service";
import {Config} from "../../../shared/configs/general.config";

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.html',
    styleUrls:['./user-profile.scss']
})

export class UserProfileComponent implements OnInit {
    userId:string;
    tfaEnabled:boolean = false;    
    objUser:RegisterUserModel = new RegisterUserModel();
    objResponse:UserResponse = new UserResponse();
    imageSrc:string=Config.DefaultAvatar;
    profileval:any=0;
    sportObj:any=[];
    profileArray:any=[];
    loginobjUser:RegisterUserModel = new RegisterUserModel();
    accountDetails:any=[];
    isaddUSAG: boolean = true;
    USAGMemberID: any;

    constructor(private _objUserService:UserService, private router: Router) {
        let userInfo:RegisterUserModel = JSON.parse(Config.getUserInfoToken());
        this.userId = userInfo._id;
        this.loginobjUser=userInfo;
       if(localStorage.getItem('memberid') == 'true'){
        localStorage.removeItem('memberid');
           window.location.reload();
         
       }
        //this.tfaEnabled = userInfo.twoFactorAuthEnabled;
    }
    async ngOnInit() {
        this.getUserDetail();
        await this.getUSAGMember();
       
        this._objUserService.getPaylianceCIDbyUID(this.loginobjUser._id).subscribe( res => {
        
            this._objUserService.paylianceCIDinfo = res[0].CID;
        })
        this.getJudgesSport(this.loginobjUser._id);
		if(this.loginobjUser.userRole=='2'){
			this.getAccountInfo();
		}
    }
    editusag(){
        this.router.navigate(['/profile/usa-gym-member']);
    }
    getUSAGMember() {
        return new Promise((resolve,reject)=>{
            this._objUserService.getUSAGMember(this.loginobjUser._id).subscribe((res)=>{
                if(res.success){
                    if(res.data && res.data.MemberID){
                        this.USAGMemberID = res.data.MemberID
                        this.isaddUSAG = false;
                        resolve()
                    }  else {
                        this.isaddUSAG = true
                        resolve()
                    }
                  
                }  else {
                    this.isaddUSAG = true
                    resolve()
                }
              
            })
        })
      
    }
    getUserDetail() {
        this._objUserService.getUserDetail(this.userId)
            .subscribe(resUser => {
               
                this.profileval=80;
				if(this.loginobjUser.userRole!='2'){
					this.profileval=80;
				}else{
					this.profileval=70;
				}
              //  this.imageSrc="http://192.168.1.90:3005/"+this.objUser.imageProperties.imagePath;
                this.bindDetail(resUser)
            },
                error => this.errorMessage(error));
    }
    getJudgesSport(resUser){
     
        this._objUserService.getJudgesSport(resUser)
        .subscribe(resSport => {
           this.sportObj=resSport;
           if(resSport.length>0){
        
             this.profileval=this.profileval+10;
           }else{
           
             this.profileArray.push({"label":"Add Sports Profile","link":"sports"});
           }          
        },
          error => {
              this.errorMessage(error)
              this.profileArray.push({"label":"Add Sports Profile","link":"sports"})
            });
      }
	  getAccountInfo(){
		  if(this.accountDetails.length >0){
			  
		  }else{
			  this.profileArray.push({"label":"Add Bank Information","link":"accountinfo"})
		  }
	  }
    errorMessage(objResponse:any) {
        Swal("Alert !", objResponse, "info");
    }
    addusagMemberID(){
        this.router.navigate(['/profile/usa-gym-member']);
    }
    
    bindDetail(objRes:RegisterUserModel) {

        this.objUser = objRes;
        if (!this.objUser.imageName){
            this.imageSrc = Config.DefaultAvatar;
            this.profileArray.push({"label":"Add Profile Image","link":"image"})
        }      
        else{
            this.profileval=this.profileval+10;
          
             let cl = Config.Cloudinary;
             // this.imageSrc = cl.url(this.objUser.imageName);
		     // this.imageSrc="http://localhost:3005/public/uploads/images/users/"+this.objUser.imageName;
              this.imageSrc="https://flyp10.com/public/uploads/images/users/"+this.objUser.imageName;
        }

    }

    onShowEdit() {
        this.router.navigate(['/profile/edit', this.userId]);
    }
    RedirecttoPage(link){
        if(link=='image'){
            this.router.navigate(['/profile/edit', this.userId]);
        }else if(link=='sports'){
            this.router.navigate(['/profile/sport']);    
         }else{
			 this.router.navigate(['/profile/accountinfo']); 
		 }
    }
}

