import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {PricingModel} from './pricing-setting.model';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {API_URL} from "../../../shared/configs/env.config";
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class PricingSettingService {
    apiRoute:string = "price-setting";

    constructor(private _http:HttpClient) {

    }
    
    savePricesetting(objEmailService:PricingModel) {
        let body = JSON.stringify(objEmailService);
        return this._http.post(API_URL + this.apiRoute, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    updatePricesetting(objEmailService:PricingModel,id:string) {
        let body = JSON.stringify(objEmailService);
        return this._http.patch(API_URL + this.apiRoute + "/" + id, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    getPricing():Observable < any> {
        return this._http.get<PricingModel>(API_URL + this.apiRoute)
            .pipe(
                catchError(this.handleError)
            );
    }

    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
           
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
         
          }
          // return an ErrorObservable with a user-facing error message
          return new ErrorObservable(error.error.message ? error.error.message :
            'Something bad happened; please try again later.');
    }

}