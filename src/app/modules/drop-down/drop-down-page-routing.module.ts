import { NgModule } from '@angular/core';
import { DropDownPageComponent } from './drop-down-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: DropDownPageComponent
            }
        ])
    ],
    exports: [RouterModule]
})
export class DropDownPageRoutingModule { }