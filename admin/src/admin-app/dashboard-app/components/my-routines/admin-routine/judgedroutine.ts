import { Component, OnInit} from "@angular/core";
import { MatPaginator, MatTableDataSource, MatSelectModule } from '@angular/material';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineResponse, RoutineModel } from "../routine.model";
import { JudgesResponse } from "../../user-management/user.model";
import { AdminRoutineService } from "./Admin-routines.service";
import { WalletService } from "../../wallet/wallet.service";
import { SportService } from "../../sport/sport.service";
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { MeetResponse } from "../../events-meet/event-meet-model";
import { TransactionHistoryComponent } from "../../wallet/transaction-history.component";
@Component({
  selector: "judged-routine-list",
  templateUrl: "./judgedRoutine.html",
  styleUrls: ['../routine-list.scss']
})
export class JudgedRoutineListComponent implements OnInit {
    displayedColumns = ['SN', 'Title','RoutineId','Athlete','Judge','UploadedOn','JudgedOn','Score','Actions'];    
    dataSource: any;    
    userId: string;
    objResponse:JudgesResponse;
    /* Pagination */
    pageSizeOptions = [5, 10, 25, 50, 100];
    perPage:number = 10;
    currentPage:number = 1;
    totalItems:number = 1;
    preIndex:number = 0;

    epageSizeOptions = [5, 10, 25, 50, 100];
    eperPage:number = 10;
    ecurrentPage:number = 1;
    etotalItems:number = 1;
    epreIndex:number = 0;
    /* End Pagination */
     totaldataItem:any;
  uploadingType: any;
 
  displayedRows$: any;
  EventMeetList =[];
  selectedEventMeetID: any;
  eventmeetobjListResponse: any;
  etotaldataItem: any;

    constructor(private route:Router,private activatedRoute:ActivatedRoute,private _Service:AdminRoutineService,private walletservice: WalletService,private sportService:SportService){

    }
    
    formatId(id){
      return id.replace(/.(?=.{4})/g, '.')
    }

    ngOnInit() {
      this.activatedRoute.params.subscribe(param=>{
        this.uploadingType=param['type'];
        if(this.uploadingType == 'eventmeet'){
          this.getStartedEventMeet()
          this.displayedColumns = ['SN', 'Title','RoutineId','Athlete','UploadedOn','JudgedOn','Score','Actions'];    
          
        } else {
          this.getRoutine();
        }
       // this.getRoutine();
      })
          //this.getRoutine();
        }

        getStartedEventMeet() {
          this._Service.getStartedEventMeet(this.eperPage,this.ecurrentPage,this.uploadingType)
                 .subscribe(res =>this.bindList1(res),
                     error => this.errorMessage(error));
        }
        
         getRoutine() {
             this._Service.getAlljudgedRoutine(this.perPage,this.currentPage,this.uploadingType)
                 .subscribe(res =>this.bindList(res),
                     error => this.errorMessage(error));
        }
       

        getJudgedEventMeetRoutines(eventmeetId) {
         
          this._Service.getJudgedEventMeetRoutines(this.perPage,this.currentPage,eventmeetId)
          .subscribe(res =>this.bindList(res),
              error => this.errorMessage(error));
 }

 toggleEventMeet(eventmeetId,i) {
  this.selectedEventMeetID = eventmeetId
  this.EventMeetList[i].isActive =  true;
  if(this.EventMeetList[i].isActive) {
    this.preIndex = 0;
    this.perPage =10;
    this.currentPage = 1;
    this.totalItems =0;
    this.dataSource = new MatTableDataSource([])
    this.getJudgedEventMeetRoutines(eventmeetId)
  }
  
 }
 closeEventMeet(i) {
  this.EventMeetList[i].isActive =  false;
 }
         errorMessage(objResponse:any) {
            Swal("Alert !", objResponse, "info");
        }
       pageChanged(event: any) {
        this.perPage = event.pageSize;
        this.currentPage = event.pageIndex + 1;
        if(this.uploadingType == 'flyp10'){
          this.getRoutine();
        } else {
          this.getJudgedEventMeetRoutines(this.selectedEventMeetID)
        }
        
      }

      epageChanged(event: any) {
        this.eperPage = event.pageSize;
        this.ecurrentPage = event.pageIndex + 1;
       this.getStartedEventMeet();
        
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
      eapplyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
         let etotaldataItem = this.etotaldataItem.filter(event => event.EventName.toLowerCase().indexOf(filterValue) > -1);
                if(filterValue=='' || filterValue==null || !filterValue ){
                    this.EventMeetList = this.eventmeetobjListResponse.response.dataList
                }else{
                    this.EventMeetList= etotaldataItem;
                }
      };
        bindList(objRes:JudgesResponse) {
            //console.log(objRes)
            this.objResponse = objRes;
            this.dataSource = new MatTableDataSource(this.objResponse.dataList);           
            this.totalItems = objRes.totaldataItem.length?objRes.totaldataItem.length:0;
            this.totaldataItem=new MatTableDataSource(this.objResponse.totaldataItem);
            this.preIndex = (this.perPage * (this.currentPage - 1));
        }
        bindList1(objRes ) {
          this.eventmeetobjListResponse = objRes;
          this.EventMeetList = this.eventmeetobjListResponse.response.dataList;
          this.EventMeetList.forEach((event)=>{
            event.isActive = false;
          })
          this.EventMeetList[0].isActive = true;
          //this.EventMeetList = of(this.EventMeetList)
           // this.objListResponse = objRes;
            this.etotalItems = this.eventmeetobjListResponse.response.totalItems;
           //this.dataSource = new MatTableDataSource(this.objListResponse.response.dataList);
          //  this.data = this.objListResponse.response.dataList
          this.etotaldataItem=this.eventmeetobjListResponse.response.totaldataItem;
           this.epreIndex = (this.eperPage * (this.ecurrentPage - 1));
         }

   view(routineId:string){
    this.route.navigate(['/admin-routine/routine-details',routineId]);
  }

  formatdate(date){
    date = date.replace(/\..+$/, '');
    return moment(new Date(date)).format('L');
  }
     formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}
}