import { Component, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { USAGRoutineService } from "./usag-routine.service";
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { MatTableDataSource } from "@angular/material";


@Component({
  selector: "usag-routine",
  templateUrl: "./usag-organizer-routine.list.html",
  styleUrls: ['../routine-list.scss']
})
export class USAGRoutineListComponent implements OnInit {
  eventid: any;
  navLinks: any[]
  constructor(private router:Router,private activatedRoute: ActivatedRoute,private _Service:USAGRoutineService){
    this.activatedRoute.params.subscribe(param => {
      //  console.log("sdsds",param['id'])
        this.eventid = param['eventId']
        this.navLinks = [
          {label: 'New Routine', path: '/usag-admin-routine/routine-management/eventmeet/'+this.eventid+'/newRoutine'}, 
          {label: 'InQueue Routine', path: '/usag-admin-routine/routine-management/eventmeet/'+this.eventid+'/queueRoutine'}, 
          {label: 'Judged Routine', path: '/usag-admin-routine/routine-management/eventmeet/'+this.eventid+'/judgedRoutine'},
        
         // {label: 'Setting', path: '/profile/setting'}
     ];
    })
  
  }

  ngOnInit(): void {  
     
  }
}