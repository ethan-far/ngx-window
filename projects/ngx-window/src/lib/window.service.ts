import { ElementRef, Injectable, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WindowService {

    private container?: ViewContainerRef;
    private lastId: number = 0;

    registerContainer(container: ViewContainerRef) {
        this.container = container;
    }

    registerWindow(elementRef: ElementRef<HTMLElement>, refElement?: HTMLElement): number {
        return ++this.lastId;
    }

    open(id: number, template: TemplateRef<any>): ViewRef {
        return this.container!.createEmbeddedView(template);
    }

    close(view: ViewRef) {
        const index = this.container!.indexOf(view);

        this.container!.remove(index);
    }
}
