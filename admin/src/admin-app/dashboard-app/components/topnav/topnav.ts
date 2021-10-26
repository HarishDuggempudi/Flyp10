import {Component, ViewChild,ViewEncapsulation,Input, DoCheck} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../../../login-app/components/login/login.service';
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
import { TeammateService } from '../teammate/teammate.service';
import { NotificationService } from '../notification/notification.service';
import Swal from 'sweetalert2';
import {MatTabChangeEvent} from '@angular/material';
import { NotificationListComponent } from '../notification/notification-list.component';
import {RoutineService} from "../judges-routines/routines.service";
import {RoutineModel,RoutineResponse} from '../my-routines/routine.model';
@Component({
  selector: 'topnav',
  templateUrl: './topnav.html',
  styleUrls: ['./topnav.scss'],
  encapsulation : ViewEncapsulation.None
})

export class TopNavCmp implements DoCheck{

  @ViewChild('tabGroup') tabGroup;

  // public oneAtATime: boolean = true;
  // public items: Array<any> = [{name: 'google', link: 'https://google.com'}, {
  //   name: 'facebook',
  //   link: 'https://facebook.com'
  // }];
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
  isdocheck:boolean=true;
  requestLength:number = 0;
  unreadNotifications:any[] = [];
  constructor(private routineservice: RoutineService,private _router: Router,private _service: TeammateService,private _nservice: NotificationService, private loginService: LoginService,private xhrService: XhrService, private _http:HttpClient, private fileService:FileOperrationService) {
    
    let userInfo: UserModel = JSON.parse(Config.getUserInfoToken());
    this.loggedInUserDetails = userInfo;
    //console.log('user infohy ========>  ', userInfo);
    this._nservice.notificationTriggered.subscribe(data => {
      //console.log(data);
    })
    this.userName = userInfo.username;
    this.userRole = userInfo.userRole
    if(userInfo.imageName){ 
      this.imageSrc = "https://flyp10.com/public/uploads/images/users/"+userInfo.imageName;
    }
    this.twoFactorEnabled = userInfo.twoFactorAuthEnabled;
    // this.getRequests();
    //this.getAckNotifications();
  }

  ngAfterViewInit() {
   // console.log('afterViewInit => ', this.tabGroup.selectedIndex);
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    //console.log('tabChangeEvent => ', tabChangeEvent);
    //console.log('index => ', tabChangeEvent);
    // tabChangeEvent.stopPropagation();​
  }

  toggled(event) {
   // alert(this.isOpen)
    if(this.isOpen === false){
      this.isOpen = true;
    }else{
      this.isOpen = false;
    }
  }

  getRequests(){
    this.getRequestList(this.loggedInUserDetails._id).subscribe(data => {
      
      let reqData = data['reqData'];
     // console.log('REQQQQ ', data);
      for(var i=0; i< reqData.length; i++){
        if(reqData[i].type === "0" && reqData[i].read === false){
          let requestDetails = {
            RID : reqData[i].notificationProperties.RID,
            notificationId: reqData[i]._id
          }
          this.getUsersByUID(reqData[i].UID, this.requests, requestDetails);
        }
      }
    }, err => {console.log(err)}, () => {
      
    })
  }
  ngDoCheck() {
   // console.log("ngDoCheck");
   var checksidebar = Config.getSidebarchanges()
    if(checksidebar == '1') {
      Config.setSidebarchanges('2')
      this.getAckNotifications();
    }
    let checkBool= Config.getchanges();
	 let checknoti=Config.getNotichanges();
	if(checkBool=='1'){
		//console.log("changes happen in top nav")
		let userInfo: UserModel = JSON.parse(Config.getUserInfoToken());
		if(userInfo.imageName){ 
		   this.imageSrc = "https://flyp10.com/public/uploads/images/users/"+userInfo.imageName;
		   //this.imageSrc = "http://192.168.1.90:3005/public/uploads/images/users/"+userInfo.imageName;
		   Config.setchanges('0');
		}else{
			this.imageSrc=Config.DefaultAvatar;
			Config.setchanges('0');
		}
	}
	 if(checknoti=="1" && this.isdocheck){
		 //console.log("NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
		  this.notifications = [];
          this.requests = [];
		  this.getAckNotifications();
		 Config.setNotichanges('0');
		 Config.setNoticompchanges('1');
		 this.isdocheck=false;
	 }else{
		 Config.setNotichanges('0');
         this.isdocheck=true;
	  }
	
  }
  getAckNotifications(){
    this.getAckList(this.loggedInUserDetails._id).subscribe(data => {
      
      let reqData = data['reqData'];
      // this.notifications = reqData;
     // console.log('REQcccccccccccccccQQQ ', reqData);
	   this.notifications = [];
       this.requests = [];
      for(var i=0; i< reqData.length; i++){
        if(reqData.length){
          let requestDetails = {
            RID : reqData[i].notificationProperties.RID,
            notificationId: reqData[i]._id,
            notificationType: reqData[i].type,
            notificationRead: reqData[i].read,
			notificationTime: reqData[i].addedOn,
			message:reqData[i].message,
          }
          //quick fix for organizer issue
          this.getUsersByUID(reqData[i].notificationProperties.FID, this.notifications, requestDetails);
        }
      } 
    }, err => {console.log(err)}, () => {
     // console.log('notifications', this.notifications)
    })
  }

  markAsRead(user){
    this.notifications = []
   // console.log('mark as unread ', user);
    this.updateReadStatusNotification(user.nid,true);
  }

  acceptRequest(user){
    this.notifications = [];
	this.requests=[];
    let tempObj;
    this._service.getConnectionStatusByID(user.requestId).subscribe(data => {
      //console.log('request data to accept >>>>>>>>>>>.. ', data);
      tempObj = data;
      tempObj.status = "2"
    }, err => console.log(err),
      () => {
        this._service.updateTeamMate(tempObj).subscribe(res => {

         // console.log('response for updating cancel request ', res);      
          
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
	this.requests=[];
    let tempObj;
    this._service.getConnectionStatusByID(user.requestId).subscribe(data => {
      //console.log('request data to declineRequest >>>>>>>>>>>.. ', data);
      tempObj = data;
      tempObj.status = "1"
    }, err => console.log(err),
      () => {
        this._service.updateTeamMate(tempObj).subscribe(res => {

         // console.log('response for updating cancel request ', res);         
          
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
          //console.log('response after notification saved', response);
		  Config.setNoticompchanges('1');	
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
     // console.log('inside notification saved finally ');
     // this.getRequests();
      //this.getAckNotifications();
    })
  }


  updateReadStatusNotification(nid:string,val:boolean) {
    this._service.getNotificationByNID(nid).subscribe(data => {
      //console.log('notifi data ', data);
      if(data){
        var notificationDetails = data;
        notificationDetails.read = val;
        this._service.updateNotification(notificationDetails).subscribe( response => {
          //console.log('response after notification saved', response)
        }, err => {
          //console.log('err ', err);
        }, () => {
          // Swal("Request sent!", "We will notify you once user responds back!", "success");
        })
      }
    }, err => { console.log(err)}, () => {
     // console.log('inside notification saved finally ');
      this.getAckNotifications();
    })
  }

  getUsersByUID(UID, arr:any[], requestDetails){

    // alert(rdata['UID']);
    if(UID){
      this._service.getUserByUserID(UID).subscribe(data => {
        //  console.log('dataaaaa ', data);
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
          if(element.notificationType === "0"){
             this.requests.push(element);
         this.requests.sort((a, b) => new Date(b.notificationTime).getTime() - new Date(a.notificationTime).getTime())
          }
          //console.log('element', arr);
        },err => { console.log(err)}, 
          () => {
         // console.log('inside finally request list ', this.notifications);
        })
    }
    
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

 getAssignedroutine(){
	    this.routineservice.getAssignedroutine(this.loggedInUserDetails._id).subscribe(
        res=>{
				if(res.length>0){
			
                    // console.log("suggestedRoutine",res)	
                      let objTemp: RoutineModel = new RoutineModel();
								objTemp._id = res[0]._id;
								objTemp.routinestatus = '0';
								objTemp.judgedBy=" ";
								objTemp.judgedOn=new Date().toString();
								objTemp.assignedTo=" "
				  this.routineservice.updateAssignedRoutine(objTemp).subscribe(
				   res=>{
					      // Swal("Info","Routine session expired.", "info");	
                            //this.location.back();						   
					 },err=>{
						  //this.errorMessage(err)
								 // Swal("Alert!", "Something bad happened; please try again later.", "info");
		           })					 
				}
      },err=>{
         //this.errorMessage(err)
      }
    )
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

  logout() {
	  this.getAssignedroutine();
    this.loginService.logout();
    this._router.navigate(['/login']);
  }
}
