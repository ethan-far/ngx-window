import { NgModule } from '@angular/core';
import { NgxWindowModule } from '../../../../projects/ngx-window/src/public-api';
import { DropDownPageComponent } from './drop-down-page.component';

@NgModule({
    imports: [
        NgxWindowModule,
    ],
    declarations: [
        DropDownPageComponent
    ]
})
export class DropDownPageModule { }