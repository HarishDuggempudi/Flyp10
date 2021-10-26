import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Config} from "../../../shared/configs/general.config";
import {API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';
import { XhrService } from '../../../shared/services/xhr.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class WalletService {
    
    walletinfoAPI:string="walletinfo";
	transactionsAPI:string="transactioninfo";
	gentokenafterpayAPI:string="gentokenafterpayment";
	convergeAPI:string="flyp10convergeApires";
	userWalletAPI="userwallet";
	transactionAPI="transaction";
    constructor(private xhrService: XhrService, private _http:HttpClient, private fileService:FileOperrationService) {

    }

    getSessionTokenForHPP(data){
        return this._http.post(API_URL +'getSessionTokenForHPP',data)
        .pipe(
            catchError(this.handleError)
        );
    }
	
	 getWalletInfo(userId){
		return this._http.get(API_URL +this.walletinfoAPI+"/"+userId)
            .pipe(
                catchError(this.handleError)
            );
	} 
	 getTransactionInfo(userId){
		return this._http.get(API_URL +this.transactionsAPI+"/"+userId)
            .pipe(
                catchError(this.handleError)
            );
    }
    getRemitHistoryById(userId){
		return this._http.get(API_URL +'remitHistoryById'+"/"+userId)
            .pipe(
                catchError(this.handleError)
            );
	}
	makepayment(txnObj){
		return this._http.post(API_URL+'makepayment', txnObj)
        .pipe(catchError(this.handleError))
    }
    makeMCCTokenPayment(txnObj){
		return this._http.post(API_URL+'makemcctokenpayment', txnObj)
        .pipe(catchError(this.handleError))
    }
	generateTokenAfterPayment(paymentObj){
		let body=JSON.stringify(paymentObj);
		return this._http.post(API_URL +this.gentokenafterpayAPI,body)
            .pipe(
                catchError(this.handleError)
            );
	}
	 saveConvergeResponse(response){
        let body=JSON.stringify(response);
        return this._http.post(API_URL +this.convergeAPI, body)
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
	creditUserWallet(walletObj){
		let body=JSON.stringify(walletObj);
        return this._http.post(API_URL +'/' +this.userWalletAPI, body)
        .pipe(
            catchError(this.handleError)
        );
	}
	saveTransaction(transactionObj){
		let body=JSON.stringify(transactionObj);
        return this._http.post(API_URL +'/' +this.transactionAPI, body)
        .pipe(
            catchError(this.handleError)
        );
	}
	updateConvergeInfo(convergeObj,userid){
		
		let body=JSON.stringify(convergeObj);
        return this._http.put(API_URL +'updateconvergeinfo/'+userid, body)
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
          return new ErrorObservable(error.status ? error.status :
            'Something bad happened; please try again later.');
    }

}
