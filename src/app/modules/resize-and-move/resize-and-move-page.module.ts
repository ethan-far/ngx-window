import { NgModule } from '@angular/core';
import { MovableComponent } from './movable.component';
import { ResizableComponent } from './resizable.component';
import { ResizeAndMovePageComponent } from './resize-and-move-page.component';

@NgModule({
    declarations: [
        ResizeAndMovePageComponent,
        ResizableComponent,
        MovableComponent
    ]
})
export class ResizeAndMovePageModule { }