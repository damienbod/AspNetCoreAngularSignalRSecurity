import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CompDialogComponent } from '../comp-dialog-component/comp-dialog.component';

@Component({
    selector: 'app-test-component',
    templateUrl: './test.component.html'
})

export class TestComponent {

    message: string;

    constructor(private dialog: MatDialog) {
        this.message = 'Hello from Test constructor';
    }

    openDialog() {
        this.dialog.open(CompDialogComponent);
    }
}
