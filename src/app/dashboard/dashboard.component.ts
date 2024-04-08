import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private http: HttpClient, private _service: ProductService,
     private toastr: ToastrService, private router: Router) { }
  title = 'Shopping';
  badgevisibility = true;
  badgeCount = 0;
  registerArr: any[] = [];
  url: string = "https://fakestoreapi.com/products";
  quantity: number = 1;

  ngOnInit(): void {
    this.getdata();
    this.badgetotal();
  }


  getdata() {
    this.http.get<any>(this.url).subscribe({
      next: (res) => {
        this.registerArr = res;
        //console.log(this.registerArr);
      },
      error: console.log,

    })
  }
  getItemQuantity(item: any): number {

    return item.quantity || 0; // Default quantity is 0 if not set
  }

  updateQuantity(event: Event, index: number, item: any): void {
    const value = (event.target as HTMLInputElement).value;
    console.log();

    this.registerArr[index].quantity = value;
    const amount = item.price * this.getItemQuantity(item)
    this.registerArr[index].amount = amount;
    this.registerArr[index].id = this.registerArr[index].id.toString();
  }

  calculateTotal(): number {
    let total = 0;
    for (const item of this.registerArr) {
      total += item.price * this.getItemQuantity(item);
    }
    return total;
  }
  badgetotal() {
    this._service.getItem().subscribe({
      next: (res) => {
        this.badgeCount = res.length
        this.badgevisibility = false;
      }
    })
  }
  
  buttonDisable(event: MouseEvent, item: any){
    this._service.getItem().subscribe({
      next: (res) => {
        res.forEach((element: any) => {
          if (element.id === item.id) {
            const button = event.target as HTMLButtonElement;
            console.log(button)
            button.innerHTML = 'Added to Cart';
            
            this.isdisable=true;
            //button.disabled = true;
          }
        });

      }
    })
  }

  isdisable:boolean = false
  addtocart(event: MouseEvent, item: any, index: any) {
    console.log(item);
    this._service.postItem(item).subscribe({
      next: (res) => {
        this.badgetotal();
        this.toastr.success("Item Added Successfully !! ", 'Success Message!');
        this.buttonDisable(event,item);
      }
    })
 
    // const button = event.target as HTMLButtonElement;
    // button.textContent = 'Added to Cart';
    // this.registerArr[index].quantity =0;
    //button.disabled = true;
  }

  Filterchange(data: Event) {
    const val = (data.target as HTMLInputElement).value;
    this.registerArr.filter((ele) => {
      return ele.title.includes(val);
    })
  }
  categories: string[] = ["All Products", "Electronics", "Jewelery", "Men's clothing", "Women's clothing"];
  selectedCategory: string | undefined;

  selectCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'All Products') {
      this.getdata();
    }
    else {
      this.http.get<any>(this.url + '/category/' + category.toLowerCase()).subscribe({
        next: (res) => {
          this.registerArr = res;

          console.log(res);
        },
        error: console.log,

      })
    }
    const formattedCategoryName = category.replace(/\s+/g, '-');
    this.router.navigate(['dashboard/category/', formattedCategoryName ]);
  }

}
