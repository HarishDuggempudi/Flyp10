 import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {Component, OnInit} from '@angular/core';
import {RegisterUserModel, UserResponse} from "../user-management/user.model";
import {UserService} from "../user-management/user.service";
import {Config} from "../../../shared/configs/general.config";

@Component({
    selector: 'Card-profile',
    templateUrl: './card.list.html',
    styleUrls:['./user-profile.scss']
})

export class CardListComponent implements OnInit {
    CardDetails:any[]=[];
    userId:string;
    loginobjUser:RegisterUserModel = new RegisterUserModel();
	userDetails:RegisterUserModel = new RegisterUserModel();
	constructor(private router: Router, private _objUserService:UserService){
		let userInfo:RegisterUserModel = JSON.parse(Config.getUserInfoToken());
        this.userId = userInfo._id;
        this.loginobjUser=userInfo;
	}
	ngOnInit() {
		this.getccinfo()
    }

    errorMessage(objResponse:any) {
        Swal("Alert !", objResponse, "info");
    }
     makeasdefaultcard(docid,account){
		 let data={
			 docid:docid,
			 userid:this.loginobjUser._id
		 }
		 this._objUserService.makeasdefaultcard(data).subscribe(res=>{
			 this.getccinfo();
		
			 Swal("Success" , `Your request to set ${account.ssl_account_number} as default card is successful`,"success");
		 },err=>this.errorMessage(err))
	 }
	 removeCard(carddetails){
		
		 this._objUserService.getccinfobyid(carddetails.docid).subscribe(res=>{
			 this.getccinfo();
			 Swal("Success",res.message,"success");
		 },err=>this.errorMessage(err));
	 }
    getccinfo(){
		this.CardDetails=[];
		this._objUserService.getccinfo(this.loginobjUser._id).subscribe(res=>{
			
			if(res.length){
				for(let i=0;i<res.length;i++){
					this._objUserService.getinfobyToken(res[i].token).subscribe(result=>{
						
						if(result.response.txn){
							if(result.response.txn.ssl_result==0){
							    this.pushcarddetails(result.response.txn,res[i].isdefault,res[i]._id)
								
							}
						}
					},error=>{
						this.errorMessage(error);
					})
				}
			}
		},err=>this.errorMessage(err))
	}
	pushcarddetails(response,isdefault,docid){
		 response.isdefault=isdefault;
		 response.docid=docid
		this.CardDetails.push(response);
	}
    setDefault(e, account) {
       
		if(e.checked){
			this.makeasdefaultcard(account.docid,account)
		}
		else{
			this.getccinfo();
			Swal("Alert !","At least one card must be a default card.","info");
			
		}
		 
      
    }
	
  addCard(){
      this.router.navigate(['/profile/cardseditor'])
  }
}