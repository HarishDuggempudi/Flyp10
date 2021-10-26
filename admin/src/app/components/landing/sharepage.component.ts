import { Component, OnInit, EventEmitter ,ViewChild } from "@angular/core";
import {ActivatedRoute, Router } from '@angular/router';
import {RoutineService} from '../../../admin-app/dashboard-app/components/my-routines/routines.service';
import {RoutineModel,RoutineResponse} from '../../../admin-app/dashboard-app/components/my-routines/routine.model';
@Component({
    selector: "sharepage",
    templateUrl: "./sharepage.html",
    styleUrls: ['./sharepage.scss']
  })

  export class SharePage implements OnInit {
    routineId:string;
    routineObj:RoutineModel= new RoutineModel();
    constructor(private router: Router,private activatedRoute: ActivatedRoute ,private routineservice: RoutineService){
      activatedRoute.params.subscribe(param => this.routineId = param['routineId']);
    }
    ngOnInit(){
       this.getRoutineDetail();
    }
    getRoutineDetail(){
      this.routineservice.getRoutinebyroutineid(this.routineId).subscribe(
        res=>{
          this.routineObj=res;
         // console.log("response Routine",res)
        },
        err=>{
          // console.log("err")
        }
      )
    }
}
    