import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

    constructor(){}
  ngOnInit():void{
    this.currentUserData = JSON.parse(localStorage?.getItem('currentUser') ?? 'null');
    this.pastOrders = this.currentUserData.order;
    this.userAddress = this.currentUserData.address;
  }
  currentUserData: any; 
  pastOrders: any; 
  userAddress:any
 
  }
 
