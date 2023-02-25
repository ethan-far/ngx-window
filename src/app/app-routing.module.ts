import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlignmentPageComponent } from './modules/alignment/alignment-page.component';
import { DropDownPageComponent } from './modules/drop-down/drop-down-page.component';
import { ResizeAndMovePageComponent } from './modules/resize-and-move/resize-and-move-page.component';

const routes: Routes = [
    { path: 'drop-downs', component: DropDownPageComponent },
    { path: 'resize-and-move', component: ResizeAndMovePageComponent },
    { path: 'alignment', component: AlignmentPageComponent },
    { path: '', component: DropDownPageComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
