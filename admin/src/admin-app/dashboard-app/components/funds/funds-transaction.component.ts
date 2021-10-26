import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import Swal from "sweetalert2";
import {RegisterUserModel, UserResponse} from "../user-management/user.model";
import {Config} from "../../../shared/configs/general.config";
import {FundsService} from "./funds.service";
import {FundsModel,FundsResponse} from "./funds.model";
import {UserService} from "../user-management/user.service";
import * as moment from 'moment';
@Component({
  selector: "funds-judge-list",
  templateUrl: "./funds-transaction.html",
  styles: ['./funds.scss']
})
export class FundsTransactionComponent implements OnInit {

   displayedColumns = ['SN','Name', 'Username', 'Amount','Date','Refnum'];    
    dataSource: any;    
    objResponse: any;
    /* Pagination */
    pageSizeOptions = [5, 10, 25, 50, 100];
    perPage:number = 10;
    currentPage:number = 1;
    totalItems:number = 1;
    preIndex:number = 0;
    /* End Pagination */
  constructor(public _fService: FundsService) {
	    
  }
  ngOnInit() {
	 this.getRemittanceHistory();
   }

   getRemittanceHistory(){
     this._fService.getRemittanceHistory().subscribe(response => {
     //  console.log('response ', response);
       this.objResponse = response;
       this.bindList(this.objResponse);
     })
   }

   formatDate(date){
	   if(date){
		   return moment(new Date(date)).format('L');
	   }else{
		   return "";
	   }
	   
   }

   errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }

   pageChanged(event: any) {
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    //this.getSportList();
  }

  bindList(objRes) {
	// console.log(objRes);
      this.objResponse = objRes;
      this.dataSource = new MatTableDataSource(objRes);           
      this.totalItems = objRes.length;
      this.preIndex = (this.perPage * (this.currentPage - 1));
  }
}
