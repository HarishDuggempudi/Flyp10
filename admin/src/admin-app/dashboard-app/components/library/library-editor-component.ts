import Swal from 'sweetalert2';
import {Component, OnInit} from '@angular/core';
import {LibraryModel} from "./library.model";
import {LibraryService} from "./library.service";
import {FormGroup, Validators, FormBuilder,FormControl} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: "library-editor-component",
  templateUrl: "./library-editor-component.html"
})
export class LibraryEditorComponent {
  
}