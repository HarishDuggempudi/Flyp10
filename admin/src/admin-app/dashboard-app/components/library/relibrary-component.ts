import { Component, OnInit, ChangeDetectorRef, NgZone, ApplicationRef } from "@angular/core";
import {LibraryModel,LibraryResponse} from './library.model'
import {LibraryService} from "./library.service"
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import {TeammateService} from '../teammate/teammate.service';
import Swal from "sweetalert2";
import {Config} from "../../../shared/configs/general.config";
import {RegisterUserModel} from "../user-management/user.model";
import {RoutineModel} from "../my-routines/routine.model";
import {RoutineService} from "../my-routines/routines.service";
import {UserService} from "../user-management/user.service";
import * as moment from 'moment';
@Component({
  selector: "relibrary-component",
  templateUrl: "./relibrary-component.html",
  styleUrls: ['./library.scss']
})
export class RELibraryComponent {
  loginuserinfo:RegisterUserModel;
  routineList:any[] = [];
  loadRoutine:any = {};
  teammatelist:any[]= [];
  videoComment:any= "";
  userDetails:any={};
  dateSort:boolean=false;
  viewSort:boolean=false;
  scoreSort:boolean=false;
  isdateSort:boolean=true;
  isviewSort:boolean=false;
  isscoreSort:boolean=false;
  constructor(public app: ApplicationRef,private _objUserService:UserService, private _service: LibraryService, private routineservice: RoutineService,private router: Router, private _ngZone: NgZone, private teammateservice:TeammateService, private ref: ChangeDetectorRef){
    let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    this.loginuserinfo=userInfo;
    this.loadRoutine = {
      title: "Video Title Goes Here",
      submittedBy: "Mary Ann",
      views: 0,
      sport: "Diving",
      level: "Beginner 1",
      event: "Championship",
      path: "../../../../assets/client/video/flyp10video.mp4",
      videoType: "video/mp4",
      id: "sdfksdlfj",
	  score:"0",
	  awards:"0",
	  athlete:""
    }
  }

  ngOnInit(){
    // this.getConnectedTeammate();
    this.getUserDetail();
    // this.getCommentsByRID("5bf2b24e1367122188be52b2");
    this.getRoutinesById();
  }
  timeAgo(date){
	  return moment(date).fromNow();  
  }
  getUserDetail() {
      this._objUserService.getUserDetail(this.loginuserinfo._id)
          .subscribe(resUser => {
             
            this.userDetails = resUser;
          console.log(this.userDetails)
            //   this.profileval=80;
            // //  this.imageSrc="http://192.168.1.90:3005/"+this.objUser.imageProperties.imagePath;
            //   this.bindDetail(resUser)
          },
              error => this.errorMessage(error));
  }

  postComment(vdata) {

    let comment = {
      uid: this.loginuserinfo._id,
      uname: this.userDetails.firstName + " " + this.userDetails.lastName,
      rid: vdata.id,
      submittedBy: vdata.submittedBy,
      comment: this.videoComment,
      active: true,
	  avatar:this.userDetails.imageName
    }
   
    this._service.addComment(comment).subscribe(data => {
     
      Swal("Comment added!", "Comment is added successfully", "success");
    }, err => {

    }, () => {
      this.refreshVideo(vdata);
    })    
  }

  refreshVideo(video){
    
    this.getCommentsByrid(video.id)    
  }

  getCommentsByrid(vid){
    this._service.getCommentsByRID(vid).subscribe(res => {
     
      this.videoComment = "";
      this.loadRoutine.comments = res;
    })
  }
  
  getRoutinesById(){
    
    this.routineservice.getRelibraryRoutines().subscribe(
      res=>{
        if(res.length){
           this.routineList=res
             /* for (let i = 0; i < res.length; i++) {
               const element = res[i];
              
               if(element.routinestatus === "1")
               this.routineList.push(element);
             } */
        }
        
      },
      err=>{
        this.errorMessage(err);
      },
      () => {
        if(this.routineList.length){
			
             this.playVideo(this.routineList[0]);
			 this.routineList=this.routineList.sort((a, b) => new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime())
		}
       
      }
    )
  }

  getCommentsByRID(vid){
  
    this._service.getCommentsByRID(vid._id).subscribe(res => {
    // console.log(res)
      this.loadRoutine = {
        title: vid.title,
        submittedBy: vid.submittedBy,
        views: vid.view,
        sport: vid.sport,
        level: vid.level,
        event: vid.event,
		score:vid.score,
        path: vid.videofilename,
        videoType: vid.filetype,
        id: vid._id,
        comments: res,
		awards:vid.awards,
		athlete:vid.athlete
      }
    })
  }

  playVideo(video){
   
    this.updateViews(video);
    this.getCommentsByRID(video)    
  }

  updateViews(video){
    
	if(video.view){
		let viewCount=Number(video.view)
		if(!isNaN(viewCount)){
			video.view =viewCount+1;
			this._service.updateViews(video).subscribe(res => {
			  
			})
		}else{
			video.view =1;
			this._service.updateViews(video).subscribe(res => {
			 
			})
		}
	}else{
		video.view =1;
		this._service.updateViews(video).subscribe(res => {
		  
		})
	}
    
  }

  getConnectedTeammate(){
    /**
     * fetching teammate count
     * Teammate status
     * status 0-pending
     * status 2-completed
     */
    this.teammateservice.getTeamMateByUID(this.loginuserinfo._id).subscribe(
      response=>{
            if(response.reqData){
              let res=response.reqData
              if(res.length){
                
                  for(let i=0;i<res.length;i++){
                    let temp=res[i];
                    if(temp.status=='2'){
                      this.getUsersByID(temp.FID, this.teammatelist);
                        //this.teammatelist.push(temp)
                    }
                    else{
                     
                    }

                    if(i==res.length-1){
                      
                    }
                  }
              }else{
              
              }

            }             
      },err=>{
          this.errorMessage(err)
      }, () => {
        // this.getRoutinesById()
      })

      this.teammateservice.getRequestsByFID(this.loginuserinfo._id).subscribe(
        response=>{
          if(response.reqData){
            let res=response.reqData
            if(res.length){
              
                for(let i=0;i<res.length;i++){
                  let temp=res[i];
                  if(temp.status=='2'){
                  // this.teammatelist.push(temp)
                    this.getUsersByID(temp.UID, this.teammatelist);
                  }
                  else{
                    
                  }

                  if(i==res.length-1){
                    
                  }
                }
            }else{
            
            }
          }              
        },err=>{
            this.errorMessage(err)
        }, () => {
          
          // this.getRoutinesById(this.loginuserinfo._id);
        })
      
    }
    /** teammate count fetching end here */
    getUsersByID(id:string, arr:any[]){
    this.teammateservice.getUserByUserID(id).subscribe(data => {
      arr.push(data);
      // this.getRoutinesById(data._id)
    })
  }

  errorMessage(objResponse: any) {
  
    if(objResponse.message){
      Swal("Alert !", objResponse.message, "info");
    }
    else{
      Swal("Alert !", objResponse, "info");
    }
   
  }
  sortLibrary(sortType){
	  
	  if(sortType=='D'){
			  this.isdateSort=true;
			  this.isviewSort=false;
			  this.isscoreSort=false;
		   if(this.dateSort){
			   this.dateSort=!this.dateSort;
			   this.routineList=this.routineList.sort((a, b) => new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime())
		   }else{
			   this.dateSort=!this.dateSort;
			   this.routineList=this.routineList.sort((a, b) => new Date(a.addedOn).getTime() - new Date(b.addedOn).getTime())
		   }
		  
		  
	  }else if(sortType=='V'){
		      this.isdateSort=false;
			  this.isviewSort=true;
			  this.isscoreSort=false;
		  if(this.viewSort){
			   this.viewSort=!this.viewSort;
			   this.routineList=this.routineList.sort((a, b) => Number(b.view) - Number(a.view))
		   }else{
			   this.viewSort=!this.viewSort;
			   this.routineList=this.routineList.sort((a, b) => Number(a.view) - Number(b.view))
		   }
	  }
	  else if(sortType=='S'){
		      this.isdateSort=false;
			  this.isviewSort=false;
			  this.isscoreSort=true;
		  if(this.scoreSort){
			   this.scoreSort=!this.scoreSort;
			   this.routineList=this.routineList.sort((a, b) => Number(b.score) - Number(a.score))
		   }else{
			   this.scoreSort=!this.scoreSort;
			   this.routineList=this.routineList.sort((a, b) => Number(a.score) - Number(b.score))
		   }
	  }
  }
}
