import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../Services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../Services/api.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  constructor(private activeRoute: ActivatedRoute,
    private router:Router,
    private http: HttpClient,
    private _user: UserService,
    private _service: ProductService,
    private _api: ApiService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService // Inject NgxSpinnerService
  ) { }

  badgeCount: number | undefined;
  id: any;
  isLoading: boolean = true;
  product: any;
  //url: string = "https://fakestoreapi.com/products/";

  ngOnInit() {
    this.spinner.show();
    this.activeRoute.paramMap.subscribe((params) => { this.id = params.get('productId');       //    ['productId'];
    this.currentUserData = JSON.parse(localStorage?.getItem('currentUser') ?? 'null');
    this.getProduct();
    this.badgetotal();
    this.getUser();
  }) 
  }

  currentUserData: any;
  pastOrders: any;
  currentUser: any| undefined;
  userOrders: any;
  temp:any=[];
  customerReviews:any=[];
  selectedProductCategory:string = '';
  similarProducts:any = [];
  getUser() {
    this._user.getAllRegisterUser().subscribe({
      next: res => {
        const users = res.find((user: any) => {
          return user.id === this.currentUserData.id;
        });

        if (users) {
          this.currentUser = users;
          this.temp = users.address
          console.log(this.currentUser);
         
        }
      }
    })
    this._api.getProductApi(this.id).subscribe(res =>{
      this.customerReviews = res.customerReviews
      this.selectedProductCategory = res.category;
      console.log('Reviews',this.selectedProductCategory);
      this._api.getProductByCategory(this.selectedProductCategory).subscribe(result => {
        this.similarProducts = result;
        console.log('Similiar Product', this.similarProducts)
   })
    });

 
    this.http.get<any>('http://localhost:3000/order').subscribe((res) => {
      let order = res.map((item: any) => {
        if (item.userId === this.currentUser.id)
          return item;

      });
      order = order.filter( (element: any) => {
        return element !== undefined;
      });
      this.userOrders = order;
      console.log('Order',this.userOrders);
     
    })

  }



  getProduct() {
    //this.http.get<any>(this.url + this.id).subscribe({
    this._api.getProductApi(this.id).subscribe({  
    next: (res) => {
        this.product = res;
        console.log(this.product);
        this.isLoading = false;
        this.spinner.hide(); // Hide spinner once data is loaded
      },
      error: console.log,

    })
  }

  getItemQuantity(item: any): number {

    return item.quantity || 0; // Default quantity is 1 if not set
  }

  updateQuantity(event: Event, item: any): void {
    const value = (event.target as HTMLInputElement).value;
    //console.log();

    this.product.quantity = value;
    const amount = item.price * this.getItemQuantity(item)
    this.product.amount = amount;
    this.product.id = this.product.id.toString();
    //console.log(this.product, 'new')
  }

  addtocart(product: any) {
    console.log("Sumbitted")
    product.addedToCart = true;
    this._api.updateApi(product.id, product).subscribe((res: any) => console.log('patch', res))
    this._service.postItem(product).subscribe({
      next: (res) => {
        this.badgetotal();
        this._snackBar.open('Item Added to Cart', 'OK', {
          duration: 2000
        });

      }
    })
  }

  updatetocart(product: any){
    console.log(product)
    this._api.updateApi(product.id, product).subscribe((res: any) => console.log('patch', res))
    this._service.updateItem(product.id, product).subscribe((res: any) => {
      console.log('patch', res)
      this._snackBar.open('Item Added to Cart', 'OK', {
        duration: 2000
      });
    })
  }


  badgetotal() {
    this._service.getItem().subscribe({
      next: (res) => {
        this.badgeCount = res.length
        //this.badgevisibility = false;
      }
    })
  }

  similiar(item:any){
    this.router.navigate(['/dashboard/product/',item.id]);
  
  }
}
