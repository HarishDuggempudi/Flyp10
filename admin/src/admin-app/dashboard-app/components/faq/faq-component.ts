import { Component, OnInit } from "@angular/core";
import {FaqModel,FaqResponse} from './faq.model'
import {FaqService} from "./faq.service"
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import {Config} from "../../../shared/configs/general.config";
import {RegisterUserModel} from "../user-management/user.model";
@Component({
  selector: "faq-component",
  templateUrl: "./faq-component.html",
  styleUrls: ['./faq.scss']
})
export class FaqComponent implements OnInit {
  userRole:string="3"
  loginuserinfo:RegisterUserModel
  ngOnInit() {
     this.FaqList()
  }
  faqlist:any=[];
  constructor(private router: Router, private _objService: FaqService) {
    let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    this.loginuserinfo=userInfo;
    if(userInfo.userRole){
       this.userRole=userInfo.userRole;
    }
  }

  FaqList() {
    this._objService
      .getfaqDetailByuserid(this.userRole)
      .subscribe(
        objRes => {
          this.faqlist=objRes;
         

        },
        error => this.errorMessage(error)
      );
  }
  errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }

}
