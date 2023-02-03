import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxWindowModule } from '../../../../projects/ngx-window/src/public-api';
import { DropDownPageComponent } from './drop-down-page.component';

@NgModule({
    imports: [
        CommonModule,
        NgxWindowModule
    ],
    declarations: [
        DropDownPageComponent
    ]
})
export class DropDownPageModule { }