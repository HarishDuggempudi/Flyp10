import { Component, OnInit } from "@angular/core";
import { TeammateService } from '../teammate/teammate.service';
import { NotificationService } from './notification.service';
import {Config} from "../../../shared/configs/general.config";
import {UserModel} from "../user-management/user.model";
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import { Subject } from 'rxjs/Subject';
import {API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';
import { XhrService } from '../../../shared/services/xhr.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import Swal from 'sweetalert2';

@Component({
  selector: "team-list",
  templateUrl: "./notification-list.html",
  styleUrls: ['./notification.scss']
})
export class NotificationListComponent implements OnInit {
  userName: string;
  twoFactorEnabled: boolean;
  imageSrc: string = Config.DefaultAvatar;
  userRole:any='1';
  requests:any[]=[];
  acceptedAck: any[] = [];
  rejectedAck:any[]=[];
  notifications:any[]=[];
  loggedInUserDetails:UserModel;
  isOpen:boolean= false;
  requestLength:number = 0;
  readNotifications:any[] = [];
  earlier:any[]=[];
  
  ngOnInit() {
    
  }

  constructor(private _service: TeammateService,private _http:HttpClient,private _nservice: NotificationService) {
    let userInfo: UserModel = JSON.parse(Config.getUserInfoToken());
    this.loggedInUserDetails = userInfo;
  
    this.userName = userInfo.username;
    this.userRole = userInfo.userRole
    this._nservice.notificationTriggered.subscribe(data => {
      
    })
    if(userInfo.imageName){
      this.imageSrc = Config.Cloudinary.url(userInfo.imageName);
    }
    this.twoFactorEnabled = userInfo.twoFactorAuthEnabled;
    this.getAckNotifications();
    // this.getUnreadNotifications();
  }
  ngDoCheck() {
	 let checknoti=Config.getNoticompchanges();
	
	 if(checknoti=="1"){
	
		 this.getAckNotifications();
		 //this.getUnreadNotifications();
		 Config.setNotichanges('0');
	 }else{
		 Config.setNoticompchanges('0');
	  }
	
  }
  getUnreadNotifications(){
    this.getReadNotificationsList(this.loggedInUserDetails._id).subscribe(data => {
      let reqData = data['reqData'];
      // this.notifications = reqData;
	  this.readNotifications=[];
   
      for(var i=0; i< reqData.length; i++){
        if(reqData.length){
          // if(reqData[i].updatedOn == undefined){

          // }
          let requestDetails = {
            RID : reqData[i].notificationProperties.RID,
            notificationId: reqData[i]._id,
            notificationType: reqData[i].type,
            notificationRead: reqData[i].read,
			message:reqData[i].message,
            // notificationTime: reqData[i].updatedOn != undefined ? reqData[i].updatedOn : reqData[i].addedOn
            notificationTime: reqData[i].addedOn
          }

          this.getUsersByUID(reqData[i].notificationProperties.FID, this.readNotifications, requestDetails);
          
        }
      }
    })
  }

  getAckNotifications(){
    this.getAckList(this.loggedInUserDetails._id).subscribe(data => {    
      let reqData = data['reqData'];
      // this.notifications = reqData;
	   this.notifications = [];
      
      for(var i=0; i< reqData.length; i++){
        if(reqData.length){
          // if(reqData[i].updatedOn == undefined){

          // }
          let requestDetails = {
            RID : reqData[i].notificationProperties.RID,
            notificationId: reqData[i]._id,
            notificationType: reqData[i].type,
            notificationRead: reqData[i].read,
			message:reqData[i].message,
            notificationTime: reqData[i].updatedOn != undefined ? reqData[i].updatedOn : reqData[i].addedOn
          }

          this.getUsersByUID(reqData[i].notificationProperties.FID, this.notifications, requestDetails);
          
        }
      }
    }, err => {console.log(err)}, () => {
      this.getUnreadNotifications()
    })
  }

  markAsRead(user){
    this.notifications = []
  
    this.updateReadStatusNotification(user.nid,true);
  }

  acceptRequest(user){
   
    this._nservice.notificationTriggered.emit('notifications updated');
    this.notifications = [];
    let tempObj;
    this._service.getConnectionStatusByID(user.requestId).subscribe(data => {
     
      tempObj = data;
      tempObj.status = "2"
    }, err => console.log(err),
      () => {
        this._service.updateTeamMate(tempObj).subscribe(res => {

          
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

  declineRequest(user){
    this.notifications = [];
    let tempObj;
    this._service.getConnectionStatusByID(user.requestId).subscribe(data => {
    
      tempObj = data;
      tempObj.status = "1"
    }, err => console.log(err),
      () => {
        this._service.updateTeamMate(tempObj).subscribe(res => {

         
          
        }, err => console.log(err), 
          () => {
            let notificationData = {
              type: "2",
              UID: user._id,
              FID: this.loggedInUserDetails._id
            }
            this.updateRequestStatusNotification(user.nid, notificationData);
          }
        )
      }
    )
  }

  updateRequestStatusNotification(nid,notificationObj) {
    this._service.getNotificationByNID(nid).subscribe(data => {
     
      if(data){
        var notificationDetails = data;
        notificationDetails.UID = notificationObj.UID;
        notificationDetails.notificationProperties.FID = notificationObj.FID;
        notificationDetails.type = notificationObj.type;
        this._service.updateNotification(notificationDetails).subscribe( response => {
         
        }, err => {
          console.log('err ', err);
        }, () => {
		   Config.setNotichanges('1');		  
          if(notificationObj.type === "1"){
            Swal("Teammate added!", "Teammate has been added to your existing team!", "success");   
          }else if(notificationObj.type === "2") {
            Swal("Request declined!", "Request declined successfully!", "success");
          }
          // Swal("Request sent!", "We will notify you once user responds back!", "success");
        })
      }
    }, err => { console.log(err)}, () => {
  
      this.getAckNotifications();
    })
  }


  updateReadStatusNotification(nid:string,val:boolean) {
    this._service.getNotificationByNID(nid).subscribe(data => {
    
      if(data){
        var notificationDetails = data;
        notificationDetails.read = val;
        this._service.updateNotification(notificationDetails).subscribe( response => {
         
        }, err => {
          //console.log('err ', err);
        }, () => {
          // Swal("Request sent!", "We will notify you once user responds back!", "success");
        })
      }
    }, err => { console.log(err)}, () => {
      //console.log('inside notification saved finally ');
      this.getAckNotifications();
    })
  }

  getUsersByUID(UID, arr:any[], requestDetails){
    // alert(rdata['UID']);
    this._service.getUserByUserID(UID).subscribe(data => {
    
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
        notificationTime: requestDetails.notificationTime,
		message:requestDetails.message
      }
      arr.push(element);
	  arr.sort((a, b) => new Date(b.notificationTime).getTime() - new Date(a.notificationTime).getTime())
      //console.log('notification list ', arr);
    },err => { console.log(err)}, 
      () => {
     // console.log('inside finally request list ', this.notifications);
    })
  }

  getUserByUID(UID, arr:any[], requestDetails){
    arr = [];
    // alert(rdata['UID']);
    this._service.getUserByUserID(UID).subscribe(data => {
     // console.log('dataaaaa ', data);
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
	  arr.sort((a, b) => new Date(b.notificationTime).getTime() - new Date(a.notificationTime).getTime());
      //console.log('arr.push ', arr);
    },err => { console.log(err)}, 
      () => {
    //  console.log('inside finally request list ', this.notifications);
    })
  }

  getRequestList(id:string){
    return this._http.get(API_URL + "requestnotifications/" + id)
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

  getReadNotificationsList(id:string){
    return this._http.get(API_URL + "readnotifications/" + id)
        .pipe(
            catchError(this.handleError)
        );
  }

  requestsLength(notifications){
   // console.log('inside request length', notifications)
    let tempArr = [];
    for (let index = 0; index < notifications.length; index++) {
      const element = notifications[index];
      if(element.type === "0"){
        tempArr.push(element)
      }      
    }
    this.requestLength = tempArr.length
    // return tempArr.length
  }


handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
    //  console.error('An error occurred:', error.error.message);
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
