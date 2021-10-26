import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {FaqModel,FaqResponse} from './faq.model';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Config} from "../../../shared/configs/general.config";
import {API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';
import { XhrService } from '../../../shared/services/xhr.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class FaqService {
    faqapi:string = "faq";
    faqapilist:string="faqlist/user";
    apiRoutes:string = "routines";
    progressObserver:any;
    progress:any;
    apiuserRoutine="routine/user"
    constructor(private xhrService: XhrService, private _http:HttpClient, private fileService:FileOperrationService) {
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }

    
    saveFaq(faqObject:FaqModel){
        let body=JSON.stringify(faqObject);
        return this._http.post(API_URL + this.faqapi, body)
        .pipe(
            catchError(this.handleError)
        );
    }
    getFaqlist(perPage:number, currentPage:number, active?:boolean):Observable < FaqResponse> {
        // Initialize Params Object
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('perpage', perPage.toString());
        query = query.append('page', currentPage.toString());
        if(active)
            query = query.append('active', active.toString());
        return this._http.get(API_URL + this.faqapi, {params: query} )
            .pipe(
                catchError(this.handleError)
            );
    }
    getfaqDetail(objId:string):Observable < FaqModel> {
        return this._http.get<FaqModel>(API_URL + this.faqapi + "/" + objId)
            .pipe(
                catchError(this.handleError)
            );
    }
    getfaqDetailByuserid(objId:string):Observable < FaqModel> {
        return this._http.get<FaqModel>(API_URL + this.faqapilist + "/" + objId)
            .pipe(
                catchError(this.handleError)
            );
    }
    updateFaq(faqobj:FaqModel) {
        let body = JSON.stringify(faqobj);
        return this._http.put(API_URL + this.faqapi + "/" + faqobj._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
    deleteFaq(objDel:FaqModel):Observable<any> {
        let body = JSON.stringify({});
        return this._http.patch(API_URL + this.faqapi + "/" + objDel._id, body)
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
