import Swal from 'sweetalert2';
import {Component, AfterViewInit, OnInit, Input, OnChanges, OnDestroy, Inject} from '@angular/core';
import * as moment from 'moment';
import {DashboardResponseModel,DashboardModel} from './dashboard.model';
import {DashboardJudgeModel} from './dashboard.jude.model';
import {FormGroup, Validators, FormBuilder,} from "@angular/forms";
import {DashboardService} from './dashboard.service';
import {Config} from "../../../shared/configs/general.config";
import {RegisterUserModel} from "../user-management/user.model";
import {RoutineService} from '../judges-routines/routines.service';
import {TeammateService} from '../teammate/teammate.service';
import {UserService} from "../user-management/user.service";
import {UserModel} from "../user-management/user.model";
import { SportService } from '../sport/sport.service';
import { ActivatedRoute, Router } from '@angular/router';
import {WalletService} from "../wallet/wallet.service";
import { MatPaginator, MatTableDataSource, MatSelectModule } from '@angular/material';
import {WalletModel} from "../wallet/wallet.model";
declare var gapi:any;
import * as _ from 'lodash';   
@Component({
  selector: 'browser-chart',
  template: `
  <div *ngIf="pieChartData?.length>0">
    <canvas baseChart
          [data]="pieChartData"
          [labels]="pieChartLabels"
          [chartType]="pieChartType"></canvas>
  </div>
  `
})
export class BrowserAnalysisChart implements OnChanges {
  public pieChartLabels:string[];
  public pieChartData:number[];
  public pieChartType:string = 'pie';
  loggedInUserDetails:UserModel;
  
  @Input() viewId:string;

  constructor(private objService:DashboardService) {
    
  }

  ngOnChanges() {
    if (this.viewId)
      this.getBrowserWiseData();
  }

  getBrowserWiseData() {
    this.objService.queryGoogleApi({
      'ids': 'ga:' + this.viewId,
      'dimensions': 'ga:browser',
      'metrics': 'ga:pageviews',
      'sort': '-ga:pageviews',
      'max-results': 5
    })
      .then((response:any)=> {
        let label:string[] = [];
        let value:number[] = [];
        if (response.rows)
          response.rows.forEach(function (row: any, i: any) {
            label.push(row[0]);
            value.push(+row[1]);
          });
        this.pieChartLabels = label;
        this.pieChartData = value;
      })
      .catch((err:any)=>{});
  }
}

@Component({
  selector: 'country-chart',
  template: `
  <div *ngIf="doughnutChartData?.length>0">
    <canvas baseChart
                [data]="doughnutChartData"
                [labels]="doughnutChartLabels"
                [chartType]="doughnutChartType">
    </canvas>
  </div>
  `
})
export class CountryWiseChart implements OnChanges {
  public doughnutChartLabels:string[];
  public doughnutChartData:number[];
  public doughnutChartType:string = 'doughnut';
  @Input() viewId:string;

  constructor(private objService:DashboardService) {
  }

  ngOnChanges() {
    if (this.viewId)
      this.getCounrtyWiseData();
  }

  getCounrtyWiseData() {
    this.objService.queryGoogleApi({
      'ids': 'ga:' + this.viewId,
      'dimensions': 'ga:country',
      'metrics': 'ga:sessions',
      'sort': '-ga:sessions',
      'max-results': 5
    })
      .then((response:any)=> {
        let label:string[] = [];
        let value:number[] = [];
        if (response.rows)
          response.rows.forEach(function (row: any, i: any) {
            label.push(row[0]);
            value.push(+row[1]);
          });
        this.doughnutChartLabels = label;
        this.doughnutChartData = value;
      })

      .catch((err:any)=>console.log(err));

  }
}

@Component({
  selector: 'user-count',
  template: ` 
    <div class="row">
      <div class="col-lg-6">
        <div class="media">
          <i class="fas fa-user-plus rd "></i>
          <div class="media-body p-2">
            <h5>New Users</h5>
            <span class="count"><animate-counter [valueToCount]="newUserCount"></animate-counter></span>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="media">
          <i class="fas fa-users grn"></i>
          <div class="media-body p-2">
            <h5>Returning Users</h5>
            <span class="count"><animate-counter [valueToCount]="returningUserCount"></animate-counter></span>
          </div>
        </div>
      </div>
    </div>`,
    styleUrls: ['./dashboard.scss'],
})
export class UserCount implements OnChanges {
  activeUserCount:number = 0;
  newUserCount:number = 0;
  returningUserCount:number = 0;
  @Input() viewId:string;

  constructor(@Inject(DashboardService)private objService:DashboardService) {
  }

  ngOnChanges() {
    if (this.viewId)
      this.getTotalUsers();
  }

  getTotalUsers() {
    this.objService.queryGoogleApi({
      'ids': 'ga:' + this.viewId,
      'dimensions': 'ga:userType',
      'metrics': 'ga:users',
      'max-results': 5,
      "start-date": "2005-01-01",
      "end-date": moment().format('YYYY-MM-DD')
    })
      .then((res:any)=> {
        if (res.rows && res.rows.length > 0) {
          this.newUserCount = res.rows[0][1];
          this.returningUserCount = res.rows[1][1];
        }
      })
      .catch((err:any)=> {
        Swal("Alert !", err.error.message, "info");
      });
  }


}

@Component({
  selector: 'page-view',
  template: `
  <div class="media">
    <a target="_blank" class="media-link" href="https://analytics.google.com"></a>
    <i class="fas fa-eye blue"></i>
    <div class="media-body p-2">
      <h5>Page Views</h5>
      <span class="count"><animate-counter [valueToCount]="pageView"></animate-counter></span>
    </div>
  </div>
  `,
  styleUrls: ['./dashboard.scss']
})
export class PageViewComponent implements OnChanges {
  pageView:number = 0;
  @Input() viewId:string;

  constructor(private objService:DashboardService) {
  }

  ngOnChanges() {
    if (this.viewId)
      this.getTotalPageView();
  }

  getTotalPageView() {
    let now = moment();
    this.objService.queryGoogleApi({
      'ids': 'ga:' + this.viewId,
      'metrics': 'ga:pageviews',
      'max-results': 5,
      "start-date": "2005-01-01",
      "end-date": moment(now).format('YYYY-MM-DD')
    })
      .then((res:any)=> {
        if (res.rows.length > 0)
          this.pageView = res.rows[0][0];
      })
      .catch((err)=>console.log(err));
  }
}


@Component({
  selector: 'week-chart',
  template: `
  <div *ngIf="lineChartData">
    <canvas baseChart width="800" height="150"
    [datasets]="lineChartData"
    [labels]="lineChartLabels"
    [options]="lineChartOptions"
    [colors]="lineChartColors"
    [legend]="lineChartLegend"
    [chartType]="lineChartType"
    (chartHover)="chartHovered($event)"
    (chartClick)="chartClicked($event)"></canvas>
</div>
  `
})
export class LastWeekVsThisWeekAnalysisChart implements OnChanges {
  public lineChartData:Array<any>;
  public lineChartLabels:Array<any>;
  public lineChartOptions:any = {
    responsive: true,
    fill: false
  };
  public lineChartColors:Array<any> = [
    
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
 
  @Input() viewId: string;

  constructor(private objService:DashboardService) {
  }

  ngOnChanges() {
    if (this.viewId){
      this.getSessionData();
    }
  }

  getSessionData() {
    let thisWeek = this.objService.queryGoogleApi({
      'ids': 'ga:' + this.viewId,
      'dimensions': 'ga:date,ga:nthDay',
      'metrics': 'ga:sessions',
      'start-date': moment().day(0).format('YYYY-MM-DD'),
      'end-date': moment().format('YYYY-MM-DD')
    });

    let lastWeek = this.objService.queryGoogleApi({
      'ids': 'ga:' + this.viewId,
      'dimensions': 'ga:date,ga:nthDay',
      'metrics': 'ga:sessions',
      'start-date': moment().day(0).subtract(1, 'week')
        .format('YYYY-MM-DD'),
      'end-date': moment().day(6).subtract(1, 'week')
        .format('YYYY-MM-DD')
    });
    Promise.all<any>([thisWeek, lastWeek])
      .then((results:any)=> {
          let data1 = [];
          let data2 = [];
          let labels = [];
          if (results.length > 0) {
            data1 = results[0].rows.map(function (row: any) {
              return +row[2];
            });
            data2 = results[1].rows.map(function (row: any) {
              return +row[2];
            });
            labels = results[1].rows.map(function (row: any) {
              return +row[0];
            });
            labels = labels.map(function (label: string) {
              return moment(label, 'YYYYMMDD').format('ddd');
            });
          }
          this.lineChartData = [
            {data: data1, label: 'This Week'},
            {data: data2, label: 'Last Week'},
          ];
          this.lineChartLabels = labels;
        }
      )
      .catch(
        (err)=>
          console.log(err)
      );
  }
}


@Component({
  selector: 'home',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})

export class DashboardComponent implements OnInit,OnDestroy {

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
  elemValDaysSelected = 30;
  elemValLevelSelected = "";
  elemValEventSelected = "";
  elemValCompareSelected = "";
  userState = "";
  teammates = [];
  userSports = [];
  userLevels = [];
  userEvents = [];

  eventsScoreDaysSelected = 30;
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

  eventsChartScoreDaysSelected = 30;
  eventsChartScoreLevelSelected = "";
  eventsChartScoreSportSelected = "";
  eventsChartScoreEventSelected = "";
  eventsChartScoreCompareSelected = "";

  userSportsForCharting = [];
  userLevelsForCharting = [];
  userEventsForCharting = [];
  noDataToDisplay: boolean = false;
  chartCriNotMet: boolean = false;
  compareTeammatesData = [];
  relibraryCount:any=0
  subscriptionType = "";
  /* End Pagination */
  displayedColumns = ['element', 'performed', 'average', 'highest', 'lowest'];
  LowerEventEventmeetGroup: any =[];
  eventMeetGroupRoutine: any=[];
  userInfo: any;
  constructor( private walletservice:WalletService, private _service: TeammateService,private router: Router,private sportServices:SportService,private _formBuilder:FormBuilder, private userServices:UserService,private objService:DashboardService,private routineservice:RoutineService,public teammateservice:TeammateService) {
    let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    this.loginuserinfo=userInfo;
  //  console.log('user details ', this.loginuserinfo);
    this.getUserDetails(this.loginuserinfo._id);
    this.subType = this.loginuserinfo.subtype;
    this.getTeammatesDetails();
    if(userInfo.userRole){
       this.userRole=userInfo.userRole;
       
    }
	    
  }
  maxElement(element){
    this.router.navigate(['/library'],{ queryParams: { id: element.maxValRoutineId } });
   // console.log('element',element)
  }
  minElement(element){
    this.router.navigate(['/library'],{ queryParams: { id: element.minValRoutineId } });

    //console.log('element',element)
  }
  maxEvent(element){
    this.router.navigate(['/library'],{ queryParams: { id: element.maxValRoutineId } });


    //console.log('element',element)
  }
  minEvent(element){
    this.router.navigate(['/library'],{ queryParams: { id: element.minValRoutineId } });

    //console.log('element',element)
  }

  getUserDetails(uid){
    return new Promise((resolve,reject)=>{
      this._service.getUserByUserID(uid).subscribe(data => {
        //  console.log('user state ', data.address);
        this.userInfo = data
          this.userState = data.address;
          this.subscriptionType = data.subtype;
          resolve()
          // return data
        })
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
     // console.log('teammates data ', teammatesId);
      this.teammates = teammatesId;
    })
  }

  roundOffValue(val){
    return Math.round( (val + Number.EPSILON) * 100) / 100;
  }

  async ngOnInit() {
    await this.getUserDetails(this.loginuserinfo._id);
      if(this.userRole=='1'){
        this.getAccessToken();
      }else if(this.userRole=='3'){
         this.getRountineCount();
         this.getUserMappedSportsLevelsEvents(this.loginuserinfo._id);
         this.getElementsValueSummary(this.loginuserinfo._id);
        //  this.getPerformedRoutinesById(this.loginuserinfo._id);
         this.getEventsScoreSummary(this.loginuserinfo._id);
        //  this.getEventsForAnalytics(this.loginuserinfo._id);
         this.getSportsDetailsByUsername(this.loginuserinfo.username);
         this.getRoutineScoresByUID(this.loginuserinfo._id);
		     //this.getSportList();
	     this.getMywalletinfo();
      }else if(this.userRole=='2'){
        this.getJudgedRoutine();
        this.getAllRoutine();
    this.getMywalletinfo();
    if(this.userInfo && this.userInfo.EligibleJudgeForMyFlyp10Routine){
      this.getVerifiedJudgeSportsByjudgeId(this.loginuserinfo._id)
     }
    this.getEventMeetRoutine(this.loginuserinfo._id)
	     	//this.getSportList();
      }else{
		  this.getRelibraryCount();
	  }
  }
  eventMeetRountine:any=[]
  getEventMeetRoutine(userid){
	  this.routineservice.getEventForJudges(userid).subscribe(res=>{
		   //console.log("evnet Meet Rountine ",userid,res)
		   if(res.success){
			   let eventmeetRoutine = res.result;
			   this.eventMeetRountine = [];
			   let temp;
			   for(var i= 0;i<eventmeetRoutine.length;i++){
				   temp = eventmeetRoutine[i];
				   let eventMeetInfo;
				   if(eventmeetRoutine[i].sportid == Config.WFigureSkating || eventmeetRoutine[i].sportid == Config.MFigureSkating){
						eventMeetInfo = eventmeetRoutine[i].eventmeetInfo;
					   let eventmeetJudge = eventmeetRoutine[i].judgeInfo;
					   //Figureskating technician for higher;
					   if(eventmeetJudge.hasOwnProperty('isTechnician') && eventmeetJudge.isTechnician == '1'&&eventmeetRoutine[i].technician_status == '0'){
              this.eventMeetRountine.push(temp);
              
							if(i == eventmeetRoutine.length-1){
                this.judgeData.newRoutines=this.judgeData.newRoutines+this.eventMeetRountine.length
								if(this.LowerEventEventmeetGroup.length >0)
								 this.getEventMeetGroupRoutine();
								}
					   }
					   //Figureskating judge for higher;
					   else if(eventmeetJudge.hasOwnProperty('isTechnician') && eventmeetJudge.isTechnician == '0'&& eventMeetInfo.EventLevel == '1' && eventmeetRoutine[i].technician_status == '2'){
						this.eventMeetRountine.push(temp);
						if(i == eventmeetRoutine.length-1){
              this.judgeData.newRoutines=this.judgeData.newRoutines+this.eventMeetRountine.length
              if(this.LowerEventEventmeetGroup.length >0)
              
							 this.getEventMeetGroupRoutine();
							}
					   }
					   //Figureskating judge for lower;
					  else if(eventmeetJudge.hasOwnProperty('isTechnician') && eventmeetJudge.isTechnician == '0'&& eventMeetInfo.EventLevel == '0'){
						this.LowerEventEventmeetGroup.push(temp);
						if(i == eventmeetRoutine.length-1){
              this.judgeData.newRoutines=this.judgeData.newRoutines+this.eventMeetRountine.length
							if(this.LowerEventEventmeetGroup.length >0)
							 this.getEventMeetGroupRoutine();
              }
              else {
                if(i == eventmeetRoutine.length-1){
                  this.judgeData.newRoutines=this.judgeData.newRoutines+this.eventMeetRountine.length
                  if(this.LowerEventEventmeetGroup.length >0)
                   this.getEventMeetGroupRoutine();
                  }
              }
						//this.eventMeetRountine.push(temp);
					  }
					
					 
				   }
				   else {
					this.eventMeetRountine.push(temp);
					if(i == eventmeetRoutine.length-1){
            this.judgeData.newRoutines=this.judgeData.newRoutines+this.eventMeetRountine.length
						if(this.LowerEventEventmeetGroup.length >0)
						 this.getEventMeetGroupRoutine();
						}
				   }
				   
				  
			   }

			//   this.eventMeetRountine=res.result
			   //console.log(this.eventMeetRountine,this.eventMeetRountine.length)
		   }
		   else{
			this.eventMeetRountine=[] 
			Swal("Alert","Unable to get event meet routine.","info")
		   }
	  },err=>{
		//  //console.log("error")
		  this.eventMeetRountine=[]
		  Swal("Alert","Unable to get event meet routine.","info")
	  })
  }
  getEventMeetGroupRoutine() {
	  var eventmeetgroups = [];
	  var eventMeetGroupRoutine = [];
	this.LowerEventEventmeetGroup.forEach((routine,i) => {
		this.routineservice.getEventmeetGroupByeventId(routine.eventMeetId).subscribe((res) => {
			if (res.success) {
			  eventmeetgroups = res.result;
			  if (eventmeetgroups.length > 0) {
				 
				eventmeetgroups.forEach((comp, j) => {
					let  competitorsRoutine = [];
				  comp.competitors.forEach((c,k) => {
					let croutine = this.LowerEventEventmeetGroup.filter((routine)=>routine.userid == c._id && routine.eventMeetId == comp.eventId)
					if(croutine.length > 0){
            competitorsRoutine.push(croutine[0]);
            competitorsRoutine = _.uniqBy(competitorsRoutine,'userid' );
					}
					if(k == comp.competitors.length-1 && comp.competitors.length == competitorsRoutine.length){
						let data = {
							groupId :comp._id,
							GroupName : comp.groupName,
							CompetitorRoutines : competitorsRoutine,
						}
						eventMeetGroupRoutine.push(data);
					
          }
          	if(i == this.LowerEventEventmeetGroup.length -1 && this.eventMeetGroupRoutine.length == 0 ){
							this.eventMeetGroupRoutine = _.uniqBy(eventMeetGroupRoutine,'groupId' );
              console.log(this.eventMeetGroupRoutine);
              this.judgeData.newRoutines=this.judgeData.newRoutines+this.eventMeetGroupRoutine.length
						}

				  })
				})
			}
		}
			})
			
	});
	
  }

  
  sortChartingBySport(ev){
    this.chartingCanvasLoading = false;
    this.lineChartData = [];
    //console.log('selected sort val ', this.selectedSortChartingSportVal);
   // console.log('sorted data ',this.chartingSortedByDays );
  //  console.log('label ', this.lineChartLabels);
    const filteredResult = this.chartingSortedByDays.filter( v => v._id.sport === this.selectedSortChartingSportVal);
  //  console.log('Filtered Result ', filteredResult);
    this.chartingSortedBySports = filteredResult;
    var tempArr = [],
      scoreData = [],
      groupedItem = [],
      linechartLabel = [];
      filteredResult.forEach(element => {
        for (let i = 0; i < element.groupedItem.length; i++) {
          const gItem = element.groupedItem[i];
          //console.log("Grouped item " ,gItem);
       //   console.log('line chart labels array ',  this.lineChartLabels);
          groupedItem.push(gItem);
        }
      });
    //  console.log('Final res ===> ', groupedItem);
      for (let j = 0; j < this.lineChartLabels.length; j++){
        const labelDate = this.lineChartLabels[j]; 
       // console.log('date to check ', labelDate);
        for (let i = 0; i < groupedItem.length; i++){
          const gItem = groupedItem[i];
         // console.log("Grouped item " ,gItem);
          if(moment(gItem.submittedOn).format('MM/DD/YYYY') == labelDate){
            scoreData.push(gItem.score);
            break;
          }
          const index = i+1;
          if(index == groupedItem.length){
            scoreData.push("0");
          }
        }
      }
   //   console.log('scores combined ----------------------------------------> ', scoreData);
      const tempObj = {
        data: scoreData,
        label: "Me"
      }
      this.lineChartData.push(tempObj)
      // this.lineChartData = [{ data: scoreData, label: "Me"}];     
      this.chartingCanvasLoading = true; 
      //console.log('this.linechartlabels ', this.lineChartLabels)
  }

  sortChartingByLevel(){
    this.chartingCanvasLoading = false;
    this.lineChartData = [];
   // console.log('selected sort val ', this.selectedSortChartingLevelVal);
   // console.log('sorted data ',this.chartingSortedBySports );
   // console.log('label ', this.lineChartLabels);
    const filteredResult = this.chartingSortedBySports.filter( v => v._id.level === this.selectedSortChartingLevelVal);
   // console.log('Filtered Result ', filteredResult);
    this.chartingSortedByLevels = this.filterData;
    var tempArr = [],
      scoreData = [],
      groupedItem = [],
      linechartLabel = [];
      filteredResult.forEach(element => {
        for (let i = 0; i < element.groupedItem.length; i++) {
          const gItem = element.groupedItem[i];
         // console.log("Grouped item " ,gItem);
         // console.log('line chart labels array ',  this.lineChartLabels);
          groupedItem.push(gItem);
        }
      });
     // console.log('Final res ===> ', groupedItem);
      for (let j = 0; j < this.lineChartLabels.length; j++){
        const labelDate = this.lineChartLabels[j]; 
        //console.log('date to check ', labelDate);
        for (let i = 0; i < groupedItem.length; i++){
          const gItem = groupedItem[i];
       //   console.log("Grouped item " ,gItem);
          if(moment(gItem.submittedOn).format('MM/DD/YYYY') == labelDate){
            scoreData.push(gItem.score);
            break;
          }
          const index = i+1;
          if(index == groupedItem.length){
            scoreData.push("0");
          }
        }
      }
      //console.log('scores combined ----------------------------------------> ', scoreData);
      const tempObj = {
        data: scoreData,
        label: "Me"
      }
      this.lineChartData.push(tempObj)
      // this.lineChartData = [{ data: scoreData, label: "Me"}];     
      this.chartingCanvasLoading = true; 
     // console.log('this.linechartlabels ', this.lineChartLabels)
  }

  sortChartingByEvent(){
    this.chartingCanvasLoading = false;
    this.lineChartData = [];
 //   console.log('selected sort val ', this.selectedSortChartingEventVal);
  //  console.log('sorted data ',this.chartingSortedByLevels );
  //  console.log('label ', this.lineChartLabels);
    const filteredResult = this.chartingSortedByLevels.filter( v => v._id.event === this.selectedSortChartingEventVal);
  //  console.log('Filtered Result ', filteredResult);
    // this.chartingSortedB = this.filterData;
    var tempArr = [],
      scoreData = [],
      groupedItem = [],
      linechartLabel = [];
      filteredResult.forEach(element => {
        for (let i = 0; i < element.groupedItem.length; i++) {
          const gItem = element.groupedItem[i];
        //  console.log("Grouped item " ,gItem);
       //   console.log('line chart labels array ',  this.lineChartLabels);
          groupedItem.push(gItem);
        }
      });
     // console.log('Final res ===> ', groupedItem);
      for (let j = 0; j < this.lineChartLabels.length; j++){
        const labelDate = this.lineChartLabels[j]; 
      //  console.log('date to check ', labelDate);
        for (let i = 0; i < groupedItem.length; i++){
          const gItem = groupedItem[i];
        //  console.log("Grouped item " ,gItem);
          if(moment(gItem.submittedOn).format('MM/DD/YYYY') == labelDate){
            scoreData.push(gItem.score);
            break;
          }
          const index = i+1;
          if(index == groupedItem.length){
            scoreData.push("0");
          }
        }
      }
   //   console.log('scores combined ----------------------------------------> ', scoreData);
      const tempObj = {
        data: scoreData,
        label: "Me"
      }
      this.lineChartData.push(tempObj)
      // this.lineChartData = [{ data: scoreData, label: "Me"}];     
      this.chartingCanvasLoading = true; 
    //  console.log('this.linechartlabels ', this.lineChartLabels)
  }

  // filterScoreTrackingChartByDays(ev){
  //   this.chartingCanvasLoading = false;
  //   this.lineChartData = [];
  //   this.lastNdays = ev.value;
  //   this.lineChartLabels = this.LastNDays(ev.value);
  //   const toPass = {
  //     uid: this.loginuserinfo._id,
  //     days: parseInt(ev.value,10)
  //   }
  // //  console.log('line chart labels array ',  this.lineChartLabels);
  //   this.getChartDataByUid(this.loginuserinfo._id);
  //   // this.objService.getRoutineScoresByUID(toPass.uid).subscribe(data => {
  //   //   console.log('routine scores data =====> ', data);
  //   //   const routineScores = data['data'];
  //   //   this.scoreChartData = data['data'];
  //   //   this.scoreChartSport = this.removeDuplicates(this.scoreChartData, 'sport');
  //   //   this.scoreChartLevel = this.removeDuplicates(this.scoreChartData, 'level');
  //   //   this.scoreChartEvent = this.removeDuplicates(this.scoreChartData, 'event');
  //   //   var tempArr = [],
  //   //   scoreData = [],
  //   //   groupedItem = [],
  //   //   linechartLabel = [];
  //   //   routineScores.forEach(element => {
  //   //     for (let i = 0; i < element.groupedItem.length; i++) {
  //   //       const gItem = element.groupedItem[i];
  //   //       console.log("Grouped item " ,gItem);
  //   //       console.log('line chart labels array ',  this.lineChartLabels);
  //   //       groupedItem.push(gItem);
  //   //     }
  //   //   });
  //   //   console.log('Final res ===> ', groupedItem);
  //   //   for (let j = 0; j < this.lineChartLabels.length; j++){
  //   //     const labelDate = this.lineChartLabels[j]; 
  //   //     console.log('date to check ', labelDate);
  //   //     for (let i = 0; i < groupedItem.length; i++){
  //   //       const gItem = groupedItem[i];
  //   //       console.log("Grouped item " ,gItem);
  //   //       if(moment(gItem.submittedOn).format('MM/DD/YYYY') == labelDate){
  //   //         scoreData.push(gItem.score);
  //   //         break;
  //   //       }
  //   //       const index = i+1;
  //   //       if(index == groupedItem.length){
  //   //         scoreData.push("0");
  //   //       }
  //   //     }
  //   //   }
  //   //   console.log('scores combined ----------------------------------------> ', scoreData);
  //   //   this.lineChartData = [{ data: scoreData, label: "Me"}];     
  //   //   this.chartingCanvasLoading = true; 
  //   //   console.log('this.linechartlabels ', this.lineChartLabels)
  //   // })
  // }

  getChartDataByUid(uid):Promise<any>{
    this.selectedSortChartingSportVal = "";
    this.selectedSortChartingLevelVal = "";
    this.selectedSortChartingEventVal = "";
   return new Promise((resolve, reject) => {
    this.objService.getRoutineScoresByUID(uid).subscribe(data => {
    //  console.log('routine scores data =====> ', data);
      const routineScores = data['data'];
      this.chartingSortedByDays = data["data"];
      this.scoreChartData = data['data'];
      this.scoreChartSport = this.removeDuplicates(this.scoreChartData, 'sport');
      this.scoreChartLevel = this.removeDuplicates(this.scoreChartData, 'level');
      this.scoreChartEvent = this.removeDuplicates(this.scoreChartData, 'event');
      var tempArr = [],
      scoreData = [],
      groupedItem = [],
      linechartLabel = [];
      routineScores.forEach(element => {
        for (let i = 0; i < element.groupedItem.length; i++) {
          const gItem = element.groupedItem[i];
         // console.log("Grouped item " ,gItem);
        //  console.log('line chart labels array ',  this.lineChartLabels);
          groupedItem.push(gItem);
        }
      });
     // console.log('Final res ===> ', groupedItem);
      for (let j = 0; j < this.lineChartLabels.length; j++){
        const labelDate = this.lineChartLabels[j]; 
     //   console.log('date to check ', labelDate);
        for (let i = 0; i < groupedItem.length; i++){
          const gItem = groupedItem[i];
      //    console.log("Grouped item " ,gItem);
          if(moment(gItem.submittedOn).format('MM/DD/YYYY') == labelDate){
            scoreData.push(gItem.score);
            break;
          }
          const index = i+1;
          if(index == groupedItem.length){
            scoreData.push("0");
          }
        }
      }
     // console.log('scores combined ----------------------------------------> ', scoreData);
      const tempObj = {
        data: scoreData,
        label: (uid === this.loginuserinfo._id) ? "Me":groupedItem[0]['addedBy']
      }
      this.lineChartData.push(tempObj)
      // this.lineChartData = [{ data: scoreData, label: "Me"}];     
      this.chartingCanvasLoading = true; 
    //  console.log('this.linechartlabels ', this.lineChartLabels)
      resolve(true);
    })
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

  getTeammatesChartData(){
    this.getTeammatesList().then(data => {
      data.map(requestDetail => {
        this.chartingCanvasLoading = false;
      //  console.log('from map ',requestDetail)
        const teammateId = (requestDetail.UID === this.loginuserinfo._id) ? requestDetail.FID : requestDetail.UID;
        this.getChartDataByUid(teammateId).then(res => {console.log('consoled promise res ', res)})
      });
    })
    // this.objService.getAcceptedByUID(this.loginuserinfo._id).subscribe(response => {
    //   console.log('Accepted users list ', response);
    //   const responseArr = response['response'];
    //   this.usersList = responseArr;
    //   responseArr.map(requestDetail => {
    //     console.log('from map ',requestDetail)
    //     const teammateId = (requestDetail.UID === this.loginuserinfo._id) ? requestDetail.FID : requestDetail.UID;
    //     this.getChartDataByUid(teammateId)
    //   });      
    // })
  }

  getRoutineScoresByUID(uid){
    this.lineChartLabels = this.LastNDays(this.lastNdays);
  //  console.log('line chart labels array ',  this.lineChartLabels);
    this.objService.getRoutineScoresByUID(uid).subscribe(data => {
   //   console.log('routine scores data =====> ', data);
      const routineScores = data['data'];
      this.scoreChartData = data['data'];
      this.scoreChartSport = this.removeDuplicates(this.scoreChartData, 'sport');
      this.scoreChartLevel = this.removeDuplicates(this.scoreChartData, 'level');
      this.scoreChartEvent = this.removeDuplicates(this.scoreChartData, 'event');
      var tempArr = [],
      scoreData = [],
      linechartLabel = [];
      routineScores.forEach(element => {
        for (let i = 0; i < element.groupedItem.length; i++) {
          const gItem = element.groupedItem[i];
      //    console.log("Grouped item " ,gItem);
       //   console.log('line chart labels array ',  this.lineChartLabels);
          for (let j = 0; j < this.lineChartLabels.length; j++) {
            const labelDate = this.lineChartLabels[j];
         //   console.log(`submitted date is -------> ${moment(gItem.submittedOn).format('MM/DD/YYYY')} label date is -------> ${labelDate}`)
            if(moment(gItem.submittedOn).format('MM/DD/YYYY') == labelDate){
              scoreData.push(gItem.score);
            }else{
              scoreData.push("0");
            }
          }
        }
      });
      this.lineChartData = [{ data: scoreData, label: "Me"}];     
      this.chartingCanvasLoading = true; 
   //   console.log('scores combined ----------------------------------------> ', tempArr);
    //  console.log('this.linechartlabels ', this.lineChartLabels)
    })
  }

  getRoutineScoresByUIDAsPromise(uid):Promise<any>{
    return new Promise((resolve, reject) => {
      this.objService.getRoutineScoresByUID(uid).subscribe(response => {
      ///  console.log("PER_RTN ==========> ", response['data']);
        resolve(response['data']);
        // this.bindList(response);
      })
    })
  }

  // compareCharting(ev){
  //   this.chartingCanvasLoading = false;
  //   this.chartCompareValue = "Select";
  // //  console.log('last n days>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', this.LastNDays(7));
  //   if(ev.value == 'Teammates'){
  //     this.getTeammatesChartData();
  //   }
  // }

  toggleFilter(){
    if(this.showEventScoreFilter){
      this.showEventScoreFilter = false;
    }
    else{
      this.showEventScoreFilter = true;
    }
  }

  pushPerformedRoutinesById(uid){
    this.objService.getPerformedRoutinesById(uid).subscribe(response => {
      this.teammatesScoreData.push(response);
     // console.log('PUSHED FOR SCORE ', response);
    })
  }

  pushEventsForAnalytics(uid):Promise<any> {
    return new Promise(resolve => {
      this.objService.getEventsScoreById(uid).subscribe(response => {
        this.teammatesValueData.push(response);
      //  console.log('PUSHED FOR VALUE ', response);
        resolve(response);
      })
    })
  }

  filterEventScoreSummaryByTeammates(ev){
    this.teammatesScoreData = [];
   // console.log('filter score by teammates');
    if(ev.value == "Teammates"){
      this.getEventsScoreByTeammates(this.loginuserinfo._id, 'score');
    }
  }

  // filterEventValueSummaryByTeammates(ev){
  //   this.teammatesValueData = [];
  //  // console.log('filter value by teammates');
  //   if(ev.value == "Teammates"){
  //     this.getUserList(this.loginuserinfo._id, 'value');
  //   }
  // }

  // Get teammate details starts here ----------------
  getUserList(fid, type) {
    this.usersList = [];
    this.objService.getAcceptedByUID(this.loginuserinfo._id).subscribe(response => {
    //  console.log('Accepted users list ', response);
      const responseArr = response['response'];
      this.usersList = responseArr;
      //console.log('teammates list ', this.usersList);
      Promise.all(responseArr.map(requestDetail => {
    //    console.log('from map ',requestDetail)
        const teammateId = (requestDetail.UID === this.loginuserinfo._id) ? requestDetail.FID : requestDetail.UID;
          this.eventsValueSummaryById(teammateId).then(data => {
     //     console.log(`returned response for ${teammateId} ==> `, data);
          this.teammatesValueData.push(data[0]);
        }).catch( err => {
         // console.log(`unable to get details for ${teammateId} `, err);
        })
      })).then(response => {
       // console.log('promise response ', response);
       // console.log('Teammates value summary ', this.teammatesValueData);
        // this.bindList(this.teammatesValueData);
        setTimeout(() => {
          if(type == 'score'){
            this.bindListForEvents(this.teammatesScoreData);
          }else if(type == 'value'){
            this.bindList(this.teammatesValueData);
          }
        }, 2000);
      })
      
    })
  }

  getEventsScoreByTeammates(fid, type) {
    this.usersList = [];
    this.objService.getAcceptedByUID(this.loginuserinfo._id).subscribe(response => {
     // console.log('Accepted users list ', response);
      const responseArr = response['response'];
      this.usersList = responseArr;
      Promise.all(responseArr.map(requestDetail => {
       // console.log('from map ',requestDetail)
        const teammateId = (requestDetail.UID === this.loginuserinfo._id) ? requestDetail.FID : requestDetail.UID;
          this.eventsScoreSummaryById(teammateId).then(data => {
        //  console.log(`returned response for ${teammateId} ==> `, data);
          this.teammatesScoreData.push(data[0]);
        }).catch( err => {
          //console.log(`unable to get details for ${teammateId} `, err);
        })
      })).then(response => {
        //console.log('promise response ', response);
      //  console.log('Teammates score summary ', this.teammatesScoreData);
        // this.bindList(this.teammatesValueData);
        setTimeout(() => {
          if(type == 'score'){
            this.bindListForEvents(this.teammatesScoreData);
          }else if(type == 'value'){
            this.bindList(this.teammatesValueData);
          }
        }, 2000);
      })
      
    })
  }

  getUsersByFID(rdata:string, arr:any[], index, type, length){
   // console.log('users list before FID ', this.usersList);
    this._service.getUserByUserID(rdata['FID']).subscribe(data => {
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
     // console.log('arr.push ', arr);
      if(type == 'score'){
        this.pushPerformedRoutinesById(element._id)
      }else if(type == 'value'){
        this.pushEventsForAnalytics(element._id).then(data => {
          const indexLength = index+1;
          if(indexLength == length){

            //  console.log('ALL DATA FETCHED ULIST', this.usersList);
              if(type == 'score'){
                this.bindListForEvents(this.teammatesScoreData);
              }else if(type == 'value'){
              //  console.log('final teammates val data ', this.teammatesValueData);
                this.bindList(this.teammatesValueData[0]);
              }

          }
        })
      }
    })
  }

  getUsersByUID(rdata:string, arr:any[], index, type){

    // alert(rdata['UID']);
    this._service.getUserByUserID(rdata['UID']).subscribe(data => {
    //  console.log('dataaaaa ', data);
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
    //  console.log('arr.push ', arr);
    })
  }

  // Get teammate details ends here ----------------

  toggleValueFilter(){
    if(this.showEventValueFilter){
      this.showEventValueFilter = false;
    }
    else{
      this.showEventValueFilter = true;
    }
  }

  getEventsForAnalytics(uid) {
    this.objService.getEventsScoreById(uid).subscribe(response => {
    //  console.log('EVENTS RES =====> ', response);
      this.bindListForEvents(response);
    })
  }

  // getEventsForAnalyticsFilterByDays(ev) {
  //   const toPass = {
  //     uid: this.loginuserinfo._id,
  //     days: parseInt(ev.value,10)
  //   }
  //   this.objService.getEventsForAnalyticsFilterByDays(toPass).subscribe(response => {
  //    // console.log('EVENTS RES =====> ', response);
  //     this.bindListForEvents(response);
  //   })
  // }

  // Revised flow starts here ---- 123 --------------------------------------------

  getElementsValueSummary(uid){
 //   console.log(`%c inside getElementsValueSummary - ${uid}`, 'color: green; font-weight: bold');
    let uidToPass = [];
    uidToPass.push(uid);
 //   console.log(`%c uid to pass is ${uidToPass}`, 'color: green; font-weight: bold');
    let body = {
      uid: uidToPass,
      days: this.elemValDaysSelected
    }
   // console.log("passed body ", body);
    this.objService.getElementsValueSummary(body).subscribe(response => {
  //    console.log('response from server ', response);
      this.bindListElements(response);
    })
  }

  bindListElements(objRes) {
    //   console.log("bind list called ", objRes);
       this.dataSource = [];
       this.eventsValueData = objRes;
          // console.log('obj RESSSSSSSSSSSSSSSSs ', objRes);
           this.dataSource = new MatTableDataSource(objRes);           
           this.totalItems = objRes.length;
           this.preIndex = (this.perPage * (this.currentPage - 1));
  }

  

  // getEventsScoreSummary(uid) {
  //   console.log(`%c inside getElementsValueSummary - ${uid}`, 'color: blue; font-weight: bold');
  //   let uidToPass = [];
  //   uidToPass.push(uid);
  //   console.log(`%c uid to pass is ${uidToPass}`, 'color: blue; font-weight: bold');
  //   let body = {
  //     uid: uidToPass,
  //     days: this.eventsScoreDaysSelected
  //   }
  //   console.log("passed body ", body);
  //   this.objService.getEventsScoreById(body).subscribe(response => {
  //    console.log('EVENTS score =====> ', response);
  //    this.eventsScoreDataForCharts = response;

  //   //  draw tracking chart for 7 days --------------------------
  //   console.log('%c last 7 days '+ this.LastNDays(7), 'color: violet; font-weight: bold')
  //    let chartLabels = ['04/6/2019', '04/7/2019', '04/8/2019', '04/9/2019','04/10/2019','04/11/2019','04/12/2019'];
  //    let eventsChartData = [
  //     {
  //       label: 'High Bar',
  //       data: [30,50,90,120,13,null,45]
  //     },
  //     {
  //       label: 'Vault - WGym',
  //       data: [120,13,null,45,30,50,90]
  //     },
  //     {
  //       label: 'Bars',
  //       data: [31,57,94,12,57,86,30]
  //     },
  //     {
  //       label: 'Level 1 Test 2',
  //       data: [55,null,21,77,120,18,60]
  //     }
  //   ];
  //    this.drawChartForEventsScore(this.LastNDays(7), eventsChartData);
  //     this.bindListEvents(response);
  //   })
  // }

  getEventsScoreSummary(uid) {
    this.loadChart = true;
  //  console.log(`%c inside getElementsValueSummary - ${uid}`, 'color: blue; font-weight: bold');
    let uidToPass = [];
    uidToPass.push(uid);
  //  console.log(`%c uid to pass is ${uidToPass}`, 'color: blue; font-weight: bold');
    let body = {
      uid: uidToPass,
      days: this.eventsScoreDaysSelected
    }
   // console.log("passed body ", body);
    this.objService.getEventsScoreById(body).subscribe(response => {
    // console.log('EVENTS score =====> ', response);
    //  if(response.length){

    //  }else{
    //    this.loadChart = false;
    //    this.noDataToDisplay = true;
    //  }
    //  this.eventsScoreDataForCharts = response;
      // this.bindListEvents(response);
      let daysLabel = this.LastNDays(this.eventsChartScoreDaysSelected);
     // console.log('days label ', daysLabel);
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
          // console.log('event ===> ', event);
          event.groupedItem.forEach(item => {
            let tempDate = new Date(item.addedOn)
            let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
            daysLabel.forEach((date, index) => {
              // console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
              if(date == addedOn.toString()){
                // console.log('match found - score is ===> ',item.score);
                dataObj.data[index] = item.score;
              }
              if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
            })
          });
        //  console.log('dataObj is ===========> ', dataObj);
          dataToPass.push(dataObj)
        });
      //  console.log('data to pass ===========> ', dataToPass);
        this.drawChartForEventsScore(daysLabel, dataToPass);
        this.bindListEvents(response);
      }else{
       // console.log('no data to display');
        this.noDataToDisplay = true;
        this.loadChart = false;
      }   
    })
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
    this.eventsChartScoreDaysSelected = parseInt(ev.value,10)
   // console.log('days selected', this.eventsScoreDaysSelected);
    this.fetchDataAndDrawCharts();    
  }

  loadLevelsBySportForCharting(val){
    this.userLevelsForCharting = [];
    this.sportServices.getSportDetailsbyMapping(val).subscribe(
    res=>{
     // console.log('changed sport', res);
      this.userLevelsForCharting = res[0].level;
    },err=>{
            this.errorMessage(err)
    })
  }

  loadEventsForCharting(sport, level){
    this.userEventsForCharting = [];
    this.objService.getEventsBySportLevel(sport, level).subscribe(
      res=>{
       // console.log('changed sport', res);
        res.forEach(element => {
          this.userEventsForCharting.push(element.event);
        });
      },err=>{
              this.errorMessage(err)
      })
  }

  drawChartByLevel(ev){    
    this.eventsChartScoreLevelSelected = ev.value;    
 //   console.log('level selected', this.eventsChartScoreLevelSelected);    
    this.loadEventsForCharting(this.eventsChartScoreSportSelected, this.eventsChartScoreLevelSelected)
    this.fetchDataAndDrawCharts();    
  }

  drawChartBySport(ev){
    this.eventsChartScoreSportSelected = ev.value;
  //  console.log('days selected', this.eventsScoreDaysSelected);
    this.loadLevelsBySportForCharting(this.eventsChartScoreSportSelected);
    this.fetchDataAndDrawCharts();    
  }

  drawChartByEvent(ev){
    this.eventsChartScoreEventSelected = ev.value;
 //   console.log('event selected', this.eventsChartScoreEventSelected);
    this.fetchDataAndDrawCharts();    
  }

  compareCharting(ev){
    this.eventsChartScoreCompareSelected = ev.value;
    if(this.eventsChartScoreCompareSelected == 'Teammates'){
      if(!this.eventsChartScoreSportSelected || !this.eventsChartScoreLevelSelected || !this.eventsChartScoreEventSelected){
        this.chartCriNotMet = true;
        this.loadChart = false;

      }else{
        this.chartCriNotMet = false;
        let teammatesChartingData = [];
        let getTeammatesData = new Promise((resolve, reject) => {
          console.log('inside getTeammatesData Promise');
          this.loadChart = false;
          this.eventsChartLabels = [];
          this.eventsChartData = [];

          let bodyToPass = {};    
          if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
          if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = this.eventsChartScoreDaysSelected; 
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
                bodyToPass['uid'] = [];
                bodyToPass['state'] = this.userState;
                let authUid = [];
                authUid.push(this.loginuserinfo._id)
                bodyToPass['uid'] = authUid;
                break;
              }
            }
          }else{
            bodyToPass['uid'] = [];
            let authUid = [];
            authUid.push(this.loginuserinfo._id);
            bodyToPass['uid'] = authUid;
          }

          // console.log('body to pass ', bodyToPass);
          let daysLabel = this.LastNDays(this.eventsChartScoreDaysSelected);
          this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
      //      console.log('response from server ', response);
            if(response.length){
         //     console.log('teammates data ========> ', response);
              teammatesChartingData = response;
              resolve(response);
            }else{
              reject(response);
            }
          })
        })

        getTeammatesData.then(data => {
          
          var teammatesData = [];
          teammatesData.push(data)
          console.log('teammates data ', teammatesData);
          this.loadChart = false;
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

          // console.log('body to pass ', bodyToPass);
          let daysLabel = this.LastNDays(this.eventsChartScoreDaysSelected);
          this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
           // console.log('response from server ', response);
            if(response.length){
           //   console.log('user charting data ========> ', response);
           //   console.log('teammates charting data ========> ', teammatesData);
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
                  // console.log('event ===> ', event);
                  event.groupedItem.forEach(item => {
                    let tempDate = new Date(item.addedOn)
                    let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                    daysLabel.forEach((date, index) => {
                      // console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                      if(date == addedOn.toString()){
                        // console.log('match found - score is ===> ',item.score);
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
              //  console.log('data to pass ====> ', dataToPass);
                let userDataToPass = [];
                let teammatesDataToPass = [];
                teammatesDataToPass.push(dataToPass);
                response.forEach(event => {
                  let dataObj = {
                    label: "Me",
                    data: []
                  };
                  // dataObj.label = event.event;
                  // console.log('event ===> ', event);
                  event.groupedItem.forEach(item => {
                    let tempDate = new Date(item.addedOn)
                    let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
                    daysLabel.forEach((date, index) => {
                      // console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
                      if(date == addedOn.toString()){
                        // console.log('match found - score is ===> ',item.score);
                        dataObj.data[index] = item.score;
                      }
                      if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
                    })
                  });
                 // console.log('dataObj is ===========> ', dataObj);
                  userDataToPass.push(dataObj);
                  userDataToPass.push(teammatesDataToPass[0]);
                  // userDataToPass = [...userDataToPass[0], ...teammatesDataToPass]
                //  console.log('PASSED CHART DATA ================> ', userDataToPass);
                  this.drawChartForEventsScore(daysLabel, userDataToPass);
                });
              })
            }else{

            }
          })
        })
      }
    }
  }

  fetchDataAndDrawCharts(){
  //  console.log('inside fetch data function');
    this.loadChart = false;
    this.eventsChartLabels = [];
    this.eventsChartData = [];

    let bodyToPass = {};    
    if(this.eventsChartScoreSportSelected) bodyToPass['sport'] = this.eventsChartScoreSportSelected; 
    if(this.eventsChartScoreDaysSelected) bodyToPass['days'] = this.eventsChartScoreDaysSelected; 
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
          bodyToPass['uid'] = [];
          bodyToPass['state'] = this.userState;
          let authUid = [];
          authUid.push(this.loginuserinfo._id)
          bodyToPass['uid'] = authUid;
          break;
        }
      }
    }else{
      bodyToPass['uid'] = [];
      let authUid = [];
      authUid.push(this.loginuserinfo._id);
      bodyToPass['uid'] = authUid;
    }

    // console.log('body to pass ', bodyToPass);
    let daysLabel = this.LastNDays(this.eventsChartScoreDaysSelected);
    // console.log('days label ', daysLabel);
    this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
    //  console.log('response from server ', response);
      if(response.length){
        // draw chart for selected days        
        let dataToPass = [];
        response.forEach(event => {
          let dataObj = {
            label: "",
            data: []
          };
          dataObj.label = event.event;
          // console.log('event ===> ', event);
          event.groupedItem.forEach(item => {
            let tempDate = new Date(item.addedOn)
            let addedOn = tempDate.getMonth()+1 + '/' + tempDate.getDate() + '/' + tempDate.getFullYear()
            daysLabel.forEach((date, index) => {
              // console.log(`index = ${index} addedOn ===========> ${addedOn} date =============> ${date}`);
              if(date == addedOn.toString()){
                // console.log('match found - score is ===> ',item.score);
                dataObj.data[index] = item.score;
              }
              if(dataObj.data[index] == undefined) dataObj.data[index] = null;            
            })
          });
         // console.log('dataObj is ===========> ', dataObj);
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
    this.loadChart = false;
  //  console.log('initial data for charts ', this.eventsScoreDataForCharts)
    this.eventsChartLabels = labels;
    this.eventsChartData = data;
    // this.loadChart = true;
  }

  bindListEvents(objRes) {
    //   console.log("bind list called ", objRes);
       this.eventsDataSource = [];
       this.eventsScoreData = objRes;
          // console.log('obj RESSSSSSSSSSSSSSSSs ', objRes);
           this.eventsDataSource = new MatTableDataSource(objRes);           
           this.totalItems = objRes.length;
           this.preIndex = (this.perPage * (this.currentPage - 1));
  }

  loadLevelsBySportForEvents(val){
    this.userLevelsforEventsScore = [];
    this.sportServices.getSportDetailsbyMapping(val).subscribe(
    res=>{
      console.log('changed sport', res);
      this.userLevelsforEventsScore = res[0].level;
    },err=>{
            this.errorMessage(err)
    })
  }

  filterEventScoreBySport(ev){
    this.eventsScoreSportSelected = ev.value
   // console.log('Sport selected', this.eventsScoreSportSelected);
    this.loadLevelsBySportForEvents(this.eventsScoreSportSelected);
    let bodyToPass = {};
    if(this.eventsScoreSportSelected) bodyToPass['sport'] = this.eventsScoreSportSelected; 
    if(this.eventsScoreDaysSelected) bodyToPass['days'] = this.eventsScoreDaysSelected; 
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
          bodyToPass['uid'] = [];
          bodyToPass['state'] = this.userState;
          let authUid = [];
          authUid.push(this.loginuserinfo._id)
          bodyToPass['uid'] = authUid;
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
    //  console.log('response from server ', response);
      this.bindListEvents(response);
    })
  }

  filterEventsScoreByDays(ev){
    this.eventsScoreDaysSelected = parseInt(ev.value,10)
   // console.log('days selected', this.eventsScoreDaysSelected);
    let bodyToPass = {};
    if(this.eventsScoreSportSelected) bodyToPass['sport'] = this.eventsScoreSportSelected; 
    if(this.eventsScoreDaysSelected) bodyToPass['days'] = this.eventsScoreDaysSelected; 
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
          bodyToPass['uid'] = [];
          bodyToPass['state'] = this.userState;
          let authUid = [];
          authUid.push(this.loginuserinfo._id)
          bodyToPass['uid'] = authUid;
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
  //    console.log('response from server ', response);
      this.bindListEvents(response);
    })
  }

  filterEventScoresByLevel(ev){
    this.eventsScoreLevelSelected = ev.value
  //  console.log('Level selected', this.eventsScoreLevelSelected);
    let bodyToPass = {};
    if(this.eventsScoreSportSelected) bodyToPass['sport'] = this.eventsScoreSportSelected; 
    if(this.eventsScoreDaysSelected) bodyToPass['days'] = this.eventsScoreDaysSelected; 
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
          bodyToPass['uid'] = [];
          bodyToPass['state'] = this.userState;
          let authUid = [];
          authUid.push(this.loginuserinfo._id)
          bodyToPass['uid'] = authUid;
          break;
        }
      }
    }else{
      bodyToPass['uid'] = [];
      let authUid = [];
      authUid.push(this.loginuserinfo._id);
      bodyToPass['uid'] = authUid;
    }

   // console.log('body to pass ', bodyToPass);
    this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
  //    console.log('response from server ', response);
      this.bindListEvents(response);
    })
  }

  getUserMappedSportsLevelsEvents(resUser){   
    this.objService.getUserMappedSportsLevelsEvents(resUser)
    .subscribe(resSport => { 
    //  console.table('response ', resSport)  
      resSport.forEach(element => {
        this.userEvents.push(element.event);
        this.userEventsforEventsScore.push(element.event);
        this.userSports.push(element.sportName);
        this.userSportsForCharting.push(element.sportName);
        this.userSportsforEventsScore.push(element.sportName)
        this.userLevels.push(element.level);
        this.userLevelsforEventsScore.push(element.level);
      });
      this.userEvents = this.userEvents.filter((item, index) =>  this.userEvents.indexOf(item) == index);
      this.userSports = this.userSports.filter((item, index) =>  this.userSports.indexOf(item) == index);
      this.userLevels = this.userLevels.filter((item, index) =>  this.userLevels.indexOf(item) == index);
      this.userSportsForCharting = this.userSportsForCharting.filter((item, index) =>  this.userSportsForCharting.indexOf(item) == index);
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

  filterValuesBySport(ev){
    this.elemValSportSelected = ev.value
 //   console.log('Sport selected', this.elemValDaysSelected);
    this.loadLevelsBySport(this.elemValSportSelected);
    let bodyToPass = {};
    if(this.elemValSportSelected) bodyToPass['sport'] = this.elemValSportSelected; 
    if(this.elemValDaysSelected) bodyToPass['days'] = this.elemValDaysSelected; 
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
          bodyToPass['uid'] = [];
          bodyToPass['state'] = this.userState;
          let authUid = [];
          authUid.push(this.loginuserinfo._id)
          bodyToPass['uid'] = authUid;
          break;
        }
      }
    }else{
      bodyToPass['uid'] = [];
      let authUid = [];
      authUid.push(this.loginuserinfo._id);
      bodyToPass['uid'] = authUid;
    }

//    console.log('body to pass ', bodyToPass);
    this.objService.getElementsValueSummary(bodyToPass).subscribe(response => {
   //   console.log('response from server ', response);
      this.bindListElements(response);
    })
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
      //  console.log('changed sport', res);
        res.forEach(element => {
          this.userEvents.push(element.event);
        });
      },err=>{
              this.errorMessage(err)
      })
  }

  filterValuesByLevel(ev){
    this.elemValLevelSelected = ev.value
    //console.log('Level selected', this.elemValLevelSelected);
    this.loadEvents(this.elemValSportSelected, this.elemValLevelSelected);
    let bodyToPass = {};
    if(this.elemValSportSelected) bodyToPass['sport'] = this.elemValSportSelected; 
    if(this.elemValDaysSelected) bodyToPass['days'] = this.elemValDaysSelected; 
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
          bodyToPass['uid'] = [];
          bodyToPass['state'] = this.userState;
          let authUid = [];
          authUid.push(this.loginuserinfo._id)
          bodyToPass['uid'] = authUid;
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
     // console.log('response from server ', response);
      this.bindListElements(response);
    })
  }

  filterValuesByEvent(ev){
    this.elemValEventSelected = ev.value
  //  console.log('Event selected', this.elemValEventSelected);
    let bodyToPass = {};
    if(this.elemValSportSelected) bodyToPass['sport'] = this.elemValSportSelected; 
    if(this.elemValDaysSelected) bodyToPass['days'] = this.elemValDaysSelected; 
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
          bodyToPass['uid'] = [];
          bodyToPass['state'] = this.userState;
          let authUid = [];
          authUid.push(this.loginuserinfo._id)
          bodyToPass['uid'] = authUid;
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
     // console.log('response from server ', response);
      this.bindListElements(response);
    })
  }

  compareElementsValueSummary(ev){
    this.elemValCompareSelected = ev.value;
    let bodyToPass = {};
    if(this.elemValSportSelected) bodyToPass['sport'] = this.elemValSportSelected; 
    if(this.elemValDaysSelected) bodyToPass['days'] = this.elemValDaysSelected; 
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
          bodyToPass['uid'] = [];
          bodyToPass['state'] = this.userState;
          let authUid = [];
          authUid.push(this.loginuserinfo._id)
          bodyToPass['uid'] = authUid;
          break;
        }
      }
    } else{
      bodyToPass['uid'] = [];
      let authUid = [];
      authUid.push(this.loginuserinfo._id);
      bodyToPass['uid'] = authUid;
    }
  //  console.log('body to pass ', bodyToPass);
    this.objService.getElementsValueSummary(bodyToPass).subscribe(response => {
   //   console.log('response from server ', response);
      this.bindListElements(response);
    })

  }

  compareEventScoreSummary(ev){
    this.eventsScoreCompareSelected = ev.value;
    let bodyToPass = {};
    if(this.eventsScoreSportSelected) bodyToPass['sport'] = this.eventsScoreSportSelected; 
    if(this.eventsScoreDaysSelected) bodyToPass['days'] = this.eventsScoreDaysSelected; 
    if(this.eventsScoreLevelSelected) bodyToPass['level'] = this.eventsScoreLevelSelected; 
    if(this.eventsScoreEventSelected) bodyToPass['event'] = this.eventsScoreEventSelected; 
    if(this.eventsScoreCompareSelected){
      switch(this.eventsScoreCompareSelected)
      {
        case "Teammates": {
        //  console.log('teammates ', this.teammates);
          bodyToPass['uid'] = [];
          bodyToPass['uid'] = this.teammates
          break;
        }
        case "National": {
          bodyToPass['uid'] = [];
          bodyToPass['state'] = this.userState;
          let authUid = [];
          authUid.push(this.loginuserinfo._id)
          bodyToPass['uid'] = authUid;
          break;
        }
      }
    } else{
      bodyToPass['uid'] = [];
      let authUid = [];
      authUid.push(this.loginuserinfo._id);
      bodyToPass['uid'] = authUid;
    }
   // console.log('body to pass ', bodyToPass);
    this.objService.getEventsScoreById(bodyToPass).subscribe(response => {
    //  console.log('response from server ', response);
      this.bindListEvents(response);
    })

  }

  filterPerformedRoutinesByDays(ev){
    this.elemValDaysSelected = parseInt(ev.value,10)
  //  console.log('days selected', this.elemValDaysSelected);
    let bodyToPass = {};
    if(this.elemValSportSelected) bodyToPass['sport'] = this.elemValSportSelected; 
    if(this.elemValDaysSelected) bodyToPass['days'] = this.elemValDaysSelected; 
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
          bodyToPass['uid'] = [];
          bodyToPass['state'] = this.userState;
          let authUid = [];
          authUid.push(this.loginuserinfo._id)
          bodyToPass['uid'] = authUid;
          break;
        }
      }
    }else{
      bodyToPass['uid'] = [];
      let authUid = [];
      authUid.push(this.loginuserinfo._id);
      bodyToPass['uid'] = authUid;
    }

   // console.log('body to pass ', bodyToPass);
    this.objService.getElementsValueSummary(bodyToPass).subscribe(response => {
   //   console.log('response from server ', response);
      this.bindListElements(response);
    })
  }

  // Revised flow ends here --- 456 --------------------------------------------

  eventsValueSummaryById(uid):Promise<any>{
    return new Promise((resolve, reject) => {
      this.objService.getPerformedRoutinesById(uid).subscribe(response => {
      //  console.log("PER_RTN ==========> ", response);
        resolve(response);
        // this.bindList(response);
      })
    })
  }

  eventsScoreSummaryById(uid):Promise<any>{
    return new Promise((resolve, reject) => {
      this.objService.getEventsScoreById(uid).subscribe(response => {
       // console.log("PER_RTN ==========> ", response);
        resolve(response);
        // this.bindList(response);
      })
    })
  }

  getPerformedRoutinesById(uid){
    this.objService.getPerformedRoutinesById(uid).subscribe(response => {
    //  console.log("PER_RTN ==========> ", response);
      // this.performedRoutines = response;

      this.filterDataValueSummarySport = this.removeDuplicates(response, 'sport');
      this.filterDataValueSummaryLevel = this.removeDuplicates(response, 'level');
      this.filterDataValueSummaryEvent = this.removeDuplicates(response, 'event');
      this.bindList(response);
    })
  }

  getSportsDetailsByUsername(uname){
    this.objService.getSportsDetailsByUsername(uname).subscribe(response => {
   //   console.log("sports and levels ====> ", response["data"])
      this.filterData = response["data"];
    }, err => {
     // console.log('error retrieving sports details ', err);
    }, () => {
      // this.getUserList(this.loginuserinfo._id);
    })
  }

  // filterValuesBySport(ev){
  // // //  console.log('events Val ', this.eventsValueData);
  // //   const filteredResult = this.eventsValueData.filter( v => v._id.sport === ev.value);
  // // //  console.log('Filtered Result ', filteredResult);
  // //   this.filteredEventsValData = filteredResult;
  // //   this.dataSource = new MatTableDataSource(this.filteredEventsValData);

  //   console.log('selected sport ', this.elemValSportSelected);
  // }

  filterScoresBySport(ev){
    const filteredResult = this.eventsScoreData.filter( v => v._id.sport === ev.value);
   // console.log('Filtered Result ', filteredResult);
    this.filteredEventsScoreData = filteredResult;
    this.eventsDataSource = new MatTableDataSource(this.filteredEventsScoreData);
  }

  filterScoresByLevel(ev){
    let filteredResultByLevel = [];
    if(this.filteredEventsScoreData.length){
      filteredResultByLevel = this.filteredEventsScoreData.filter( v => v._id.level === ev.value);
    }else{
      filteredResultByLevel = this.eventsValueData.filter( v => v._id.level === ev.value);
    }
    //console.log('Filtered Result ', filteredResultByLevel);
    this.eventsDataSource = new MatTableDataSource(filteredResultByLevel);
  }

  // filterValuesByLevel(ev){
  //   let filteredResultByLevel = [];
  //   if(this.filteredEventsValData.length){
  //     filteredResultByLevel = this.filteredEventsValData.filter( v => v._id.level === ev.value);
  //   }else{
  //     filteredResultByLevel = this.eventsValueData.filter( v => v._id.level === ev.value);
  //   }
  //  // console.log('Filtered Result ', filteredResultByLevel);
  //   this.dataSource = new MatTableDataSource(filteredResultByLevel);
  // }

  // filterValuesByEvent(ev){
  //   let filteredResultByEvent = [];
  //   if(this.filteredEventsValData.length){
  //     filteredResultByEvent = this.filteredEventsValData.filter( v => v._id.event === ev.event);
  //   }else{
  //     filteredResultByEvent = this.eventsValueData.filter( v => v._id.event === ev.event);
  //   }
  // //  console.log('Filtered Result ', filteredResultByEvent);
  //   this.dataSource = new MatTableDataSource(filteredResultByEvent);
  // }

  removeDuplicates(originalArray, prop) {
      var newArray = [];
      var lookupObject  = {};

      for(var i in originalArray) {
        lookupObject[originalArray[i]['_id'][prop]] = originalArray[i];
      }

      for(i in lookupObject) {
          newArray.push(lookupObject[i]);
      }
      return newArray;
  }

  bindList(objRes) {
 //   console.log("bind list called ", objRes);
    this.dataSource = [];
    this.eventsValueData = objRes;
    
   // console.log('Filter data ', this.filterDataValueSummary);
		// console.log(objRes);
        // this.performedRoutines = objRes;
        for (let i = 0; i < objRes.length; i++) {
          const element = objRes[i];
        //  console.log('element from bind list ', element);
          // const highest = Math.max.apply(Math, element.groupedItem)
          const highest = element.groupedItem.reduce((prev, current) => (parseInt(prev.total,10) > parseInt(current.total,10)) ? prev : current);
          const lowest = element.groupedItem.reduce((prev, current) => (parseInt(prev.total,10) < parseInt(current.total,10)) ? prev : current);
        //  console.log('Max val ',highest.total);
          let sum = 0;
          for (let j = 0; j < element.groupedItem.length; j++) {
            const elem = element.groupedItem[j];
            sum += parseInt(elem.total,10)           
          }
          const avg = sum/element.groupedItem.length;
          objRes[i]['highest']=highest.total;
          objRes[i]['lowest']=lowest.total;
          objRes[i]['avg']=Math.round(avg);
        }
       // console.log('obj RESSSSSSSSSSSSSSSSs ', objRes);
        this.dataSource = new MatTableDataSource(objRes);           
        this.totalItems = objRes.length;
        this.preIndex = (this.perPage * (this.currentPage - 1));
    }

    bindListForEvents(objRes) {
    //  console.log("bind list for events called");
      this.eventsDataSource = [];
      this.eventsScoreData = objRes;
      // console.log(objRes);
          // this.performedRoutines = objRes;
          var chartData = [];
          for (let i = 0; i < objRes.length; i++) {
            const element = objRes[i];
            var lineChartData = {
              data: [],
              label: 'sample'
            }
            // const highest = Math.max.apply(Math, element.groupedItem)
            const highest = element.groupedItem.reduce((prev, current) => (parseInt(prev.score,10) > parseInt(current.score,10)) ? prev : current);
            const lowest = element.groupedItem.reduce((prev, current) => (parseInt(prev.score,10) < parseInt(current.score,10)) ? prev : current);
           // console.log('Max val ',highest.score);
            let sum = 0;
            for (let j = 0; j < element.groupedItem.length; j++) {
              lineChartData.data.push(element.groupedItem[j].score);
              // lineChartData.label.push(element.groupedItem[j].addedOn)
              const elem = element.groupedItem[j];
              sum += parseInt(elem.score,10)           
            }
            // console.log('LABEL ', element.groupedItem);
            // lineChartData.label = element._id.event;

          //  console.log('LINE CHART ', lineChartData);
            // this.lineChartData = lineChartData;
            const avg = sum/element.groupedItem.length;
            objRes[i]['highest']=highest.score;
            objRes[i]['lowest']=lowest.score;
            objRes[i]['avg']=Math.round(avg);
          }
         // console.log('obj RESSSSSSSSSSSSSSSSs ', objRes);
          this.eventsDataSource = new MatTableDataSource(objRes);           
          this.totalItems = objRes.length;
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

  getMywalletinfo(){
	   this.walletservice.getWalletInfo(this.loginuserinfo._id).subscribe(res=>{
		 //  console.log(res);
		   if(res.length>0){
			   this.walletObj=res[0];
			   if(this.userRole=='2'){
				   this.judgeData.creditsEarned=Number(this.walletObj.balance);
                   this.judgeData.pendingCredits=Number(this.walletObj.balance);
			   }
			   else if(this.userRole=='3'){
				   this.dashboardData.availableCredit=this.walletObj.balance;
			   }
			   

		   }
		   
	   },err=>{
		   this.errorMessage(err)
	   })
   }
  /** bar hart data */
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['Gymnastics','Irish Dance','Figure Skating','Diving'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Beginner 1'},
    {data: [28, 48, 40, 69, 86, 47, 90], label: 'Beginner 2'}
  ];

  public barChartColors: Array<any> = [
    {backgroundColor: '#2298F1'},
    {backgroundColor: '#DA932C'}, 
    {backgroundColor: '#D65B4A'},
 
]
 
 /**linchart data */
  // public lineChartData:any[] = [
  //   [3,5,8,2,9,10]
  // ];
  public lineChartData:any[] =[
    {data: [12,0,3,0,4,5] , label: "Me"},
    // {data: [3,2,1], label: "Line B"}
  ]
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
  public lineChartLabels:Array<any> = [];
  public lineChartType:string = 'line';

  public lineChartColors: Array<any> = []
 
 getJudgedRoutine(){
  this.routineservice.getJudgedRotineByuser(this.loginuserinfo._id).subscribe(
    res=>{
      //console.log("dashboard",res);
      this.judgedRoutine=res;
      if(this.judgedRoutine.length){
        this.judgeData.judgedRoutine=this.judgedRoutine.length;
        //this.judgeData.creditsEarned=this.judgedRoutine.length * 2;
       // this.judgeData.pendingCredits=this.judgedRoutine.length * 2;

      }
    },err=>{
        this.errorMessage(err);
    }
    
  )
}
getRelibraryCount(){
	this.routineservice.getRelibraryRoutines().subscribe(
      res=>{
        if(res.length){
           this.relibraryCount=res.length;
             /* for (let i = 0; i < res.length; i++) {
               const element = res[i];
              
               if(element.routinestatus === "1")
               this.routineList.push(element);
             } */
        }
        
      },
      err=>{
        this.errorMessage(err);
      })
}
getVerifiedJudgeSportsByjudgeId(username){
	  this.routineservice.getVerifiedJudgeByjudgeId(username).subscribe(
      async (res)=>{
         this.ownsportObj=res;
	     if(this.ownsportObj.length>0){
			  for(let i=0;i<this.ownsportObj.length;i++){
            let temp1=this.ownsportObj[i];
                await this.getJudgeNewRoutineData(temp1);
						  // console.log("getroutinebysportsandlevel",this.routineList)
				
			  }
		 }else{ 
			 
		 }
         //console.log("resssssssssss",res)
      },err=>{
         this.errorMessage(err)
      }
     )
   }
   getJudgeNewRoutineData(tempObject) {
    return new Promise((resolve, reject) => {
      this.routineservice.getroutinebysportsandlevel(tempObject.sportid,tempObject.levelid).subscribe(
        res=>{
    if(res.length>0){
      let temp=[];
     // console.log(res)
      for(let j=0;j<res.length;j++){
       let tempObj=res[j];
        // console.log(tempObj)
         if(tempObj.isResubmitted=='0'){
          if(tempObject.uploadingfor == '1' && tempObj.technician_status && tempObj.technician_status == '0') {
            temp.push(tempObj);
           }
           else if(tempObject.uploadingfor == '2' && tempObj.technician_status && tempObj.technician_status == '2'){
            temp.push(tempObj);
           }
           else if(tempObject.uploadingfor == '3'&& tempObj.technician_status){
            temp.push(tempObj);
           }
           else if(tempObject.uploadingfor == '0'){
            temp.push(tempObj);
           }
            if(j==res.length-1){
             
            //  this.suggestedRoutine = this.suggestedRoutine.concat(temp);
            this.suggestedRoutine = temp
              this.judgeData.newRoutines=this.judgeData.newRoutines+this.suggestedRoutine.length;
            resolve()
          }
         }else{
                         let array=[]
                         let sourceinfo=tempObj.sourceinfo ? tempObj.sourceinfo:[];
                         array=sourceinfo.filter(item=>item.judgeid==this.loginuserinfo._id )
                           
                         // console.log(array)
                          if(array.length==0){
                            if(tempObject.uploadingfor == '1' && tempObj.technician_status && tempObj.technician_status == '0') {
                              temp.push(tempObj);
                             }
                             else if(tempObject.uploadingfor == '2' && tempObj.technician_status && tempObj.technician_status != '0'){
                              temp.push(tempObj);
                             }
                             else if(tempObject.uploadingfor == '3'&& tempObj.technician_status){
                              temp.push(tempObj);
                             }
                             else if(tempObject.uploadingfor == '0'){
                              temp.push(tempObj);
                             }
                            if(j==res.length-1){
                              
                               //   this.suggestedRoutine = this.suggestedRoutine.concat(temp);
                               this.suggestedRoutine = temp;
                                  this.judgeData.newRoutines=this.judgeData.newRoutines+this.suggestedRoutine.length;
                                  resolve()
                              }
                          }else{
                            if(j==res.length-1){
                              
                                 // this.suggestedRoutine = this.suggestedRoutine.concat(temp);
                                 this.suggestedRoutine = temp;
                                  this.judgeData.newRoutines=this.judgeData.newRoutines+this.suggestedRoutine.length;
                                  resolve()
                              }
                          }                   
        }
       
      }
       // this.routineList = this.routineList.concat(res);
     // this.routineList=this.routineList.sort(function(a, b){return Number(b.userinfo.subtype) - Number(a.userinfo.subtype)});
    }
    else{
      resolve()
    }
  },err=>{
    this.errorMessage(err)
 })
  })
   }
getAllRoutine(){
  this.routineservice.getAllRotinebyStatus().subscribe(
    res=>{
      this.routineList=res;
    //  console.log("resssssssssss",res)
    },err=>{
       this.errorMessage(err)
    }
  )
}
getSportList(){
	    this.sportServices.getSportList(1000,1)
    .subscribe(sportres=>{
        
        this.sportlist=sportres.dataList;
      //  console.log(this.sportlist);
    },err=>this.errorMessage(err));
}

getCreditsEarned(){
  if(this.judgeData.judgedRoutine>0){
    return this.judgeData.creditsEarned=this.judgeData.judgedRoutine * 2;
  }else{
    return this.judgeData.creditsEarned;
  }
}
  // events
  public chartClicked(e:any):void {
    //console.log(e);
  }
 
  public chartHovered(e:any):void {
   // console.log(e);
  }
 
  getAccessToken() {
    this.objService.getAccessToken()
      .subscribe((res)=>this.authenticateAnalyticsApi(res),
        err => this.errorMessage(err));
  }

  errorMessage(objResponse:any) {
    Swal("Alert !", objResponse, "info");
  }
  /** fetching Routine Count */
  getRountineCount(){
    /**
     * Routine status
     * status 0-pending
     * status 1-completed
     * status 3-incompleted
     */
    this.routineservice.getRotineByuserId(this.loginuserinfo._id).subscribe(
        res=>{            
              if(res.length){
                  this.dashboardData.totalRountine=res.length.toString();
                  for(let i=0;i<res.length;i++){
                      let temp=res[i];
                      if(temp.routinestatus=='0'){
                          let count=parseInt( this.dashboardData.pendingRoutine)+1
                          this.dashboardData.pendingRoutine=count.toString();
                        //  console.log(this.dashboardData.pendingRoutine);
                      }else if(temp.routinestatus=='1'){
                        let count=parseInt( this.dashboardData.completedRoutine)+1
                        this.dashboardData.completedRoutine=count.toString();
                      }
                      else{
                         // console.log(temp.routinestatus);
                      }
                      if(i==res.length-1){
                       // console.log(this.dashboardData);
                      }
                  }
              }else{
                //console.log("sdssssssss222222222222222222ssssss ress",res);
               }
        },
        err=>{
          this.errorMessage(err)
        })

      /** routine count fetching end here */

      /**
     * fetching teammate count
     * Teammate status
     * status 0-pending
     * status 2-completed
     */
      this.teammateservice.getTeamMateByUID(this.loginuserinfo._id).subscribe(
        response=>{
              if(response.reqData){
                let res=response.reqData
                if(res.length){
                   
                    for(let i=0;i<res.length;i++){
                       let temp=res[i];
                       if(temp.status=='0'){
                          let count=parseInt(this.dashboardData.pendingRequested)+1
                          this.dashboardData.pendingRequested=count.toString();
                       }
                       else if(temp.status=='2'){
                         let count=parseInt(this.dashboardData.connecteduser)+1
                         this.dashboardData.connecteduser=count.toString();
                       }
                       else{
                         //console.log(temp.status);
                       }

                       if(i==res.length-1){
                        // console.log("sdssssssssssssss",this.dashboardData);
                       }
                    }
                }else{
                // console.log("sdssssssss2222222200000000000000000002222222222ssssss ress",res);
                }

              }             
         },err=>{
             this.errorMessage(err)
         })

         this.teammateservice.getRequestsByFID(this.loginuserinfo._id).subscribe(
          response=>{
            if(response.reqData){
              let res=response.reqData
              if(res.length){
                 
                  for(let i=0;i<res.length;i++){
                     let temp=res[i];
                     if(temp.status=='0'){
                        let count=parseInt(this.dashboardData.pendingRequested)+1
                        this.dashboardData.pendingRequested=count.toString();
                     }
                     else if(temp.status=='2'){
                       let count=parseInt(this.dashboardData.connecteduser)+1
                       this.dashboardData.connecteduser=count.toString();
                     } else{
                      // console.log(temp.status);
                     }

                     if(i==res.length-1){
                      // console.log("sdssssssss222222222222222222ssssss",this.dashboardData);
                     }
                  }
              }else{
              // console.log("sdsssss211111111111111111111111122222222ssssss ress",res);
              }
             }              
           },err=>{
               this.errorMessage(err)
           })
        /** teammate count fetching end here */
}

remit(){
  this.router.navigate(['/wallet'])
}

  getuserDashboarddata(){
   this.dashboardData=this.objService.getDashBoarddata()
   //console.log("this.dashboardDatathis.dashboardDatathis.dashboardDatathis.dashboardData",this.dashboardData)
  }
  authenticateAnalyticsApi(res:DashboardResponseModel) {
    let pollingInterval:number = 1000;//1 min default
    if (res.analyticsData)
      this.viewId = res.analyticsData.analyticsViewID;
      
    gapi.analytics.auth.authorize({
      'serverAuth': {
        'access_token': res.token.access_token
      }
    });
    if (res.analyticsData.pollingInterval)
      pollingInterval = res.analyticsData.pollingInterval;
    this.pollRealTimeData = setInterval(()=> {
      this.getActiveUser(res.token.access_token);
    }, pollingInterval);
  }


  getActiveUser(accessToken:string) {
    let queryParam:string = "";
    queryParam += "ids=ga:" + this.viewId;
    queryParam += "&metrics=rt:activeUsers";
    queryParam += "&access_token=" + accessToken;
    this.objService.queryGoogleRealtimeApi(queryParam)
      .subscribe(res => {
          if (res.rows && res.rows.length > 0) {
            this.activeUserCount = res.rows[0][0];
            if (this.activeUserCount == this.prevCount)
              this.activeClass = "";
            else
              this.activeClass = this.activeUserCount > this.prevCount ? 'fa-caret-up' : 'fa-caret-down';
            this.prevCount = this.activeUserCount;
          }
          else {
            this.activeUserCount = 0;
            this.activeClass = "";
          }
        },
        err=> {
         // console.log(err.error.message);
        }
      );
  }

  ngOnDestroy() {
    if (this.pollRealTimeData)
      clearInterval(this.pollRealTimeData);
  }
}