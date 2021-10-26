import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {LibraryModel,LibraryResponse} from './library.model';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Config} from "../../../shared/configs/general.config";
import {API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';
import { XhrService } from '../../../shared/services/xhr.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class LibraryService {
    libraryapi:string = "library";
    libraryapilist:string="librarylist/user";
    apiRoutes:string = "routines";
    progressObserver:any;
    progress:any;
    apiuserRoutine="routine/user"
    constructor(private xhrService: XhrService, private _http:HttpClient, private fileService:FileOperrationService) {
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }

    addComment(commentObj){
        let body=JSON.stringify(commentObj);
//console.log(API_URL + 'librarycomments')
 
        return this._http.post(API_URL + 'librarycomments', body);
    }

    getCommentsByRID(rid){
        return this._http.get(API_URL + "librarycomment/" + rid)
        .pipe(
            catchError(this.handleError)
        )
    }

    
    savelibrary(libraryObject:LibraryModel){
        let body=JSON.stringify(libraryObject);
        return this._http.post(API_URL + this.libraryapi, body)
        .pipe(
            catchError(this.handleError)
        );
    }


    updateViews(libraryobj) {
        let body = JSON.stringify(libraryobj);
        return this._http.patch(API_URL + "videoView" + "/" + libraryobj._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    getlibrarylist(perPage:number, currentPage:number, active?:boolean):Observable < LibraryResponse> {
        // Initialize Params Object
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('perpage', perPage.toString());
        query = query.append('page', currentPage.toString());
        if(active)
            query = query.append('active', active.toString());
        return this._http.get(API_URL + this.libraryapi, {params: query} )
            .pipe(
                catchError(this.handleError)
            );
    }
    getlibraryDetail(objId:string):Observable < LibraryModel> {
        return this._http.get<LibraryModel>(API_URL + this.libraryapi + "/" + objId)
            .pipe(
                catchError(this.handleError)
            );
    }
    getlibraryDetailByuserid(objId:string):Observable < LibraryModel> {
        return this._http.get<LibraryModel>(API_URL + this.libraryapilist + "/" + objId)
            .pipe(
                catchError(this.handleError)
            );
    }
    updatelibrary(libraryobj:LibraryModel) {
        let body = JSON.stringify(libraryobj);
        return this._http.put(API_URL + this.libraryapi + "/" + libraryobj._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
    deletelibrary(objDel:LibraryModel):Observable<any> {
        let body = JSON.stringify({});
        return this._http.patch(API_URL + this.libraryapi + "/" + objDel._id, body)
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
