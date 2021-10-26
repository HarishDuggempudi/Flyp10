import {Component, OnInit,Inject} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {PromocodeService} from './promocode.service';
import { RegisterUserModel, UserResponse } from "../user-management/user.model";
import { Config } from "../../../shared/configs/general.config";
import { UserService } from "../user-management/user.service";

@Component({
  selector: 'promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.scss']
})

export class PromocodeComponent implements OnInit {
loginobjUser: RegisterUserModel = new RegisterUserModel();
  objUser: RegisterUserModel = new RegisterUserModel();
   id:any;
    name:any;

  

  constructor(public dialogRef:MatDialogRef<PromocodeComponent>,public promoservice:PromocodeService,@Inject(MAT_DIALOG_DATA) public data: {user: any}, private _objUserService: UserService,) {
       let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    this.loginobjUser = userInfo;
   
  }
  ngOnInit() {
   console.log("user",this.data)
   this. getUserDetail()
   
  }
form = new FormGroup({
    Promocode: new FormControl('',Validators.required),
   
   
    })
 Promocode(){
   if(this.form.valid){
    
         var body= { Promocode: this.form.value.Promocode, Addedby: this.objUser.username, UserId:  this.objUser._id }   
       
 this.promoservice.Sendpromote(body)
                    .subscribe(res => this.resStatusMessage(res),
                        error =>this.errorMessage(error));
     console.log(body)
     this.dialogRef.close()
   }
 }
  resStatusMessage(res:any) {
       
    console.log("Success !", res.message, "success")
    }

    errorMessage(objResponse:any) {
        console.log("Alert !", objResponse, "info");
    }
     getUserDetail() {
    this._objUserService.getUserDetail(this.loginobjUser._id)
      .subscribe(resUser => {
        
        this.objUser = resUser;
         this.id= this.objUser._id
    this.name=this.objUser.username
      },
        error => this.errorMessage(error));
      
  }
  close(){
          this.dialogRef.close()
        }
}
