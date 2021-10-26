
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import { API_URL} from "../../../shared/configs/env.config";
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { CountryResponse } from "./Country.model";

@Injectable()

export class CountryService {
    apiRoute:string = "countryCurrency";


    constructor(private _http:HttpClient) {

    }

    postcountryCurrency(data){
      return this._http.post(API_URL + this.apiRoute + "/" , data)
            .pipe(
                catchError(this.handleError)
            );
    }
    getCountryList(perPage:number, currentPage:number):Observable <CountryResponse> {
        let query = new HttpParams();
        query = query.append('perpage', perPage.toString());
        query = query.append('page', currentPage.toString());
        return this._http.get<CountryResponse>(API_URL + this.apiRoute, {params: query})
            .pipe(
                catchError(this.handleError)
            );
    }
    getCountry(){
        return this._http.get<any>(API_URL + 'country')
            .pipe(
                catchError(this.handleError)
            );
    }
   
    getcountryCurrencyByID(id:string):Observable < any> {
        return this._http.get<any>(API_URL + this.apiRoute + "/" + id)
            .pipe(
                catchError(this.handleError)
            );
    }
    patchcountryCurrency(id:string,data):Observable < any> {
      return this._http.patch<any>(API_URL + this.apiRoute + "/" + id,data)
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
    // deleteContact(objUpdate:ContactModel) {
    //     objUpdate.deleted = true;
    //     let body = JSON.stringify({});
    //     return this._http.patch(API_URL + this.apiRoute + "/" + objUpdate._id, body)
    //         .pipe(
    //             catchError(this.handleError)
    //         );

    // }

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
          return new ErrorObservable(error.error.message? error.error.message :
            'Something bad happened; please try again later.');
    }


}
