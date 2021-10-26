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
  selector: "transaction-history",
  templateUrl: "./transaction-history.html",
  styles: ['./wallet.scss']
})
export class TransactionHistoryComponent implements OnInit {
	
	displayedColumns = ['SN', 'Amount', 'Type', 'Date'];    
    dataSource: any;    
    objResponse: any=[];
    loginobjUser:RegisterUserModel = new RegisterUserModel();
    userId:string;
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
  constructor(private walletService:WalletService) {
    let userInfo:RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    this.userId = userInfo._id;
        this.loginobjUser=userInfo;
  }
  ngOnInit() {
	this.getMytransaction();
   }

   getMytransaction(){
    this.walletService.getTransactionInfo(this.loginobjUser._id).subscribe(res=>{
      
        // this.transaction=res;
        this.bindList(res);
        // this.transaction=this.transaction.reverse();
        //this.transaction=this.transaction.sort((a, b) => new Date(b.txn_date).getTime() - new Date(a.txn_date).getTime())
    },err=>{
        this.errorMessage(err)
    })
}

errorMessage(objResponse:any) {
    Swal("Alert !", objResponse, "info");
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
		this.objResponse=this.objResponse.sort((a, b) => new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime())
		//console.log(this.objResponse)
        this.dataSource = new MatTableDataSource(this.objResponse);           
        this.totalItems = objRes.length;
        this.preIndex = (this.perPage * (this.currentPage - 1));
    }
   pageChanged(event: any) {
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
  
  }
}
