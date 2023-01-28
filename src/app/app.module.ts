import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxWindowModule } from '../../projects/ngx-window/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DropDownPageModule } from './modules/drop-down/drop-down-page.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxWindowModule,
    DropDownPageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
