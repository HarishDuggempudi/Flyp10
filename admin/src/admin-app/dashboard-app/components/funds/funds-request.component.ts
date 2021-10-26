import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import Swal from "sweetalert2";
import {RegisterUserModel, UserResponse} from "../user-management/user.model";
import {Config} from "../../../shared/configs/general.config";
import {FundsService} from "./funds.service";
import {FundsModel,FundsResponse} from "./funds.model";
import {UserService} from "../user-management/user.service";
import * as moment from 'moment';
import { EventsService } from "../events/events.service";
@Component({
  selector: "funds-request-list",
  templateUrl: "./funds-request.html",
  styles: ['./funds.scss']
})
export class FundsRequestComponent implements OnInit {

  displayedColumns = ['SN', 'Username', 'Amount', 'Actions'];    
    dataSource: any;    
    objResponse: any = [];
    objListResponse
    /* Pagination */
    pageSizeOptions = [5, 10, 25, 50, 100];
    perPage:number = 10;
    currentPage:number = 1;
    totalItems:number = 1;
    preIndex:number = 0;
    rejectReqToPost = {};
    /* End Pagination */
  constructor(private _objService: FundsService,public dialog:MatDialog) {
	    
  }
  ngOnInit() {
	 this.getAllRequestList();
   }

   getAllRequestList(){
    this._objService.getAllRemitRequests().subscribe( res => {
     
      this.objResponse = res;
      this.bindList(this.objResponse)
    },error => this.errorMessage(error))
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
    
    this.objListResponse = objRes;
    this.totalItems = objRes.totalItems;
    this.dataSource = new MatTableDataSource(this.objListResponse.dataList);
    this.preIndex = (this.perPage * (this.currentPage - 1));
  }

  acceptRemitRequest(requestDetails){
    
 
    this._objService.getPaylianceAccountsByCID(requestDetails.CID).subscribe(res => {
      console.log("response from server ", res);

      //const defaultAccount = res['response'][0];
      const defaultAccount = Array.isArray(res["response"]) ? res['response'][0] : res['response'];
      console.log("default account ", defaultAccount);
      const objToPost = {
        AccountId: requestDetails.AID,
        Amount: requestDetails.amount,
        Account: defaultAccount.Account._,
        AccountType: defaultAccount.AccountType._,
        Routing: defaultAccount.Routing._,
        CustomerID: requestDetails.CID,
        UID: requestDetails.UID,
        Description: `Judged credit remittance for user @${requestDetails.username}`,
        Username: requestDetails.username
      }

      this._objService.createPaymentObjPaylianceforExistingCus(objToPost).subscribe( res => {
        console.log("response from run transaction request ", res);
        if(res['success']){
          Swal("Success!", res['message'], "success");
          this.getAllRequestList();
        }else{
          Swal("Remittance failed!", res['errorDescription'], "error");
        }
        
      })

    })
    // this._objService.getUserDetailsByUsername(requestDetails.username).subscribe(res => {      
    //   const userDetails = res['reqData'][0];
    //   console.log('user details ', userDetails);
    //   const objToPost = {
    //     fname: userDetails.firstName,
    //     lname: userDetails.lastName,
    //     AccountId: requestDetails.AID,
    //     Amount: requestDetails.amount
    //   }

      // this._objService.createPaymentObjPaylianceforExistingCus(objToPost).subscribe( res => {
      //   console.log('response for creating payment obj from the server ', res);


      // })
    // })
  }

  rejectRemitRequest(requestDetails){

    console.log('requestDetails',requestDetails)
    let dialogRef = this.dialog.open(RejectModal, {
      width: '450px',
      
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);

      if(result){
        this._objService.getPaylianceAccountsByCID(requestDetails.CID).subscribe(res => {
          const defaultAccount = res['response'][0];
  
          const objToPost = {
            AccountId: requestDetails.AID,
            CustomerID: requestDetails.CID,
            UID: requestDetails.UID,
            Username: requestDetails.username,
            reason: result
          }
          this.rejectReqToPost = objToPost;
        }, err => {
  
        }, () => {
          this._objService.rejectRemitRequest(this.rejectReqToPost).subscribe(response => {
  
            if (response['success']) {
              Swal("Success!", "Request has been rejected successfully", "success");
              this.getAllRequestList();
            }
          })
          })
      }else{
        
      }
      
      
    });
    
 
  }
}

@Component({
  selector: 'RejectModal',
  templateUrl: 'rejectModal.html'
 
})
export class RejectModal {
  reason:any;
  constructor(
    public dialogRef: MatDialogRef<RejectModal>,
    private _objUserService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      console.log("producst data inside dialog ", data)
      // this.products = data.
      console.log('reson',this.reason)
      dialogRef.disableClose = true;
    }

   

    onSubmit(){
      this.dialogRef.close(this.reason);
    }

  onCancel(): void {
    this.dialogRef.close();
  }

}
