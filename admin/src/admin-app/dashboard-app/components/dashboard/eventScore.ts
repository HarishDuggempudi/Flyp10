import { Component, OnInit, OnDestroy, OnChanges } from "../../../../../node_modules/@angular/core";
import { WalletModel } from "../wallet/wallet.model";
import { DashboardModel } from "./dashboard.model";
import { DashboardJudgeModel } from "./dashboard.jude.model";
import { MatTableDataSource } from "../../../../../node_modules/@angular/material";
import { WalletService } from "../wallet/wallet.service";
import { RegisterUserModel } from "../user-management/user.model";
import { TeammateService } from "../teammate/teammate.service";
import Swal from 'sweetalert2';
import {Config} from "../../../shared/configs/general.config";
import { Router } from "../../../../../node_modules/@angular/router";
import { SportService } from "../sport/sport.service";
import { FormBuilder } from "../../../../../node_modules/@angular/forms";
import { UserService } from "../user-management/user.service";
import { DashboardService } from "./dashboard.service";
import { RoutineService } from "../my-routines/routines.service";
import * as moment from 'moment';
@Component({
    selector: 'eventScore',
    templateUrl: './eventScore.html',
    styleUrls: ['./dashboard.scss']
  })
  
  export class EventScore implements OnInit,OnDestroy {
  
    viewId:string;
    activeUserCount:number = 0;
    private prevCount:number = 0;
    activeClass:string;
    pollRealTimeData:any;
    public loginuserinfo:any={};
    public userRole:any='1';
    subType:any="0";
    judgedRoutine:any=[];
    ownsportObj:any=[];
    routineList:any=[];
    suggestedRoutine:any=[];
    sportlist:any=[];
    // lineChartData = [];
    isSubmitted:boolean=false;
    walletObj:WalletModel=new WalletModel();
    dashboardData:DashboardModel=new DashboardModel()
    judgeData:DashboardJudgeModel=new DashboardJudgeModel();
    performedRoutines:any=[];
    elementsData:any = [];
    dataSource: any;
    eventsValueData:any[] =[];
    eventsScoreData:any[]=[];
    /* Pagination */
    pageSizeOptions = [5, 10, 25, 50, 100];
    perPage:number = 10;
    currentPage:number = 1;
    totalItems:number = 1;
    preIndex:number = 0;
    accountDetails = [];
    fundTransferList = [];
    CSVarray = [];
    eventsDataSource:any;
    showEventScoreFilter:boolean= false;
    showEventValueFilter:boolean= false;
    filteredEventsValData=[];
    filteredEventsScoreData = [];
    filterData = [];
    usersList = [];
    teammatesData = [];
    eventsValueSummaryData = [];
    teammatesScoreData = [];
    teammatesValueData = [];
    filterDataValueSummary = [];
    filterDataSportSummary = [];
    filterDataValueSummarySport = [];
    filterDataValueSummaryLevel = [];
    filterDataValueSummaryEvent = [];
    scoreChartData = [];
    scoreChartSport = [];
    scoreChartLevel = [];
    scoreChartEvent = [];
    teammatesChartingData= [];
    chartingCanvasLoading:boolean = false;
    lastNdays:number=1;
    chartCompareValue:string = "";
    selectedSortChartingSportVal = "";
    selectedSortChartingLevelVal = "";
    selectedSortChartingEventVal = "";
    chartingSortedByDays = [];
    chartingSortedBySports = [];
    chartingSortedByLevels = [];
  
    elemValSportSelected = "";
    elemValDaysSelected = 1;
    elemValLevelSelected = "";
    elemValEventSelected = "";
    elemValCompareSelected = "";
    userState = "";
    teammates = [];
    userSports = [];
    userLevels = [];
    userEvents = [];
  
    eventsScoreDaysSelected = "1";
    eventsScoreLevelSelected = "";
    eventsScoreSportSelected = "";
    eventsScoreEventSelected = "";
    eventsScoreCompareSelected = "";
    userStateforEventsScore = "";
    teammatesforEventsScore = [];
    userSportsforEventsScore = [];
    userLevelsforEventsScore = [];
    userEventsforEventsScore = [];
    eventsScoreDataForCharts = [];
    loadChart:boolean = false;
    eventsChartData = [];
    eventsChartLabels = [];
    subscriptionType = "";
    /* End Pagination */
    displayedColumns = ['element', 'performed', 'average', 'highest', 'lowest'];
    constructor( private walletservice:WalletService, private _service: TeammateService,private router: Router,
        private sportServices:SportService,private _formBuilder:FormBuilder, private userServices:UserService,
        private objService:DashboardService,private routineservice:RoutineService,
        public teammateservice:TeammateService) {
      let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
      this.loginuserinfo=userInfo;
     // console.log('user details ', this.loginuserinfo);
      this.getUserDetails(this.loginuserinfo._id);
      this.subType = this.loginuserinfo.subtype;
      this.getTeammatesDetails();
      if(userInfo.userRole){
         this.userRole=userInfo.userRole;
         
      }
          
    }
  
    getUserDetails(uid){
      this._service.getUserByUserID(uid).subscribe(data => {
     //   console.log('user state ', data.address);
        this.userState = data.address;
        this.subscriptionType = data.subtype;
        // return data
      })
    }
  
    getTeammatesDetails(){
      this.getTeammatesList().then(data => {
        let teammatesId = [];
        data.map(requestDetail => {
          this.chartingCanvasLoading = false;
        //  console.log('from map ',requestDetail)
          const teammateId = (requestDetail.UID === this.loginuserinfo._id) ? requestDetail.FID : requestDetail.UID;
          teammatesId.push(teammateId);
        });
        //console.log('teammates data ', teammatesId);
        this.teammates = teammatesId;
      })
    }
  
    ngOnInit() {
        if(this.userRole=='3'){
        
          //  this.getUserMappedSportsLevelsEvents(this.loginuserinfo._id);
          this.getJudgesSport(this.loginuserinfo._id);
        //    this.getElementsValueSummary(this.loginuserinfo._id);
          //  this.getPerformedRoutinesById(this.loginuserinfo._id);
           this.getEventsScoreSummary(this.loginuserinfo._id);
          //  this.getEventsForAnalytics(this.loginuserinfo._id);
        //    this.getSportsDetailsByUsername(this.loginuserinfo.username);
        //    this.getRoutineScoresByUID(this.loginuserinfo._id);
               //this.getSportList();
         
        }
    }

    getJudgesSport(resUser){
   
      this.userServices.getJudgesSport(resUser)
      .subscribe(resSport => { 
       this.ownsportObj=resSport;
     //console.log(this.ownsportObj)
    //  this.userownsportObj=resSport;
      this.userSports = resSport
    //  console.log("response sport ===============> ", resSport);
         if(resSport.length<=0){		   
          //  this.toggleSportlist=true;
          //  this.showAll=true;
         }
            
      },
        error => this.errorMessage(error));
    }
  
    getTeammatesList():Promise<any>{
      return new Promise((resolve, reject)=> {
         this.objService.getAcceptedByUID(this.loginuserinfo._id).subscribe(response => {
          const responseArr = response['response'];
          resolve(responseArr);
         })
      })
    }
  
    // Revised flow starts here ---- 123 --------------------------------------------    
  
    getEventsScoreSummary(uid) {
      this.loadChart = true;
      //console.log(`%c inside getElementsValueSummary - ${uid}`, 'color: blue; font-weight: bold');
      let uidToPass = [];
      uidToPass.push(uid);
   //   console.log(`%c uid to pass is ${uidToPass}`, 'color: blue; font-weight: bold');
      let body = {
        uid: uidToPass,
        days: parseInt(this.eventsScoreDaysSelected,10)
      }
      //console.log("passed body ", body);
      this.objService.getEventsScoreById(body).subscribe(response => {
      // console.log('EVENTS score =====> ', response);
       this.eventsScoreDataForCharts = response;
        this.bindListEvents(response);
      })
    }
  
    LastNDays (n:number) {
      var result = [];
      for (var i=0; i<n; i++) {
          var d = new Date();
          d.setDate(d.getDate() - i);
          result.push(moment(d).format('MM/DD/YYYY') )
      }
      return(result.reverse());
    }
  
    bindListEvents(objRes) {
      //   console.log("bind list called ", objRes);
         this.eventsDataSource = [];
         this.eventsScoreData = objRes;
            // console.log('obj RESSSSSSSSSSSSSSSSs ', objRes);
             this.eventsDataSource = new MatTableDataSource(objRes);           
             this.totalItems = objRes.length;
             this.preIndex = (this.perPage * (this.currentPage - 1));
             this.loadChart = false;
    }
  
    loadLevelsBySportForEvents(val){
      this.userLevelsforEventsScore = [];
      this.sportServices.getSportDetailsbyMapping(val).subscribe(
      res=>{
       // console.log('changed sport', res);
        this.userLevelsforEventsScore = res[0].level;
      },err=>{
              this.errorMessage(err)
      })
    }
  
    filterEventScoreBySport(ev){
      this.eventsScoreLevelSelected = ""; 
      this.eventsScoreEventSelected = ""; 
      this.userLevelsforEventsScore = ev.value;
      this.loadChart = true;
      this.eventsScoreSportSelected = ev.value[0].OrgSportName;
     // console.log('Sport selected', this.eventsScoreSportSelected);
      // this.loadLevelsBySportForEvents(this.eventsScoreSportSelected);
      let bodyToPass = {};
      if(this.eventsScoreSportSelected) bodyToPass['sport'] = this.eventsScoreSportSelected; 
      if(this.eventsScoreDaysSelected) bodyToPass['days'] = parseInt(this.eventsScoreDaysSelected,10); 
      if(this.eventsScoreLevelSelected) bodyToPass['level'] = this.eventsScoreLevelSelected; 
      if(this.eventsScoreEventSelected) bodyToPass['event'] = this.eventsScoreEventSelected; 
      if(this.eventsScoreCompareSelected){
        switch(this.eventsScoreCompareSelected)
        {
          case "Teammates": {
            bodyToPass['uid'] = [];
            bodyToPass['uid'] = this.teammates
            break;
          }
          case "National": {
            // bodyToPass['uid'] = [];
            bodyToPass['state'] = this.userState;
            // let authUid = [];
            // authUid.push(this.loginuserinfo._id)
            // bodyToPass['uid'] = authUid;
            break;
          }
        }
      }else{
        bodyToPass['uid'] = [];
        let authUid = [];
        authUid.push(this.loginuserinfo._id);
        bodyToPass['uid'] = authUid;
      }
  
      //console.log('body to pass ', bodyToPass);
      this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
     //   console.log('response from server ', response);
        this.bindListEvents(response);
      })
    }
  
    filterEventsScoreByDays(ev){
      this.loadChart = true;
      this.eventsScoreDaysSelected = ev.value
     // console.log('days selected', this.eventsScoreDaysSelected);
      let bodyToPass = {};
      if(this.eventsScoreSportSelected) bodyToPass['sport'] = this.eventsScoreSportSelected; 
      if(this.eventsScoreDaysSelected) bodyToPass['days'] = parseInt(this.eventsScoreDaysSelected,10); 
      if(this.eventsScoreLevelSelected) bodyToPass['level'] = this.eventsScoreLevelSelected; 
      if(this.eventsScoreEventSelected) bodyToPass['event'] = this.eventsScoreEventSelected; 
      if(this.eventsScoreCompareSelected){
        switch(this.eventsScoreCompareSelected)
        {
          case "Teammates": {
            bodyToPass['uid'] = [];
            bodyToPass['uid'] = this.teammates
            break;
          }
          case "National": {
            // bodyToPass['uid'] = [];
            bodyToPass['state'] = this.userState;
            // let authUid = [];
            // authUid.push(this.loginuserinfo._id)
            // bodyToPass['uid'] = authUid;
            break;
          }
        }
      }else{
        bodyToPass['uid'] = [];
        let authUid = [];
        authUid.push(this.loginuserinfo._id);
        bodyToPass['uid'] = authUid;
      }
  
   //   console.log('body to pass ', bodyToPass);
      this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
   //     console.log('response from server ', response);
        this.bindListEvents(response);
      })
    }
  
    filterEventScoresByLevel(ev){
      this.loadChart = true;
      this.eventsScoreLevelSelected = ev.value.Orglevel;
      //console.log('Level selected', this.eventsScoreLevelSelected);
      let bodyToPass = {};
      if(this.eventsScoreSportSelected) bodyToPass['sport'] = this.eventsScoreSportSelected; 
      if(this.eventsScoreDaysSelected) bodyToPass['days'] = parseInt(this.eventsScoreDaysSelected,10); 
      if(this.eventsScoreLevelSelected) bodyToPass['level'] = this.eventsScoreLevelSelected; 
      if(this.eventsScoreEventSelected) bodyToPass['event'] = this.eventsScoreEventSelected; 
      if(this.eventsScoreCompareSelected){
        switch(this.eventsScoreCompareSelected)
        {
          case "Teammates": {
            bodyToPass['uid'] = [];
            bodyToPass['uid'] = this.teammates
            break;
          }
          case "National": {
            // bodyToPass['uid'] = [];
            bodyToPass['state'] = this.userState;
            // let authUid = [];
            // authUid.push(this.loginuserinfo._id)
            // bodyToPass['uid'] = authUid;
            break;
          }
        }
      }else{
        bodyToPass['uid'] = [];
        let authUid = [];
        authUid.push(this.loginuserinfo._id);
        bodyToPass['uid'] = authUid;
      }
  
    //  console.log('body to pass ', bodyToPass);
      this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
     //   console.log('response from server ', response);
        this.bindListEvents(response);
      })
    }
  
    getUserMappedSportsLevelsEvents(resUser){   
      this.objService.getUserMappedSportsLevelsEvents(resUser)
      .subscribe(resSport => { 
        console.table('response ', resSport)  
        resSport.forEach(element => {
          this.userEvents.push(element.event);
          this.userEventsforEventsScore.push(element.event);
          this.userSports.push(element.sportName);
          this.userSportsforEventsScore.push(element.sportName)
          this.userLevels.push(element.level);
          this.userLevelsforEventsScore.push(element.level);
        });
        this.userEvents = this.userEvents.filter((item, index) =>  this.userEvents.indexOf(item) == index);
        this.userSports = this.userSports.filter((item, index) =>  this.userSports.indexOf(item) == index);
        this.userLevels = this.userLevels.filter((item, index) =>  this.userLevels.indexOf(item) == index);
      },
        error => this.errorMessage(error));
    }
  
    getAllLevels(){
      this.sportServices.getLevelList(1000,1)
      .subscribe(levelres=>{
         this.userLevels=levelres.dataList;
         
      },err=>{
          this.errorMessage(err);
      });
    }
  
    loadLevelsBySport(val){
      this.userLevels = [];
      this.sportServices.getSportDetailsbyMapping(val).subscribe(
      res=>{
        //console.log('changed sport', res);
        this.userLevels = res[0].level;
      },err=>{
              this.errorMessage(err)
      })
    }
  
    loadEvents(sport, level){
      this.userEvents = [];
      this.objService.getEventsBySportLevel(sport, level).subscribe(
        res=>{
         // console.log('changed sport', res);
          res.forEach(element => {
            this.userEvents.push(element.event);
          });
        },err=>{
                this.errorMessage(err)
        })
    }

    errorMessage(objResponse:any) {
      Swal("Alert !", objResponse, "info");
    }

    roundOffValue(val){
      return Math.round( (val + Number.EPSILON) * 100) / 100;
    }
  
    compareEventScoreSummary(ev){
      this.loadChart = true;
      this.eventsScoreCompareSelected = ev.value;
      let bodyToPass = {};
      if(this.eventsScoreSportSelected) bodyToPass['sport'] = this.eventsScoreSportSelected; 
      if(this.eventsScoreDaysSelected) bodyToPass['days'] = parseInt(this.eventsScoreDaysSelected,10); 
      if(this.eventsScoreLevelSelected) bodyToPass['level'] = this.eventsScoreLevelSelected; 
      if(this.eventsScoreEventSelected) bodyToPass['event'] = this.eventsScoreEventSelected; 
      if(this.eventsScoreCompareSelected){
        switch(this.eventsScoreCompareSelected)
        {
          case "Teammates": {
            console.log('teammates ', this.teammates);
            bodyToPass['uid'] = [];
            bodyToPass['uid'] = this.teammates
            break;
          }
          case "National": {
            bodyToPass['uid'] = this.loginuserinfo._id;
            bodyToPass['state'] = this.userState;
            // let authUid = [];
            // authUid.push(this.loginuserinfo._id)
            // bodyToPass['uid'] = authUid;
            break;
          }
        }
      } else{
        bodyToPass['uid'] = [];
        let authUid = [];
        authUid.push(this.loginuserinfo._id);
        bodyToPass['uid'] = authUid;
      }
      //console.log('body to pass ', bodyToPass);
      this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
       // console.log('response from server ', response);
        this.bindListEvents(response);
      })
  
    }
  
    // Revised flow ends here --- 456 --------------------------------------------
    maxClick(element){

      // this.router.navigateByUrl('admin/library/'+element.maxValRoutineId)
      this.router.navigate(['/library'],{ queryParams: { id: element.maxValRoutineId } });
      // window.open('https://flyp10.com/admin/library/'+element.maxValRoutineId, '_blank')
      //console.log('element',element)
    }
    minClick(element){
      this.router.navigate(['/library'],{ queryParams: { id: element.minValRoutineId } });
      // this.router.navigateByUrl('admin/library/'+element.maxValRoutineId)
      // window.open('https://flyp10.com/admin/library/'+element.minValRoutineId, '_blank')
     // console.log('element',element)
    }
  
    ngOnDestroy() {
      if (this.pollRealTimeData)
        clearInterval(this.pollRealTimeData);
    }
  }