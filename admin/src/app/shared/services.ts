import { HttpClient, HttpParams, HttpErrorResponse ,HttpHeaders} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import {API_URL} from "../shared/config/env.config";
import {Config} from "../shared/config/general.config";
import { BlogResponse, BlogModel, BlogCategoryResponse,BlogTagModel,BlogCategoryModel } from '../components/landing/blog.model';

@Injectable()
export class Services {
    API_URL:string = "https://flyp10.com/api" ;
    //API_URL:string = "http://192.168.1.90:3005/api" ;
  //  API_URL:string = API_URL
    testimonialRoute: string = 'testimonial'
	apibannerRoute:string='getbanner';
	faqapilist:string="faqlist/user";
	apitermsRoute:string="htmlpageinfo";
	convergeAPI:string="flyp10convergeApires";
	userWalletAPI="userwallet";
	transactionAPI="transaction";
	 pricingApi="/usersportpricing";
	txndata:any;
    constructor( private _http:HttpClient) {
        
    }    
    settxndata(txndata){
		this.txndata=txndata
	}
	gettxndata(){
		return this.txndata
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
          return new ErrorObservable(error.status ? error.status :
            'Something bad happened; please try again later.');
    }

    postCaptcha(res):Observable<any> {
      //  let queryString = new HttpParams();
      //   queryString = queryString.append('secret', '6LdBPMEZAAAAAIWEqJAC__8pj4bgggF1TIP5yKLn');
      //  queryString = queryString.append('response',res.toString());
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
        });
        let data = {
            secret : Config.captchaSecretKey,
            response:res
        }
        //https://www.google.com/recaptcha/api/siteverify?secret=6LdBPMEZAAAAAIWEqJAC__8pj4bgggF1TIP5yKLn&response="+res+"&remoteip=REMOTEADD"
        return this._http.post(API_URL+'postCaptcha', data,{headers})
        .pipe(
            catchError(this.handleError)
        );
    }

    getTestimonialsData(){
        return this._http.get(this.API_URL + '/' + this.testimonialRoute);
    }
	getTerms(){
		return this._http.get(this.API_URL +'/' +this.apitermsRoute+"/terms")
            .pipe(
                catchError(this.handleError)
            );
	}
	saveContact(){
		var response=  { 'fullName': 'user_name', 'email': 'user_email', 'userPhone': 'user_phone', 'message': 'ser_message' };
		 let body=JSON.stringify(response);
		 let headers = new HttpHeaders({
'Content-Type': 'application/json',
'Accept': 'application/json',
});
        return this._http.post(this.API_URL +'/' +"contact/info", body,{headers})
        .pipe(
            catchError(this.handleError)
        );
	}
    saveConvergeResponse(response){
        let body=JSON.stringify(response);
        return this._http.post(this.API_URL +'/' +this.convergeAPI, body)
        .pipe(
            catchError(this.handleError)
        );
    }
	creditUserWallet(walletObj){
		let body=JSON.stringify(walletObj);
        return this._http.post(this.API_URL +'/' +this.userWalletAPI, body)
        .pipe(
            catchError(this.handleError)
        );
    }
    updateConvergeInfo(convergeObj,userid){
		
		let body=JSON.stringify(convergeObj);
        return this._http.put(this.API_URL +'/updateconvergeinfo/'+userid, body)
        .pipe(
            catchError(this.handleError)
        );
	}
	saveTransaction(transactionObj){
		let body=JSON.stringify(transactionObj);
        return this._http.post(this.API_URL +'/' +this.transactionAPI, body)
        .pipe(
            catchError(this.handleError)
        );
	}
	getPrivacy(){
		return this._http.get(this.API_URL +'/' + this.apitermsRoute+"/privacy")
            .pipe(
                catchError(this.handleError)
            );
	}
    getBannerbyID(bannerid:string){
      
        return this._http.get(this.API_URL + this.apibannerRoute+"/"+bannerid)
            .pipe(
                catchError(this.handleError)
            );
    }
	getfaqDetailByuserid(objId:string){
        return this._http.get(this.API_URL + this.faqapilist + "/" + objId)
            .pipe(
                catchError(this.handleError)
            );
    }
    getBlogList():Observable < BlogResponse > {
        
        return this._http.get<BlogResponse>(this.API_URL +'/blog')
            .pipe(
                catchError(this.handleError)
            );
    }

    getBlogData(){
        // return Observable.interval(2200).map(i => this._http.get(this.API_URL + '/blog'));
        return this._http.get(this.API_URL + '/blog');
    }

    getBlogDetail(id:string):Observable < BlogModel > {
        // console.log("BlogDetail", API_URL)
        return this._http.get<BlogModel>(this.API_URL + "/blog/" + id)
            .pipe(
                catchError(this.handleError)
            );
    }

    getBlogCategoryList():Observable < BlogCategoryResponse> {
        return this._http.get(this.API_URL + '/blogcategory')
            .pipe(
                catchError(this.handleError)
            );
    }

    getBlogCategoryDetail(objId:string):Observable < BlogCategoryModel> {
        return this._http.get<BlogCategoryModel>(this.API_URL  + "/blogcategory" + objId)
            .pipe(
                catchError(this.handleError)
            );
    }

    getBlogTagList():Observable < BlogTagModel[] > {
        // console.log("Blog Tag List", API_URL);
        return this._http.get<BlogTagModel[]>(this.API_URL + '/blogtag')
            .pipe(
                catchError(this.handleError)
            );
    }
	
	getPricingList(){
    // Initialize Params Object
    
    return this._http.get(this.API_URL + this.pricingApi )
        .pipe(
            catchError(this.handleError)
        );
 }

}
