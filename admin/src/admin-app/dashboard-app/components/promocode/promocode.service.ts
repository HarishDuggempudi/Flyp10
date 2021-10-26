import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {API_URL} from "../../../shared/configs/env.config";
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class PromocodeService {
    apiRoute:string = "promocode";
    progressObserver:any;
    progress:any;

    constructor(private _http:HttpClient) {
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }
Sendpromote(objSave) {
    console.log("url:" ,API_URL)
        let body = JSON.stringify(objSave);
        return this._http.post(API_URL + this.apiRoute, body)
        
            .pipe(
                // catchError(this.handleError)
            );
    }
  
getPromocodeDetail(objId:string):Observable <any> {
        return this._http.get<any>(API_URL + this.apiRoute + "/" + objId)
            .pipe(
                // catchError(this.handleError)
            );
    }
  
}
