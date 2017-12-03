import { Component } from '@angular/core';

@Component({
    selector: 'app-module-1-dialog',
    template: `
  <mat-dialog-content><p>Hello!</p></mat-dialog-content>
<mat-dialog-actions>
  <button mat-button mat-dialog-close>Close</button>
</mat-dialog-actions>
  `
})
export class Module1DialogComponent { }
