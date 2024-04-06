import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public ref: MatDialogRef<ConfirmationDialogComponent>,
  ) {
    ref.disableClose = true;
    console.log(this.data.hide)
  }
  hide: any = this.data.hide;
  title: any = this.data.data.title;
  confirm() {
    this.ref.close(true);
  }
}
