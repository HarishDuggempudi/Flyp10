import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Config} from "../../../shared/configs/general.config";
import {API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';
import { XhrService } from '../../../shared/services/xhr.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import * as moment from 'moment';
@Injectable()
export class EventMeetJudgeMappingService {
    
    apiRoutes:string = "routines";
    progressObserver:any;
    progress:any;
    apiuserRoutine="routine/user"
    public loginuserinfo:any={};
	eventMeetapi:string ="eventsportmeet";
	eventlistapi:string="eventlist";
	eventlistbyeventapi="eventsportlistbyevent";
    eventMeetlistapi:string="eventsportmeetuser";
    removeEventList:string='/removeeventlist';
    constructor(private xhrService: XhrService, private _http:HttpClient, private fileService:FileOperrationService) {
        
    }
   
    
   
    getEventMeetByuserid(userid):Observable < any> {
        // Initialize Params Object
        return this._http.get(API_URL + "getEventMeetbyuserid/"+userid )
            .pipe(
                catchError(this.handleError)
            );
    }
    getSanctionEventMeet(memberid):Observable < any> {
        // Initialize Params Object
        return this._http.get(API_URL + "eventmeetsformapbymemberid/"+memberid )
            .pipe(
                catchError(this.handleError)
            );
    }
    getUSAGMember(userid) {
        
        return this._http.get(API_URL+'getUSAGverificationMemberID/'+userid)
        .pipe(catchError(this.handleError))
    }
    getEventMeet(id){
		return this._http.get(API_URL +"eventmeet/"+id)
            .pipe(
                catchError(this.handleError)
            );
    }
  
    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
           // console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
     
          }
          // return an ErrorObservable with a user-facing error message
          return new ErrorObservable(error.error.message ? error.error.message :
            'Something bad happened; please try again later.');
    }
    getSanctionJudges(sanctionid){
        return this._http.get(API_URL +"getSanctionJudges/"+sanctionid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getJudgesPanelForSports(sportid){
        return this._http.get(API_URL +"getUSAGSportJudgePanel/"+sportid)
        .pipe(
            catchError(this.handleError)
        );
    }
    swapJudgesForEventmeetByEventLevel(data) {
        return this._http.post(API_URL +"swapJudgesForEventmeetByEventLevel",data)
        .pipe(
            catchError(this.handleError)
        );
    }
    getScoreCalculationbySportLevelEvent(data) {
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('sportId', data.sportId);
        query = query.append('levelId', data.levelId);  
        query = query.append('eventId', data.eventId);  
       
        return this._http.get(API_URL +"getScoreCalculationbySportLevelEvent", {params: query} )
        .pipe(
            catchError(this.handleError)
        );
    }
    getEventMeetJudgePanel(data) {
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('sportId', data.sportId);
        query = query.append('levelId', data.levelId);  
        query = query.append('eventId', data.eventId);  
        query = query.append('eventmeetId', data.eventmeetId);  
        return this._http.get(API_URL +"eventmeetJudgesBypanel", {params: query} )
        .pipe(
            catchError(this.handleError)
        );
    }
    getJudgesbySportAndLevel(sportid):Observable < any>{
        return this._http.get<any>(API_URL + 'getJudgesbySportAndLevel/'+sportid)
        .pipe(
            catchError(this.handleError)
        );
    }
        saveEventmeetJudgesBypanel(data) {
            return this._http.post<any>(API_URL + 'eventmeetJudgesBypanel',data)
            .pipe(
                catchError(this.handleError)
            );
        }

}
