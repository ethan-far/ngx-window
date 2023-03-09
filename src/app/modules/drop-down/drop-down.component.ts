import { Component, Input, ViewChild } from '@angular/core';
import { WindowComponent, WindowOptions } from '../../../../projects/ngx-window/src/public-api';

@Component({
    selector: 'ngx-test-drop-down',
    templateUrl: './drop-down.component.html',
    styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent {
    @Input() title: string = '';

    @ViewChild('dropDownWindow') dropDownWindow!: WindowComponent;

    windowVisible: boolean = false;
    windowOptions: WindowOptions = { alignment: { reference: { vertical: 'bottom' } } };

    onClick() {
        this.dropDownWindow.toggle();
    }

    onVisibleChange(visible: boolean) {
        this.windowVisible = visible;
    }
}