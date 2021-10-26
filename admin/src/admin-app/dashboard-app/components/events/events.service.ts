import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {EventdataModel} from './events.model';
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
export class EventsService {
    faqapi:string = "faq";
    faqapilist:string="faqlist/user";
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
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }

    
    formatdate(date){
		//console.log("formatdate",date,new Date(date))
        return moment(new Date(date)).format('YYYY-MM-DD').toString();
      }
  saveEventMeet(eventObject:EventdataModel){
   // console.log(eventObject.start,eventObject.end)
	if(eventObject.start!=undefined){
		eventObject.start=this.formatdate(eventObject.start)+"T00:00:00";
        eventObject.end=this.formatdate(eventObject.end)+"T23:59:59";
	//	 console.log(eventObject)
		 let body=JSON.stringify(eventObject);
	//	 console.log(body)
		 return this._http.post(API_URL + this.eventMeetapi, body)
		 .pipe(
			 catchError(this.handleError) 
		 );
	  }
     
        
 }
 saveEventList(eventObject){
     let body=JSON.stringify(eventObject);
    
     return this._http.post(API_URL + this.eventlistapi, body)
     .pipe(
         catchError(this.handleError)
     );
 }
 RemoveEventList(eventObject,id){
    let body=JSON.stringify(eventObject);
 
    return this._http.post(API_URL + this.removeEventList+'/'+id, body)
    .pipe(
        catchError(this.handleError)
    );
}

 saveUserEventList(eventObject){
    let body=JSON.stringify(eventObject);
   
    return this._http.post(API_URL + "usereventlist", body)
    .pipe(
        catchError(this.handleError)
    );
}

 updateEventList(eventObject){
 
     eventObject.start=this.formatdate(eventObject.start)+"T00:00:00";
     eventObject.end=this.formatdate(eventObject.end)+"T23:00:00";
        
     let body=JSON.stringify(eventObject);
   
    return this._http.put(API_URL + "eventsportlistbyevent" + '/' + eventObject._id, body)
    .pipe(
        catchError(this.handleError)
    );
}

deleteEvent(eventObject){
    let body=JSON.stringify(eventObject);
   
    return this._http.patch(API_URL + "eventsportlistbyevent" + '/' + eventObject.title, body)
    .pipe(
        catchError(this.handleError)
    );
}

  getEventList(){
     
     return this._http.get(API_URL + this.eventMeetapi)
     .pipe(
         catchError(this.handleError)
     );
 }
getfutureevntbyuserid(userid){
	 return this._http.get(API_URL + "getfutureevntbyuserid"+'/'+userid)
     .pipe(
         catchError(this.handleError)
     );
}
 getevntbyuseridandeventid(userid,evenid){
	 return this._http.get(API_URL + "getevntbyuseridandeventid"+'/'+userid+'/'+evenid)
     .pipe(
         catchError(this.handleError)
     );
 }
 getEventMeetListByuserId(userid:string){
     return this._http.get(API_URL + this.eventMeetlistapi+"/"+userid)
     .pipe(
         catchError(this.handleError)
     );
 }
 getEventListByevent(event:string){
     return this._http.get(API_URL + this.eventlistbyeventapi+"/"+event)
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
