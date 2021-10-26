import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Config} from "../../../shared/configs/general.config";
import {API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';
import { XhrService } from '../../../shared/services/xhr.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class EventMeetService {
    
    faqapi:string = "faq";
    faqapilist:string="faqlist/user";
    apiRoutes:string = "routines";
    progressObserver:any;
    progress:any=0;
    eventMeetId;
    apiuserRoutine="routine/user"
    progressSource = new BehaviorSubject<number>(0);
    constructor(private xhrService: XhrService, private _http:HttpClient, private fileService:FileOperrationService) {
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }

    saveEventMeet(body){
		return this._http.post(API_URL +"eventmeet",body)
            .pipe(
                catchError(this.handleError)
            );
    }
    update(body,id){
		return this._http.post(API_URL +"eventmeet/"+id,body)
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

    getEventMeetSportEventInfobyId(eventmeetId) {
        return this._http.get(API_URL + 'getEventMeetSportEventInfobyId' + "/" + eventmeetId)
        .pipe(
            catchError(this.handleError)
        );
    }
    getAthleteCoachRoutinesByEvent(eventmeetId,sanctionId) {
          let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('eventmeetId', eventmeetId.toString());
        query = query.append('sanctionId', sanctionId.toString());  
        return this._http.get(API_URL + 'getAthleteCoachRoutinesByEvent',{params:query})
        .pipe(
            catchError(this.handleError)
        );
    }
    exportpdf(data) {
        return this._http.post(API_URL + 'generatepdf',data)
        .pipe(
            catchError(this.handleError)
        );
    }
    getSanction(memberID){
        // let query = new HttpParams();
     
        // // Begin assigning parameters
        // query = query.append('perpage', perPage.toString());
        // query = query.append('page', currentPage.toString());  
        return this._http.get(API_URL + 'getSanctionByMemberID' + "/" + memberID)
        .pipe(
            catchError(this.handleError)
        );
    }
    checkMeetDirectorOrAdmin(MemberID,SanctionID) {
 let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('USAGID', MemberID.toString());
        query = query.append('SanctionID', SanctionID.toString());  
        return this._http.get(API_URL + 'checkMeetDirectorOrAdmin',{params:query})
        .pipe(
            catchError(this.handleError)
        );



    }
    saveSanctionSetting(data){
        return this._http.patch(API_URL + 'updateSanctionByID' + "/" + data._id,data)
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
    getSanctionByAdmin(memberID){
      
        return this._http.get(API_URL + 'getSanctionByAdminMemberID' + "/" + memberID)
        .pipe(
            catchError(this.handleError)
        );
    }
    getUSAGSportJudgePanel(sportid){
     
        return this._http.get(API_URL + 'getUSAGSportJudgePanel' + "/" + sportid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getSanctionByID(sid){
          
        return this._http.get(API_URL + 'getSanctionByID' + "/" + sid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getSportLevelSortOrder(sportId) {
        return this._http.get(API_URL + 'SportLevelSort' + "/" + sportId)
        .pipe(
            catchError(this.handleError)
        ); 
    }
    getSanctionInfoBySanctionID(sid){
          
        return this._http.get(API_URL + 'getSanctionInfoBySanctionID' + "/" + sid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getSanctionFlyp10UserStatus(sid){
          
        return this._http.get(API_URL + 'getSanctionFlyp10UserStatus' + "/" + sid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getEventMeet(id){
		return this._http.get(API_URL +"eventmeet/"+id)
            .pipe(
                catchError(this.handleError)
            );
    }
    enrollEventMeet(body){
		return this._http.post(API_URL +"enroll",body)
            .pipe(
                catchError(this.handleError)
            );
    }
    EnrollEventMeetForSanctionOrganizerAdminstrators(body){
        return this._http.post(API_URL +"EnrollEventMeetForSanctionOrganizerAdminstrators",body)
        .pipe(
            catchError(this.handleError)
        );

    }
    getEnrollEventMeet(){
		return this._http.get(API_URL +"getenroll")
            .pipe(
                catchError(this.handleError)
            );
    }
    getEnrollEventMeetbyId(id){
		return this._http.get(API_URL +"getenroll/"+id)
            .pipe(
                catchError(this.handleError)
            );
    }
    getenrollStartEndDate(id){
		return this._http.get(API_URL +"getenrollStartEndDate/"+id)
            .pipe(
                catchError(this.handleError)
            );
    }
    getActivecountryCurrency():Observable < any> {
        return this._http.get<any>(API_URL + 'getActivecountryCurrency')
            .pipe(
                catchError(this.handleError)
            );
    }

    getallEventMeet(perPage:number, currentPage:number):Observable < any> {
        // Initialize Params Object
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('perpage', perPage.toString());
        query = query.append('page', currentPage.toString());       
        return this._http.get(API_URL + "eventmeet", {params: query} )
            .pipe(
                catchError(this.handleError)
            );
    }
    getEventMeetByCreatedby(perPage:number, currentPage:number,userid):Observable < any> {
        // Initialize Params Object
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('perpage', perPage.toString());
        query = query.append('page', currentPage.toString());       
        return this._http.get(API_URL + "getEventMeetbyCreatedBy/"+userid, {params: query} )
            .pipe(
                catchError(this.handleError)
            );
    }

    getEventMeetbyCreatedBySanctionID(perPage:number, currentPage:number,userid,sanctionid):Observable < any> {
        // Initialize Params Object
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('perpage', perPage.toString());
        query = query.append('page', currentPage.toString());       
        return this._http.get(API_URL + "getEventMeetbyCreatedBySanctionID/"+userid+'/'+sanctionid, {params: query} )
            .pipe(
                catchError(this.handleError)
            );
    }
    getSanctionEventMeet(perPage:number, currentPage:number,sid):Observable < any> {
        // Initialize Params Object
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('perpage', perPage.toString());
        query = query.append('page', currentPage.toString());       
        return this._http.get(API_URL + "sanctioneventmeet/"+sid, {params: query} )
            .pipe(
                catchError(this.handleError)
            );
    }
    getEventmeetCoachmapping(userId) {
        let query = new HttpParams();
        query = query.append('userId', userId.toString());
        return this._http.get(API_URL + "getEventMeetCoachMappingForUser", {params: query} )
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

    getJudgespanelByeventmeetId(eventId) {
       
             
        return this._http.get(API_URL + "eventmeetJudgespanelByeventmeetId/"+eventId,  )
        .pipe(
            catchError(this.handleError)
        );
    }
    getRankingForEventMeet(eventId) {
       
             
        return this._http.get(API_URL + "getRankingForEventMeet/"+eventId,  )
        .pipe(
            catchError(this.handleError)
        );
    }
    getRankingForEventMeetAlllevel(eventId){
        return this._http.get(API_URL + "getRankingForEventMeetAlllevel/"+eventId,  )
        .pipe(
            catchError(this.handleError)
        );
    }
    getRoutineByEventLevel(lid,eid,eventMeetId) {
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('lid', lid.toString());
        query = query.append('eid', eid.toString());  
        query = query.append('eventMeetId', eventMeetId.toString());  
        return this._http.get(API_URL + "getRoutineByEventLevel",{params: query} )
        .pipe(
            catchError(this.handleError)
        );

    }
    SendStartCodeForUSAGMappedCoaches(data) {
        
             
        return this._http.post(API_URL + "sendStartCodeToUSAGMappedCompetitors", data )
        .pipe(
            catchError(this.handleError)
        );
    }
    downloadEventmeetScore(eventid){
        return this._http.get(API_URL + "downloadEventmeetScore/"+eventid )
        .pipe(
            catchError(this.handleError)
        );

    }

    downloadEventmeetScoreByLevel(data){
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('levelId', data.levelId.toString());
        // query = query.append('eventId', data.eventId.toString()); 
       
        return this._http.get(API_URL + "downloadEventmeetScoreBylevel/"+data.eventmeetId,{params:query} )
        .pipe(
            catchError(this.handleError)
        );

    }
    mappedEventMeetCoachInfo(eventid,sanctionID) {
        return this._http.get(API_URL + "mappedEventMeetCoachInfo/"+eventid+"/"+sanctionID  )
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
    getJudgesbySportAndLevel(sportid):Observable < any>{
        return this._http.get<any>(API_URL + 'getJudgesbySportAndLevel/'+sportid)
        .pipe(
            catchError(this.handleError)
        );
    }
    checkisEnrolledEvent(eventid,userid):Observable < any>{
        return this._http.get<any>(API_URL + 'checkisEnrolledEvent/'+eventid+"/"+userid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getReviewRoutine():Observable < any>{
        return this._http.get<any>(API_URL + 'getReviewRoutine')
        .pipe(
            catchError(this.handleError)
        );
    }
    updateMeetdeventRoutineStatus(data):Observable < any>{
        return this._http.post<any>(API_URL + 'updateMeetdeventRoutineStatus',data)
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
