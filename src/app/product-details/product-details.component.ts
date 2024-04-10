import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
constructor(private activeRoute:ActivatedRoute,
  private http:HttpClient,
  )
{}
id:string | undefined;
product:any;
url: string = "https://fakestoreapi.com/products/";
ngOnInit(){
  this.id = this.activeRoute.snapshot.params['productId'];
  this.getProduct();
}
getProduct(){
  this.http.get<any>(this.url+this.id).subscribe({
    next: (res) => {
      this.product= res;
      console.log(this.product);
     
    },
    error: console.log,

  })
}
}

