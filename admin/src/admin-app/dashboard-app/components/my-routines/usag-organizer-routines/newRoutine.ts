import { Component, OnInit} from "@angular/core";
import { MatPaginator, MatTableDataSource, MatSelectModule } from '@angular/material';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineResponse, RoutineModel } from "../routine.model";
import { JudgesResponse } from "../../user-management/user.model";
import { USAGRoutineService } from "./usag-routine.service";
import { WalletService } from "../../wallet/wallet.service";
import { SportService } from "../../sport/sport.service";
import * as moment from 'moment';
import { EventMeetService } from "../../events-meet/event-meet-service";
@Component({
  selector: "new-routine-list",
  templateUrl: "./newRoutine.html",
  styleUrls: ['../routine-list.scss']
})
export class NewRoutineListComponent implements OnInit {
    displayedColumns = ['SN', 'Title','RoutineId','FileSize','FileType','Athlete','UploadedOn','Actions'];    
    dataSource: any;    
    userId: string;
    objResponse;
    /* Pagination */
    pageSizeOptions = [5, 10, 25, 50, 100];
    perPage:number = 10;
    currentPage:number = 1;
    totalItems:number = 1;
    preIndex:number = 0;
    /* End Pagination */
     totaldataItem:any;
    eventid: any;

    constructor(private _objService: EventMeetService,private route:Router,private activatedRoute: ActivatedRoute,private _Service:USAGRoutineService,private walletservice: WalletService,private sportService:SportService){

    }
    
   
formatId(id){
  return id.replace(/.(?=.{4})/g, '.')
}
    ngOnInit() {
        this.activatedRoute.params.subscribe(param => {
            //  console.log("sdsds",param['id'])
              this.eventid = this.activatedRoute.parent.params['_value'].eventId
            
              if(this.eventid){
                this.getNewRoutine();
              }
            })
        }
        
         getNewRoutine() {
             this._Service.getAllnewRoutine(this.perPage,this.currentPage,this.eventid)
                 .subscribe(res =>this.bindList(res),
                     error => this.errorMessage(error));
        }
         errorMessage(objResponse:any) {
            Swal("Alert !", objResponse, "info");
        }
       pageChanged(event: any) {
        this.perPage = event.pageSize;
        this.currentPage = event.pageIndex + 1;
        this.getNewRoutine();
      }
      applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
         this.totaldataItem.filter = filterValue;
                if(filterValue=='' || filterValue==null || !filterValue ){
                    this.dataSource = new MatTableDataSource(this.objResponse.dataList);
                }else{
                    this.dataSource=this.totaldataItem;
                }
      };
        bindList(objRes) {
           // console.log(objRes)
            this.objResponse = objRes;
            this.objResponse.dataList.forEach((obj) => {
              if(obj.athleteInfo.length > 0){
                obj['athlete'] = obj.athleteInfo[0].Name
              } 
              else  if(obj.coachInfo.length > 0){
                obj['athlete'] = obj.coachInfo[0].Name
              }
              else {
                obj['athlete'] = obj.userInfo.firstName+ ' '+obj.userInfo.lastName
              }
            })
            this.objResponse.totaldataItem.forEach((obj) => {
              if(obj.athleteInfo.length > 0){
                obj['athlete'] = obj.athleteInfo[0].Name
              } 
              else  if(obj.coachInfo.length > 0){
                obj['athlete'] = obj.coachInfo[0].Name
              }
              else {
                obj['athlete'] = obj.userInfo.firstName+ ' '+obj.userInfo.lastName
              }
            })
            this.dataSource = new MatTableDataSource(this.objResponse.dataList);           
            this.totalItems = objRes.totaldataItem.length?objRes.totaldataItem.length:0;
            this.totaldataItem=new MatTableDataSource(this.objResponse.totaldataItem);
            this.preIndex = (this.perPage * (this.currentPage - 1));
        }
        delete(id: string,routine) {
            Swal({
              title: "Are you sure?",
              text: "You will not be able to recover this Routine!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!"
            }).then(result => {
              if (result.value) {
                let objTemp: RoutineModel = new RoutineModel();
                objTemp._id = id;
                objTemp.deleted = true;
                this._Service.deleteRoutine(objTemp).subscribe(
                  res => {
                    this.getNewRoutine();
                     Swal("Deleted!", res.message, "success");         
                    this.getdeletedRoutineSportPricing(routine)
                  },
                  error => {
                    Swal("Alert!", error, "info");
                  }
                );
              }
            });
          }

          getdeletedRoutineSportPricing(routine){
            // console.log(routine)
            if (routine.uploadingType == '1') {
             this.sportService.getSportPricingDetailbysportID(routine.sportid, routine.scoretype)
               .subscribe(res => {
       
                 if (res) {
                   this.RefundWallet(res[0], routine)
                   //this.pricinginfo=res[0];
                 }
       
               }, err => {
       
               })
           } else {
             //eventMeetId
             this._objService.getEventMeet(routine.eventMeetId).subscribe(res => {
               if (res.success) {
                 let result = res.result
                 let price = 0
                 if (routine.scoretype == '1') {
                   price = result.ScompetitorPrice
                 } else {
                   price = result.NcompetitorPrice
                 }
                 
                 let findjudges = result.Judges
                 for (let i = 0; i < findjudges.length; i++) {
                   let temp = findjudges[i]
                   //console.log(temp)
                   if (temp.Event == routine.eid) {
                     let Judges = temp.Judges
                     let judgesCount = Judges.length
                     let Amt = (Number(price) * Number(judgesCount))
                     let response = {
                       competitor: Amt,
                       judge: Amt
                     }
          if(Number(price) > 0.01){
                     this.RefundWallet(response, routine)
                  }
                   }
                 }
               }
             })
           }
          }
   view(routineId:string){
    this.route.navigate(['/admin-routine/routine-details',routineId]);
  }
     RefundWallet(response,routine){
          if(Number(response.competitor) > 0.01){			 
            let walletObj={
             "type" :'c',
             "userid":routine.submittedByID,
            "balance":response.competitor
            }
         
        this.walletservice.creditUserWallet(walletObj).subscribe(res=>{
                
                 //Swal("Info!", res.message, "info");
                this.saveRefundTransaction(response.competitor,routine);	                 				 
             },err=>{
                
         })
       }
   }   
   
	 saveRefundTransaction(Amount,routine){
        var desc='Refund -'+routine.title;
        var time= moment(new Date()).format("MM/DD/YYYY HH:mm:ss A").toString();
        var transactionObj={
                                userid:routine.userid,
                                txn_amount:Amount,
                                txn_type:'c',
                                txn_id:Math.random().toString(36).substr(2, 9),
                                txn_token:'',
                                txn_desc:desc,
                                txn_date:time,
                                promocode:'0'	  
                }
                  
          this.walletservice.saveTransaction(transactionObj).subscribe(res=>{
                
            },err=>{
              
           })			  
  }
  formatdate(date){
    date = date.replace(/\..+$/, '');
    return moment(new Date(date)).format('L');
  }
     formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}
}