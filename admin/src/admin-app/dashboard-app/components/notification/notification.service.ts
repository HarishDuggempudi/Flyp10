import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {TestimonialModel, TestimonialResponse} from './notification.model';
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
export class NotificationService {
    apiRoute:string = "testimonial";
    progressObserver:any;
    progress:any;
    notificationTriggered = new EventEmitter<any>();
    notifications:any[] = [];
    readNotifications:any[] = [];
    requests:any[]=[];
    loggedInUserDetails:UserModel;
    constructor(private xhrService: XhrService, private _http:HttpClient, private fileService:FileOperrationService) {
        let userInfo: UserModel = JSON.parse(Config.getUserInfoToken());
    this.loggedInUserDetails = userInfo;
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }

    getUnreadNotifications(userDetails){
        this.notifications = [];
        this.requests = []
        this.getAckList(userDetails._id).subscribe(data => {
          
          let reqData = data['reqData'];
          // this.notifications = reqData;
       //   console.log('REQQQQ ', reqData);
          for(var i=0; i< reqData.length; i++){
            if(reqData.length){
              // if(reqData[i].updatedOn == undefined){
    
              // }
              let requestDetails = {
                RID : reqData[i].notificationProperties.RID,
                notificationId: reqData[i]._id,
                notificationType: reqData[i].type,
                notificationRead: reqData[i].read,
                notificationTime: reqData[i].updatedOn != undefined ? reqData[i].updatedOn : reqData[i].addedOn
              }
    
              this.getUsersByUID(reqData[i].notificationProperties.FID, this.notifications, requestDetails);
              
            }
          }
        }, err => {console.log(err)}, () => {
          this.getReadNotifications(userDetails)
        })
      }

      getReadNotifications(userDetails){
        this.readNotifications = [];
        this.getReadNotificationsList(userDetails._id).subscribe(data => {
          let reqData = data['reqData'];
          // this.notifications = reqData;
        
          for(var i=0; i< reqData.length; i++){
            if(reqData.length){
              // if(reqData[i].updatedOn == undefined){
    
              // }
              let requestDetails = {
                RID : reqData[i].notificationProperties.RID,
                notificationId: reqData[i]._id,
                notificationType: reqData[i].type,
                notificationRead: reqData[i].read,
                // notificationTime: reqData[i].updatedOn != undefined ? reqData[i].updatedOn : reqData[i].addedOn
                notificationTime: reqData[i].addedOn
              }
    
              this.getUsersByUID(reqData[i].notificationProperties.FID, this.readNotifications, requestDetails);
              
            }
          }
        })
      }

      getReadNotificationsList(id:string){
        return this._http.get(API_URL + "readnotifications/" + id)
            .pipe(
                catchError(this.handleError)
            );
      }
    
      getAckList(id:string){
        return this._http.get(API_URL + "acknotifications/" + id)
            .pipe(
                catchError(this.handleError)
            );
      }

      getUsersByUID(UID, arr:any[], requestDetails){
        // alert(rdata['UID']);
        this.getUserByUserID(UID).subscribe(data => {
          //console.log('dataaaaa ', data);
          let element = {
            active: data['active'],
            addedOn: data['addedOn'],
            address: data['address'],
            blocked: data['blocked'],
            dob:data['dob'], 
            email: data['email'],
            firstName:data['firstName'], 
            imageName:data['imageName'], 
            imageProperties:data['imageProperties'],
            lastName:data['lastName'], 
            phoneNumber:data['phoneNumber'], 
            securityQuestion:data['securityQuestion'], 
            twoFactorAuthEnabled: data['twoFactorAuthEnabled'],
            userConfirmed:data['userConfirmed'], 
            userRole: data['userRole'],
            username: data['username'],
            _id: data['_id'],
            requestId: requestDetails.RID,
            nid: requestDetails.notificationId,
            notificationType: requestDetails.notificationType,
            notificationTime: requestDetails.notificationTime
          }
          arr.push(element);
          if(element.notificationType === "0"){
            this.requests.push(element)
          }
         // console.log('arr.push ', arr);
        },err => { console.log(err)}, 
          () => {
          //console.log('inside service finally request list ', this.notifications);
        })
      }

      getUserByUserID(uid){
        return this._http.get(API_URL + 'user' + "/" + uid)
            .pipe(
                catchError(this.handleError)
            );
    }

    // make notification changes

    updateTeamMate(teammateObj) {
       // console.log('teammateObj =====> ', teammateObj);
        let body = JSON.stringify(teammateObj);
       // console.log('update obj json parse ', body)
        return this._http.put(API_URL + 'teammate' + "/" + teammateObj._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    getConnectionStatusByID(rid:string){
        return this._http.get(API_URL + 'teammate' + "/" + rid)
            .pipe(
                catchError(this.handleError)
            );
    }

    saveNotification(notificationObj){
        let body=JSON.stringify(notificationObj);
     //   console.log('notifications obj ', body);
        // this._http.post(API_URL + this.mappingApiRoute, body).subscribe((res) => {
        //     console.log('response', res);
        // })

        return this._http.post(API_URL + 'notifications', body);
    }

    getNotificationByNID(nid){
        return this._http.get(API_URL + 'notifications' + "/" + nid)
        .pipe(
            catchError(this.handleError)
        );
    }

    updateNotification(notificationObj){
        let body=JSON.stringify(notificationObj);
      //  console.log('notifications obj ', body);
        // this._http.post(API_URL + this.mappingApiRoute, body).subscribe((res) => {
        //     console.log('response', res);
        // })

        return this._http.put(API_URL + 'notifications/' + notificationObj._id, body)
        .pipe(
            catchError(this.handleError)
        );
    }

    markAsRead(user){
        this.notifications = []
       // console.log('mark as unread ', user);
        this.updateReadStatusNotification(user.nid,true);
      }
    
      acceptRequest(user){
        this.notifications = [];
        let tempObj;
        this.getConnectionStatusByID(user.requestId).subscribe(data => {
        //  console.log('request data to accept >>>>>>>>>>>.. ', data);
          tempObj = data;
          tempObj.status = "2"
        }, err => console.log(err),
          () => {
            this.updateTeamMate(tempObj).subscribe(res => {
    
              //console.log('response for updating cancel request ', res);      
              
            }, err => console.log(err), 
              () => {
                let notificationData = {
                  type: "1",
                  UID: user._id,
                  FID: this.loggedInUserDetails._id
                }
                this.updateRequestStatusNotification(user.nid, notificationData);
              }
            )
          }
        )
      }
    
      declineRequest(user, loggedInUserDetails){
        this.notifications = [];
        let tempObj;
        this.getConnectionStatusByID(user.requestId).subscribe(data => {
        //  console.log('request data to accept >>>>>>>>>>>.. ', data);
          tempObj = data;
          tempObj.status = "1"
        }, err => console.log(err),
          () => {
            this.updateTeamMate(tempObj).subscribe(res => {
    
             // console.log('response for updating cancel request ', res);         
              
            }, err => console.log(err), 
              () => {
                let notificationData = {
                  type: "2",
                  UID: user._id,
                  FID: loggedInUserDetails._id
                }
                this.updateRequestStatusNotification(user.nid, notificationData);
              }
            )
          }
        )
      }
    
      updateRequestStatusNotification(nid,notificationObj) {
        this.getNotificationByNID(nid).subscribe(data => {
         // console.log('notifi data ', data);
          if(data){
            var notificationDetails = data;
            notificationDetails.UID = notificationObj.UID;
            notificationDetails.notificationProperties.FID = notificationObj.FID;
            notificationDetails.type = notificationObj.type;
            this.updateNotification(notificationDetails).subscribe( response => {
              //console.log('response after notification saved', response)
            }, err => {
              console.log('err ', err);
            }, () => {
              if(notificationObj.type === "1"){
                Swal("Teammate added!", "Teammate has been added to your existing team!", "success");   
              }else if(notificationObj.type === "2") {
                Swal("Request declined!", "Request declined successfully!", "success");
              }
              // Swal("Request sent!", "We will notify you once user responds back!", "success");
            })
          }
        }, err => { console.log(err)}, () => {
        //  console.log('inside notification saved finally ');
          this.getUnreadNotifications(this.loggedInUserDetails);
        })
      }
    
    
      updateReadStatusNotification(nid:string,val:boolean) {
        this.getNotificationByNID(nid).subscribe(data => {
         // console.log('notifi data ', data);
          if(data){
            var notificationDetails = data;
            notificationDetails.read = val;
            this.updateNotification(notificationDetails).subscribe( response => {
              //console.log('response after notification saved', response)
            }, err => {
              console.log('err ', err);
            }, () => {
              // Swal("Request sent!", "We will notify you once user responds back!", "success");
            })
          }
        }, err => { console.log(err)}, () => {
          //console.log('inside notification saved finally ');
          this.getUnreadNotifications(this.loggedInUserDetails);
        })
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
