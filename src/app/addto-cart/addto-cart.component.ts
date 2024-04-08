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

@Component({
  selector: 'app-addto-cart',
  templateUrl: './addto-cart.component.html',
  styleUrl: './addto-cart.component.css'
})
export class AddtoCartComponent {

  constructor(private _service: ProductService,private deleteDialog: MatDialog,private _snackBar: MatSnackBar,private toastr: ToastrService) {}

  cartItems: any = [];
  displayedColumns: string[] = ['name', 'image', 'description', 'price', 'quantity', 'amount', 'action'];
  badgeCount: number | undefined;

  ngOnInit(): void {
    this.getdata();
    this.calculateTotal();
  }
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  getdata() {
    this._service.getItem().subscribe({
      next: (res) => {
        this.cartItems = res;
        this.cartItems = new MatTableDataSource(this.cartItems);
        this.cartItems = res;
        //console.log(this.cartItems);
        this.cartItems.paginator = this.paginator;
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
        data:userData,
        hide:false
      }
    });
    deleteref.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.deleteItem(userData);
          }}
    })
  }

  deleteItem(item: any) {
    const id = item.id
    this._service.deleteItem(id).subscribe({
      next: (res) => {
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
        data:this.cartItems,
        hide:true
      }
    });
    deleteref.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.clear();
          }}
    })
  }
  clear() {
    const selectedIds = this.cartItems.map(((ele: { id: any; }) => ele.id));
    //console.log(selectedIds);
    const deleteRequests = selectedIds.map((ele: any) => this._service.deleteItem(ele));

    forkJoin(deleteRequests).subscribe(
      res => {
        this.getdata();
       // console.log(res);
      });
    this.toastr.success(" Cart Empted successfully !! ", 'Delete Message!');

  }
}
