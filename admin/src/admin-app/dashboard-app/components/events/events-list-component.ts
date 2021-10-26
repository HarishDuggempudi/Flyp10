import { Component, OnInit } from "@angular/core";
//import {FaqModel,FaqResponse} from './events.model'
import {EventsService} from "./events.service"
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
@Component({
  selector: "events-list-component",
  templateUrl: "./events-list-component.html"
})
export class EventsListComponent implements OnInit {
  
    
  
    ngOnInit() {
       
    }
  
    constructor(private router: Router, private _objService: EventsService) {}
  

}
