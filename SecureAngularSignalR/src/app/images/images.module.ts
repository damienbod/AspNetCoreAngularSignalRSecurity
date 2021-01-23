import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ImagesComponent } from './components/images.component';
import { ImagesRoutes } from './images.routes';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule, ImagesRoutes],

  declarations: [ImagesComponent],

  exports: [ImagesComponent],
})
export class ImagesModule {}
