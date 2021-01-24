import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent {
  public message: string;
  public values: any[] = [];

  constructor() {
    this.message = 'HomeComponent constructor';
  }
}
