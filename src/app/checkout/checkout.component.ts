import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../Services/product.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../Services/api.service';
import { UserService } from '../Services/user.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  addressForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private _service: ProductService,
    private http: HttpClient,
    private _user: UserService,
    private _api: ApiService,
    private editDialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  cartItems: any = [];
  
  pincodeURL: string = "https://api.postalpincode.in/pincode/";
  typesOfPayments: string[] = ['UPI', 'Debit Card', 'Credit Card', 'Net Banking', 'Cash on Delivery'];
  currentUserData: any

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.minLength(6)]],
     
    });
    this.getdata();
    this.getUser();
       
  }

  getpincode() {
    const pincode = this.addressForm.value.pinCode;
    this.http.get<any>(this.pincodeURL + pincode).subscribe((res) => {
      if (res[0].Status === 'Success') {
        //console.log(res);
        // this.addressForm.get('city')?.disable();
        // this.addressForm.get('state')?.disable();
        this.addressForm.get('city')?.setValue(res[0].PostOffice[0].District);
        this.addressForm.get('state')?.setValue(res[0].PostOffice[0].State);
      }

    })
  }

  getdata() {
    this._service.getItem().subscribe({
      next: (res) => {
        this.cartItems = res;
        
        this.currentUserData = JSON.parse(localStorage?.getItem('currentUser') ?? 'null')
        //console.log(this.currentUserData);
      },
      error: console.log,

    })
  }
  getUser(){
    this._user.getAllRegisterUser().subscribe({
      next: res =>{
      const users = res.find((user:any) =>{
        return user.id === this.currentUserData.id;
        //return user.email === this.currentUserData.email && user.password === this.currentUserData.password;
      });
      
      if(users){
        this.currentUser = users;
        this.address = users.address
      }
    }
  })
  }
  totalAmount:any;
  calculateTotal(): number {
   let total =0;
    for (const item of this.cartItems) {
      total += item.amount;
    }
    this.totalAmount = total;
    return total;
  }
  address: any = [];
  temp:any;
  currentUser:any;

  onAddressSubmit() {
    this.addressBox = true;
    if (this.addressForm.valid) {
         this.temp= this.addressForm.value
         this.address.push(this.temp);
          this.currentUser.address = this.address;
  
           this._user.updateUser(this.currentUser.id, this.currentUser).subscribe((res)=>{
            console.log("Updated");
            this.getUser();
           }
           )}
    
      this.addressForm.reset();
      this.showForm = false;
      this.toastr.success("Address added successfully !! ", 'Success Message!', {
        progressBar: true,
        closeButton: true,
    });
  }
  

  showForm: boolean = false; // Flag to show/hide add address form
  addressBox : boolean = true;
  ShippingAddress :any;
  selectAddress(address: any) {
    // Logic to select address
    this.ShippingAddress = address;
    console.log('Selected address:', address);
     this.nextStep();
  }
  editAddresspopup(address: any,index:any){
    const editref = this.editDialog.open(EditDialogComponent, {
      width: '25%',
      data: address
    });
    editref.afterClosed().subscribe({
      next: (val) => {
        if(val.close){
        //console.log('patch val',val);
        this.address[index]= val.data;
        //console.log('up', this.address)
        this.currentUser.address = this.address;
  
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
  showAddAddressForm() {
    // Show add address form
    this.showForm = true;
    this.addressBox = false;
  }

  hideAddAddressForm() {
    // Hide add address form
    this.showForm = false;
    this.addressBox = true;
  }
  

  onSelectionChange(event :any) {
        console.log('Selected Payment:', event.selectedOptions.selected[0]._value);
        this.orders.paymentType = event.selectedOptions.selected[0]._value;
  }

  orders = {
    userId: '',
    order: [],
    address:'',
    paymentType:'',
    amount:'',
    orderDate:new Date(),
  };
  
  placeOrder() {
    
    this.orders.userId = this.currentUser.id;
    this.orders.address = this.ShippingAddress;
    this.orders.order = this.cartItems;
    this.orders.amount = this.totalAmount;
    console.log(this.orders);
    this.http.post<any>('http://localhost:3000/order', this.orders).subscribe(()=>{
      console.log("Order placed Successfully!!");
      this.clear();
    })
    this.toastr.success("Order placed successfully !! ", 'Success Message!', {
      progressBar: true,
      closeButton: true,
    });
   
  }

  clear() {
    const selectedIds = this.cartItems.map(((ele: { id: any; }) => ele.id));
    //console.log(selectedIds);
    const deleteRequests = this.cartItems.map((item: any) => this.deleteItem(item))
    forkJoin(deleteRequests).subscribe(
      res => {
        this.getdata();
        // console.log(res);
      });
  }

  deleteItem(item: any) {
    const id = item.id
    this._service.deleteItem(id).subscribe({
      next: (res) => {
        item.addedToCart = false;
        item.amount = 0
        item.quantity = 0;
        //console.log(item);
        this._api.updateApi(item.id, item).subscribe()
        this.getdata();
        this.router.navigate(['/dashboard']);
      }
    })
  }
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
