import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import {RegisterUserModel, UserResponse} from "../user-management/user.model";
import {Config} from "../../../shared/configs/general.config";
import {WalletService} from "./wallet.service";
// import {FundsModel,FundsResponse} from "./funds.model";
import {UserService} from "../user-management/user.service";
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSelectModule } from '@angular/material';
@Component({
  selector: "remittance-history",
  templateUrl: "./remittance-history.html",
  styles: ['./wallet.scss']
})
export class RemittanceHistoryComponent implements OnInit {
	
	displayedColumns = ['SN','Amount', 'Previous', 'Closing', 'Date', 'Status'];    
    dataSource: any;    
    objResponse: any=[];
    /* Pagination */
    pageSizeOptions = [5, 10, 25, 50, 100];
    perPage:number = 10;
    currentPage:number = 1;
    totalItems:number = 1;
    preIndex:number = 0;
    accountDetails = [];
    fundTransferList = [];
    CSVarray = [];
    /* End Pagination */
    loginobjUser:RegisterUserModel = new RegisterUserModel();
    userId:string;
  constructor(private walletservice:WalletService) {
    let userInfo:RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    this.userId = userInfo._id;
    this.loginobjUser=userInfo;
  }
  ngOnInit() {
    this.getRemitHistoryById()
   }

   getRemitHistoryById(){
     this.walletservice.getRemitHistoryById(this.loginobjUser._id).subscribe(response => {
     
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

    formatDollar(val){
	  if(val){
		  var amt=val.toString();
		  if(amt.indexOf('.')!=-1){
			return '$ '+amt
		  }else{
			 return '$ '+amt+'.00'
		  }
	  }
	  else{
		   return '$ 0.00'
	  }
	  
  }
   bindList(objRes) {

        this.objResponse = objRes;
        this.dataSource = new MatTableDataSource(objRes);           
        this.totalItems = objRes.length;
        this.preIndex = (this.perPage * (this.currentPage - 1));
    }
   pageChanged(event: any) {
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    //this.getSportList();
  }
}
