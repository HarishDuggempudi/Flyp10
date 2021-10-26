
import {Component, AfterViewInit, OnInit} from '@angular/core';
import { TeammateService } from './teammate.service';
import {Location} from '@angular/common';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import {Config} from "../../../shared/configs/general.config";
import {RoutineService} from "../my-routines/routines.service";
import * as moment from 'moment';
@Component({
  selector: 'team-detail',
  templateUrl: './teammate-details.html',
  styleUrls: ['./team-detail.scss']
})
export class TeammateDetailComponent implements OnInit,AfterViewInit {

  userData:any;
  userRequestData:any;
  imageSrc:any;
  routineList:any=[];
  loginuserinfo:any={}
  constructor(private _service: TeammateService,private router: Router, private route: ActivatedRoute,private routineservice:RoutineService) {
    let userData = this.route.snapshot.paramMap.get('userDetails')
    // this.userRequestData = userData.
    let userInfo = JSON.parse(Config.getUserInfoToken());
    this.loginuserinfo=userInfo;
    this.userData = this._service.teammateData;
    this.getRequestList(this.userData.requestId);
    this.getAllSportDetail(this.userData._id);
    if(this.userData.imageName){
      this.imageSrc ="https://flyp10.com/public/uploads/images/users/"+this.userData.imageName;
    }else{
      this.imageSrc =null;
    }
    
  }

  ngAfterViewInit() {
   
  }

  ngOnInit() {
    //this.getAllSportDetail(this.userData.requestId);
  }
  formatdate(date){
    return moment(new Date(date)).format('L');
  }
 pad(num) {
   return ("0"+num).slice(-2);
 }
 formatduration(secs) {
 var minutes = Math.floor(secs / 60);
 secs =Math.floor(secs%60)

 var hours = Math.floor(minutes/60)
 minutes = minutes%60;
 return this.pad(hours)+":"+this.pad(minutes)+":"+this.pad(secs);
 }
 isSharedWithYou(array,id){
          let len=[]
          len=array.filter(item=>item==id);
          if(len.length>0){
                  return true;
          }else{
             return false;
          }
 }
 commentPage(routineId: string) {
  this.router.navigate(['/routine/details', routineId]);
}
  getAllSportDetail(uid){
    console.log('this.routineList triggered')
    this.routineservice.getsharedRoutinebyUID(uid).subscribe(
      res=>{
             this.routineList=res;
             console.log(this.routineList)
      },
      err=>{
        this.errorMessage(err);
      }
    )
    
}
errorMessage(objResponse: any) {

  if(objResponse.message){
    Swal("Alert !", objResponse.message, "info");
  }
  else{
    Swal("Alert !", objResponse, "info");
  }
 
}
  removeUser(){
 
    this.userRequestData.status = '3';
 
    this._service.updateTeamMate(this.userRequestData).subscribe(res => {
     
      Swal("User removed!", "Don't worry we will not let the removed user know about this action!", "success");
      this.router.navigate(['/team']);
    })
  }

  getRequestList(fid):void{
    this._service.getConnectionStatusByID(fid).subscribe(data => {
       
        this.userRequestData = data;
    })
  }

}

