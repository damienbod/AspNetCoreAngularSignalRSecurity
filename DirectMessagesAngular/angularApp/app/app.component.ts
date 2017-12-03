import { Component } from '@angular/core';
import {VERSION} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
   version = VERSION;
}
