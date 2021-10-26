import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {UserModel, UserResponse} from '../user-management/user.model';

import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import { Subject } from 'rxjs/Subject';
import {Config} from "../../../shared/configs/general.config";
import {API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';
import { XhrService } from '../../../shared/services/xhr.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class TeammateRoutineService {
    apiRoutesStatus:string="routinestatus";
    constructor(private xhrService: XhrService, private _http:HttpClient, private fileService:FileOperrationService) {
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }
    getRankingForEventMeetlevel(lid,eventMeetId) {
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('lid', lid.toString());
        query = query.append('eventMeetId', eventMeetId.toString());  
        return this._http.get(API_URL+"getRankingForEventMeetlevel",{params:query})
        .pipe(
            catchError(this.handleError)
      
            );
    }
    getRankingbyEventLevel(lid,eid,eventMeetId){
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('lid', lid.toString());
        query = query.append('eid', eid.toString());  
        query = query.append('eventMeetId', eventMeetId.toString());  
        return this._http.get(API_URL+"getRankingbyEventLevel",{params:query})
        .pipe(
            catchError(this.handleError)
      
            );
    } 
    getTeammateRoutines(perPage,currentPage) {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        return this._http.get(API_URL + "getTeammateRoutines",{params: queryString} )
            .pipe(
                catchError(this.handleError)
            );
    }
    getRoutinebyroutinestatusid(rid){
        return this._http.get(API_URL + this.apiRoutesStatus + "/" + rid)
        .pipe(
            catchError(this.handleError)
        );
    }

   


    handleError(error: HttpErrorResponse) {
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
          return new ErrorObservable(error.error.message ? error.error.message :
            'Something bad happened; please try again later.');
    }

}
