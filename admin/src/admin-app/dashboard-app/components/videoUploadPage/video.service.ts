import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { VideoModel,VideoResponse } from "./video.model";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Config} from "../../../shared/configs/general.config";
import {API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';
import { XhrService } from '../../../shared/services/xhr.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class VideoService {
    apiRoute:string = "testimonial";
    progressObserver:any;
    progress:any;
    apibannerRoute:string="banner";
    constructor(private xhrService: XhrService, private _http:HttpClient, private fileService:FileOperrationService) {
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }
	
	getBannerList(perPage:number, currentPage:number){
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        return this._http.get(API_URL + this.apibannerRoute, {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }
	getBannerbyID(bannerid:string){
      
        return this._http.get(API_URL + "getbanner"+"/"+bannerid)
            .pipe(
                catchError(this.handleError)
            );
    }
  getBannerbybannerID(bannerid){
	  return this._http.get(API_URL + "banner"+"/"+bannerid)
            .pipe(
                catchError(this.handleError)
            );
  }
 updatebanner(videoObj:VideoModel, file:File,bannerid:string):Observable<any> {

   
         return Observable.create((observer: any) => {
             let formData:FormData = new FormData(),
                 xhr:XMLHttpRequest = new XMLHttpRequest();
               
            formData.append('documentName', file);
            
             formData.append('data', JSON.stringify(videoObj));
            
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
             xhr.open('PUT', API_URL + this.apibannerRoute +"/"+bannerid, true);
             xhr.setRequestHeader("Authorization", Config.AuthToken);
             xhr.send(formData);
         });
     }
uploadBannerVideo(videoObj:VideoModel, file:File):Observable<any> {
       

      return Observable.create((observer: any) => {
          let formData:FormData = new FormData(),
              xhr:XMLHttpRequest = new XMLHttpRequest();

          formData.append('documentName', file);
          formData.append('data', JSON.stringify(videoObj));
        
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
          xhr.open('POST', API_URL + this.apibannerRoute, true);
          xhr.setRequestHeader("Authorization", Config.AuthToken);
          xhr.send(formData);
      });
  }
   deleteBanner(bannerObj:VideoModel):Observable < any> {
        let body = JSON.stringify(bannerObj);
        return this._http.patch(API_URL + this.apibannerRoute + "/" + bannerObj._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
/* 
    deleteImage(fileName:string, orgExt:string, path:string):Observable < any > {
        return this.fileService.deleteFile(fileName, orgExt, path,"image");
    }

    saveTestimonial(objSave:TestimonialModel, file:File):Observable<any> {
        return this.xhrService.xhrRequest<TestimonialModel, any>('POST', this.apiRoute, "imageName", objSave, file);
    }

    updateTestimonial(objUpdate:TestimonialModel, file:File, imageDeleted:boolean, testimonialId: string):Observable<any> {
        return this.xhrService.xhrRequest<TestimonialModel, any>('PUT', this.apiRoute, "imageName", objUpdate, file, testimonialId, imageDeleted);
    }

    getTestimonialList(perPage:number, currentPage:number):Observable < TestimonialResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        return this._http.get<TestimonialResponse>(API_URL + this.apiRoute, {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }


    getTestimonialDetail(testimonialId:string):Observable < TestimonialModel> {
        return this._http.get<TestimonialModel>(API_URL + this.apiRoute + "/" + testimonialId)
            .pipe(
                catchError(this.handleError)
            );
    }

   

   */
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
