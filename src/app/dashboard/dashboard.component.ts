import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { async, map, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private http: HttpClient, private _service: ProductService,
    private toastr: ToastrService, private router: Router,  private spinner: NgxSpinnerService,private productDetailDialog: MatDialog,) { }
  title = 'Shopping';
  badgevisibility = true;
  badgeCount = 0;
  registerArr: any[] = [];
  url: string = "https://fakestoreapi.com/products/";
  quantity: number = 1;
  filteredProducts: any[] = [];
  ngOnInit(): void {
    this.getdata();
    this.badgetotal();
  }
 // {{item.id}}
  onClick(item:any): void {
    this.spinner.show(); // Show spinner when button is clicked
    // Perform your navigation logic here, for example:
    this.router.navigate(['/dashboard/product/', item.id ]).then(() => {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.spinner.hide(); // Hide spinner when navigation ends
        }
      });
    });
  }

  getdata() {
    this.http.get<any>(this.url).subscribe({
      next: (res) => {
        this.registerArr = res;

        //console.log(this.registerArr);
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
    this.registerArr[index].addedToCart = false;
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


  isInCart(item: any): Observable<boolean> {
    return this._service.getItem().pipe(
      map((items: any[]) => {
        console.log('Irt',items)
        return items.some((ele: any) => ele.title === item.title);
      })
    );
  }
   buttonText:string = "Add to Cart";
  isdisable!: boolean;

  addtocart(event: MouseEvent, item: any, index: any) {
    item.addedToCart = true;
    //console.log(item);
    this._service.postItem(item).subscribe({
      next: (res) => {
        this.badgetotal();
        this.toastr.success("Item Added Successfully !! ", 'Success Message!');
        // this.buttonDisable(event, item);
        this.isInCart( item).subscribe((varw)=>{
          if(varw){
           
           //this.buttonText ='Added to Cart';
            // const button = event.target as HTMLButtonElement;
            //  button.textContent = 'Added to Cart';button.disabled = true;

          }
        })
       
        
      }
    })
 
    // const button = event.target as HTMLButtonElement;
    // button.textContent = 'Added to Cart';
    // this.registerArr[index].quantity =0;
    //button.disabled = true;
  }
  searchTerm:any;
  Filterchange() {
    console.log(this.searchTerm);
    
    this.registerArr = this.registerArr.filter((ele) =>
    ele.title.toLowerCase().includes(this.searchTerm.toLowerCase()) 
    );
    console.log(this.registerArr);
    //setTimeout(()=>this.registerArr = this.filteredProducts,300)
    
   if(!this.searchTerm)this.getdata();
   
  }


  categories: string[] = ["All Products", "Electronics", "Jewelery", "Men's clothing", "Women's clothing"];
  selectedCategory: string | undefined;

  selectCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'All Products') {
      this.getdata();
    }
    else {
      this.http.get<any>(this.url + 'category/' + category.toLowerCase()).subscribe({
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
  
  detailpopup() {
    // localStorage.setItem('editdialogOpen', 'true');
    // localStorage.setItem('editdialogData', JSON.stringify(userData));


    const detailref = this.productDetailDialog.open(ProductDetailsComponent, {
      width: '25%',
    });
    detailref.afterClosed().subscribe({
      next: (val) => {
        if (val) this.getdata();

        // localStorage.setItem('editdialogOpen', 'false');
        // localStorage.removeItem('editdialogData')
      }


    })
  }
}
