 import Swal from 'sweetalert2';
import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {RegisterUserModel, UserResponse, JudgeSportModel} from "./user.model";
import {UserService} from "./user.service";
import {Config} from "../../../shared/configs/general.config";
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import {WalletService} from "../wallet/wallet.service";
import {WalletModel} from "../wallet/wallet.model";
@Component({
  selector: 'user-wallet-view',
  templateUrl: './user-wallet-info.html',
  styleUrls:['./user-view.scss']

})

export class UserWalletComponent implements OnInit {
  userId: string;
  objUser: RegisterUserModel = new RegisterUserModel();
  objResponse: UserResponse = new UserResponse();
  imageSrc: string = Config.DefaultAvatar;
  SportDetails:any=[];
  userid:any;
  walletObj:WalletModel=new WalletModel();
  transaction:any=[];
  ngOnInit() {
    this.getUserDetail();
	
  }

  constructor(private walletservice : WalletService,private router: Router, private activatedRoute: ActivatedRoute, private _objUserService: UserService) {
    activatedRoute.parent.params.subscribe(param => {this.userId = param['userId']});
  }
    formatdate(date){
	   if(date){
		   return moment(new Date(date)).format('L');
	   }else{
		   return "";
	   }
	   
   }
   
     formatDollar(val){
	  if(val){
		  var amt=val.toString();
		  if(amt.indexOf('.')!=-1){
			return Number(amt).toFixed(2)
		  }else{
			 return amt+'.00'
		  }
	  }
	  else{
		   return '0.00'
	  }
	  
  }
  getUserDetail() {
    this._objUserService.getUserDetail(this.userId)
      .subscribe(resUser => {
        
        this.bindDetail(resUser)
       
      },
        error => this.errorMessage(error));
  }
   getMywalletinfo(){
	   this.walletservice.getWalletInfo(this.objUser._id).subscribe(res=>{
		 
		   if(res.length>0){
			   this.walletObj=res[0];
			   //this.walletObj.balance = "60";
		   }
		   
	   },err=>{
		   this.errorMessage(err)
	   })
   }
   getMytransaction(){
	   this.walletservice.getTransactionInfo(this.objUser._id).subscribe(res=>{
		  
		   this.transaction=res;
		   this.transaction=this.transaction.reverse();
		   //this.transaction=this.transaction.sort((a, b) => new Date(b.txn_date).getTime() - new Date(a.txn_date).getTime())
	   },err=>{
		   this.errorMessage(err)
	   })
   }
  errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }
  bindDetail(objUser: RegisterUserModel) {
	 
    this.objUser = objUser;
	this.getMywalletinfo();
	this.getMytransaction();
    if (!this.objUser.imageName)
      this.imageSrc = Config.DefaultAvatar;
    else {
      let cl = Config.Cloudinary;
     // this.imageSrc = cl.url(this.objUser.imageName);
	   this.imageSrc ="https://flyp10.com/public/uploads/images/users/"+this.objUser.imageName;
    }
  }

  upgrade(){
	  this.router.navigate(["/user-management/detail/"+this.userId+"/subscription/", this.userId]);
  }

  
  

}

