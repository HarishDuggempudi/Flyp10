import { Component, OnInit, Inject, ViewChild, Injectable  } from "@angular/core";
import {LoginService} from '../../../login-app/components/login/login.service';
import {Config} from "../../../shared/configs/general.config";
import {UserModel} from "../user-management/user.model";
import { TeammateService } from './teammate.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import Swal from 'sweetalert2';
import { request } from "http";
import {DialogOverviewExampleDialog} from './dialog-overview-example-dialog';
// export * from './addteam.component';
import * as moment from 'moment';
@Component({
  selector: "addteam",
  templateUrl: "./addteam.html",
  styleUrls: ['./addteam.scss'] 
})

@Injectable()

export class AddTeamComponent implements OnInit {
  usersList: any[] = [];
  searchInput: string = '';
  selectedUser:any = {};
  showUser:boolean = false;
  showDetails:boolean = false;
  filteredItems:any[] = [];
  loggedInUserDetails:UserModel;
  requestRes:string='';
  requestBtnText:string = 'Add as teammate';
  reqBtnColor:string = '#2f3090';
  requestSent:string = "";
  showReqData:number = 0;
  requestData:any[] = [];
  reqUserData:any = {};
  userFound:boolean;
  searchedUser:any={};
  searchVal:string="";
  imageSrc:any;
  userData:any;
  requestedData:any=[];
  constructor(private loginService: LoginService, private _service: TeammateService,public dialog: MatDialog) {
    
    
    this._service.listen().subscribe( (m:any) => {
    
            this.onFilterClick(m);
    })
    let userInfo: UserModel = JSON.parse(Config.getUserInfoToken());
 
    this.loggedInUserDetails = userInfo;
    // this.getUserList();
    this.getTeamMatesByUID(this.loggedInUserDetails._id);
    
    
  }

  onFilterClick(event) {
    
  }
  
  ngOnInit() {
    
  }
  timeAgo(date){
	  return moment(date).fromNow();  
  }

  /* == Status codes for adding users ==
      requested = 0,
      cancelled = 1,
      accepted = 2,
      removed = 3
  */

  // Function to add a new teammate

  addTeammate(userDetails) {
    this.userData = userDetails;
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '450px',
      data: { passphrase: this.userData.passphrase }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.showUser = false;
      this.searchInput = "";
    
      if(result){
       
        let user = {
          UID: this.loggedInUserDetails._id,
          FID: userDetails._id,
          status: '0',
        }


        const notificationData = {
          UID: userDetails._id,
          type: '0',
          read: false,
          message: 'New friend request from ',
          notificationProperties: {
            FID: this.loggedInUserDetails._id,
            RID: ''
          }
          
        }
      
        // if user cancels a request, following code changes status as "0" back

        if(JSON.stringify(this.searchedUser)!= '{}' && this.searchedUser != undefined){
          this.searchedUser.status = "0";
          this._service.updateTeamMate(this.searchedUser).subscribe(res => {
          
            this.requestSent = "0";
           
            notificationData.notificationProperties.RID = res.savedData._id
           
            this.updateNotification(notificationData);
			this.getTeamMatesByUID(this.loggedInUserDetails._id);
          })
        }

        // if a user is newly sending request, following code sets status as "0"

        else{
       
          this._service.addTeamMate(user).subscribe(res => {  
            if(res['status'] === 200){
              this.requestRes = res['message'];
              this.getTeamMatesByUID(this.loggedInUserDetails._id);
                   
              this.requestSent = "0";
			  this.searchedUser=null;
             
              notificationData.notificationProperties.RID = res['savedData']._id
              
              this.saveNotification(notificationData);
            }      
          })
        }
      }else{
        this.usersList = [];
      }

    });
  }

  updateNotification(data) {
    this._service.saveNotification(data).subscribe( response => {
     
    }, err => {
      
    }, () => {
      this.checkRequestStatusByFID(this.userData._id);
      Swal("Request sent!", "We will notify you once user responds back!", "success");
      this.showUser = false;
    })
  }

  saveNotification(data) {
    this._service.saveNotification(data).subscribe( response => {
      
      
    }, err => {
     
      
    }, () => {
      this.checkRequestStatusByFID(this.userData._id);
      Swal("Request sent!", "We will notify you once user responds back!", "success");
      this.showUser = false;
      this.searchInput = "";
    })
  }

  cancelRequest(){
   
    
    this.searchedUser.status = '3';
    this._service.updateTeamMate(this.searchedUser).subscribe(res => {
     
      
      if(res){
       
        
        this.requestSent = "1";
        this.showUser = false;
        this.searchInput = "";
        Swal("Request cancelled!", "Phew! It happens", "success");
      }else{
        this.showUser = false;
        this.searchInput = "";
        Swal("Operation failed!", "Operation failed! Please try again", "error");
      }
    })
  }

  getTeamMatesByUID(uid){
    this._service.getTeamMateByUID(uid).subscribe(data => {
      
      
       this.requestData = data['reqData'];
	   this.getRequestedArray(this.requestData);
    })
  }
  getRequestedArray(array){
	  this.requestedData=[];
    if(array.length>0){	
		 for(let i=0;i<array.length;i++){
      
      
			 let temp=array[i]
			 if(temp.status=='0'){
				  this._service.getUserByUserID(temp.FID).subscribe(data => {
          
            
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
						requestId: temp._id,
						reqOn:temp.addedOn
					  }
					     this.requestedData.push(element);
						 this.requestedData=this.requestedData.sort((a, b) => new Date(b.reqOn).getTime() - new Date(a.reqOn).getTime())
					})
			 }
		 }
	}
    /* this._service.getUserByUserID(rdata['UID']).subscribe(data => {
      console.log('dataaaaa ', data);
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
        requestId: rdata['_id']
      }
      arr.push(element);
      console.log('arr.push ', arr);
    }) */
  }
  openDetails(userDetails){
    this.showDetails = true;
   
    
    this.selectedUser = userDetails;
    this.checkRequestStatusByFID(this.selectedUser._id);
  }

  setSearchedUser(user){
    this.checkRequestStatusByFID(user._id);
  }

  checkRequestStatusByFID(fid:string){
	   this.searchedUser={};
    this._service.getRequestsByFID(fid).subscribe(data => {
      if(data){
        this.userFound = true;
        let reqData = data['reqData'];
       
        
        if(reqData.length){
          for (let index = 0; index < reqData.length; index++) {
            const element = reqData[index];
            if(element.UID === this.loggedInUserDetails._id ){
              this.searchedUser = element;
              this.requestSent = element.status;
              break;
            }else{
              this.requestSent = "";
            }            
          }
        }else{
          this.checkRequestStatusByUID(fid)
          this.requestSent = "";
        }
      }else{
        this.userFound = false;
      }      
    })
  }

  checkRequestStatusByUID(uid:string){
	   this.searchedUser={};
    this._service.getTeamMateByUID(uid).subscribe(data => {
      if(data){
        this.userFound = true;
        let reqData = data['reqData'];
        
        if(reqData.length){
          for (let index = 0; index < reqData.length; index++) {
            const element = reqData[index];
            if(element.FID === this.loggedInUserDetails._id && element.UID===uid){
              this.searchedUser = element;
              this.requestSent = element.status;
              break;
            }else{
              this.requestSent = "";
            }            
          }
        }else{
          this.requestSent = "";
        }
      }else{
        this.userFound = false;
      }      
    })
  }

  onSearchChange(val){
    val = this.searchVal;
    this.showUser = false;
    // if(!val.length){
    //   this.getUserList();
    // }
    // this.searchedUser = {}
    // this.showDetails = false;
    // if(!val || val.length < 24){
    //   this.requestRes = "";
    //   this.getUserList();
    // }
    // if(val.length == 24){
    //   this.checkRequestStatusByFID(val);
    //   console.log('request data ======> ', this.requestData);

    // }      
    this.usersList = this.usersList.filter((item) => {
      if(item.username && val){
          if(item.username.toLowerCase().indexOf(val.toLowerCase()) > -1){
            return true;
          }else{
            return false;
          }
        }
      });
      
  }

  searchUsername(){
    // this.showDetails = false;
    this.showUser = true;
    this.imageSrc=null;
	this.usersList=[];
	this.selectedUser={};
   
    this._service.getUserDetailsByUsername(this.searchInput).subscribe(
      data => {
        if(data['reqData'].length){
          this.usersList = [];
        
          let userData = data['reqData'];
         
          if(userData[0].username !== this.loggedInUserDetails.username){
            this.usersList.push(userData[0]);
           
            if(userData[0].imageName){ 
              this.imageSrc = "https://flyp10.com/public/uploads/images/users/"+userData[0].imageName;
             
            }
          }else{
            this.searchInput = "";
            Swal("That's yours!", "You cannot add yourself as teammate", "error");
          }
          
         
        }else{
          Swal("User not found!", "Please check the username and try again", "error");
        }        
      }
    )
  }

  getUserList() {
    this._service.getUserList()
    .subscribe(resUser => {
      this.usersList = resUser.dataList;
     
      for (var i = 0; i < this.usersList.length; i++)
        if (this.usersList[i]._id && this.usersList[i]._id === this.loggedInUserDetails._id) { 
            this.usersList.splice(i, 1);
            break;
      }
      
    }) 
  }

}
