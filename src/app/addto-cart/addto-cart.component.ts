import { Component, ViewChild } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { forkJoin } from 'rxjs';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-addto-cart',
  templateUrl: './addto-cart.component.html',
  styleUrl: './addto-cart.component.css'
})
export class AddtoCartComponent {

  constructor(private _service: ProductService, private _api :ApiService,
     private deleteDialog: MatDialog, private _snackBar: MatSnackBar, private toastr: ToastrService) { }

  cartItems: any = [];
  displayedColumns: string[] = ['name', 'image', 'description', 'price', 'quantity', 'amount', 'action'];
  badgeCount: number | undefined;
  dataSource: any;
  ngOnInit(): void {
    this.getdata();
    this.calculateTotal();
  }
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator,{ static: true } ) page!: MatPaginator;
  getdata() {
    this._service.getItem().subscribe({
      next: (res) => {
        this.cartItems = res;
        this.dataSource = new MatTableDataSource(res);
        //this.cartItems = res;
             
        this.dataSource.paginator = this.page;
        this.dataSource.sort = this.sort;
        this.badgeCount = res.length;
      },
      error: console.log,

    })
  }
  calculateTotal(): number {
    let total = 0;
    for (const item of this.cartItems) {
      total += item.amount;

    }
    return total;
  }

  deletepopup(userData: any) {
    const deleteref = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '39%',
      data: {
        data: userData,
        hide: false
      }
    });
    deleteref.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.deleteItem(userData);
        }
      }
    })
  }

  deleteItem(item: any) {
    const id = item.id
    this._service.deleteItem(id).subscribe({
      next: (res) => {
        item.addedToCart = false;
        item.amount = 0
        item.quantity = 0;
        //console.log(item);
        this._api.updateApi(item.id,item).subscribe((res) => console.log('patch', res)
        )
        this.getdata();
        this._snackBar.open('Item removed', 'OK', {
          duration: 2000
        });
      }
    })
  }
  clearAllpopup() {
    const deleteref = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '41%',
      data: {
        data: this.cartItems,
        hide: true
      }
    });
    deleteref.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.clear();
        }
      }
    })
  }
  clear() {
    const selectedIds = this.cartItems.map(((ele: { id: any; }) => ele.id));
    //console.log(selectedIds);
    const deleteRequests = this.cartItems.map( (item:any)=> this.deleteItem(item))
    //const deleteRequests = selectedIds.map((ele: any) => this._service.deleteItem(ele));

    forkJoin(deleteRequests).subscribe(
      res => {
        this.getdata();
        // console.log(res);
      });
    this.toastr.error(" Cart Empted successfully !! ", 'Delete Message!',{
      progressBar:true,
      closeButton:true,
    });

  }
}
