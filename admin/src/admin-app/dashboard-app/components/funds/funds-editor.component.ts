
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import Swal from "sweetalert2";
import {RegisterUserModel, UserResponse} from "../user-management/user.model";
import {Config} from "../../../shared/configs/general.config";
import {FundsService} from "./funds.service";
import {FundsModel} from "./funds.model";
import {UserService} from "../user-management/user.service";
import * as moment from 'moment';
@Component({
  selector: "funds-judge-list",
  templateUrl: "./funds-editor.html",
  styles: ['./funds.scss']
})
export class FundsEditorComponent implements OnInit {

  constructor() {
	    
  }
  ngOnInit() {
	 
   }
}
