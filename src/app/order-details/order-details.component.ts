import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public ref: MatDialogRef<OrderDetailsComponent>,
  private http : HttpClient,
  private toastr: ToastrService){
  ref.disableClose = true;
}
 Orders: any = this.data.order;
 User : any = this.data;
ngOnInit(){
  console.log(this.data);
  
}
}
