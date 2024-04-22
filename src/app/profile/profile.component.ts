import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../Services/api.service';
import { ProductService } from '../Services/product.service';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor(private fb: FormBuilder,
    private _service: ProductService,
    private http: HttpClient,
    private _user: UserService,
    private _api: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private editDialog: MatDialog,
    private deleteDialog:MatDialog,
    private orderDialog :MatDialog,
    private editProfileDialog :MatDialog,
    private spinner: NgxSpinnerService // Inject NgxSpinnerService
  ) { }
  ngOnInit(): void {
    this.spinner.show();
    this.currentUserData = JSON.parse(localStorage?.getItem('currentUser') ?? 'null');
    this.getUser();
  }
  currentUserData: any;
  pastOrders: any;
  currentUser: any;
  userOrders: any;
  isLoading :boolean = true;

  getUser() {
    this._user.getAllRegisterUser().subscribe({
      next: res => {
        const users = res.find((user: any) => {
          return user.id === this.currentUserData.id;
          //return user.email === this.currentUserData.email && user.password === this.currentUserData.password;
        });

        if (users) {
          this.currentUser = users;
          console.log(this.currentUser);
          this.isLoading = false;
          this.spinner.hide();
        }
      }
    })
    this.http.get<any>('http://localhost:3000/order').subscribe((res) => {
      let order = res.map((item: any) => {
        if ( item.userId === this.currentUser.id)
          return item;

      });
      order = order.filter(function (element: any) {
        return element !== undefined;
      });
      this.userOrders = order;
      console.log(this.userOrders);

    })

  }
  
  editAddresspopup(address: any,index:any){
    const editref = this.editDialog.open(EditDialogComponent, {
      width: '25%',
      data: address
    });
    editref.afterClosed().subscribe({
      next: (val) => {
        if(val.close){
       
           this.currentUser.address[index]= val.data;
           this._user.updateUser(this.currentUser.id, this.currentUser).subscribe((res)=>{
            console.log("Updated");
            this.getUser();
           })
           this.toastr.success("Address updated successfully !! ", 'Success Message!', {
            progressBar: true,
            closeButton: true,
        });
      }
      }


    })
  }

  deletepopup(address: any,index:any) {
    const deleteref = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '39%',
      data: {
        data: address,
        hide: false
      }
    });
    deleteref.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.currentUser.address.splice(index,1)
           this._user.updateUser(this.currentUser.id, this.currentUser).subscribe((res)=>{
            console.log("Updated");
            this.getUser();
           })
           this.toastr.success("Address deleted successfully !! ", 'Success Message!', {
            progressBar: true,
            closeButton: true,
        });
        }
      }
    })
  }
  profileEdit(message:string){
    console.log('Button Pressed');
    
    const editProfileref = this.editProfileDialog.open(EditProfileComponent, {
      width: '50%',
      maxHeight:'500px',
      data: {
        user:this.currentUser,
        msg:message
      }
    });
    editProfileref.afterClosed().subscribe({
      next: (val) => {
        if(val.close){
       console.log(val);

       if(message == 'Name'){
           this.currentUser.firstname= val.data.FirstName;
           this.currentUser.lastname= val.data.LastName;
       }
       if(message == 'Email'){
        this.currentUser.email= val.data;
        }

        if(message == 'Password'){
          this.currentUser.password= val.data;
          this.currentUser.confirmPassword= val.data;
      }

      if(message == 'MobileNumber'){
        this.currentUser.address[0].phoneNumber= val.data;
        }
      
      
           this._user.updateUser(this.currentUser.id, this.currentUser).subscribe((res)=>{
            console.log("Updated");
            this.getUser();
           })
           this.toastr.success("Profile updated successfully !! ", 'Success Message!', {
            progressBar: true,
            closeButton: true,
        });
      }}

    })
  }

  profileDelete(){

  }


  ViewOrder(order: any) {
    const orderref = this.orderDialog.open(OrderDetailsComponent, {
      width: '75%',
      maxHeight: '600px',
      data: order
    });
//     orderref.afterClosed().subscribe({
//       next: (val) => {
//   }
// })

}
}

