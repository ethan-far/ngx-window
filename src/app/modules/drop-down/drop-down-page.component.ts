import { Component, ViewChild } from '@angular/core';
import { WindowCloserDirective } from '../../../../projects/ngx-window/src/lib/window-closer.directive';

@Component({
    selector: 'ngx-test-drop-down-page',
    templateUrl: './drop-down-page.component.html',
    styleUrls: ['./drop-down-page.component.scss'],
    standalone: false
})
export class DropDownPageComponent {
    @ViewChild(WindowCloserDirective) windowCloser!: WindowCloserDirective;

    onCloseWithinCloseButtonClick() {
        this.windowCloser.close();
    }
}

