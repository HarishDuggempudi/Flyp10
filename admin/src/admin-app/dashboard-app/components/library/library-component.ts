import { Component, OnInit, ChangeDetectorRef, NgZone, ApplicationRef } from "@angular/core";
import {LibraryModel,LibraryResponse} from './library.model'
import {LibraryService} from "./library.service"
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import {TeammateService} from '../teammate/teammate.service';
import Swal from "sweetalert2";
import {Config} from "../../../shared/configs/general.config";
import {RegisterUserModel} from "../user-management/user.model";
import {RoutineModel} from "../my-routines/routine.model";
import {RoutineService} from "../my-routines/routines.service";
import {UserService} from "../user-management/user.service";
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from "../dashboard/dashboard.service";
import { resolve } from "url";
@Component({
  selector: "library-component",
  templateUrl: "./library-component.html",
  styleUrls: ['./library.scss']
})
export class LibraryComponent {
 
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
  routineId: any;
  idRoutine: any[]=[];
  teammates: any[]=[];
  constructor(private objService:DashboardService,public spinner:NgxSpinnerService,public activatedRoute:ActivatedRoute,public app: ApplicationRef,private _objUserService:UserService, private _service: LibraryService, private routineservice: RoutineService,private router: Router, private _ngZone: NgZone, private teammateservice:TeammateService, private ref: ChangeDetectorRef){
   
    activatedRoute.queryParams.subscribe(param => this.routineId = param['id']);
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
   
    // this.getUserDetail();

   this.getTeammatesDetails()
    this.spinner.show();
 

  }
  timeAgo(date){
	  return moment(date).fromNow();  
  }
  getUserDetail() {
      this._objUserService.getUserDetail(this.loginuserinfo._id)
          .subscribe(resUser => {
        
            this.userDetails = resUser;
      
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
  
  getRoutinesById(id){
   
    //console.log('idddddd',id)
    this.routineservice.getRotineByuserId(id).subscribe(
      res=>{
        if(res.length){
        
             for (let i = 0; i < res.length; i++) {
               const element = res[i];
               if(this.routineId==element._id){
                this.idRoutine.push(element)
              }
               if(element.routinestatus === "1"){
                this.routineList.push(element);
               }
               
             }
        }
      },
      err=>{
        this.errorMessage(err);
      },
      () => {
       //console.log('troutine listtt',this.routineList)
       this.sortLibrary('D')
      if(this.idRoutine.length){
          this.playVideo(this.idRoutine[0])       
      }else if(this.routineList.length){
        this.playVideo(this.routineList[0])       
      }

      }
    )
  }

  commentPage(routineId: string) {
  this.router.navigate(['/routine/details', routineId]);
}
  getsharedRoutinebyUID(id){
   
    //console.log('idddddd',id)
    this.routineservice.getsharedRoutinebyUID(id).subscribe(
      res=>{
        if(res.length){
        
             for (let i = 0; i < res.length; i++) {
               const element = res[i];
               if(this.routineId==element.rountineInfo._id){
                this.idRoutine.push(element.rountineInfo)
              }
               if(element.rountineInfo.routinestatus === "1"){
                this.routineList.push(element.rountineInfo);
               }
               
             }
        }
      },
      err=>{
        this.errorMessage(err);
      },
      () => {
       //console.log('troutine listtt',this.routineList)
       this.sortLibrary('D')
      if(this.idRoutine.length){
          this.playVideo(this.idRoutine[0])       
      }else if(this.routineList.length){
        this.playVideo(this.routineList[0])       
      }

      }
    )
  }

  getCommentsByRID(vid){
    this._service.getCommentsByRID(vid._id).subscribe(res => {
	  
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
 
    

      this.router.navigate(['/library'],{ queryParams: { id: video._id } });
        this.getCommentsByRID(video)
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


  getTeammatesDetails(){
    this.getTeammatesList().then(data => {
      
      let teammatesId = [];
      data.map(requestDetail => {
        

        const teammateId = (requestDetail.UID === this.loginuserinfo._id) ? requestDetail.FID : requestDetail.UID;
        teammatesId.push(teammateId);
      });

      this.teammates = teammatesId;
      
      this.getRoutinesById(this.loginuserinfo._id)
      
     for(let i=0;i<this.teammates.length;i++){

      this.getsharedRoutinebyUID(this.teammates[i])

     }
   
      
    })
  }

  getTeammatesList():Promise<any>{
    return new Promise((resolve, reject)=> {
       this.objService.getAcceptedByUID(this.loginuserinfo._id).subscribe(response => {
        const responseArr = response['response'];
        resolve(responseArr);
       })
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
			   this.routineList=this.routineList.sort((a, b) => new Date(b.judgedOn).getTime() - new Date(a.judgedOn).getTime())
		   }else{
			   this.dateSort=!this.dateSort;
			   this.routineList=this.routineList.sort((a, b) => new Date(a.judgedOn).getTime() - new Date(b.judgedOn).getTime())
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
