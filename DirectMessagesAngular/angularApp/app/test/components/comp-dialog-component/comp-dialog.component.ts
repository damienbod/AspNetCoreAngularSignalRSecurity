import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Module1DialogComponent } from '../module1-dialog-component/module1-dialog.component';

@Component({
  selector: 'app-comp-dialog',
  templateUrl: './comp-dialog.component.html'
})
export class CompDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CompDialogComponent>,
    private dialog: MatDialog
  ) { }

  openDialog() {
      this.dialog.open(Module1DialogComponent);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
}
