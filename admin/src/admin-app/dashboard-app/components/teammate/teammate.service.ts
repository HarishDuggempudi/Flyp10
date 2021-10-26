import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {UserModel, UserResponse} from '../user-management/user.model';
import { TeamMateModel, TeamMateResponse } from './teammate.model';
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
export class TeammateService {
    apiRoute:string = "users";
    progressObserver:any;
    progress:any;
    teammateData:any;
    teammateRequestData:any;
    addUserData:any;
    private _listners = new Subject<any>();
    constructor(private xhrService: XhrService, private _http:HttpClient, private fileService:FileOperrationService) {
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }

    setAddUserData(data){
        this.addUserData = data;
    }
    

    listen(): Observable<any> {
       return this._listners.asObservable();
    }

    filter(filterBy: string) {
       this._listners.next(filterBy);
    }

    setTeammateData(data){
        this.teammateData = data;
    }

    setTeammateRequestData(data){
        this.teammateRequestData = data;
    }

    getUserList(roleName?:string):Observable < UserResponse > {
        let queryString = new HttpParams();
        // queryString = queryString.append('perpage', perPage.toString());
        // queryString = queryString.append('page', currentPage.toString());
        // if(roleName)
        //     queryString = queryString.append('role', roleName);
        return this._http.get<UserResponse>(API_URL + this.apiRoute)
            .pipe(
                catchError(this.handleError)
            );
    }
    getUserByUserIDWithMemberID(uid) {
        return this._http.get(API_URL + 'userwithusagid' + "/" + uid)
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
    getUSAGVerificationMemberIDByFlyp10UserID(uid) {
        return this._http.get(API_URL + 'getUSAGVerificationMemberIDByFlyp10UserID' + "/" + uid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getSanctionMemberIDByFlyp10UserID(MemberID) {
        return this._http.get(API_URL + 'getSanctionMemberIDByFlyp10UserID' + "/" + MemberID)
        .pipe(
            catchError(this.handleError)
        );
    }
    getUSAGMember(userid) {
        
        return this._http.get(API_URL+'getUSAGverificationMemberID/'+userid)
        .pipe(catchError(this.handleError))
    }

    getUserDetailsByUsername(uname){
        return this._http.get(API_URL + 'teammatedetails' + "/" + uname)
        .pipe(
            catchError(this.handleError)
        );
    }

    addTeamMate(teammateObj){
        let body=JSON.stringify(teammateObj);

     

        return this._http.post(API_URL + 'teammate', body);
    }

    saveNotification(notificationObj){
        let body=JSON.stringify(notificationObj);
       
     

        return this._http.post(API_URL + 'notifications', body);
    }

    getNotificationByNID(nid){
        return this._http.get(API_URL + 'notifications' + "/" + nid)
        .pipe(
            catchError(this.handleError)
        );
    }

    updateNotification(notificationObj){
        let body=JSON.stringify(notificationObj);
       

        return this._http.put(API_URL + 'notifications/' + notificationObj._id, body)
        .pipe(
            catchError(this.handleError)
        );
    }

    // saveSportsEvent(EventObject:EventModel){
    //     let body=JSON.stringify(EventObject);
    //     return this._http.post(API_URL + this.eventapiroute, body)
    //     .pipe(
    //         catchError(this.handleError)
    //     );
    // }

    updateTeamMate(teammateObj) {
      
        let body = JSON.stringify(teammateObj);
       
        return this._http.put(API_URL + 'teammate' + "/" + teammateObj._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    getConnectionStatusByID(rid:string){
        return this._http.get(API_URL + 'teammate' + "/" + rid)
            .pipe(
                catchError(this.handleError)
            );
    }

    getTeamMateByUID(objId:string) {
        return this._http.get(API_URL + 'teammates' + "/" + objId)
            .pipe(
                catchError(this.handleError)
            );
    }

    getRequestsByFID(objId:string) {
        return this._http.get(API_URL + 'teammatereq' + "/" + objId)
            .pipe(
                catchError(this.handleError)
            );
    }

    deleteImage(fileName:string, orgExt:string, path:string):Observable < any > {
        return this.fileService.deleteFile(fileName, orgExt, path,"image");
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
