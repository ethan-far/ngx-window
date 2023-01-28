import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { WindowService } from './window.service';

@Component({
    selector: 'ngx-window-container',
    templateUrl: './window-container.component.html',
    styleUrls: ['./window-container.component.scss']
})
export class WindowContainerComponent implements AfterViewInit {
    @ViewChild('container', { read: ViewContainerRef })
    private container!: ViewContainerRef;

    constructor(private windowService: WindowService) { }

    ngAfterViewInit(): void {
        this.windowService.registerContainer(this.container);
    }
}