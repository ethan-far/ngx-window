import { ElementRef, Injectable, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';
import { Subject } from 'rxjs';

interface Window {
    id: number;
    elementRef: ElementRef;
    refElement?: HTMLElement;
    view?: ViewRef;
    children: number[];
}

@Injectable({
    providedIn: 'root'
})
export class WindowService {

    readonly windowOpened$: Subject<number> = new Subject();
    readonly windowClosed$: Subject<number> = new Subject();
    readonly windowMoved$: Subject<number> = new Subject();

    private container?: ViewContainerRef;
    private lastId: number = 0;

    private windows: { [id: number]: Window } = {};

    constructor() {
        // One listener to scroll events that get them at the capture stage (before they reach the scrolled element) 
        // is much more efficient, especially when passive (cannot interfere with the event propagation cycle).
        // Moreover, instead of performing actions on the event thread, it emits the values on an Observable to
        // be handled asynchronously.
        document.addEventListener('scroll', event => {
            Object.values(this.windows).forEach((window: Window) => {
                if ((event.target instanceof Node) && window.refElement && event.target.contains(window.refElement)) {
                    this.windowMoved$.next(window.id);
                }
            });
        }, { capture: true, passive: true });
    }

    registerContainer(container: ViewContainerRef) {
        this.container = container;
    }

    registerWindow(elementRef: ElementRef<HTMLElement>, refElement?: HTMLElement): number {
        const id = ++this.lastId;

        this.windows[id] = {
            id,
            elementRef,
            refElement,
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
            const parentId = this.findContainingWindowId(window.elementRef.nativeElement);

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
