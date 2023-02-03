import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { WindowService } from './window.service';

@Directive({
    selector: '[ngxWindowCloser]'
})
export class WindowCloserDirective {

    constructor(private windowService: WindowService, private elementRef: ElementRef<HTMLElement>) { }

    close() {
        this.windowService.closeContainingWindow(this.elementRef.nativeElement);
    }
}