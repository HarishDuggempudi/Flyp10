import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import {RegisterUserModel, UserResponse} from "../user-management/user.model";
import {Config} from "../../../shared/configs/general.config";
import {FundsService} from "./funds.service";
import {FundsModel,FundsResponse} from "./funds.model";
import {UserService} from "../user-management/user.service";
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSelectModule } from '@angular/material';
@Component({
  selector: "funds-judge-list",
  templateUrl: "./funds-judges.html",
  styles: ['./funds.scss']
})
export class FundsJudgesComponent implements OnInit {
	
	displayedColumns = ['SN', 'Username', 'Amount'];    
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
  constructor(private fundsservice:FundsService) {
	    
  }
  ngOnInit() {
	 this.getJudgeWalletInfo();
   }
   
   getJudgeWalletInfo(){
	   this.fundsservice.getJudgeWalletInfo().subscribe(res=>{
       if(res.length){
        
        this.fundTransferList = res;
        this.bindList(this.fundTransferList);
       

        
       }
       
	   },err=>{
		   
	   })
   }

   createCSVObjtoPass(fundTransferList,arr,arrLength){
    this.fundsservice.getPaylianceAccountsByCID(fundTransferList.paylianceCID).subscribe(resp => {            
      if(Array.isArray(resp['response'])){
        this.accountDetails = resp['response'];
      }else{
          const tempVar = [];
          tempVar.push(resp['response'])
          this.accountDetails = tempVar;
      }  
    
      // const CSVdata = {
      //   amount: fundTransferList.walletinfo.balance,
      //   account: this.accountDetails[0].Account._,
      //   accountType: this.accountDetails[0].AccountType._,
      //   routing: this.accountDetails[0].Routing._
      // }
      const CSVdata = ['checkcredit', fundTransferList.walletinfo.balance, this.accountDetails[0].Account._, this.accountDetails[0].Routing._];
      
      arr.push(CSVdata);
    }, err => {
     
    }, () => {
      if(this.CSVarray.length == arrLength){
       
        this.createCSVtoUpload(this.CSVarray);
      }

    })
   }

   createCSVtoUpload(data){
    this.fundsservice.createCSVforACH(data).subscribe(accResponse => {
     
    })
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
    
  }
}
