import Swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import { takeUntil } from "rxjs/operators";

import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";

import { RegisterUserModel } from "../user-management/user.model";
import { Config } from "../../../shared/configs/general.config";

import { Subject } from "rxjs";
import { AddCreditService } from "./add-credit.service";

@Component({
  selector: "credit-list",
  templateUrl: "./credit-list.component.html",
  styleUrls:['./credit-list.component.scss']
 
})

export class CreditListComponent implements OnInit {
    displayedColumns = ['SN', 'Competitors','Available Balance']; 
    dataSource:any;
    Collections=[];
    objResponse:any={};
    perPage:number = 10;
    currentPage:number = 1;
    preIndex: number = 0;
  totaldataItem: any;
  totalItems: any;
    constructor(private addcredit:AddCreditService,private router: Router){}
 ngOnInit() {
this.getAllUsersWalletInfo();
 }
 pageChanged(event: any) {
  this.perPage = event.pageSize;
  this.currentPage = event.pageIndex + 1;
  this.getAllUsersWalletInfo();
}
 viewcredits(credit){

 }
 getAllUsersWalletInfo() {
   this.addcredit.getAllUsersWalletInfo(this.perPage,this.currentPage).subscribe((res)=>{
    this.bindList(res)
    },err=>{
        console.log(err)
    })
 }
 addcredits() {
  this.router.navigate(["/add-credits/form"]);
 }
 bindList(objRes) {
  this.objResponse = objRes;
  this.dataSource = new MatTableDataSource(this.objResponse.dataList); 
  this.totaldataItem=new MatTableDataSource(this.objResponse.totaldataItem);	
  this.totalItems = objRes.totalItems;
  this.preIndex = (this.perPage * (this.currentPage - 1));
}
formatDollar(val){
  if(val){
      var amt=val.toString();
      if(amt.indexOf('.')!=-1){
        return '$ '+Number(amt).toFixed(2)
      }else{
         return '$ '+amt+'.00'
      }
  }
  else{
       return '$ 0.00'
  }
  
}
applyFilter(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  console.log(this.totaldataItem)
    this.totaldataItem.filter = filterValue;
if(filterValue=='' || filterValue==null || !filterValue ){
    this.dataSource = new MatTableDataSource(this.objResponse.dataList);
 }else{
  this.dataSource=this.totaldataItem;
 }
};
}
  

 

