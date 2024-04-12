import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../Services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
constructor(private activeRoute:ActivatedRoute,
  private http:HttpClient,private _service: ProductService,private _snackBar: MatSnackBar, private spinner: NgxSpinnerService // Inject NgxSpinnerService
  )
{}
badgeCount: number | undefined;
id:any;
  isLoading: boolean = true;
product:any;
url: string = "https://fakestoreapi.com/products/";
ngOnInit(){
  this.spinner.show();
  this.activeRoute.paramMap.subscribe((params)=>{ this.id = params.get('productId')})         //    ['productId'];
  this.getProduct();
  this.badgetotal();

}
getProduct(){
  this.http.get<any>(this.url+this.id).subscribe({
    next: (res) => {
      this.product= res;
      console.log(this.product);
      this.isLoading = false;
      this.spinner.hide(); // Hide spinner once data is loaded
    },
    error: console.log,

  })
}

getItemQuantity(item: any): number {

  return item.quantity || 1; // Default quantity is 1 if not set
}

updateQuantity(event: Event,  item: any): void {
  const value = (event.target as HTMLInputElement).value;
  //console.log();

  this.product.quantity = value;
  const amount = item.price * this.getItemQuantity(item)
  this.product.amount = amount;
  this.product.id = this.product.id.toString();
  //console.log(this.product, 'new')
}

addtocart(event:any, product:any){
console.log("Sumbitted")
this._service.postItem(product).subscribe({
  next: (res) => {
    this.badgetotal();
    this._snackBar.open('Item Added to Cart', 'OK', {
      duration: 2000
    });
   // this.toastr.success("Item Added Successfully !! ", 'Success Message!');
  }
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
}
