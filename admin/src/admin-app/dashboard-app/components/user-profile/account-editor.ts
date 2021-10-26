 import { Router,ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import {Component, OnInit} from '@angular/core';
import {RegisterUserModel, UserResponse} from "../user-management/user.model";
import {UserService} from "../user-management/user.service";
import {Config} from "../../../shared/configs/general.config";
import {UserModel} from "../user-management/user.model";
import {Validators, FormBuilder, FormGroup, FormControl,FormArray} from "@angular/forms";
import {AccountModel} from "../user-management/user.model";
@Component({
    selector: 'Account-profile-editor',
    templateUrl: './account-editor.html',
    styleUrls:['./user-profile.scss']
})

export class AccountEditorComponent implements OnInit {
	types = [
		{value: 'Checking', viewValue: 'Checking'},
		{value: 'Savings', viewValue: 'Savings'}
	  ];
	accountForm: FormGroup;
    accountObj:AccountModel=new AccountModel();
	isSubmitted:boolean=false;
	loggedInUserDetails:UserModel;
	selectedAccountType:string = "";
	constructor(private _formBuilder: FormBuilder,private router: Router,private activatedRoute: ActivatedRoute, private _objUserService:UserService){
		let userInfo: UserModel = JSON.parse(Config.getUserInfoToken());
    	this.loggedInUserDetails = userInfo;
		this.accountForm = this._formBuilder.group({
			"bankName": ['',Validators.required],
            "accountnumber": ['',Validators.required],
            "abanumber": ['',Validators.required],
            // "accounttype": ['',Validators.required],
			"isprimary":[''],
			// "ischecking":['']
        });
	}
	ngOnInit() {}

	accountTypeSelectChange(ev){
		this.selectedAccountType = ev.value;
	}
	
	saveAccount(){
	
		const CID = this._objUserService.paylianceCIDinfo;
		let dataToPost = {
			bankName: this.accountForm.value.bankName,
			accountnumber: this.accountForm.value.accountnumber,
			abanumber: this.accountForm.value.abanumber,
			isprimary: this.accountForm.value.isprimary,
			ischecking: this.selectedAccountType,
			customerId: CID,
			userId: this.loggedInUserDetails._id
		}
	
		this._objUserService.createACHObj(dataToPost).subscribe( res => {
			console.log(res)
			if(res.success == false){
				Swal("Alert!" , res.message,"error");
			}else{
				Swal("Success" , res.message,"success");
				this.router.navigate(['/profile/accountinfo'])
			}			
		})
	}
	 triggerCancelForm() {
      this.router.navigate(['/profile/accountinfo']);
	 }
}