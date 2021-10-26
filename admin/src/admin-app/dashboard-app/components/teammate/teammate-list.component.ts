import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { TeammateService } from './teammate.service';
import {Config} from "../../../shared/configs/general.config";
import {UserModel} from "../user-management/user.model";
import Swal from 'sweetalert2';

@Component({
  selector: "team-list",
  templateUrl: "./teammate-list.html",
  styleUrls: ['./teammate-list.scss']
})
export class TeamListComponent implements OnInit {

   /* Pagination */
   pageSizeOptions = [5, 10, 25, 50, 100];
   perPage:number = 10;
   currentPage:number = 1;
   totalItems:number = 1;
   preIndex:number = 0;
   imageSrc:any;
   /* End Pagination */
   requestUserData:any[]=[];
   usersList:any[] = [];
   loggedInUserDetails:UserModel;
   requests:any[]=[];
   requestStatus = "";
   connectedUsers:any[] = [];
   connectedUsersList:any[]=[]
  filteredusersList: any[] =[];
  constructor(private router: Router, private _service: TeammateService){
    let userInfo: UserModel = JSON.parse(Config.getUserInfoToken());
  
    this.loggedInUserDetails = userInfo; 
    this.getRequestList(userInfo._id);
  }
  
  ngOnInit() {
    
  }

  addTeamMate() {
    this.router.navigate(['/team/add-teammate']);
  }

  viewUserDetails(userDetails){
   
    this._service.setTeammateData(userDetails);
    // this._service.setTeammateRequestData(this.connectedUsersList)
    this.router.navigate([`/team/teammate/${userDetails._id}`]);
  }

  getUserList(fid) {
    this.usersList = [];
    this.filteredusersList =[]
    this._service.getRequestsByFID(fid).subscribe(data => {
      
      let reqData = data['reqData'];
      for(var i=0; i< reqData.length; i++){
        if(reqData[i].status === "2"){

          this.getUsersByUID(reqData[i], this.usersList, i);
         
        }
      }      
    }, err => console.log(err), 
      () => {
        
        this._service.getTeamMateByUID(fid).subscribe(data => {
          let reqData = data['reqData'];
          for(var i=0; i< reqData.length; i++){
            if(reqData[i].status === "2"){
              this.getUsersByFID(reqData[i], this.usersList, i);
            }
          }
        }, err => console.log(err),
          () => {
           
          }
        )
      }
    )
  }

  getRequestList(fid){
    this.usersList = [];
    this.filteredusersList =[]
    this.requestUserData = [];
    this._service.getRequestsByFID(fid).subscribe(data => {
     
      let reqData = data['reqData'];
      for(var i=0; i< reqData.length; i++){
        if(reqData[i].status === "0"){
        
          this.requests.push(reqData[i]);
          this.getUsersByUID(reqData[i], this.requestUserData,i)
          // this.getUserList(fid);
        }
      }      
    }, err => {console.log(err)},      
      () => {
       
        this.getUserList(fid);   
      }
    )
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.filteredusersList=this.usersList.filter(user => (user.firstName.toLowerCase().indexOf(filterValue) > -1 || user.lastName.toLowerCase().indexOf(filterValue) > -1 || user.username.toLowerCase().indexOf(filterValue) > -1 ))
  }

  // getTeamMatesByUID(uid){
  //   let tempObj = {
  //     requestData: [],
  //     usersData: []
  //   }
  //   this._service.getTeamMateByUID(uid).subscribe(data => {
  //     console.log('users by uid ', data['reqData']);
  //     let users = data['reqData'];
  //     for (let i = 0; i < users.length; i++) {
  //       if(users[i].status === "2"){
  //         this.connectedUsers.push(users[i])
  //         // tempObj.requestData.push(users[i]);
  //         // this.getUsersByID(users[i].FID, tempObj.usersData);
  //         this.getUsersByID(users[i].FID, this.usersList);
  //       }        
  //     }
  //   })
  // }

  getUsersByFID(rdata:string, arr:any[], index){
   
    this._service.getUserByUserID(rdata['FID']).subscribe(data => {
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
      this.filteredusersList = JSON.parse(JSON.stringify(this.usersList));
      
    })
  }

  getUsersByUID(rdata:string, arr:any[], index){

    // alert(rdata['UID']);
    this._service.getUserByUserID(rdata['UID']).subscribe(data => {
    
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
      this.filteredusersList = JSON.parse(JSON.stringify(this.usersList));
     
    })
  }

  getUsersByID(id:string, arr:any[]){
    this._service.getUserByUserID(id).subscribe(data => {
      arr.push(data);
    })
  }

  acceptRequest(request){
  
    this.requestUserData = [];
    this.usersList = [];
    this.filteredusersList =[]
    let tempObj;
    this._service.getConnectionStatusByID(request.requestId).subscribe(data => {
     
      tempObj = data;
      tempObj.status = "2"
    }, err => console.log(err),
      () => {
        this._service.updateTeamMate(tempObj).subscribe(res => {

        
          Swal("Teammate added!", "Teammate has been added to your existing team!", "success");         
          
        }, err => console.log(err), 
          () => {
            this.getRequestList(this.loggedInUserDetails._id);
          }
        )
      }
    )
  }



}
