import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {API_URL} from "../../../shared/configs/env.config";
import {DashboardModel,DashboardResponseModel} from "./dashboard.model";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { HttpErrorResponse, HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators/catchError";
import {Config} from "../../../shared/configs/general.config";
import {RegisterUserModel} from "../user-management/user.model";
import {RoutineService} from '../my-routines/routines.service';
import * as moment from 'moment';
import { SportComponent } from "../sport/sport.component";
declare var gapi:any;

@Injectable()

export class DashboardService {
    accessTokenApiRoute:string = "google/accesstoken";
    realTimeApiRoute:string = "https://content.googleapis.com/analytics/v3/data/realtime?";
    dashborddetail:DashboardModel=new DashboardModel()
    public loginuserinfo:any={};	
    constructor(private _http:HttpClient,private routineservice:RoutineService) {
        let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
        this.loginuserinfo=userInfo;     
       // this.getRountineCount();
       // console.log("asssssssssssssssssssssssssssssssssss",this.loginuserinfo._id,this.dashborddetail)
    }
	
    getAccessToken():Observable<DashboardResponseModel> {
        return this._http.get<DashboardResponseModel>(API_URL + this.accessTokenApiRoute)
        .pipe(
            catchError(this.handleError)
        );
    }

    getPerformedRoutinesById(body){
        const bodyToPass = JSON.stringify(body)
        return this._http.post(API_URL+'getElementsValueSummary/', bodyToPass)
        .pipe(
            catchError(this.handleError)
        );
    }

    getUserMappedSportsLevelsEvents(uid){
        // const bodyToPass = JSON.stringify(body)
        const body = {
            uid: uid
        }
        return this._http.post(API_URL+'getUserMappedSportsLevelsEvents/', body)
        .pipe(
            catchError(this.handleError)
        );
    }

    getEventsBySportLevel(sport, level){
        // const bodyToPass = JSON.stringify(body)
        const body = {
            sport: sport,
            level: level
        }
        return this._http.post(API_URL+'getEventsBySportLevel/', body)
        .pipe(
            catchError(this.handleError)
        );
    }

    getUserDetails(uid){
        return this._http.get(API_URL+'user/'+uid)
        .pipe(
            catchError(this.handleError)
        );
    }

    getElementsValueSummary(body){
        const bodyToPass = JSON.stringify(body)
        return this._http.post(API_URL+'getElementsValueSummary/', bodyToPass)
        .pipe(
            catchError(this.handleError)
        );
    }

    getEventsScoreById(body){
        // const body = {
        //     uid: uid
        // }
        return this._http.post(API_URL+'eventsScoreById', body)
        .pipe(
            catchError(this.handleError)
        );
    } 

    filterByDateJudgedRoutineByUid(data){
        const body = {
            uid: data.uid,
            days: data.days
        }
        return this._http.post(API_URL+'filterByDateJudgedRoutineByUid', body)
        .pipe(
            catchError(this.handleError)
        );
    }

    updateFields(){
        return this._http.post(API_URL+'updateObjectId',{})
    }

    filterTrackingChartByDaysAndUid(data){
        const body = {
            uid: data.uid,
            days: data.days
        }
        return this._http.post(API_URL+'filterTrackingChartByDaysAndUid', body)
        .pipe(
            catchError(this.handleError)
        );
    }

    getAcceptedByUID(uid){
        return this._http.get(API_URL+'acceptedByUID/'+uid)
        .pipe(
            catchError(this.handleError)
        );
    }

    getRoutineScoresByUID(uid){
        return this._http.get(API_URL+'routineScoresByUID/'+uid)
        .pipe(
            catchError(this.handleError)
        );
    }

    // getSportsDetailsByUsername(uname){
    //     return this._http.post(API_URL+'filterByDateJudgedRoutineByUid/'+uname)
    //     .pipe(
    //         catchError(this.handleError)
    //     );
    // }

    getSportsDetailsByUsername(uname){
        return this._http.post(API_URL+'sportDetailsByUsername/'+uname, {})
        .pipe(
            catchError(this.handleError)
        );
    }

    getEventsForAnalyticsFilterByDays(data){
        const body = {
            uid: data.uid,
            days: data.days
        }
        return this._http.post(API_URL+'getEventsForAnalyticsFilterByDays', body)
        .pipe(
            catchError(this.handleError)
        );
    }

    queryGoogleApi(params:any) {
        return new Promise((resolve, reject) => {
            var data = new gapi.analytics.report.Data({query: params});
         //   console.log('google api ', data);
            data.once('success', function (response: any) {
                resolve(response);
            })
                .once('error', function (response: any) {
                    reject(response);
                })
                .execute();
        });
    }

    queryGoogleRealtimeApi(params:any):Observable<any> {
        return this._http.get(this.realTimeApiRoute + params)
            .pipe(
                catchError(this.handleError)
            );
    }

     getDashBoarddata(){
         return this.dashborddetail;
     }
    /**
     * Routine status
     * status 0-pending
     * status 1-completed
     * status 3-incompleted
     */
    getRountineCount(){
        this.routineservice.getRotineByuserId(this.loginuserinfo._id).subscribe(
            res=>{            
                  if(res.length){
                      this.dashborddetail.totalRountine=res.length.toString();
                      for(let i=0;i<res.length;i++){
                          let temp=res[i];
                          if(temp.routinestatus=='0'){
                              let count=parseInt( this.dashborddetail.pendingRoutine)+1
                              this.dashborddetail.pendingRoutine=count.toString();
                          }else if(temp.routinestatus=='1'){
                            let count=parseInt( this.dashborddetail.completedRoutine)+1
                            this.dashborddetail.completedRoutine=count.toString();
                          }
                          else{
                             // console.log(temp.routinestatus);
                          }
                      }
                  }
            },
            err=>{
                catchError(this.handleError)
            }
          )
    }
    handleError(error: HttpErrorResponse) {
     //   console.log("Http Error Response", error)
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error.message}`);
          }
          // return an ErrorObservable with a user-facing error message
          return new ErrorObservable(error.error.message? error.error.message : 'Something bad happened; please try again later.');
    }

}