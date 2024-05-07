import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
import { forkJoin } from 'rxjs';
import { RatingComponent } from '../rating/rating.component';

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
    private ratingDialog: MatDialog,
    private deleteDialog: MatDialog,
    private orderDialog: MatDialog,
    private editProfileDialog: MatDialog,
    private spinner: NgxSpinnerService // Inject NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.currentUserData = JSON.parse(localStorage?.getItem('currentUser') ?? 'null');
    this.getUser();

  }
  currentUserData: any;
  pastOrders: any;
  currentUser: any | undefined;
  userOrders: any;
  isLoading: boolean = true;

  getUser() {
    this._user.getAllRegisterUser().subscribe({
      next: res => {
        const users = res.find((user: any) => {
          return user.id === this.currentUserData.id;
          //return user.email === this.currentUserData.email && user.password === this.currentUserData.password;
        });

        if (users) {
          this.currentUser = users;
          this.temp = users.address
          console.log(this.currentUser);

        }
      }
    })
    this.http.get<any>('http://localhost:3000/order').subscribe((res) => {
      let order = res.map((item: any) => {
        if (item.userId === this.currentUser.id)
          return item;

      });
      order = order.filter((element: any) => {
        return element !== undefined;
      });
      this.userOrders = order;
      console.log('Order', this.userOrders);
      this.isLoading = false;
      this.spinner.hide();
    })

  }

  editAddresspopup(address: any, index: any) {
    const editref = this.editDialog.open(EditDialogComponent, {
      width: '25%',
      data: {
        data: address,
        msg: 'Edit'
      }
    });
    editref.afterClosed().subscribe({
      next: (val) => {
        if (val.close) {

          this.currentUser.address[index] = val.data;
          this._user.updateUser(this.currentUser.id, this.currentUser).subscribe((res) => {
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
  customerRating = {
    userId: '',
    userName: '',
    userRating: '',
    userReview: '',
    userReviewTitle: '',
    ReviewDate: new Date()

  };
 
  // Rating and Review
  rating(item: any, index: any, oid: any) {
    //console.log('item', item);

    const ratingref = this.ratingDialog.open(RatingComponent, {
      width: '50%',
      maxHeight: '500px',
      data: item
    });
    ratingref.afterClosed().subscribe((res) => {

      this.customerRating.userRating = res.data.rating;
      this.customerRating.userReview = res.data.review;
      this.customerRating.userReviewTitle = res.data.reviewTitle;
      this.customerRating.userId = this.currentUser.id;
      this.customerRating.userName = this.currentUser.firstname;

      this._api.getProductApi(item.id).subscribe((res) => {
        //this.data = res.customerReviews
       // console.log('Get Data', res);
       res.customerReviews.push(this.customerRating);
        console.log('Array',res);
        this._api.updateApi(item.id, res).subscribe();
      })
          this.userOrders[oid].order[index].userRating = res.data.rating;
          this.userOrders[oid].order[index].userReview = res.data.review;
          this.userOrders[oid].order[index].userReviewTitle = res.data.reviewTitle;
          this.userOrders[oid].order[index].isReviewed = res.data.isReviewed;
        //  console.log(this.userOrders);
          this.http.patch<any>(`http://localhost:3000/order/${this.userOrders[oid].id}`,this.userOrders[oid]).subscribe((res) => {
         // console.log('res',res);
          this.getUser();
         // console.log(this.userOrders);
          this.toastr.success("Rating added successfully !! ", 'Success Message!', {
            progressBar: true,
            closeButton: true,
          });
      })

    })
  }

  temp: any = [];
  addAddresspopup() {
    const addref = this.editDialog.open(EditDialogComponent, {
      width: '25%',
      data: {
        data: {},
        msg: 'Add'
      }
    });
    addref.afterClosed().subscribe({
      next: (val) => {
        if (val.close) {

          this.temp.push(val.data);
          this.currentUser.address = this.temp;

          this._user.updateUser(this.currentUser.id, this.currentUser).subscribe((res) => {
            this.getUser();
          }
          )

          this.toastr.success("Address added successfully !! ", 'Success Message!', {
            progressBar: true,
            closeButton: true,
          });
        }
      }
    })



  }

  deletepopup(address: any, index: any) {
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
          this.currentUser.address.splice(index, 1)
          this._user.updateUser(this.currentUser.id, this.currentUser).subscribe((res) => {
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

  profileEdit(message: string) {
    console.log('Button Pressed');

    const editProfileref = this.editProfileDialog.open(EditProfileComponent, {
      width: '50%',
      maxHeight: '500px',
      data: {
        user: this.currentUser,
        msg: message
      }
    });
    editProfileref.afterClosed().subscribe({
      next: (val) => {
        if (val.close) {
          console.log(val);

          if (message == 'Name') {
            this.currentUser.firstname = val.data.FirstName;
            this.currentUser.lastname = val.data.LastName;
          }
          if (message == 'Email') {
            this.currentUser.email = val.data;
          }

          if (message == 'Password') {
            this.currentUser.password = val.data;
            this.currentUser.confirmPassword = val.data;
          }

          if (message == 'MobileNumber') {
            this.currentUser.address[0].phoneNumber = val.data;
          }


          this._user.updateUser(this.currentUser.id, this.currentUser).subscribe((res) => {
            console.log("Updated");
            this.getUser();
          })
          this.toastr.success("Profile updated successfully !! ", 'Success Message!', {
            progressBar: true,
            closeButton: true,
          });
        }
      }

    })
  }

  profileDelete() {
    const deleteref = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '39%',
      data: {
        data: this.currentUser,
        hide: false
      }
    });
    deleteref.afterClosed().subscribe({
      next: (val) => {
        if (val) {

          this.userOrders.forEach((element: any) => {
            const deleteRequests = this.http.delete<any>(`http://localhost:3000/order/${element.id}`);
            forkJoin(deleteRequests).subscribe(res => {
              this.getUser();
            });
          })
          this._user.deleteUser(this.currentUser.id).subscribe((res) => {
            console.log("User Deleted");
            this.getUser();
            this.router.navigate(['./login']);
          })
          this.toastr.success("User deleted successfully !! ", 'Success Message!', {
            progressBar: true,
            closeButton: true,
          });
        }
      }
    })
  }


  ViewOrder(order: any) {
    
    const orderRef = this.orderDialog.open(OrderDetailsComponent, {
      width: '75%',
      maxHeight: '600px',
      data: order
    });
   
    this.router.navigate(['/profile',
      { outlets: { 'order-outlet': ['order',order.id] } },
    ]);
  
    orderRef.afterClosed().subscribe(() => {
      this.router.navigate(['/profile']);
    })

  }



}

