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
import {VideoModel} from '../videoUploadPage/video.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class RoutineService {
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
    checkExistRoutine(routineObj:RoutineModel):Observable<any> {
        return this._http.post(API_URL + 'checkExistingRoutine',routineObj)
            .pipe(
                catchError(this.handleError)
            );
    }
    uploadRoutine(routineObj:RoutineModel, file:File):Observable<any> {
        

        return Observable.create((observer: any) => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();

            formData.append('documentName', file);
            formData.append('data', JSON.stringify(routineObj));
            
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(JSON.parse(xhr.response));
                        
                    }
                }
            };
            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);
               
                this.progressSource.next(this.progress);
                //this.progressObserver.next(this.progress);
            };
            
            xhr.open('POST', API_URL + this.apiRoute, true);
            xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }
    uploadBannerVideo(videoObj:VideoModel, file:File):Observable<any> {
        

      return Observable.create((observer: any) => {
          let formData:FormData = new FormData(),
              xhr:XMLHttpRequest = new XMLHttpRequest();

          formData.append('documentName', file);
          formData.append('data', JSON.stringify(videoObj));
         
          xhr.onreadystatechange = () => {
              if (xhr.readyState === 4) {
                  if (xhr.status === 200) {
                      observer.next(JSON.parse(xhr.response));
                      observer.complete();
                  } else {
                      observer.error(JSON.parse(xhr.response));
                      
                  }
              }
          };
          xhr.upload.onprogress = (event) => {
              this.progress = Math.round(event.loaded / event.total * 100);
              //this.progressObserver.next(this.progress);
          };
          xhr.open('POST', API_URL + this.apibannerRoute, true);
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
    getBanner() {
        return this._http.get<VideoModel>(API_URL + this.apibannerRoute)
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
    getRoutineCommentbyflyp10routineid(rid:string){
        return this._http.get<RoutineComment>(API_URL+"getRoutineCommentbyflyp10routineid/" + rid)
        .pipe(
            catchError(this.handleError)
      
            );
    } 
    getEventlevelRoutines(data){
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('lid', data.lid.toString());
        query = query.append('eid', data.eid.toString());  
        
        return this._http.get(API_URL+"getEventlevelRoutines/"+data.eventMeetId,{params:query})
        .pipe(
            catchError(this.handleError)
      
            );
    }
    getEventMeetRoutineJudgesScore(routineId){
        return this._http.get(API_URL + "getEventmeetRoutineJudgesbyPanel/"+routineId )
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
    getRoutineCommentForEventMeet(rid){
        return this._http.get(API_URL + 'getRoutineCommentForEventMeet' + "/" + rid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getEventMeetOverallCommentByPanel(rid) {
        return this._http.get(API_URL + 'getEventMeetOverallCommentByPanel' + "/" + rid)
        .pipe(
            catchError(this.handleError)
        );

    }
    getEventMeetRoutineCommentByPanel(rid:string){
        return this._http.get<RoutineComment>(API_URL+"getEventMeetRoutineCommentByPanel/" + rid)
        .pipe(
            catchError(this.handleError)
      
            );
    } 
    getRoutineCommentbyEventroutineid(rid:string){
        return this._http.get<RoutineComment>(API_URL+"getRoutineCommentbyEventroutineid/" + rid)
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
    
    shareRoutine(objTemp:any):Observable < any> {
        let body = JSON.stringify(objTemp);
        return this._http.post(API_URL +"/shareRoutine", body)
            .pipe(
                catchError(this.handleError)
            );
    }
    getsharedRoutinebyUID(uid){
        console.log(API_URL + "getsharedRoutinebyUID" + "/" + uid)
        return this._http.get<any>(API_URL + "getsharedRoutinebyUID" + "/" + uid)
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
