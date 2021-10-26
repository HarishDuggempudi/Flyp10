import { Component, OnInit, OnDestroy } from "../../../../../node_modules/@angular/core";
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
    selector: 'eventValue',
    templateUrl: './eventValue.html',
    styleUrls: ['./dashboard.scss']
  })
  
  export class EventValue implements OnInit,OnDestroy {
  
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
    // showEventScoreFilter:boolean= false;
    // showEventValueFilter:boolean= false;
    // filteredEventsValData=[];
    // filteredEventsScoreData = [];
    // filterData = [];
    // usersList = [];
    // teammatesData = [];
    // eventsValueSummaryData = [];
    // teammatesScoreData = [];
    // teammatesValueData = [];
    // filterDataValueSummary = [];
    // filterDataSportSummary = [];
    // filterDataValueSummarySport = [];
    // filterDataValueSummaryLevel = [];
    // filterDataValueSummaryEvent = [];
    // scoreChartData = [];
    // scoreChartSport = [];
    // scoreChartLevel = [];
    // scoreChartEvent = [];
    // teammatesChartingData= [];
    chartingCanvasLoading:boolean = false;
    // lastNdays:number=1;
    // chartCompareValue:string = "";
    // selectedSortChartingSportVal = "";
    // selectedSortChartingLevelVal = "";
    // selectedSortChartingEventVal = "";
    // chartingSortedByDays = [];
    // chartingSortedBySports = [];
    // chartingSortedByLevels = [];
  
    elemValSportSelected = "";
    elemValDaysSelected = "1";
    elemValLevelSelected = "";
    elemValEventSelected = "";
    elemValCompareSelected = "";
    userState = "";
    teammates = [];
    userSports = [];
    userLevels = [];
    userEvents = [];
  
    eventsScoreDaysSelected = 1;
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
    eventAllObj = [];
    loadChart:boolean = false;
    eventsChartData = [];
    eventsChartLabels = [];
    /* End Pagination */
    displayedColumns = ['element', 'performed', 'average', 'highest', 'lowest'];
    subscriptionType = "";
    constructor( private walletservice:WalletService, private _service: TeammateService,private router: Router,
        private sportServices:SportService,private _formBuilder:FormBuilder, private userServices:UserService,
        private objService:DashboardService,private routineservice:RoutineService,
        public teammateservice:TeammateService) {
      let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
      this.loginuserinfo=userInfo;
      //console.log('user details ', this.loginuserinfo);
      this.getUserDetails(this.loginuserinfo._id);
      this.subType = this.loginuserinfo.subtype;
      this.getTeammatesDetails();
      if(userInfo.userRole){
         this.userRole=userInfo.userRole;
         
      }
          
    }
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
      //console.log('element',element)
    }
  
    getUserDetails(uid){
      this._service.getUserByUserID(uid).subscribe(data => {
        //console.log('user state ', data.address);
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
        //  //console.log('from map ',requestDetail)
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
           this.getAllEvents()
           this.getElementsValueSummary(this.loginuserinfo._id);
          //  this.getPerformedRoutinesById(this.loginuserinfo._id);
        //    this.getEventsScoreSummary(this.loginuserinfo._id);
        //   //  this.getEventsForAnalytics(this.loginuserinfo._id);
        //    this.getSportsDetailsByUsername(this.loginuserinfo.username);
        //    this.getRoutineScoresByUID(this.loginuserinfo._id);
               //this.getSportList();
         
        }
    }

    getAllEvents(){
      this.sportServices.getSportsEvent(10000,1)
    .subscribe(eventRes=>{
       this.eventAllObj=eventRes.dataList;
      
    },err=>{
		this.errorMessage(err);
	}) 
    }
  
    getTeammatesList():Promise<any>{
      return new Promise((resolve, reject)=> {
         this.objService.getAcceptedByUID(this.loginuserinfo._id).subscribe(response => {
          const responseArr = response['response'];
          resolve(responseArr);
         })
      })
    }

    getUsersByUID(rdata:string, arr:any[], index, type){
  
      // alert(rdata['UID']);
      this._service.getUserByUserID(rdata['UID']).subscribe(data => {
      //  //console.log('dataaaaa ', data);
        let element = {
          active: data['active'],
          addedOn: data['addedOn'],
          address: data['address'],
          blocked: data['blocked'],
          dob:data['dob'], 
          email: data['email'],
          firstName:data['firstName'], 
          imageName:data['imageName'], 
          imageProperties:data['imageProperties'],
          lastName:data['lastName'], 
          phoneNumber:data['phoneNumber'], 
          securityQuestion:data['securityQuestion'], 
          twoFactorAuthEnabled: data['twoFactorAuthEnabled'],
          userConfirmed:data['userConfirmed'], 
          userRole: data['userRole'],
          username: data['username'],
          _id: data['_id'],
          requestId: rdata['_id']
        }                                
        arr.push(element);
      //  //console.log('arr.push ', arr);
      })
    }

  
    // getEventsForAnalyticsFilterByDays(ev) {
    //   const toPass = {
    //     uid: this.loginuserinfo._id,
    //     days: parseInt(ev.value,10)
    //   }
    //   this.objService.getEventsForAnalyticsFilterByDays(toPass).subscribe(response => {
    //    // //console.log('EVENTS RES =====> ', response);
    //     this.bindListForEvents(response);
    //   })
    // }
  
    // Revised flow starts here ---- 123 --------------------------------------------
  
    getElementsValueSummary(uid){
      this.loadChart = true;
      //console.log(`%c inside getElementsValueSummary - ${uid}`, 'color: green; font-weight: bold');
      let uidToPass = [];
      uidToPass.push(uid);
      //console.log(`%c uid to pass is ${uidToPass}`, 'color: green; font-weight: bold');
      let body = {
        uid: uidToPass,
        days: parseInt(this.elemValDaysSelected, 10)
      }
      //console.log("passed body ", body);
      this.objService.getElementsValueSummary(body).subscribe(response => {
        //console.log('response from server ', response);
        this.bindListElements(response);
      })
    }
  
    bindListElements(objRes) {
      //   //console.log("bind list called ", objRes);
         this.dataSource = [];
         this.eventsValueData = objRes;
            // //console.log('obj RESSSSSSSSSSSSSSSSs ', objRes);
             this.dataSource = new MatTableDataSource(objRes);           
             this.totalItems = objRes.length;
             this.preIndex = (this.perPage * (this.currentPage - 1));
             this.loadChart = false;
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
  
    getUserMappedSportsLevelsEvents(resUser){   
      this.objService.getUserMappedSportsLevelsEvents(resUser)
      .subscribe(resSport => { 
        console.table('response ', resSport)  
        resSport.forEach(element => {
          this.userEvents.push(element.event);
          this.userSports.push(element.sportName);
          this.userLevels.push(element.level);
        });
        this.userEvents = this.userEvents.filter((item, index) =>  this.userEvents.indexOf(item) == index);
        this.userSports = this.userSports.filter((item, index) =>  this.userSports.indexOf(item) == index);
        this.userLevels = this.userLevels.filter((item, index) =>  this.userLevels.indexOf(item) == index);
      },
        error => this.errorMessage(error));
    }

    getJudgesSport(resUser){
   
      this.userServices.getJudgesSport(resUser)
      .subscribe(resSport => { 
       this.ownsportObj=resSport;
     ////console.log(this.ownsportObj)
    //  this.userownsportObj=resSport;
      this.userSports = resSport
      //console.log("response sport ===============> ", resSport);
         if(resSport.length<=0){		   
          //  this.toggleSportlist=true;
          //  this.showAll=true;
         }
            
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
  
    filterValuesBySport(ev){
      this.elemValLevelSelected = "";
      this.elemValEventSelected = "";
      //console.log("event ", ev.value);
      this.elemValSportSelected = ev.value[0].OrgSportName;
      this.userLevels = ev.value;
      this.loadChart = true;
      //console.log('Sport selected', this.elemValDaysSelected);
      // this.loadLevelsBySport(this.elemValSportSelected);
      let bodyToPass = {};
      if(this.elemValSportSelected) bodyToPass['sport'] = this.elemValSportSelected; 
      if(this.elemValDaysSelected) bodyToPass['days'] = parseInt(this.elemValDaysSelected,10); 
      if(this.elemValLevelSelected) bodyToPass['level'] = this.elemValLevelSelected; 
      if(this.elemValEventSelected) bodyToPass['event'] = this.elemValEventSelected; 
      if(this.elemValCompareSelected){
        switch(this.elemValCompareSelected)
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
      this.objService.getElementsValueSummary(bodyToPass).subscribe(response => {
        //console.log('response from server ', response);
        this.bindListElements(response);
      })
    }
  
    loadEvents(sport, level){
      this.userEvents = [];
      this.objService.getEventsBySportLevel(sport, level).subscribe(
        res=>{
          //console.log('changed sport', res);
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

    loadEventsBySport(sportid){
      this.sportServices.getSportDetailsbyMapping(sportid).subscribe(
        res=>{          
          if(res.length>0){
            //console.log("response from events responswe --------> ", res);
            const temp = res[0];
            let eventarray= temp.mappingFieldsVal; 
						for(let e=0;e<eventarray.length;e++){
							let eventObj=eventarray[e];
							for(let f=0;f<this.eventAllObj.length;f++){
								  if(eventObj.event==this.eventAllObj[f]._id){
                     let event={"event":this.eventAllObj[f].Event} ;
                     //console.log("events >>>>>>>>>>>>>>>>>> ", event);
								       this.userEvents.push(event);
								  }
							}
						}
          }
        })
    }
  
    filterValuesByLevel(ev){
      //console.log("events level value ", ev.value)
      this.loadEventsBySport(ev.value.sportid);
      this.loadChart = true;
      this.elemValLevelSelected = ev.value.Orglevel
      //console.log('Level selected', this.elemValLevelSelected);
      // this.loadEvents(this.elemValSportSelected, this.elemValLevelSelected);
      let bodyToPass = {};
      if(this.elemValSportSelected) bodyToPass['sport'] = this.elemValSportSelected; 
      if(this.elemValDaysSelected) bodyToPass['days'] = parseInt(this.elemValDaysSelected,10); 
      if(this.elemValLevelSelected) bodyToPass['level'] = this.elemValLevelSelected; 
      if(this.elemValEventSelected) bodyToPass['event'] = this.elemValEventSelected; 
      if(this.elemValCompareSelected){
        switch(this.elemValCompareSelected)
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
      this.objService.getElementsValueSummary(bodyToPass).subscribe(response => {
        //console.log('response from server ', response);
        this.bindListElements(response);
      })
    }
  
    filterValuesByEvent(ev){
      this.loadChart = true;
      this.elemValEventSelected = ev.value
      //console.log('Event selected', this.elemValEventSelected);
      let bodyToPass = {};
      if(this.elemValSportSelected) bodyToPass['sport'] = this.elemValSportSelected; 
      if(this.elemValDaysSelected) bodyToPass['days'] = parseInt(this.elemValDaysSelected,10); 
      if(this.elemValLevelSelected) bodyToPass['level'] = this.elemValLevelSelected; 
      if(this.elemValEventSelected) bodyToPass['event'] = this.elemValEventSelected; 
      if(this.elemValCompareSelected){
        switch(this.elemValCompareSelected)
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
      this.objService.getElementsValueSummary(bodyToPass).subscribe(response => {
        //console.log('response from server ', response);
        this.bindListElements(response);
      })
    }

    roundOffValue(val){
      return Math.round( (val + Number.EPSILON) * 100) / 100;
    }
  
    compareElementsValueSummary(ev){
      this.loadChart = true;
      this.elemValCompareSelected = ev.value;
      let bodyToPass = {};
      if(this.elemValSportSelected) bodyToPass['sport'] = this.elemValSportSelected; 
      if(this.elemValDaysSelected) bodyToPass['days'] = parseInt(this.elemValDaysSelected,10); 
      if(this.elemValLevelSelected) bodyToPass['level'] = this.elemValLevelSelected; 
      if(this.elemValEventSelected) bodyToPass['event'] = this.elemValEventSelected; 
      if(this.elemValCompareSelected){
        switch(this.elemValCompareSelected)
        {
          case "Teammates": {
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
      this.objService.getElementsValueSummary(bodyToPass).subscribe(response => {
        //console.log('response from server ', response);
        this.bindListElements(response);
      })
  
    }
  
    filterPerformedRoutinesByDays(ev){
      this.loadChart = true;
      this.elemValDaysSelected = ev.value
      //console.log('days selected', this.elemValDaysSelected);
      let bodyToPass = {};
      if(this.elemValSportSelected) bodyToPass['sport'] = this.elemValSportSelected; 
      if(this.elemValDaysSelected) bodyToPass['days'] = parseInt(this.elemValDaysSelected,10); 
      if(this.elemValLevelSelected) bodyToPass['level'] = this.elemValLevelSelected; 
      if(this.elemValEventSelected) bodyToPass['event'] = this.elemValEventSelected; 
      if(this.elemValCompareSelected){
        switch(this.elemValCompareSelected)
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
      this.objService.getElementsValueSummary(bodyToPass).subscribe(response => {
        //console.log('response from server ', response);
        this.bindListElements(response);
      })
    }
  
    // Revised flow ends here --- 456 --------------------------------------------
  
  
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
  
    ngOnDestroy() {
      if (this.pollRealTimeData)
        clearInterval(this.pollRealTimeData);
    }
  }