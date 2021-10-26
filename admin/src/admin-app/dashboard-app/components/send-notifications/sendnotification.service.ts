import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
//import {TestimonialModel, TestimonialResponse} from './notification.model';
import {Injectable,EventEmitter} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {UserModel} from "../user-management/user.model";
import {Config} from "../../../shared/configs/general.config";
import {API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';
import { XhrService } from '../../../shared/services/xhr.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import Swal from 'sweetalert2';

@Injectable()
export class SendNotificationService {
    constructor(private _http:HttpClient) {

    }
    getUserForSendNotifications(body){
     
        return this._http.post(API_URL + 'getUserForSendNotifications',body)
        .pipe(
            catchError(this.handleError)
        );
    }

    sendNotificationToUser(data) {
        return this._http.post(API_URL + 'sendNotificationToUsers', data).pipe(
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
