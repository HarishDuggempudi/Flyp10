import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {RoutineModel,RoutineResponse,RoutineComment} from '../routine.model';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Config} from "../../../../shared/configs/general.config";
import {API_URL} from "../../../../shared/configs/env.config";
import {FileOperrationService} from '../../../../shared/services/fileOperation.service';
import { XhrService } from '../../../../shared/services/xhr.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserResponse, JudgesResponse } from '../../user-management/user.model';
import { MeetResponse } from '../../events-meet/event-meet-model';
@Injectable()
export class AdminRoutineService {
    apiRoute:string = "routine";
    apiRoutes:string = "routines";
    apiRoutesStatus:string="routinestatus";
    apiroutesJudge:string="judgeroutines";
    apicommentpost:string="routinecomment";
    apicommentRoutes:string="userroutinescomment";
    apibannerRoute:string="banner";
    progressObserver:any;
    progress:any=0;
    apiuserRoutine="routine/user";
    apiroutinestatus:string="routinebystatus";
    progressSource = new BehaviorSubject<number>(0);
    uploadingVideo:boolean = false;
    constructor(private xhrService: XhrService, private _http:HttpClient, private fileService:FileOperrationService) {
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }


    getAllnewRoutine(perPage:number, currentPage:number, type,roleName?:string):Observable <JudgesResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        queryString = queryString.append('type',type );
        if(roleName)
            queryString = queryString.append('role', roleName);
        return this._http.get<JudgesResponse>(API_URL + 'newRoutine', {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }
    getAlljudgedRoutine(perPage:number, currentPage:number,type, roleName?:string):Observable <JudgesResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        queryString = queryString.append('type',type );
        if(roleName)
            queryString = queryString.append('role', roleName);
        return this._http.get<JudgesResponse>(API_URL + 'judgedRoutine', {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }

    getStartedEventMeet(perPage:number, currentPage:number,type, roleName?:string):Observable <MeetResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        queryString = queryString.append('type',type );
        if(roleName)
            queryString = queryString.append('role', roleName);
        return this._http.get(API_URL + 'startedeventmeet', {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }
    getJudgedEventMeetRoutines(perPage:number, currentPage:number,eventmeetId:string):Observable <JudgesResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        
        
        return this._http.get<JudgesResponse>(API_URL + 'getJudgedEventMeetRoutines/'+eventmeetId, {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }
    getQueueRoutine(perPage:number, currentPage:number, roleName?:string):Observable <JudgesResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        
        if(roleName)
            queryString = queryString.append('role', roleName);
        return this._http.get<JudgesResponse>(API_URL + 'eventmeetQueueRoutine', {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }
    getRoutineJudges(routineid){
        
        return this._http.get(API_URL +"getRoutineJudges/"+routineid )
        .pipe(
            catchError(this.handleError)
        );
    }

    getAllassignedRoutine(perPage:number, currentPage:number, roleName?:string):Observable <JudgesResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        if(roleName)
            queryString = queryString.append('role', roleName);
        return this._http.get<JudgesResponse>(API_URL + 'assignedRoutine', {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }
    getAllinCompleteRoutine(perPage:number, currentPage:number, roleName?:string):Observable <JudgesResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        if(roleName)
            queryString = queryString.append('role', roleName);
        return this._http.get<JudgesResponse>(API_URL + 'inCompleteRoutine', {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }
    getAllinAppeopriateRoutine(perPage:number, currentPage:number, roleName?:string):Observable <JudgesResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        if(roleName)
            queryString = queryString.append('role', roleName);
        return this._http.get<JudgesResponse>(API_URL + 'inAppeopriateRoutine', {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }
    getRotineByuserId(userid:string) {
        return this._http.get<RoutineModel>(API_URL + this.apiuserRoutine + "/" + userid)
            .pipe(
                catchError(this.handleError)
            );
    }
    getRelibraryRoutines(){
        return this._http.get<RoutineModel>(API_URL + "getpremiumuserroutine" )
        .pipe(
            catchError(this.handleError)
        );
    }
    uploadjudgedRoutine(objTemp:any):Observable < any> {
        let body = JSON.stringify(objTemp);
        return this._http.post(API_URL +"/uploadjudgedRoutine", body)
            .pipe(
                catchError(this.handleError)
            );
    }

    deleteRoutine(objTemp:RoutineModel):Observable < any> {
        let body = JSON.stringify(objTemp);
        return this._http.patch(API_URL + this.apiRoutes + "/" + objTemp._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
    getRoutinebyroutineid(rid){
        return this._http.get<RoutineModel>(API_URL + this.apiRoutes + "/" + rid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getRoutineCommentbyroutineid(rid:string){
        return this._http.get<RoutineComment>(API_URL + this.apicommentRoutes + "/" + rid)
        .pipe(
            catchError(this.handleError)
        );
    } 
    getJudgedRotineByuser(userid:string) {
        return this._http.get<RoutineModel>(API_URL + this.apiroutesJudge + "/" + userid)
            .pipe(
                catchError(this.handleError)
            );
    } 
    getAllRotinebyStatus() {
        return this._http.get<RoutineModel>(API_URL + this.apiroutinestatus+'/'+'0')
            .pipe(
                catchError(this.handleError)
            );
    }
    getRoutinebyroutinestatusid(rid){
        return this._http.get<RoutineModel>(API_URL + this.apiRoutesStatus + "/" + rid)
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
