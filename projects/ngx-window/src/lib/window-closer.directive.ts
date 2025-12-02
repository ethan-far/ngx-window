import { Directive, ElementRef } from '@angular/core';
import { WindowService } from './window.service';

@Directive({
    selector: '[ngxWindowCloser]',
    standalone: false
})
export class WindowCloserDirective {

    constructor(private windowService: WindowService, private elementRef: ElementRef<HTMLElement>) { }

    close() {
        this.windowService.closeContainingWindow(this.elementRef.nativeElement);
    }
}