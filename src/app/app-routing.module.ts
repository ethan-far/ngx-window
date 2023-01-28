import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DropDownPageComponent } from './modules/drop-down/drop-down-page.component';

const routes: Routes = [
    { path: 'drop-downs', component: DropDownPageComponent },
    { path: '', component: DropDownPageComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
