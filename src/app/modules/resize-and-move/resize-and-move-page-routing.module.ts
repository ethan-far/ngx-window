import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResizeAndMovePageComponent } from './resize-and-move-page.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ResizeAndMovePageComponent
            }
        ])
    ],
    exports: [RouterModule]
})
export class ResizeAndMovePageRoutingModule { }