import { NgModule } from '@angular/core';
import { NgxWindowModule } from '../../../../projects/ngx-window/src/public-api';
import { MovableComponent } from './movable.component';
import { ResizableComponent } from './resizable.component';
import { ResizeAndMovePageRoutingModule } from './resize-and-move-page-routing.module';
import { ResizeAndMovePageComponent } from './resize-and-move-page.component';

@NgModule({
    imports: [
        NgxWindowModule,
        ResizeAndMovePageRoutingModule
    ],
    declarations: [
        ResizeAndMovePageComponent,
        ResizableComponent,
        MovableComponent
    ]
})
export class ResizeAndMovePageModule { }