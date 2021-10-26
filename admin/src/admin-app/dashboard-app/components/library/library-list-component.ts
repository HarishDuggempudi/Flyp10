import { Component, OnInit } from "@angular/core";
import {LibraryModel,LibraryResponse} from './library.model'
import {LibraryService} from "./library.service"
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
@Component({
  selector: "library-list-component",
  templateUrl: "./library-list-component.html"
})
export class LibraryListComponent  {
  
   
  
    constructor(private router: Router, private _objService: LibraryService) {}
  
  }