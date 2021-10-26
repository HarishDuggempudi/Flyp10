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
@Injectable()
export class USAGRoutineService {
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
    getQueueRoutine(eventmeetId,perPage:number, currentPage:number, roleName?:string):Observable <JudgesResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        
        if(roleName)
            queryString = queryString.append('role', roleName);
        return this._http.get<JudgesResponse>(API_URL + 'eventmeetQueueRoutine/'+eventmeetId, {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }

    getAllnewRoutine(perPage:number, currentPage:number, eventMeetId,roleName?:string):Observable <JudgesResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        if(roleName)
            queryString = queryString.append('role', roleName);
        return this._http.get<JudgesResponse>(API_URL + 'newRoutine/'+eventMeetId, {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }
    getUSAGMember(userid) {
        
        return this._http.get(API_URL+'getUSAGverificationMemberID/'+userid)
        .pipe(catchError(this.handleError))
    }
    updateFinalScorewithNeutralDeduction(data) {
        return this._http.patch(API_URL+'updateFinalScorewithNeutralDeduction/'+data.routineId,data)
        .pipe(catchError(this.handleError))

    }
    getSanctionEventMeet(memberid):Observable < any> {
        // Initialize Params Object
               
        return this._http.get(API_URL + "eventmeetsbymemberid/"+memberid )
            .pipe(
                catchError(this.handleError)
            );
    }
    getSanctionEventMeetRoutines(perPage:number, currentPage:number,eventMeetId){
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        return this._http.get(API_URL + "getSanctionEventMeetRoutines/"+eventMeetId,{params: queryString} )
            .pipe(
                catchError(this.handleError)
            );
    }

    getusagjudgedRoutine(perPage:number, currentPage:number, memberid,roleName?:string):Observable <JudgesResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        if(roleName)
            queryString = queryString.append('role', roleName);
        return this._http.get<JudgesResponse>(API_URL + 'usagjudgedRoutine/'+memberid, {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }
    deleteRoutineCommentsJudge(data) {
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('judgePanelId', data.judgePanelId);
        query = query.append('judgeId', data.judgeId);
        query = query.append('routineId', data.routineId);  
        return this._http.get(API_URL +"RoutineCommentsForJudge", {params: query} )
        .pipe(
            catchError(this.handleError)
        );
    }
    judgeRoutineComment(data){
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('judgePanelId', data.judgePanelid);
        query = query.append('judgeId', data.judgeId);
        query = query.append('routineId', data.routineId);  
        return this._http.get(API_URL +"judgeRoutineComment", {params: query} )
        .pipe(
            catchError(this.handleError)
        );
    }
    updateJudgeQueue(data) {
     
        return this._http.post(API_URL +"updateJudgeQueue", data )
        .pipe(
            catchError(this.handleError)
        );
    }
    addJudgesQueue(data) {
     
        return this._http.post(API_URL +"addJudgesQueue", data )
        .pipe(
            catchError(this.handleError)
        );
    }
    updateRoutineStatus(routineId) {
     
        return this._http.get(API_URL +"updateroutinestatus/"+routineId ,{} )
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
