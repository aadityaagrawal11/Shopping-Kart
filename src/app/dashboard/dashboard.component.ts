import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private http: HttpClient, private _service:ProductService,private toastr: ToastrService) { }
  title = 'Shopping';
  badgevisibility = true;
  badgeCount=0;
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

  updateQuantity(event: Event, index: number, item:any): void {
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
  badgetotal(){
    this._service.getItem().subscribe({ 
      next: (res)=>{
        this.badgeCount= res.length
        this.badgevisibility = false;
      }
    })
  }

  addtocart(item:any){
    console.log(item);
    this._service.postItem(item).subscribe({
      next: (res)=>{
        this.badgetotal();
        this.toastr.success("Item Added Successfully !! ", 'Success Message!');
      }
    })
  
  }
  Filterchange(data: Event) {
    const val = (data.target as HTMLInputElement).value;
    this.registerArr.filter((ele) => {
      return ele.title.includes(val);
    })
  }
  categories: string[] = ["All Products","electronics","jewelery","men's clothing","women's clothing"];
  selectedCategory: string | undefined;

  selectCategory(category: string): void {
    this.selectedCategory = category;
    if(category === 'All Products'){
      this.getdata();
    } 
    else{
    this.http.get<any>(this.url+'/category/'+category).subscribe({
      next: (res) => {
        this.registerArr = res;
        
        console.log(res);
      },
      error: console.log,
      
    })
  }}

}
