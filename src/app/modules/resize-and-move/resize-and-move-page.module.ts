import { NgModule } from '@angular/core';
import { NgxWindowModule } from '../../../../projects/ngx-window/src/public-api';
import { MovableComponent } from './movable.component';
import { ResizableComponent } from './resizable.component';
import { ResizeAndMovePageComponent } from './resize-and-move-page.component';

@NgModule({
    imports: [
        NgxWindowModule
    ],
    declarations: [
        ResizeAndMovePageComponent,
        ResizableComponent,
        MovableComponent
    ]
})
export class ResizeAndMovePageModule { }