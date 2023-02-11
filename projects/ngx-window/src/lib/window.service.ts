import { ElementRef, Injectable, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';
import { Subject } from 'rxjs';

interface Window {
    id: number;
    element: ElementRef;
    view?: ViewRef;
    children: number[];
}

@Injectable({
    providedIn: 'root'
})
export class WindowService {

    readonly windowOpened$: Subject<number> = new Subject();
    readonly windowClosed$: Subject<number> = new Subject();

    private container?: ViewContainerRef;
    private lastId: number = 0;

    private windows: { [id: number]: Window } = {};

    registerContainer(container: ViewContainerRef) {
        this.container = container;
    }

    registerWindow(elementRef: ElementRef<HTMLElement>, refElement?: HTMLElement): number {
        const id = ++this.lastId;

        this.windows[id] = {
            id,
            element: elementRef,
            children: []
        };

        return id;
    }

    isOpen(id: number): boolean {
        const window = this.windows[id];

        return !!window?.view;
    }

    open(id: number, template: TemplateRef<any>) {
        if (!this.isOpen(id)) {
            const window = this.windows[id];

            const view = this.container!.createEmbeddedView(template);
            const parentId = this.findContainingWindowId(window.element.nativeElement);

            if (this.windows[parentId]) {
                this.windows[parentId].children.push(id);
            }

            window.view = view;

            this.windowOpened$.next(id);
        }
    }

    close(id: number) {
        if (this.isOpen(id)) {
            const window = this.windows[id];

            window.children.forEach(childId => this.close(childId));
            window.children = [];

            const index = this.container!.indexOf(window!.view!);
            this.container!.remove(index);

            window.view = undefined;

            this.windowClosed$.next(id);
        }
    }

    closeContainingWindow(element: HTMLElement) {
        const windowId = this.findContainingWindowId(element);

        this.close(windowId);
    }

    private findContainingWindowId(element: HTMLElement): number {
        let currElement: HTMLElement | null = element;
        let windowId = -1;

        while (currElement && windowId <= 0) {
            windowId = parseInt(currElement.getAttribute('data-window-id') ?? '-1');
            currElement = currElement.parentElement;
        }

        return windowId;
    }
}
