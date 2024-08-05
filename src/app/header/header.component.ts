import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ApiService } from '../Services/api.service';
import { ProductService } from '../Services/product.service';
import { CategoryService } from '../Services/category.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor( private _api: ApiService, private _service: ProductService,private categoryService: CategoryService ){
    this.categoryService.badgeTotal$.subscribe(count => this.badgeCount = count)
  }

  myControl = new FormControl('');

  filteredOptions!: Observable<any[]>;

  ngOnInit() {
    this.getdata();
    this.badgetotal();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

 
  

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
     console.log(filterValue);

    return this.registerArr.filter(ele => ele.title.toLowerCase().includes(filterValue)
    )
  }

  registerArr: any[] = [];
  badgeCount:any;

  getdata() {
    //this._api.getdata();
    //this.http.get<any>(this.url).subscribe({
    this._api.getApi().subscribe({
      next: (res) => {
        this.registerArr = res;
      },
      error: console.log,
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
