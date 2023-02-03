import { Component, ViewChild } from '@angular/core';
import { WindowCloserDirective } from '../../../../projects/ngx-window/src/lib/window-closer.directive';
import { WindowComponent, WindowOptions } from '../../../../projects/ngx-window/src/public-api';

@Component({
    selector: 'ngx-test-drop-down-page',
    templateUrl: './drop-down-page.component.html',
    styleUrls: ['./drop-down-page.component.scss']
})
export class DropDownPageComponent {
    @ViewChild('simpleDropDown') simpleDropDown!: WindowComponent;
    @ViewChild('closeFromWithinDropDown') closeFromWithinDropDown!: WindowComponent;
    @ViewChild(WindowCloserDirective) windowCloser!: WindowCloserDirective;

    simpleDropDownWindowVisible: boolean = false;
    simpleDropDownWindowOptions: WindowOptions = { alignment: { alignToBottom: true } };

    closeFromWithinDropDownWindowVisible: boolean = false;
    closeFromWithinDropDownWindowOptions: WindowOptions = { alignment: { alignToBottom: true } };

    onSimpleDropDownClick() {
        this.simpleDropDown.toggle();
    }

    onSimpleDropDownVisibleChange(visible: boolean) {
        this.simpleDropDownWindowVisible = visible;
    }

    onCloseFromWithinDropDownClick() {
        this.closeFromWithinDropDown.toggle();
    }

    onCloseFromWithinDropDownVisibleChange(visible: boolean) {
        this.closeFromWithinDropDownWindowVisible = visible;
    }

    onCloseWithinCloseButtonClick() {
        this.windowCloser.close();
    }
}

