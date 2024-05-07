import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../Services/category.service';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private http: HttpClient,
    private _service: ProductService,
    private _api: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private categoryService: CategoryService) { }


  badgevisibility = true;
  badgeCount = 0;
  registerArr: any[] = [];
  url: string = "https://fakestoreapi.com/products/";
  quantity: number = 1;


  ngOnInit(): void {
    this.getdata();
    this.badgetotal();

  }

 

  getdata() {
    //this._api.getdata();
    //this.http.get<any>(this.url).subscribe({
    this._api.getApi().subscribe({
      next: (res) => {
        this.registerArr = res;
        this.router.navigate(['dashboard/category/all']);
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
    //this.registerArr[index].addedToCart = false;
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

  addtocart(item: any) {
    item.addedToCart = true;
    //console.log(item);
    this._api.updateApi(item.id, item).subscribe((res) => console.log('patch', res))
    this._service.postItem(item).subscribe({
      next: (res) => {
        this.badgetotal();
        this.toastr.success("Item Added Successfully !! ", 'Success Message!',{
          progressBar:true,
          closeButton:true,
        });
      }
      
    })

  }

  addedToCart() {
    this.toastr.warning("Item already added in your cart !! ", 'Alert Message!',{
      progressBar:true,
      closeButton:true,
    });
  }

  searchTerm: any;
  Filterchange() {
    console.log(this.searchTerm);

    this.registerArr = this.registerArr.filter((ele: { title: string; }) =>
      ele.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    console.log(this.registerArr);
    if (!this.searchTerm) this.getdata();
  }



  // Category

  categories: string[] = ["All Products", "Electronics", "Jewelery", "Men's clothing", "Women's clothing"];
  selectedCategory: string | undefined;

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.categoryService.setSelectedCategory(category);
    if (category === 'All Products') {
      this.getdata();
    }
    else {
     // http://localhost:3000/productApi/?category=jewelery
     // this.http.get<any>(this.url + 'category/' + category.toLowerCase()).subscribe({
     this.http.get<any>(`http://localhost:3000/productApi/?category=${category.toLowerCase()}`).subscribe({   
     next: (res) => {
          this.registerArr = res;

          console.log(res);
        },
        error: console.log,

      })
    }
    const formattedCategoryName = category.replace(/\s+/g, '-');
    this.router.navigate(['dashboard/category/', formattedCategoryName]);
  }


}
