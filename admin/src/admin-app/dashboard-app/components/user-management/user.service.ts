import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {UserModel,RegisterUserModel, RegisterUserResponse,UserResponse ,UserSettingModel,JudgeSportModel ,UserSecurityModel} from './user.model';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Config} from "../../../shared/configs/general.config";
import {API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class UserService {
    apiRoute:string = "user";
    signuproute:string="user/signup"
    signupSportroute:string="user/signup/addsport"
    apiRouteJudge:string = "user/judge";
    apiRouteJudgeSport:string = "user/judge/sporteditor";
    totpSetupApiRoute:string = "totp-setup";
    totpVerifyApiRoute:string = "totp-verify";
    totpDisableApiRoute:string = "totp-disable";
	verifiedApi:string="/user/verifiedjudges";
	unverifiedApi:string="/user/unverifiedjudges";
	expiredApi:string="/user/expiredjudges";
	rejectedApi:string="/user/rejectedjudges";
    progressObserver:any;
    progress:any;
    paylianceCIDinfo: any[] = [];

    constructor(private _http:HttpClient, private  fileService:FileOperrationService) {
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }

    registerUser1(objUser:UserModel, file:File):Observable<any> {
        return Observable.create((observer: any) => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();

            formData.append('avatar', file);
            formData.append('data', JSON.stringify(objUser));
           
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
            xhr.open('POST', API_URL + this.apiRoute, true);
            xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }

    validateCreditCardByConverge(dataToPost,headersToPass){
        // const body = dataToPost
      
        return this._http.post(API_URL+'creditcardauth', dataToPost)
        .pipe(catchError(this.handleError))
    }
    verifyMembership(dataToPost){
        // const body = dataToPost
      
        return this._http.post(API_URL+'verifyUSAGYMAPI', dataToPost)
        .pipe(catchError(this.handleError))
    }
    updateUSAGMember(userid,data){
        return this._http.patch(API_URL+'updateUSAGMember/'+userid, data)
        .pipe(catchError(this.handleError))
    }
    getUSAGMember(userid) {
        
        return this._http.get(API_URL+'getUSAGverificationMemberID/'+userid)
        .pipe(catchError(this.handleError))
    }

    // Payliance integration

    createCusObj(cusObj){
      
        return this._http.post(API_URL+'/paylianceCreateCustomer', cusObj)
        .pipe(
            catchError(this.handleError)
        );
    }

    createACHObj(achObj){
       
        return this._http.post(API_URL+'paylianceCreateACH',achObj)
        .pipe(
            catchError(this.handleError)
        );
    }

    getPaylianceCIDbyUID(uid){
       
        return this._http.get(API_URL+'getPaylianceCID/'+uid)
        .pipe(
            catchError(this.handleError)
        );
    }
	getinfobyToken(Token){
      
		 let data={
			 token:Token
		 }
        return this._http.post(API_URL+'infobyToken',data)
        .pipe(
            catchError(this.handleError)
        );
    }
     postCCinfo(tokenObj){
		  return this._http.post(API_URL+'postccinfo',tokenObj)
        .pipe(
            catchError(this.handleError)
        );
	 }
	 getccinfo(userid){
		 return this._http.get(API_URL+'getccinfo/'+userid)
        .pipe(
            catchError(this.handleError)
        );
	 }
	 makeasdefaultcard(data){
		  return this._http.post(API_URL+'makeasdefaultcard',data)
        .pipe(
            catchError(this.handleError)
        );
	 }
	 updateSub(data,userId){
		  return this._http.put(API_URL+'updateSub/'+userId,data)
        .pipe(
            catchError(this.handleError)
        );
     }
     updateCID(data,userId){
        return this._http.put(API_URL+'updateCID/'+userId,data)
      .pipe(
          catchError(this.handleError)
      );
   }
   
	 getccinfobyid(docid){
		 let data={
			 deleted:false
		 }
		 return this._http.patch(API_URL+'getccinfobyid/'+docid,data)
        .pipe(
            catchError(this.handleError)
        );
	 }
	 saveConvergeResponse(response){
        let body=JSON.stringify(response);
        return this._http.post(API_URL+'/' +'flyp10convergeApires', body)
        .pipe(
            catchError(this.handleError)
        );
    }
	saveConvergeErrorResponse(response){
        let body=JSON.stringify(response);
        return this._http.post(API_URL+'/convergeerrorlog', body)
        .pipe(
            catchError(this.handleError)
        );
    }
    getPaylianceAccountsByCID(cid){
      
        const body = {
            cid: cid[0].CID
        }
        return this._http.post(API_URL+'paylianceGetAccountDetailsByUID',body);
    }

    getPaylianceDefaultAccountByCID(cid){
       
        const body = {
            cid: cid
        }
        return this._http.post(API_URL+'paylianceGetDefaultAccount',body);
    }

    submitRemitRequest(objToPost){
       
        return this._http.post(API_URL+'submitRemitRequest',objToPost);
    }

    setDefaultPaylianceAccount(cid, aid){        
        const body = {
            cid: cid,
            aid: aid
        }
        return this._http.post(API_URL+'paylianceSetDefaultAccount',body);
    }

	getToken(dataToPost,headersToPass){
       
        return this._http.post(API_URL+'gettoken', dataToPost)
        .pipe(catchError(this.handleError))
    }
	makepayment(txnObj){
		return this._http.post(API_URL+'makepayment', txnObj)
        .pipe(catchError(this.handleError))
	}
    saveJudgesSport(objUser:JudgeSportModel):Observable<any> {

       
        return Observable.create((observer: any) => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();
            formData.append('documentName', objUser.file);    
            formData.append('data', JSON.stringify(objUser));
        
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        if(xhr.response!='' ||xhr.response!=null ||xhr.response!=undefined){
                            observer.error(JSON.parse(xhr.response));
                        }
                        else{
                           
                           
                        }
                       
                       
                    }
                }
            };
            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);
                //this.progressObserver.next(this.progress);
            };
            xhr.open('POST', API_URL + this.apiRouteJudge, true);
            xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }

    getUserDetailsByUsername(uname){
        return this._http.get(API_URL + 'teammatedetails' + "/" + uname)
        .pipe(
            catchError(this.handleError)
        );
    }
    getsignupuserinfo(userid){
        return this._http.get(API_URL + 'signupuserinfo' + "/" + userid)
        .pipe(
            catchError(this.handleError)
        );
    }
   getUsrdetailsbyusername(username){
        return this._http.get(API_URL + 'getusrdetailsbyusername' + "/" + username)
        .pipe(
            catchError(this.handleError)
        );
    }
	
    updateJudgesSport(objUser:JudgeSportModel,docid):Observable<any> {

     
   
         return Observable.create((observer: any) => {
             let formData:FormData = new FormData(),
                 xhr:XMLHttpRequest = new XMLHttpRequest();
               
            formData.append('documentName', objUser.file);
            
             formData.append('data', JSON.stringify(objUser));
          
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
             xhr.open('PUT', API_URL + this.apiRouteJudgeSport +"/"+docid, true);
             xhr.setRequestHeader("Authorization", Config.AuthToken);
             xhr.send(formData);
         });
     }
    registerUser(objUser:RegisterUserModel, file:any):Observable<any> {
      
        return Observable.create((observer: any) => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();

            formData.append('avatar', file);
           
            formData.append('data', JSON.stringify(objUser));
          
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
            xhr.open('POST', API_URL + this.apiRoute, true);
            xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }
    signUpuser(objUser:RegisterUserModel, file:any):Observable<any> {
      
        return Observable.create((observer: any) => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();

            formData.append('avatar', file);
           
            formData.append('data', JSON.stringify(objUser));
       
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
            xhr.open('POST', API_URL + this.signuproute, true);
           // xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }
    saveuserSport(objUser:JudgeSportModel){
        let body=JSON.stringify(objUser);
       
        return this._http.post(API_URL + this.signupSportroute, body)
        .pipe(
            catchError(this.handleError)
        );
    }
    updateUser(objUser:UserModel, file:any, imageDeleted:boolean, userId: string):Observable<any> {
        return Observable.create((observer: any) => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();
           console.log(file)
            if (file) {
                formData.append('avatar', file);

            }
            formData.append('data', JSON.stringify(objUser));
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
            xhr.open('PUT', API_URL + this.apiRoute + "/" + userId + "?imagedeleted=" + imageDeleted, true);
            xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }

    getUserList(perPage:number, currentPage:number, roleName?:string):Observable < UserResponse > {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        if(roleName)
            queryString = queryString.append('role', roleName);
        return this._http.get<UserResponse>(API_URL + this.apiRoute, {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }

    getUserListForSanction(perPage:number, currentPage:number, roleName?:string):Observable < UserResponse > {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        if(roleName)
            queryString = queryString.append('role', roleName);
        return this._http.get<UserResponse>(API_URL + 'userForSanction', {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }
    getAllCompetitor(perPage:number, currentPage:number):Observable < any > {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
       
        return this._http.get<UserResponse>(API_URL + "getAllCompetitor", {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }
    getJudgesSport(username:string){
        return this._http.get<RegisterUserModel>(API_URL + this.apiRouteJudge + "/" + username)
        .pipe(
            catchError(this.handleError)
        );
    } 
	 getverifiedJudgesSport(perPage:number, currentPage:number){
		 
		 let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        return this._http.get(API_URL + this.verifiedApi, {params: queryString})
            .pipe(
                catchError(this.handleError)
            );     
    } 
	getunverifiedJudgesSport(perPage:number, currentPage:number){
		 let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        return this._http.get(API_URL + this.unverifiedApi, {params: queryString})
            .pipe(
                catchError(this.handleError)
            );  
    } 
	getexpiredJudgesSport(perPage:number, currentPage:number){
		 let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        return this._http.get(API_URL + this.expiredApi, {params: queryString})
            .pipe(
                catchError(this.handleError)
            );  
    } 
	getRejectedJudgesSport(perPage:number, currentPage:number){
		 let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        return this._http.get(API_URL + this.rejectedApi, {params: queryString})
            .pipe(
                catchError(this.handleError)
            );  
    } 	
    getJudgesSportdoc(filename:string){
       
        return  this._http.get(API_URL + this.apiRouteJudge + "/downloadfile/")
        .pipe(
            catchError(this.handleError)
        );
    }

    getUsersportDetailbyid(docid){
        return this._http.get<JudgeSportModel>(API_URL + this.apiRouteJudge + "/sporteditor/" + docid)
        .pipe(
            catchError(this.handleError)
        );
    }
    deleteUsersportDetailbyid(objUser:JudgeSportModel):Observable<any>{
     
        let body = JSON.stringify(objUser);
        return this._http.patch(API_URL + this.apiRouteJudge + "/sporteditor/" + objUser._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
    UpdatesportDetailbyid(objUser:JudgeSportModel,docid:string):Observable<any>{
       
        objUser.deleted=false;
        let body = JSON.stringify(objUser);
        return this._http.patch(API_URL + this.apiRouteJudge + "/sporteditor/" + docid, body)
            .pipe(
                catchError(this.handleError)
            );
    }
	  VerifyJudgesportDetailbyid(objUser,docid:string):Observable<any>{
       
        objUser.deleted=false;
		objUser.isVerify=true;
        let body = JSON.stringify(objUser);
        return this._http.patch(API_URL + this.apiRouteJudge + "/sporteditor/" + docid, body)
            .pipe(
                catchError(this.handleError)
            );
    }
    updatePassword(objUser:UserModel):Observable<any> {
        let body = JSON.stringify(objUser);
        return this._http.patch(API_URL + this.apiRoute + "/" + objUser._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
     
    updateSecurityQuestion(objUserSecurity:UserSecurityModel):Observable<any> {
        let body = JSON.stringify(objUserSecurity);
        return this._http.patch(API_URL + this.apiRoute + "/" + objUserSecurity._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }


    //  For Two Factor authentication setup
    getTotpSecret():Observable<any> {
        return this._http.get(API_URL + this.totpSetupApiRoute)
            .pipe(
                catchError(this.handleError)
            );
    }

    verifyTotpToken(totpToken:number, userId:string):Observable<any> {
        let body = JSON.stringify({totpToken: totpToken});
        return this._http.post(API_URL + this.totpVerifyApiRoute + "/" + userId, body)
            .pipe(
                catchError(this.handleError)
            );
    }
    deleteUser(objUser:RegisterUserModel):Observable<any>{
        let body = JSON.stringify(objUser);
        return this._http.patch(API_URL + this.apiRoute + "/" + objUser._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
    updateSetting(objUserSetting:UserSettingModel):Observable<any> {
        let body = JSON.stringify(objUserSetting);
        return this._http.put(API_URL + this.totpDisableApiRoute + "/" + objUserSetting._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
 
    // End Two Factor authentication

    getUserDetail(userId:string):Observable < RegisterUserModel > {
        return this._http.get<RegisterUserModel>(API_URL + this.apiRoute + "/" + userId)
            .pipe(
                catchError(this.handleError)
            );
    }

    deleteImage(fileName:string, orgExt:string, path:string):Observable < any > {
        return this.fileService.deleteFile(fileName, orgExt, path, "image");

    }

    userBlock(userId:string) {


    }
     getVerifiedRecruiter(perPage:number, currentPage:number){
		 
		 let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        return this._http.get(API_URL + 'recruiter-verified', {params: queryString})
            .pipe(
                catchError(this.handleError)
            );     
    }  
	getUnVerifiedRecruiter(perPage:number, currentPage:number){
		 
		 let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        return this._http.get(API_URL + 'recruiter-unverified', {params: queryString})
            .pipe(
                catchError(this.handleError)
            );     
    }  
	getRejectedRecruiter(perPage:number, currentPage:number){
		 
		 let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        return this._http.get(API_URL + 'recruiter-rejected', {params: queryString})
            .pipe(
                catchError(this.handleError)
            );     
    }
	getRecruiterDetailsByID(userId:string){

        return this._http.get(API_URL + 'verfyRecruiter/'+userId)
            .pipe(
                catchError(this.handleError)
            );     
    }
	 updateRecruiterStatus(userID,rstatus):Observable<any> {
		 let data={
			 recruiterStatus:rstatus
		 }
        let body = JSON.stringify(data);
        return this._http.put(API_URL  + "verfyRecruiter/" + userID, body)
            .pipe(
                catchError(this.handleError)
            );
    }
	updateUserConfirmed(userID,data):Observable<any> {
		 
        let body = JSON.stringify(data);
        return this._http.put(API_URL  + "confirmuser/" + userID, body)
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
