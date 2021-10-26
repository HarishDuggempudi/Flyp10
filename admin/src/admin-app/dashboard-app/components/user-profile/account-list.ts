import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {Component, OnInit} from '@angular/core';
import {RegisterUserModel, UserResponse} from "../user-management/user.model";
import {UserService} from "../user-management/user.service";
import {Config} from "../../../shared/configs/general.config";

@Component({
    selector: 'Account-profile',
    templateUrl: './account-list.html',
    styleUrls:['./user-profile.scss']
})

export class AccountListComponent implements OnInit {
    accountDetails:any[]=[];
    userId:string;
    loginobjUser:RegisterUserModel = new RegisterUserModel();
	constructor(private router: Router, private _objUserService:UserService){
		let userInfo:RegisterUserModel = JSON.parse(Config.getUserInfoToken());
        this.userId = userInfo._id;
        this.loginobjUser=userInfo;
	}
	ngOnInit() {
        const CID = this._objUserService.paylianceCIDinfo;
        this.getAccountDetailsFromPayliance(CID) 
    }

    checkIfDefault(val){
        if(val === '0'){
            return true;
        }else{
            return false;
        }
    }

    getAccountDetailsFromPayliance(cid){
      
        this._objUserService.getPaylianceCIDbyUID(this.loginobjUser._id).subscribe( res => {
            
            this._objUserService.paylianceCIDinfo = res;
        },err => {
            
        }, () => {
            const CID = this._objUserService.paylianceCIDinfo;
            this._objUserService.getPaylianceAccountsByCID(CID).subscribe( res => {
              console.log("accounts response from server ", res);
                if(res['response']){
                  
                    if(Array.isArray(res['response'])){
                        this.accountDetails = res['response'];
                    }else{
                        const tempVar = [];
                        tempVar.push(res['response'])
                        this.accountDetails = tempVar;
                    }                
                }else{
                   
                }
                
            },err => {
                
            }, () => {
              
            });
        });
    }

    setDefault(e, account) {
      
        this._objUserService.setDefaultPaylianceAccount(this._objUserService.paylianceCIDinfo, account.MethodID._).subscribe( res => {
          
            if(res['success'] == true){
                Swal("Success" , `Your request to set ${account.Account._} as default account is successful`,"success");
                this.getAccountDetailsFromPayliance(this._objUserService.paylianceCIDinfo)
            }
        })
    }
	
  addAccount(){
    this._objUserService.getUserDetailsByUsername(this.loginobjUser.username).subscribe(res => {
        console.log("Payliance CID ", res.reqData[0].paylianceCID);
        if(res.reqData[0].paylianceCID == "0"){
            Swal("Alert!" , `Your account needs to be verified by the admin before you can add a bank account. Please add a sport to your profile for the verification!`,"error");
        }else{
            this.router.navigate(['/profile/account-editor'])
            // alert('to add account page')
        }       
    })
        
  }
}