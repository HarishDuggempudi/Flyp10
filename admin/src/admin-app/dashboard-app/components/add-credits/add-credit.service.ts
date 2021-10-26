import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Config} from "../../../shared/configs/general.config";
import {API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';
import { XhrService } from '../../../shared/services/xhr.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import * as moment from 'moment';
import { RegisterUserModel } from '../user-management/user.model';
@Injectable()
export class AddCreditService {
    
   
    constructor(private xhrService: XhrService, private _http:HttpClient, private fileService:FileOperrationService) {
        
    }
   
    
    getAllCompetitors(){
     
        return this._http.get(API_URL + 'getAllCompetitorForMap')
        .pipe(
            catchError(this.handleError)
        );
    }
    getUserWallet(userid){
     
        return this._http.get(API_URL + 'walletinfo/'+userid)
        .pipe(
            catchError(this.handleError)
        );
    }
    getAllUsersWalletInfo(perPage,currentPage){
        let query = new HttpParams();
        query = query.append('perpage', perPage.toString());
        query = query.append('page', currentPage.toString());  
        return this._http.get(API_URL + 'getAllUserWalletInfo', {params: query})
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
