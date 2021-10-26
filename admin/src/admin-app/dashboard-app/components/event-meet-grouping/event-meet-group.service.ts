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
import { RegisterUserModel } from '../user-management/user.model';
@Injectable()
export class EventMeetGroupService {
    
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
   
    
    getLowerEventMeet(){
     
        return this._http.get(API_URL + 'eventmeetlower')
        .pipe(
            catchError(this.handleError)
        );
    }
    getMappedCompetitorsForeventmeet(eventId) {
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('eventId', eventId);
             
        return this._http.get(API_URL + "getMappedCompetitorsForeventmeet", {params: query} )
        .pipe(
            catchError(this.handleError)
        );
    }
    getJudgesSport(username:string){
        return this._http.get<RegisterUserModel>(API_URL + 'user/judge/' + username)
        .pipe(
            catchError(this.handleError)
        );
    }
    getEventmeetGroupByeventId(eventId){
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('eventId', eventId);
             
        return this._http.get(API_URL + "geteventmeetgroupByeventId", {params: query} )
        .pipe(
            catchError(this.handleError)
        );
    } 
    saveEventMeetGroup(body)  {
        return this._http.post(API_URL +"eventmeetgroup",body)
        .pipe(
            catchError(this.handleError)
        );
    }
    removeEventMeetGroup(body){
        return this._http.post(API_URL +"removeeventmeetgroup",body)
        .pipe(
            catchError(this.handleError)
        );  
    }
    getUserSportInfoForEventMeetSport(uid,sid){
        return this._http.get(API_URL + 'getUserSportInfoForEventMeetSport/' + uid+'/'+sid)
        .pipe(
            catchError(this.handleError)
        );
    }

 getAllCompetitor(){
     
    return this._http.get(API_URL + 'getAllCompetitorForMap')
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

}
