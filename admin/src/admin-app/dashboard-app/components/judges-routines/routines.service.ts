import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {RoutineModel,RoutineResponse,RoutineComment} from './routine.model';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Config} from "../../../shared/configs/general.config";
import {API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';
import { XhrService } from '../../../shared/services/xhr.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class RoutineService {
    apiRoute:string = "routine";
    apiRoutes:string = "routines";
    apiRoutesStatus:string="routinestatus";
    apiroutesJudge:string="judgeroutines";
    apicommentpost:string="routinecomment";
    apicommentRoutes:string="userroutinescomment";
    apiroutinestatus:string="routinebystatus";
	apigetVerifiedJudge:string="getVerifiedsports"
    progressObserver:any;
	apiroutinebyspl:string="getroutinebysportsandlevel";
    progress:any;
    apiuserRoutine="routine/user"
    constructor(private xhrService: XhrService, private _http:HttpClient, private fileService:FileOperrationService) {
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }
	   getRelibraryRoutines(){
        return this._http.get<RoutineModel>(API_URL + "getpremiumuserroutine" )
        .pipe(
            catchError(this.handleError)
        );
    }
    getUserByUserID(uid){
        return this._http.get(API_URL + 'user' + "/" + uid)
            .pipe(
                catchError(this.handleError)
            );
    }
    uploadRoutine(routineObj:RoutineModel, file:File):Observable<any> {
         // console.log(routineObj,file);

        return Observable.create((observer: any) => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();

            formData.append('documentName', file);
            formData.append('data', JSON.stringify(routineObj));
            // console.log(formData)
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(JSON.parse(xhr.response));
                        //console.log(xhr.response);
                    }
                }
            };
            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);
                //this.progressObserver.next(this.progress);
            };
            xhr.open('POST', API_URL + this.apiRoute, true);
            xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }
    // deleteImage(fileName:string, orgExt:string, path:string):Observable < any > {
    //     return this.fileService.deleteFile(fileName, orgExt, path,"image");
    // }

    // saveTestimonial(objSave:TestimonialModel, file:File):Observable<any> {
    //     return this.xhrService.xhrRequest<TestimonialModel, any>('POST', this.apiRoute, "imageName", objSave, file);
    // }

    // updateTestimonial(objUpdate:TestimonialModel, file:File, imageDeleted:boolean, testimonialId: string):Observable<any> {
    //     return this.xhrService.xhrRequest<TestimonialModel, any>('PUT', this.apiRoute, "imageName", objUpdate, file, testimonialId, imageDeleted);
    // }

    // getTestimonialList(perPage:number, currentPage:number):Observable < TestimonialResponse> {
    //     let queryString = new HttpParams();
    //     queryString = queryString.append('perpage', perPage.toString());
    //     queryString = queryString.append('page', currentPage.toString());
    //     return this._http.get<TestimonialResponse>(API_URL + this.apiRoute, {params: queryString})
    //         .pipe(
    //             catchError(this.handleError)
    //         );
    // }
    
    getAllRotine() {
        return this._http.get<RoutineModel>(API_URL + this.apiRoute)
            .pipe(
                catchError(this.handleError)
            );
    }
    getEventmeetById(evenrmeetId) {
        return this._http.get(API_URL + 'getEventmeetById/'+evenrmeetId)
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
	getVerifiedJudgeByjudgeId(judgeid:string) {
        return this._http.get(API_URL + this.apigetVerifiedJudge+'/'+judgeid)
            .pipe(
                catchError(this.handleError)
            );
    }
	getroutinebysportsandlevel(sport,level){
		  return this._http.get(API_URL + this.apiroutinebyspl+'/'+sport+'/'+level)
            .pipe(
                catchError(this.handleError)
            );
    }
    sendReportMail(body){
        
        return this._http.post(API_URL + 'sendReportMail', body)
        .pipe(
            catchError(this.handleError)
        );
    }
    postComment(commentObj:RoutineComment){
        let body=JSON.stringify(commentObj);
        return this._http.post(API_URL + this.apicommentpost, body)
        .pipe(
            catchError(this.handleError)
        );
    }
    postTechnicianComment(commentObj:RoutineComment){
        let body=JSON.stringify(commentObj);
        return this._http.post(API_URL + 'routineTechniciancomment', body)
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
    getJudgedRotineByuser(userid:string) {
        return this._http.get<RoutineModel>(API_URL + this.apiroutesJudge + "/" + userid)
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
    updateRoutine(objTemp:RoutineModel):Observable < any> {
        let body = JSON.stringify(objTemp);
        return this._http.patch(API_URL + this.apiRoutesStatus + "/" + objTemp._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
    updateAssignedStatusInEventMeetForJudges(jid,rid) {
        let body = { jid : jid,assigned:true};
        return this._http.patch(API_URL + 'updateAssignedStatusInEventMeetForJudges' + "/" + rid,body)
            .pipe(
                catchError(this.handleError)
            );
    }
    getAssignedEventMeetForJudges(jid){
        return this._http.get(API_URL + 'getAssignedEventMeetForJudges' + "/" + jid)
        .pipe(
            catchError(this.handleError)
        );
    }

    getSingleRoutine(rid){
        return this._http.get(API_URL + 'getSingleRoutine' + "/" + rid)
        .pipe(
            catchError(this.handleError)
        );
    }
    updateRoutineTechnicianStatus(objTemp:RoutineModel):Observable < any> {
        let body = JSON.stringify(objTemp);
        return this._http.patch(API_URL +   "routinetechnicianstatus/" + objTemp._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
    updateTechnicianRoutine(objTemp):Observable < any>{
            let body = JSON.stringify(objTemp);
            return this._http.patch(API_URL +   "technicianroutine/" + objTemp._id, body)
                .pipe(
                    catchError(this.handleError)
                );
        
    }
	updateAssignedRoutine(objTemp:RoutineModel):Observable < any> {
        let body = JSON.stringify(objTemp);
        return this._http.patch(API_URL +"updateroutineStatus/" + objTemp._id, body)
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
    getRoutineCommentbyroutineid(rid:string,lid){
        return this._http.get<RoutineComment>(API_URL + this.apicommentRoutes + "/" + rid+"/"+lid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getJudgedEventMeetRoutine(lid){
        return this._http.get(API_URL  + "getJudgedEventMeetRoutine/"+lid)
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
    
    getEventForJudges(jid){
        return this._http.get<RoutineModel>(API_URL + 'getEventForJudges' + "/" + jid)
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
    getEventMeet(eid){
        return this._http.get<RoutineModel>(API_URL + 'eventmeet' + "/" + eid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getEventRoutineDetails(jid,rid){
        return this._http.get<RoutineModel>(API_URL + 'getEventRoutineDetails' + "/" + jid+"/"+rid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getJudgesSportDetails(sid,lid,assignedTo){
        return this._http.get(API_URL + 'getJudgesSportDetails' + "/" + sid+"/"+lid+"/"+assignedTo)
        .pipe(
            catchError(this.handleError)
        );
    }
    getMaxScoreForLevel(lid){
        return this._http.get(API_URL + '/level/'  + lid,)
        .pipe(
            catchError(this.handleError)
        );
    }
    getEventJudgeDetails(rid,jid) {
        return this._http.get(API_URL + 'getEventJudgeDetails' + "/" + jid+"/"+rid,)
        .pipe(
            catchError(this.handleError)
        );
    }
    getTechnicianRoutineStatusData(rid){
        return this._http.get(API_URL + "technicianRoutine/" + rid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getTechnicianRoutineComment(rid){
        return this._http.get(API_URL + "technicianroutinecomment/" + rid)
        .pipe(
            catchError(this.handleError)
        );
    }
    updateEventMeetRoutineID(rid,data){
        return this._http.patch(API_URL + 'updateEventMeetRoutineID' + "/" + rid,data)
        .pipe(
            catchError(this.handleError)
        );
    }
	getAssignedroutine(judgeid){
		 return this._http.get<RoutineModel>(API_URL +"/getAssignedroutine"+ "/" + judgeid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getEventJudgesCount(rid){
        return this._http.get(API_URL +"/getEventJudgesCount"+ "/" + rid)
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
