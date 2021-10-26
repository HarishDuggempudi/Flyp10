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
    selector: 'EventScoreTracking',
    templateUrl: './eventScoreTracking.html',
    styleUrls: ['./dashboard.scss']
  })
  
  export class EventScoreTracking implements OnInit,OnDestroy {
  
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
    loadChart:boolean = false;
    eventsChartData = [];
    eventsChartLabels = [];
    userSportsForCharting = [];
    userLevelsForCharting = [];
    userEventsForCharting = [];
    noDataToDisplay: boolean = false;
    chartCriNotMet: boolean = false;
    compareTeammatesData = [];
    compareNationalsData = [];
    
    eventsChartScoreDaysSelected = "1";
    eventsChartScoreLevelSelected = "";
    eventsChartScoreSportSelected = "";
    eventsChartScoreEventSelected = "";
    eventsChartScoreCompareSelected = "";

    subscriptionType = "";
    chartOptions:any ={
      elements: {
        line: {
          tension: 0,
          fill: false
        }
      },
      legend: {
        position: 'bottom'
      },
      spanGaps: true
    }

    public lineChartLegend:boolean = true;
    public lineChartType:string = 'line';

    noTeammateFound:boolean = false;
    noNationalDataFound:boolean = false;
    eventAllObj=[];
    
    /* End Pagination */
    displayedColumns = ['element', 'performed', 'average', 'highest', 'lowest'];
    constructor( private walletservice:WalletService, private _service: TeammateService,private router: Router,
        private sportServices:SportService,private _formBuilder:FormBuilder, private userServices:UserService,
        private objService:DashboardService,private routineservice:RoutineService,
        public teammateservice:TeammateService) {
      let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
      this.loginuserinfo=userInfo;
      // //console.log('user details ', this.loginuserinfo);
      this.getUserDetails(this.loginuserinfo._id);
      this.subType = this.loginuserinfo.subtype;
      this.getTeammatesDetails();
      if(userInfo.userRole){
         this.userRole=userInfo.userRole;
         
      }
          
    }

    drawChart(){
      this.loadChart = true;
      //  draw tracking chart for 7 days --------------------------
      //console.log('%c last 7 days '+ this.LastNDays(7), 'color: violet; font-weight: bold')
      let chartLabels = ['04/6/2019', '04/7/2019', '04/8/2019', '04/9/2019','04/10/2019','04/11/2019','04/12/2019'];
      let eventsChartData = [
      {
        label: 'High Bar',
        data: [30,50,90,120,13,null,45]
      },
      {
        label: 'Vault - WGym',
        data: [120,13,null,45,30,50,90]
      },
      {
        label: 'Bars',
        data: [31,57,94,12,57,86,30]
      },
      {
        label: 'Level 1 Test 2',
        data: [55,null,21,77,120,18,60]
      }
    ];
      this.drawChartForEventsScore(this.LastNDays(7), eventsChartData);
    }
  
    getUserDetails(uid){
      this._service.getUserByUserID(uid).subscribe(data => {
        //console.log('user state ', data);
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
        if(teammatesId.length){
          this.noTeammateFound = false;
        }else{
          this.noTeammateFound = true;
        }
        
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
  
    ngOnInit() {
        if(this.userRole=='3'){
          this.getEventsScoreSummary(this.loginuserinfo._id);
          this.getAllEvents();
          this.getJudgesSport(this.loginuserinfo._id);
          
          //  this.getUserMappedSportsLevelsEvents(this.loginuserinfo._id);
          // this.drawChart();
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

    getJudgesSport(resUser){
   
      this.userServices.getJudgesSport(resUser)
      .subscribe(resSport => { 
       this.ownsportObj=resSport;
     ////console.log(this.ownsportObj)
    //  this.userownsportObj=resSport;
      this.userSportsForCharting = resSport
      //console.log("response sport ===============> ", resSport);
         if(resSport.length<=0){		   
          //  this.toggleSportlist=true;
          //  this.showAll=true;
         }
            
      },
        error => this.errorMessage(error));
    }

    getEventsScoreSummary(uid) {
      this.loadChart = true;
      //console.log(`%c inside getElementsValueSummary - ${uid}`, 'color: blue; font-weight: bold');
      let uidToPass = [];
      uidToPass.push(uid);
      //console.log(`%c uid to pass is ${uidToPass}`, 'color: blue; font-weight: bold');
      let body = {
        uid: uidToPass,
        days: this.eventsScoreDaysSelected
      }
      //console.log("passed body ", body);
      this.objService.getEventsScoreById(body).subscribe(response => {
       //console.log('EVENTS score =====> ', response);
      //  if(response.length){

      //  }else{
      //    this.loadChart = false;
      //    this.noDataToDisplay = true;
      //  }
      //  this.eventsScoreDataForCharts = response;
        // this.bindListEvents(response);
        let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
        //console.log('days label ', daysLabel);
        if(response.length){
          this.noDataToDisplay = false;
          // draw chart for selected days        
          let dataToPass = [];
          response.forEach(event => {
            let dataObj = {
              label: "",
              data: []
            };
            dataObj.label = event.event;
            // //console.log('event ===> ', event);
            event.groupedItem.forEach(item => {
              let tempDate = new Date(item.addedOn)
              let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
              daysLabel.forEach((date, index) => {
                // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                if(date == addedOn.toString()){
                  // //console.log('match found - score is ===> ',item.score);
                  dataObj.data[index] = item.score;
                }
                if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
              })
            });
            //console.log('dataObj is ===========> ', dataObj);
            dataToPass.push(dataObj)
          });
          //console.log('data to pass ===========> ', dataToPass);
          this.drawChartForEventsScore(daysLabel, dataToPass);
        }else{
          //console.log('no data to display');
          this.noDataToDisplay = true;
          this.loadChart = false;
        }   
      })
    }

    errorMessage(objResponse:any) {
      Swal("Alert !", objResponse, "info");
    }

    getUserMappedSportsLevelsEvents(resUser){   
      this.objService.getUserMappedSportsLevelsEvents(resUser)
      .subscribe(resSport => { 
        console.table('response ', resSport)  
        resSport.forEach(element => {
          this.userSportsForCharting.push(element.sportName);
        });
        this.userSportsForCharting = this.userSportsForCharting.filter((item, index) =>  this.userSportsForCharting.indexOf(item) == index);
      },
        error => this.errorMessage(error));
    }

    LastNDays (n:number) {
      var result = [];
      for (var i=0; i<n; i++) {
          var d = new Date();
          d.setDate(d.getDate() - i);
          result.push(moment(d).format('M/D/YYYY') )
      }
      return(result.reverse());
    }
  
    drawChartByDays(ev){
      this.eventsChartScoreDaysSelected = ev.value
      if(this.eventsChartScoreCompareSelected === 'Teammates'){
        let tempObj = {value: 'Teammates'}
        //console.log('routing to compare charting');
        this.compareCharting(tempObj);
      }else{
        this.loadChart = true;        
        //console.log('days selected', this.eventsScoreDaysSelected);
        this.fetchDataAndDrawCharts(); 
      }   
    }
  
    loadLevelsBySportForCharting(val){
      this.loadChart = true;
      this.userLevelsForCharting = [];
      this.sportServices.getSportDetailsbyMapping(val).subscribe(
      res=>{
        //console.log('changed sport', res);
        this.userLevelsForCharting = res[0].level;
      },err=>{
              this.errorMessage(err)
      })
    }
  
    loadEventsForCharting(sport, level){
      this.loadChart = true;
      this.userEventsForCharting = [];
      this.objService.getEventsBySportLevel(sport, level).subscribe(
        res=>{
          //console.log('changed sport', res);
          res.forEach(element => {
            this.userEventsForCharting.push(element.event);
          });
        },err=>{
                this.errorMessage(err)
        })
    }

    loadEventsBySport(sportid){
      this.sportServices.getSportDetailsbyMapping(sportid).subscribe(
        res=>{          
          if(res.length>0){
            
            const temp = res[0];
            //console.log("response from events responswe --------> ", temp);
            let eventarray= temp.mappingFieldsVal; 
            //console.log("evtArr ---------> ", eventarray);
						for(let e=0;e<eventarray.length;e++){
              let eventObj=eventarray[e];
              //console.log("evtObj ---------> ", eventObj);              
							for(let f=0;f<this.eventAllObj.length;f++){
								  if(eventObj.event==this.eventAllObj[f]._id){
                     let event={"event":this.eventAllObj[f].Event} ;
                     //console.log("events >>>>>>>>>>>>>>>>>> ", event);
								       this.userEventsForCharting.push(event);
								  }
							}
						}
          }
        })
    }
  
    drawChartByLevel(ev){    
      this.loadChart = true;
      //console.log("LEV sELECTED -----> ", ev.value);
      this.eventsChartScoreLevelSelected = ev.value.Orglevel;    
      //console.log('level selected', this.eventsChartScoreLevelSelected);  
      this.loadEventsBySport(ev.value.sportid);
      // this.loadEventsForCharting(this.eventsChartScoreSportSelected, this.eventsChartScoreLevelSelected)
      // this.fetchDataAndDrawCharts();    
      if(this.eventsChartScoreCompareSelected === 'Teammates'){
          // if(!this.eventsChartScoreSportSelected || !this.eventsChartScoreLevelSelected || !this.eventsChartScoreEventSelected){
          //   //console.log('chart criteria not met');
          //   this.chartCriNotMet = true;
          //   this.loadChart = false;  
          // }else if(this.noTeammateFound){
          //   //console.log('inside no teammate found');
          //   this.loadChart = false;
          // }else{
          //   this.fetchDataAndDrawCharts();
          // } 
          if(!this.eventsChartScoreSportSelected || !this.eventsChartScoreLevelSelected || !this.eventsChartScoreEventSelected){
            //console.log('chart criteria not met');
            this.chartCriNotMet = true;
            this.loadChart = false;  
          }else if(this.noTeammateFound){
            //console.log('inside no teammate found');
            this.loadChart = false;
          }else{
            this.chartCriNotMet = false;
            let teammatesChartingData = [];
            let getTeammatesData = new Promise((resolve, reject) => {
              //console.log('inside getTeammatesData Promise');
              this.eventsChartLabels = [];
              this.eventsChartData = [];
    
              let bodyToPass = {};    
              if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
              if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = parseInt(this.eventsChartScoreDaysSelected,10); 
              if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
              if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
              if(this.eventsChartScoreCompareSelected){
                switch(this.eventsChartScoreCompareSelected)
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
    
              // //console.log('body to pass ', bodyToPass);
              let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
              this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
                //console.log('response from server ---> ', response);
                if(response.length){
                  //console.log('teammates data ========> ', response);
                  teammatesChartingData = response;
                  resolve(response);
                }else{
                  // this.noTeammateFound = true;
                  this.noDataToDisplay = true;
                  this.loadChart = false;
                  reject(response);
                }
              })
            })
    
            getTeammatesData.then(data => {
              
              var teammatesData = [];
              teammatesData.push(data)
              //console.log('teammates data ', teammatesData);
              this.eventsChartLabels = [];
              this.eventsChartData = [];
    
              let bodyToPass = {};    
              if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
              if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = this.eventsChartScoreDaysSelected; 
              if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
              if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
              bodyToPass['uid'] = [];
              let authUid = [];
              authUid.push(this.loginuserinfo._id);
              bodyToPass['uid'] = authUid;
    
              // //console.log('body to pass ', bodyToPass);
              let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
              this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
                //console.log('response from server ', response);
                if(response.length){
                  //console.log('user charting data ========> ', response);
                  //console.log('teammates charting data ========> ', teammatesData);
                  this.compareTeammatesData = teammatesData;
                  // draw teammates and user comparison chart
                  let dataToPass = [];
                  let setTeammatesData = new Promise((resolve, reject) => {
                    //console.log('compareTeammatesData ========> ', this.compareTeammatesData);
                    this.compareTeammatesData[0].forEach(event => {
                      let dataObj = {
                        label: "Teammates",
                        data: []
                      };
                      // dataObj.label = event.event;
                      // //console.log('event ===> ', event);
                      event.groupedItem.forEach(item => {
                        let tempDate = new Date(item.addedOn)
                        let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                        daysLabel.forEach((date, index) => {
                          // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                          if(date == addedOn.toString()){
                            // //console.log('match found - score is ===> ',item.score);
                            dataObj.data[index] = item.score;
                          }
                          if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                        })
                      });
                      //console.log('dataObj is ===========> ', dataObj);
                      dataToPass.push(dataObj)
                    });
                    //console.log('data to pass ===========> ', dataToPass);
                    resolve(dataToPass[0]);
                    // this.drawChartForEventsScore(daysLabel, dataToPass);
                  })
                  setTeammatesData.then(dataToPass => {
                    //console.log('data to pass ====> ', dataToPass);
                    let userDataToPass = [];
                    let teammatesDataToPass = [];
                    teammatesDataToPass.push(dataToPass);
                    response.forEach(event => {
                      let dataObj = {
                        label: "Me",
                        data: []
                      };
                      // dataObj.label = event.event;
                      // //console.log('event ===> ', event);
                      event.groupedItem.forEach(item => {
                        let tempDate = new Date(item.addedOn)
                        let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                        daysLabel.forEach((date, index) => {
                          // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                          if(date == addedOn.toString()){
                            // //console.log('match found - score is ===> ',item.score);
                            dataObj.data[index] = item.score;
                          }
                          if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                        })
                      });
                      //console.log('dataObj is ===========> ', dataObj);
                      userDataToPass.push(dataObj);
                      userDataToPass.push(teammatesDataToPass[0]);
                      // userDataToPass = [...userDataToPass[0], ...teammatesDataToPass]
                      //console.log('PASSED CHART DATA ================> ', userDataToPass);
                      this.drawChartForEventsScore(daysLabel, userDataToPass);
                    });
                  })
                }else{
    
                }
              })
            })
          }
      }else if(this.eventsChartScoreCompareSelected == 'National'){
        if(!this.eventsChartScoreSportSelected || !this.eventsChartScoreLevelSelected || !this.eventsChartScoreEventSelected){
          //console.log('chart criteria not met');
          this.chartCriNotMet = true;
          this.loadChart = false;  
        }
        // else if(this.noTeammateFound){
        //   //console.log('inside no teammate found');
        //   this.loadChart = false;
        // }
        else{
          this.chartCriNotMet = false;
          let teammatesChartingData = [];
          let getNationalData = new Promise((resolve, reject) => {
            //console.log('inside getNationalData Promise');
            this.eventsChartLabels = [];
            this.eventsChartData = [];

            let bodyToPass = {};    
            if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
            if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = parseInt(this.eventsChartScoreDaysSelected,10); 
            if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
            if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
            if(this.eventsChartScoreCompareSelected){
              switch(this.eventsChartScoreCompareSelected)
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
            }else{
              bodyToPass['uid'] = [];
              let authUid = [];
              authUid.push(this.loginuserinfo._id);
              bodyToPass['uid'] = authUid;
            }

            //console.log('body to pass for nationals ', bodyToPass);
            let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
            this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
              //console.log('response from server ', response);
              if(response.length){
                this.noNationalDataFound = false;
                //console.log('teammates data ========> ', response);
                teammatesChartingData = response;
                resolve(response);
              }else{
                this.noNationalDataFound = true;
                this.loadChart = false;
                reject(response);
              }
            })
          })

          getNationalData.then(data => {
            
            var teammatesData = [];
            teammatesData.push(data)
            //console.log('teammates data ', teammatesData);
            this.eventsChartLabels = [];
            this.eventsChartData = [];

            let bodyToPass = {};    
            if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
            if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = this.eventsChartScoreDaysSelected; 
            if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
            if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
            bodyToPass['uid'] = [];
            let authUid = [];
            authUid.push(this.loginuserinfo._id);
            bodyToPass['uid'] = authUid;

            // //console.log('body to pass ', bodyToPass);
            let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
            this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
              //console.log('response from server ', response);
              if(response.length){
                //console.log('user charting data ========> ', response);
                //console.log('teammates charting data ========> ', teammatesData);
                this.compareNationalsData = teammatesData;
                // draw teammates and user comparison chart
                let dataToPass = [];
                let setTeammatesData = new Promise((resolve, reject) => {
                  //console.log('compareTeammatesData ========> ', this.compareNationalsData);
                  this.compareNationalsData[0].forEach(event => {
                    let dataObj = {
                      label: "National",
                      data: []
                    };
                    // dataObj.label = event.event;
                    // //console.log('event ===> ', event);
                    event.groupedItem.forEach(item => {
                      let tempDate = new Date(item.addedOn)
                      let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                      daysLabel.forEach((date, index) => {
                        // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                        if(date == addedOn.toString()){
                          // //console.log('match found - score is ===> ',item.score);
                          dataObj.data[index] = item.score;
                        }
                        if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                      })
                    });
                    //console.log('dataObj is ===========> ', dataObj);
                    dataToPass.push(dataObj)
                  });
                  //console.log('data to pass ===========> ', dataToPass);
                  resolve(dataToPass[0]);
                  // this.drawChartForEventsScore(daysLabel, dataToPass);
                })
                setTeammatesData.then(dataToPass => {
                  //console.log('data to pass ====> ', dataToPass);
                  let userDataToPass = [];
                  let teammatesDataToPass = [];
                  teammatesDataToPass.push(dataToPass);
                  response.forEach(event => {
                    let dataObj = {
                      label: "Me",
                      data: []
                    };
                    // dataObj.label = event.event;
                    // //console.log('event ===> ', event);
                    event.groupedItem.forEach(item => {
                      let tempDate = new Date(item.addedOn)
                      let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                      daysLabel.forEach((date, index) => {
                        // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                        if(date == addedOn.toString()){
                          // //console.log('match found - score is ===> ',item.score);
                          dataObj.data[index] = item.score;
                        }
                        if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                      })
                    });
                    //console.log('dataObj is ===========> ', dataObj);
                    userDataToPass.push(dataObj);
                    userDataToPass.push(teammatesDataToPass[0]);
                    // userDataToPass = [...userDataToPass[0], ...teammatesDataToPass]
                    //console.log('PASSED CHART DATA ================> ', userDataToPass);
                    this.drawChartForEventsScore(daysLabel, userDataToPass);
                  });
                })
              }else{

              }
            })
          })
        }
      }
      else{
        this.fetchDataAndDrawCharts();
      }  
    }
  
    drawChartBySport(ev){
      this.eventsChartScoreLevelSelected = ""; 
      this.eventsChartScoreEventSelected = ""; 
      this.loadChart = true;
      this.userLevelsForCharting = ev.value;
      this.eventsChartScoreSportSelected = ev.value[0].OrgSportName;
      //console.log("sport selected ", this.eventsChartScoreSportSelected)
      //console.log('days selected', parseInt(this.eventsChartScoreDaysSelected,10));
      // this.loadLevelsBySportForCharting(this.eventsChartScoreSportSelected);
      if(this.eventsChartScoreCompareSelected === 'Teammates'){
          // if(!this.eventsChartScoreSportSelected || !this.eventsChartScoreLevelSelected || !this.eventsChartScoreEventSelected){
          //   //console.log('chart criteria not met');
          //   this.chartCriNotMet = true;
          //   this.loadChart = false;  
          // }else if(this.noTeammateFound){
          //   //console.log('inside no teammate found');
          //   this.loadChart = false;
          // }else{
          //   this.fetchDataAndDrawCharts();
          // } 
          if(!this.eventsChartScoreSportSelected || !this.eventsChartScoreLevelSelected || !this.eventsChartScoreEventSelected){
            //console.log('chart criteria not met');
            this.chartCriNotMet = true;
            this.loadChart = false;  
          }else if(this.noTeammateFound){
            //console.log('inside no teammate found');
            this.loadChart = false;
          }else{
            this.chartCriNotMet = false;
            let teammatesChartingData = [];
            let getTeammatesData = new Promise((resolve, reject) => {
              //console.log('inside getTeammatesData Promise');
              this.eventsChartLabels = [];
              this.eventsChartData = [];
    
              let bodyToPass = {};    
              if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
              if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = parseInt(this.eventsChartScoreDaysSelected,10); 
              if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
              if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
              if(this.eventsChartScoreCompareSelected){
                switch(this.eventsChartScoreCompareSelected)
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
    
              // //console.log('body to pass ', bodyToPass);
              let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
              this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
                //console.log('response from server ---> ', response);
                if(response.length){
                  //console.log('teammates data ========> ', response);
                  teammatesChartingData = response;
                  resolve(response);
                }else{
                  // this.noTeammateFound = true;
                  this.noDataToDisplay = true;
                  this.loadChart = false;
                  reject(response);
                }
              })
            })
    
            getTeammatesData.then(data => {
              
              var teammatesData = [];
              teammatesData.push(data)
              //console.log('teammates data ', teammatesData);
              this.eventsChartLabels = [];
              this.eventsChartData = [];
    
              let bodyToPass = {};    
              if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
              if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = this.eventsChartScoreDaysSelected; 
              if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
              if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
              bodyToPass['uid'] = [];
              let authUid = [];
              authUid.push(this.loginuserinfo._id);
              bodyToPass['uid'] = authUid;
    
              // //console.log('body to pass ', bodyToPass);
              let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
              this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
                //console.log('response from server ', response);
                if(response.length){
                  //console.log('user charting data ========> ', response);
                  //console.log('teammates charting data ========> ', teammatesData);
                  this.compareTeammatesData = teammatesData;
                  // draw teammates and user comparison chart
                  let dataToPass = [];
                  let setTeammatesData = new Promise((resolve, reject) => {
                    //console.log('compareTeammatesData ========> ', this.compareTeammatesData);
                    this.compareTeammatesData[0].forEach(event => {
                      let dataObj = {
                        label: "Teammates",
                        data: []
                      };
                      // dataObj.label = event.event;
                      // //console.log('event ===> ', event);
                      event.groupedItem.forEach(item => {
                        let tempDate = new Date(item.addedOn)
                        let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                        daysLabel.forEach((date, index) => {
                          // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                          if(date == addedOn.toString()){
                            // //console.log('match found - score is ===> ',item.score);
                            dataObj.data[index] = item.score;
                          }
                          if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                        })
                      });
                      //console.log('dataObj is ===========> ', dataObj);
                      dataToPass.push(dataObj)
                    });
                    //console.log('data to pass ===========> ', dataToPass);
                    resolve(dataToPass[0]);
                    // this.drawChartForEventsScore(daysLabel, dataToPass);
                  })
                  setTeammatesData.then(dataToPass => {
                    //console.log('data to pass ====> ', dataToPass);
                    let userDataToPass = [];
                    let teammatesDataToPass = [];
                    teammatesDataToPass.push(dataToPass);
                    response.forEach(event => {
                      let dataObj = {
                        label: "Me",
                        data: []
                      };
                      // dataObj.label = event.event;
                      // //console.log('event ===> ', event);
                      event.groupedItem.forEach(item => {
                        let tempDate = new Date(item.addedOn)
                        let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                        daysLabel.forEach((date, index) => {
                          // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                          if(date == addedOn.toString()){
                            // //console.log('match found - score is ===> ',item.score);
                            dataObj.data[index] = item.score;
                          }
                          if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                        })
                      });
                      //console.log('dataObj is ===========> ', dataObj);
                      userDataToPass.push(dataObj);
                      userDataToPass.push(teammatesDataToPass[0]);
                      // userDataToPass = [...userDataToPass[0], ...teammatesDataToPass]
                      //console.log('PASSED CHART DATA ================> ', userDataToPass);
                      this.drawChartForEventsScore(daysLabel, userDataToPass);
                    });
                  })
                }else{
    
                }
              })
            })
          }
      }else if(this.eventsChartScoreCompareSelected == 'National'){
        if(!this.eventsChartScoreSportSelected || !this.eventsChartScoreLevelSelected || !this.eventsChartScoreEventSelected){
          //console.log('chart criteria not met');
          this.chartCriNotMet = true;
          this.loadChart = false;  
        }
        // else if(this.noTeammateFound){
        //   //console.log('inside no teammate found');
        //   this.loadChart = false;
        // }
        else{
          this.chartCriNotMet = false;
          let teammatesChartingData = [];
          let getNationalData = new Promise((resolve, reject) => {
            //console.log('inside getNationalData Promise');
            this.eventsChartLabels = [];
            this.eventsChartData = [];

            let bodyToPass = {};    
            if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
            if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = parseInt(this.eventsChartScoreDaysSelected,10); 
            if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
            if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
            if(this.eventsChartScoreCompareSelected){
              switch(this.eventsChartScoreCompareSelected)
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
            }else{
              bodyToPass['uid'] = [];
              let authUid = [];
              authUid.push(this.loginuserinfo._id);
              bodyToPass['uid'] = authUid;
            }

            //console.log('body to pass for nationals ', bodyToPass);
            let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
            this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
              //console.log('response from server ', response);
              if(response.length){
                this.noNationalDataFound = false;
                //console.log('teammates data ========> ', response);
                teammatesChartingData = response;
                resolve(response);
              }else{
                this.noNationalDataFound = true;
                this.loadChart = false;
                reject(response);
              }
            })
          })

          getNationalData.then(data => {
            
            var teammatesData = [];
            teammatesData.push(data)
            //console.log('teammates data ', teammatesData);
            this.eventsChartLabels = [];
            this.eventsChartData = [];

            let bodyToPass = {};    
            if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
            if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = this.eventsChartScoreDaysSelected; 
            if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
            if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
            bodyToPass['uid'] = [];
            let authUid = [];
            authUid.push(this.loginuserinfo._id);
            bodyToPass['uid'] = authUid;

            // //console.log('body to pass ', bodyToPass);
            let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
            this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
              //console.log('response from server ', response);
              if(response.length){
                //console.log('user charting data ========> ', response);
                //console.log('teammates charting data ========> ', teammatesData);
                this.compareNationalsData = teammatesData;
                // draw teammates and user comparison chart
                let dataToPass = [];
                let setTeammatesData = new Promise((resolve, reject) => {
                  //console.log('compareTeammatesData ========> ', this.compareNationalsData);
                  this.compareNationalsData[0].forEach(event => {
                    let dataObj = {
                      label: "National",
                      data: []
                    };
                    // dataObj.label = event.event;
                    // //console.log('event ===> ', event);
                    event.groupedItem.forEach(item => {
                      let tempDate = new Date(item.addedOn)
                      let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                      daysLabel.forEach((date, index) => {
                        // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                        if(date == addedOn.toString()){
                          // //console.log('match found - score is ===> ',item.score);
                          dataObj.data[index] = item.score;
                        }
                        if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                      })
                    });
                    //console.log('dataObj is ===========> ', dataObj);
                    dataToPass.push(dataObj)
                  });
                  //console.log('data to pass ===========> ', dataToPass);
                  resolve(dataToPass[0]);
                  // this.drawChartForEventsScore(daysLabel, dataToPass);
                })
                setTeammatesData.then(dataToPass => {
                  //console.log('data to pass ====> ', dataToPass);
                  let userDataToPass = [];
                  let teammatesDataToPass = [];
                  teammatesDataToPass.push(dataToPass);
                  response.forEach(event => {
                    let dataObj = {
                      label: "Me",
                      data: []
                    };
                    // dataObj.label = event.event;
                    // //console.log('event ===> ', event);
                    event.groupedItem.forEach(item => {
                      let tempDate = new Date(item.addedOn)
                      let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                      daysLabel.forEach((date, index) => {
                        // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                        if(date == addedOn.toString()){
                          // //console.log('match found - score is ===> ',item.score);
                          dataObj.data[index] = item.score;
                        }
                        if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                      })
                    });
                    //console.log('dataObj is ===========> ', dataObj);
                    userDataToPass.push(dataObj);
                    userDataToPass.push(teammatesDataToPass[0]);
                    // userDataToPass = [...userDataToPass[0], ...teammatesDataToPass]
                    //console.log('PASSED CHART DATA ================> ', userDataToPass);
                    this.drawChartForEventsScore(daysLabel, userDataToPass);
                  });
                })
              }else{

              }
            })
          })
        }
      }
      else{
        this.fetchDataAndDrawCharts();
      }         
    }
  
    drawChartByEvent(ev){
      this.loadChart = true;
      this.eventsChartScoreEventSelected = ev.value;
      //console.log('event selected', this.eventsChartScoreEventSelected);
      // this.fetchDataAndDrawCharts();    
      if(this.eventsChartScoreCompareSelected === 'Teammates'){
          // if(!this.eventsChartScoreSportSelected || !this.eventsChartScoreLevelSelected || !this.eventsChartScoreEventSelected){
          //   //console.log('chart criteria not met');
          //   this.chartCriNotMet = true;
          //   this.loadChart = false;  
          // }else if(this.noTeammateFound){
          //   //console.log('inside no teammate found');
          //   this.loadChart = false;
          // }else{
          //   this.fetchDataAndDrawCharts();
          // } 
          if(!this.eventsChartScoreSportSelected || !this.eventsChartScoreLevelSelected || !this.eventsChartScoreEventSelected){
            //console.log('chart criteria not met');
            this.chartCriNotMet = true;
            this.loadChart = false;  
          }else if(this.noTeammateFound){
            //console.log('inside no teammate found');
            this.loadChart = false;
          }else{
            this.chartCriNotMet = false;
            let teammatesChartingData = [];
            let getTeammatesData = new Promise((resolve, reject) => {
              //console.log('inside getTeammatesData Promise');
              this.eventsChartLabels = [];
              this.eventsChartData = [];
    
              let bodyToPass = {};    
              if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
              if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = parseInt(this.eventsChartScoreDaysSelected,10); 
              if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
              if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
              if(this.eventsChartScoreCompareSelected){
                switch(this.eventsChartScoreCompareSelected)
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
    
              // //console.log('body to pass ', bodyToPass);
              let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
              this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
                //console.log('response from server ---> ', response);
                if(response.length){
                  //console.log('teammates data ========> ', response);
                  teammatesChartingData = response;
                  resolve(response);
                }else{
                  // this.noTeammateFound = true;
                  this.noDataToDisplay = true;
                  this.loadChart = false;
                  reject(response);
                }
              })
            })
    
            getTeammatesData.then(data => {
              
              var teammatesData = [];
              teammatesData.push(data)
              //console.log('teammates data ', teammatesData);
              this.eventsChartLabels = [];
              this.eventsChartData = [];
    
              let bodyToPass = {};    
              if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
              if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = this.eventsChartScoreDaysSelected; 
              if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
              if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
              bodyToPass['uid'] = [];
              let authUid = [];
              authUid.push(this.loginuserinfo._id);
              bodyToPass['uid'] = authUid;
    
              // //console.log('body to pass ', bodyToPass);
              let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
              this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
                //console.log('response from server ', response);
                if(response.length){
                  //console.log('user charting data ========> ', response);
                  //console.log('teammates charting data ========> ', teammatesData);
                  this.compareTeammatesData = teammatesData;
                  // draw teammates and user comparison chart
                  let dataToPass = [];
                  let setTeammatesData = new Promise((resolve, reject) => {
                    //console.log('compareTeammatesData ========> ', this.compareTeammatesData);
                    this.compareTeammatesData[0].forEach(event => {
                      let dataObj = {
                        label: "Teammates",
                        data: []
                      };
                      // dataObj.label = event.event;
                      // //console.log('event ===> ', event);
                      event.groupedItem.forEach(item => {
                        let tempDate = new Date(item.addedOn)
                        let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                        daysLabel.forEach((date, index) => {
                          // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                          if(date == addedOn.toString()){
                            // //console.log('match found - score is ===> ',item.score);
                            dataObj.data[index] = item.score;
                          }
                          if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                        })
                      });
                      //console.log('dataObj is ===========> ', dataObj);
                      dataToPass.push(dataObj)
                    });
                    //console.log('data to pass ===========> ', dataToPass);
                    resolve(dataToPass[0]);
                    // this.drawChartForEventsScore(daysLabel, dataToPass);
                  })
                  setTeammatesData.then(dataToPass => {
                    //console.log('data to pass ====> ', dataToPass);
                    let userDataToPass = [];
                    let teammatesDataToPass = [];
                    teammatesDataToPass.push(dataToPass);
                    response.forEach(event => {
                      let dataObj = {
                        label: "Me",
                        data: []
                      };
                      // dataObj.label = event.event;
                      // //console.log('event ===> ', event);
                      event.groupedItem.forEach(item => {
                        let tempDate = new Date(item.addedOn)
                        let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                        daysLabel.forEach((date, index) => {
                          // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                          if(date == addedOn.toString()){
                            // //console.log('match found - score is ===> ',item.score);
                            dataObj.data[index] = item.score;
                          }
                          if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                        })
                      });
                      //console.log('dataObj is ===========> ', dataObj);
                      userDataToPass.push(dataObj);
                      userDataToPass.push(teammatesDataToPass[0]);
                      // userDataToPass = [...userDataToPass[0], ...teammatesDataToPass]
                      //console.log('PASSED CHART DATA ================> ', userDataToPass);
                      this.drawChartForEventsScore(daysLabel, userDataToPass);
                    });
                  })
                }else{
    
                }
              })
            })
          }
      }else if(this.eventsChartScoreCompareSelected == 'National'){
        if(!this.eventsChartScoreSportSelected || !this.eventsChartScoreLevelSelected || !this.eventsChartScoreEventSelected){
          //console.log('chart criteria not met');
          this.chartCriNotMet = true;
          this.loadChart = false;  
        }
        // else if(this.noTeammateFound){
        //   //console.log('inside no teammate found');
        //   this.loadChart = false;
        // }
        else{
          this.chartCriNotMet = false;
          let teammatesChartingData = [];
          let getNationalData = new Promise((resolve, reject) => {
            //console.log('inside getNationalData Promise');
            this.eventsChartLabels = [];
            this.eventsChartData = [];
  
            let bodyToPass = {};    
            if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
            if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = parseInt(this.eventsChartScoreDaysSelected,10); 
            if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
            if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
            if(this.eventsChartScoreCompareSelected){
              switch(this.eventsChartScoreCompareSelected)
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
            }else{
              bodyToPass['uid'] = [];
              let authUid = [];
              authUid.push(this.loginuserinfo._id);
              bodyToPass['uid'] = authUid;
            }
  
            //console.log('body to pass for nationals ', bodyToPass);
            let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
            this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
              //console.log('response from server ', response);
              if(response.length){
                this.noNationalDataFound = false;
                //console.log('teammates data ========> ', response);
                teammatesChartingData = response;
                resolve(response);
              }else{
                this.noNationalDataFound = true;
                this.loadChart = false;
                reject(response);
              }
            })
          })
  
          getNationalData.then(data => {
            
            var teammatesData = [];
            teammatesData.push(data)
            //console.log('teammates data ', teammatesData);
            this.eventsChartLabels = [];
            this.eventsChartData = [];
  
            let bodyToPass = {};    
            if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
            if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = this.eventsChartScoreDaysSelected; 
            if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
            if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
            bodyToPass['uid'] = [];
            let authUid = [];
            authUid.push(this.loginuserinfo._id);
            bodyToPass['uid'] = authUid;
  
            // //console.log('body to pass ', bodyToPass);
            let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
            this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
              //console.log('response from server ', response);
              if(response.length){
                //console.log('user charting data ========> ', response);
                //console.log('teammates charting data ========> ', teammatesData);
                this.compareNationalsData = teammatesData;
                // draw teammates and user comparison chart
                let dataToPass = [];
                let setTeammatesData = new Promise((resolve, reject) => {
                  //console.log('compareTeammatesData ========> ', this.compareNationalsData);
                  this.compareNationalsData[0].forEach(event => {
                    let dataObj = {
                      label: "National",
                      data: []
                    };
                    // dataObj.label = event.event;
                    // //console.log('event ===> ', event);
                    event.groupedItem.forEach(item => {
                      let tempDate = new Date(item.addedOn)
                      let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                      daysLabel.forEach((date, index) => {
                        // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                        if(date == addedOn.toString()){
                          // //console.log('match found - score is ===> ',item.score);
                          dataObj.data[index] = item.score;
                        }
                        if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                      })
                    });
                    //console.log('dataObj is ===========> ', dataObj);
                    dataToPass.push(dataObj)
                  });
                  //console.log('data to pass ===========> ', dataToPass);
                  resolve(dataToPass[0]);
                  // this.drawChartForEventsScore(daysLabel, dataToPass);
                })
                setTeammatesData.then(dataToPass => {
                  //console.log('data to pass ====> ', dataToPass);
                  let userDataToPass = [];
                  let teammatesDataToPass = [];
                  teammatesDataToPass.push(dataToPass);
                  response.forEach(event => {
                    let dataObj = {
                      label: "Me",
                      data: []
                    };
                    // dataObj.label = event.event;
                    // //console.log('event ===> ', event);
                    event.groupedItem.forEach(item => {
                      let tempDate = new Date(item.addedOn)
                      let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                      daysLabel.forEach((date, index) => {
                        // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                        if(date == addedOn.toString()){
                          // //console.log('match found - score is ===> ',item.score);
                          dataObj.data[index] = item.score;
                        }
                        if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                      })
                    });
                    //console.log('dataObj is ===========> ', dataObj);
                    userDataToPass.push(dataObj);
                    userDataToPass.push(teammatesDataToPass[0]);
                    // userDataToPass = [...userDataToPass[0], ...teammatesDataToPass]
                    //console.log('PASSED CHART DATA ================> ', userDataToPass);
                    this.drawChartForEventsScore(daysLabel, userDataToPass);
                  });
                })
              }else{
  
              }
            })
          })
        }
      }
      else{
        this.fetchDataAndDrawCharts();
      }  
    }
  
    compareCharting(ev){
      this.loadChart = true;
      this.eventsChartScoreCompareSelected = ev.value;
      if(this.eventsChartScoreCompareSelected == 'Teammates'){
        if(!this.eventsChartScoreSportSelected || !this.eventsChartScoreLevelSelected || !this.eventsChartScoreEventSelected){
          //console.log('chart criteria not met');
          this.chartCriNotMet = true;
          this.loadChart = false;  
        }else if(this.noTeammateFound){
          //console.log('inside no teammate found');
          this.loadChart = false;
        }else{
          this.chartCriNotMet = false;
          let teammatesChartingData = [];
          let getTeammatesData = new Promise((resolve, reject) => {
            //console.log('inside getTeammatesData Promise');
            this.eventsChartLabels = [];
            this.eventsChartData = [];
  
            let bodyToPass = {};    
            if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
            if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = parseInt(this.eventsChartScoreDaysSelected,10); 
            if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
            if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
            if(this.eventsChartScoreCompareSelected){
              switch(this.eventsChartScoreCompareSelected)
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
  
            // //console.log('body to pass ', bodyToPass);
            let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
            this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
              //console.log('response from server ---> ', response);
              if(response.length){
                //console.log('teammates data ========> ', response);
                teammatesChartingData = response;
                resolve(response);
              }else{
                // this.noTeammateFound = true;
                this.noDataToDisplay = true;
                this.loadChart = false;
                reject(response);
              }
            })
          })
  
          getTeammatesData.then(data => {
            
            var teammatesData = [];
            teammatesData.push(data)
            //console.log('teammates data ', teammatesData);
            this.eventsChartLabels = [];
            this.eventsChartData = [];
  
            let bodyToPass = {};    
            if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
            if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = this.eventsChartScoreDaysSelected; 
            if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
            if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
            bodyToPass['uid'] = [];
            let authUid = [];
            authUid.push(this.loginuserinfo._id);
            bodyToPass['uid'] = authUid;
  
            // //console.log('body to pass ', bodyToPass);
            let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
            this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
              //console.log('response from server ', response);
              if(response.length){
                //console.log('user charting data ========> ', response);
                //console.log('teammates charting data ========> ', teammatesData);
                this.compareTeammatesData = teammatesData;
                // draw teammates and user comparison chart
                let dataToPass = [];
                let setTeammatesData = new Promise((resolve, reject) => {
                  //console.log('compareTeammatesData ========> ', this.compareTeammatesData);
                  this.compareTeammatesData[0].forEach(event => {
                    let dataObj = {
                      label: "Teammates",
                      data: []
                    };
                    // dataObj.label = event.event;
                    // //console.log('event ===> ', event);
                    event.groupedItem.forEach(item => {
                      let tempDate = new Date(item.addedOn)
                      let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                      daysLabel.forEach((date, index) => {
                        // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                        if(date == addedOn.toString()){
                          // //console.log('match found - score is ===> ',item.score);
                          dataObj.data[index] = item.score;
                        }
                        if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                      })
                    });
                    //console.log('dataObj is ===========> ', dataObj);
                    dataToPass.push(dataObj)
                  });
                  //console.log('data to pass ===========> ', dataToPass);
                  resolve(dataToPass[0]);
                  // this.drawChartForEventsScore(daysLabel, dataToPass);
                })
                setTeammatesData.then(dataToPass => {
                  //console.log('data to pass ====> ', dataToPass);
                  let userDataToPass = [];
                  let teammatesDataToPass = [];
                  teammatesDataToPass.push(dataToPass);
                  response.forEach(event => {
                    let dataObj = {
                      label: "Me",
                      data: []
                    };
                    // dataObj.label = event.event;
                    // //console.log('event ===> ', event);
                    event.groupedItem.forEach(item => {
                      let tempDate = new Date(item.addedOn)
                      let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                      daysLabel.forEach((date, index) => {
                        // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                        if(date == addedOn.toString()){
                          // //console.log('match found - score is ===> ',item.score);
                          dataObj.data[index] = item.score;
                        }
                        if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                      })
                    });
                    //console.log('dataObj is ===========> ', dataObj);
                    userDataToPass.push(dataObj);
                    userDataToPass.push(teammatesDataToPass[0]);
                    // userDataToPass = [...userDataToPass[0], ...teammatesDataToPass]
                    //console.log('PASSED CHART DATA ================> ', userDataToPass);
                    this.drawChartForEventsScore(daysLabel, userDataToPass);
                  });
                })
              }else{
  
              }
            })
          })
        }
      }else if(this.eventsChartScoreCompareSelected == 'National'){
        if(!this.eventsChartScoreSportSelected || !this.eventsChartScoreLevelSelected || !this.eventsChartScoreEventSelected){
          //console.log('chart criteria not met');
          this.chartCriNotMet = true;
          this.loadChart = false;  
        }
        // else if(this.noTeammateFound){
        //   //console.log('inside no teammate found');
        //   this.loadChart = false;
        // }
        else{
          this.chartCriNotMet = false;
          let teammatesChartingData = [];
          let getNationalData = new Promise((resolve, reject) => {
            //console.log('inside getNationalData Promise');
            this.eventsChartLabels = [];
            this.eventsChartData = [];
  
            let bodyToPass = {};    
            if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
            if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = parseInt(this.eventsChartScoreDaysSelected,10); 
            if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
            if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
            if(this.eventsChartScoreCompareSelected){
              switch(this.eventsChartScoreCompareSelected)
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
            }else{
              bodyToPass['uid'] = [];
              let authUid = [];
              authUid.push(this.loginuserinfo._id);
              bodyToPass['uid'] = authUid;
            }
  
            //console.log('body to pass for nationals ', bodyToPass);
            let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
            this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
              //console.log('response from server ', response);
              if(response.length){
                //console.log('teammates data ========> ', response);
                teammatesChartingData = response;
                resolve(response);
              }else{
                this.noNationalDataFound = true;
                this.loadChart = false;
                reject(response);
              }
            })
          })
  
          getNationalData.then(data => {
            
            var teammatesData = [];
            teammatesData.push(data)
            //console.log('teammates data ', teammatesData);
            this.eventsChartLabels = [];
            this.eventsChartData = [];
  
            let bodyToPass = {};    
            if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
            if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = this.eventsChartScoreDaysSelected; 
            if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
            if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
            bodyToPass['uid'] = [];
            let authUid = [];
            authUid.push(this.loginuserinfo._id);
            bodyToPass['uid'] = authUid;
  
            // //console.log('body to pass ', bodyToPass);
            let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
            this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
              //console.log('response from server ', response);
              if(response.length){
                //console.log('user charting data ========> ', response);
                //console.log('teammates charting data ========> ', teammatesData);
                this.compareNationalsData = teammatesData;
                // draw teammates and user comparison chart
                let dataToPass = [];
                let setTeammatesData = new Promise((resolve, reject) => {
                  //console.log('compareTeammatesData ========> ', this.compareNationalsData);
                  this.compareNationalsData[0].forEach(event => {
                    let dataObj = {
                      label: "National",
                      data: []
                    };
                    // dataObj.label = event.event;
                    // //console.log('event ===> ', event);
                    event.groupedItem.forEach(item => {
                      let tempDate = new Date(item.addedOn)
                      let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                      daysLabel.forEach((date, index) => {
                        // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                        if(date == addedOn.toString()){
                          // //console.log('match found - score is ===> ',item.score);
                          dataObj.data[index] = item.score;
                        }
                        if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                      })
                    });
                    //console.log('dataObj is ===========> ', dataObj);
                    dataToPass.push(dataObj)
                  });
                  //console.log('data to pass ===========> ', dataToPass);
                  resolve(dataToPass[0]);
                  // this.drawChartForEventsScore(daysLabel, dataToPass);
                })
                setTeammatesData.then(dataToPass => {
                  //console.log('data to pass ====> ', dataToPass);
                  let userDataToPass = [];
                  let teammatesDataToPass = [];
                  teammatesDataToPass.push(dataToPass);
                  response.forEach(event => {
                    let dataObj = {
                      label: "Me",
                      data: []
                    };
                    // dataObj.label = event.event;
                    // //console.log('event ===> ', event);
                    event.groupedItem.forEach(item => {
                      let tempDate = new Date(item.addedOn)
                      let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                      daysLabel.forEach((date, index) => {
                        // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                        if(date == addedOn.toString()){
                          // //console.log('match found - score is ===> ',item.score);
                          dataObj.data[index] = item.score;
                        }
                        if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                      })
                    });
                    //console.log('dataObj is ===========> ', dataObj);
                    userDataToPass.push(dataObj);
                    userDataToPass.push(teammatesDataToPass[0]);
                    // userDataToPass = [...userDataToPass[0], ...teammatesDataToPass]
                    //console.log('PASSED CHART DATA ================> ', userDataToPass);
                    this.drawChartForEventsScore(daysLabel, userDataToPass);
                  });
                })
              }else{
  
              }
            })
          })
        }
      }else{
        this.loadChart = false;
        this.fetchDataAndDrawCharts();
      }
    }
  
    fetchDataAndDrawCharts(){
      //console.log('inside fetch data function');
      this.chartCriNotMet = false;
      this.eventsChartLabels = [];
      this.eventsChartData = [];
  
      let bodyToPass = {};    
      if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
      if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = parseInt(this.eventsChartScoreDaysSelected,10); 
      if(this.eventsChartScoreLevelSelected) bodyToPass['level'] = this.eventsChartScoreLevelSelected; 
      if(this.eventsChartScoreEventSelected) bodyToPass['event'] = this.eventsChartScoreEventSelected; 
      if(this.eventsChartScoreCompareSelected){
        switch(this.eventsChartScoreCompareSelected)
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
  
      // //console.log('body to pass ', bodyToPass);
      let daysLabel = this.LastNDays(parseInt(this.eventsChartScoreDaysSelected,10));
      // //console.log('days label ', daysLabel);
      this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
        //console.log('response from server ', response);
        if(response.length){
          this.noDataToDisplay = false;
          // draw chart for selected days        
          let dataToPass = [];
          response.forEach(event => {
            let dataObj = {
              label: "",
              data: []
            };
            dataObj.label = event.event;
            // //console.log('event ===> ', event);
            event.groupedItem.forEach(item => {
              let tempDate = new Date(item.addedOn)
              let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
              daysLabel.forEach((date, index) => {
                // //console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                if(date == addedOn.toString()){
                  // //console.log('match found - score is ===> ',item.score);
                  dataObj.data[index] = item.score;
                }
                if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
              })
            });
            //console.log('dataObj is ===========> ', dataObj);
            dataToPass.push(dataObj)
          });
          //console.log('data to pass ===========> ', dataToPass);
          this.drawChartForEventsScore(daysLabel, dataToPass);
        }else{
          this.noDataToDisplay = true;
          this.loadChart = false;
        }      
      })
    }
  
    drawChartForEventsScore(labels, data){
      //console.log('initial data for charts ', this.eventsScoreDataForCharts)
      //console.log('final passed data for charts ', data)
      if(data.length) this.noDataToDisplay = false;
      this.eventsChartLabels = labels;
      this.eventsChartData = data;
      this.loadChart = false;
    }

    ngOnDestroy() {
      if (this.pollRealTimeData)
        clearInterval(this.pollRealTimeData);
    }
  }