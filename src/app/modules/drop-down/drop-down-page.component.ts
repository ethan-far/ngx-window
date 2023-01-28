import { Component, ViewChild } from '@angular/core';
import { WindowComponent, WindowOptions } from '../../../../projects/ngx-window/src/public-api';

@Component({
    selector: 'ngx-test-drop-down-page',
    templateUrl: './drop-down-page.component.html',
    styleUrls: ['./drop-down-page.component.scss']
})
export class DropDownPageComponent {
    @ViewChild('simpleDropDown') simpleDropDown!: WindowComponent;

    simpleDropDownWindowOptions: WindowOptions = { alignment: { alignToBottom: true } };

    onSimpleDropDownClick() {
        this.simpleDropDown.open();
    }
}