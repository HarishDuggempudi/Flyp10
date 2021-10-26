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
import { WalletService } from "../wallet/wallet.service";
import * as moment from 'moment';

@Component({
  selector: "credit-list",
  templateUrl: "./add-credit.component.html",
  styleUrls:['./add-credit.component.scss']
 
})

export class AddCreditComponent implements OnInit {
    displayedColumns = ['SN', 'Competitors','Available Credits', 'Actions']; 
    dataSource:any;
    Collections=[];
    objResponse:any={};
    addCreditsForm:FormGroup;
  allCompetitors: any;
  filteredCompetitors: any;
  Competitor;
  AvailableBalance;
  AddCredit;
  private _onDestroy = new Subject<void>();
  @ViewChild('form') myNgForm;
  isSubmitted = false;
  selectedCompetitor: any;
    constructor(private addcredit:AddCreditService,private router: Router,private _formBuilder:FormBuilder,private walletservice : WalletService){
        this.addCreditsForm = this._formBuilder.group({
             "Competitors" : ['',Validators.required],
             "inputCompetitors":[''] ,
             'availablebalance':[''],
             'AddCredit':['',Validators.required],
             'Description':['',Validators.required]
       });
    
       this.addCreditsForm.controls.inputCompetitors.valueChanges
            .pipe(takeUntil(this._onDestroy))
             .subscribe(() => {
               this.filterCompetitors()
         });
    }
 ngOnInit() {
     this.getAllCompetitors()

 }
 OnCompetitorChange() {
   this.selectedCompetitor = this.addCreditsForm.value.Competitors;
   this.getUserWallet(this.selectedCompetitor);
 }
 getUserWallet(userid){
   this.addcredit.getUserWallet(userid).subscribe((res)=>{
     console.log(res);
     let selectedCompetitorWalletInfo = res[0];
     this.AvailableBalance = '$'+this.formatDollar(selectedCompetitorWalletInfo.balance);
   })
 }
 getAllCompetitors() {
     this.addcredit.getAllCompetitors().subscribe((res)=>{
        this.allCompetitors = res.dataList;
          this.filteredCompetitors = this.allCompetitors
     })
 }
 addcreditWallet(){
   if(this.addCreditsForm.valid){
  let walletObj={
   "type" :'c',
   "userid":this.selectedCompetitor,
   "balance":this.addCreditsForm.value.AddCredit
  }
this.walletservice.creditUserWallet(walletObj).subscribe(res=>{
   //  console.log(res);	
            this.saveTransaction(this.addCreditsForm.value.AddCredit);	
              Swal("Success!","$"+this.formatDollar(this.addCreditsForm.value.AddCredit)+" has been credited to the competitors.", "success");				 
              this.addCreditsForm.reset();
              this.router.navigate(["/add-credits"]);

   },err=>{
     //console.log(err);
 })
}
}
formatDollar(val){
  if(val){
    var amt=val.toString();
    if(amt.indexOf('.')!=-1){
    return Number(amt).toFixed(2)
    }else{
     return Number(amt).toFixed(2)
    }
  }
  else{
     return '0.00'
  }
  
}
 saveTransaction(Amount){
  var desc='Manual Credits -'+ this.addCreditsForm.value.Description;
  var time= moment(new Date()).format("MM/DD/YYYY HH:mm:ss A").toString();
  var transactionObj={
              userid:this.selectedCompetitor,
              txn_amount:Amount,
              txn_type:'c',
              txn_id:Math.random().toString(36).substr(2, 9),
              txn_token:'',
              txn_desc:desc,
              txn_date:	time	  
                    }
        
  this.walletservice.saveTransaction(transactionObj).subscribe(res=>{
     // console.log(res);			  
    },err=>{
    //  console.log(err);
     })			  
} 
 filterCompetitors() {
    if (!this.allCompetitors) {
      return;
      }
      // get the search keyword
      let search = this.addCreditsForm.controls.inputCompetitors.value;
      if (!search) {
          this.filteredCompetitors=this.allCompetitors.slice();
          return;
      } else {
          search = search.toLowerCase();
      }
      // filter the banks
      this.filteredCompetitors=this.allCompetitors.filter(comp => comp.username.toLowerCase().indexOf(search) > -1)
  }
 viewcredits(credit){

 }
 addcredits() {

 }
 cancel() {
   this.addCreditsForm.reset();
   this.router.navigate(["/add-credits"]);
   
 }
}
  

 

