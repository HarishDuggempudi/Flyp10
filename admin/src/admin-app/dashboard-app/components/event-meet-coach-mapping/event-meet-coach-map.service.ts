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
export class EventMeetCoachMappingService {
    
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
    getEventMeet(id){
		return this._http.get(API_URL +"eventmeet/"+id)
            .pipe(
                catchError(this.handleError)
            );
    }
    
    getEventMeetCoachMappingList(eventId) {
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('eventId', eventId.toString());
             
        return this._http.get(API_URL + "eventmeetcoachmapping", {params: query} )
        .pipe(
            catchError(this.handleError)
        );
    }
    getEventMeetByuserid(userid):Observable < any> {
        // Initialize Params Object
        return this._http.get(API_URL + "eventmeetsformapbyuserid/"+userid )
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
    
    removeEventMeetCoachMapping(userId,eventId)  {
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('userId', userId.toString());
        query = query.append('eventId', eventId.toString());    
        return this._http.get(API_URL +"removeeventmeetcoachmapping",{params: query})
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

    getCompetitorsByEventmeetSanction(sanctionid) {
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('sanctionid', sanctionid);
             
        return this._http.get(API_URL + "getCompetitorsByEventmeetSanction", {params: query} )
        .pipe(
            catchError(this.handleError)
        );
    }
    saveEventMeetCoachMapping(body)  {
        return this._http.post(API_URL +"eventmeetcoachmapping",body)
        .pipe(
            catchError(this.handleError)
        );
    }
  getEventList(){
     
     return this._http.get(API_URL + 'eventmeetsformap')
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
