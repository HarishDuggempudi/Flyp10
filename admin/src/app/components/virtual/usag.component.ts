import { Component, OnInit, Inject, PLATFORM_ID, APP_ID } from "@angular/core";
import Swal from "sweetalert2";
import { Services } from '../../shared/services';


@Component({
    selector: 'Irishdance',
    templateUrl: './usag.component.html',
    styleUrls: ['./virtual.scss']
})

export class USAGComponent implements OnInit{
    constructor(private _service: Services) {
        
       

    }

    ngOnInit() {
       
    }
   
}