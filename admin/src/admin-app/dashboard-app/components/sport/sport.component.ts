import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: "sport",
  templateUrl: "./sport.html",
  styleUrls: ['sport.scss']
})
export class SportComponent implements OnInit {
  navLinks: any[] = [
    {label:'Sport', path: '/sport'}, 
    {label: 'Event', path: '/sport/event'},
    {label: 'Level', path: '/sport/level'},
    {label: 'Category', path: '/sport/category'},
    {label: 'Element', path: '/sport/element'},
    {label: 'Element Group', path: '/sport/elementgroup'},
    // {label: 'Base', path: '/sport/base'},
    {label: 'Mapping', path: '/sport/mapping'}, 
    {label: 'Sport Pricing', path: '/sport/pricing'},	
  ];   

  constructor(private router:Router) { }

  ngOnInit() {
  }

  addSport(){
    this.router.navigate(['/sport/editor']);
  }

}
