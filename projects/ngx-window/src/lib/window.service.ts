import { ElementRef, EmbeddedViewRef, Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';

interface Window {
    id: number;
    elementRef: ElementRef;
    refElement?: HTMLElement;
    view?: EmbeddedViewRef<any>;
    children: number[];
}

@Injectable({
    providedIn: 'root'
})
export class WindowService {

    readonly windowOpened$: Subject<number> = new Subject();
    readonly windowClosed$: Subject<number> = new Subject();
    readonly windowMoved$: Subject<number> = new Subject();

    private _container?: ViewContainerRef;
    private _lastId: number = 0;

    private _windows: { [id: number]: Window } = {};

    private _intersectionObserver: IntersectionObserver;

    constructor() {
        // One listener to scroll events that get them at the capture stage (before they reach the scrolled element) 
        // is much more efficient, especially when passive (cannot interfere with the event propagation cycle).
        // Moreover, instead of performing actions on the event thread, it emits the values on an Observable to
        // be handled asynchronously.
        document.addEventListener('scroll', event => {
            Object.values(this._windows).forEach((window: Window) => {
                if ((event.target instanceof Node) && window.refElement && event.target.contains(window.refElement)) {
                    this.windowMoved$.next(window.id);
                }
            });
        }, { capture: true, passive: true });

        document.addEventListener('click', event => {
            Object
                .values(this._windows)
                .filter(window => window.refElement !== event.target && !this.windowContainsEventTarget(window, event))
                .forEach(window => this.close(window.id));
        }, { capture: true, passive: true });

        this._intersectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                Object
                    .values(this._windows)
                    .filter(window => window.refElement === entry.target)
                    .forEach(window => this.close(window.id));
            })
        }, { threshold: 1 });
    }

    registerContainer(container: ViewContainerRef) {
        this._container = container;
    }

    registerWindow(elementRef: ElementRef<HTMLElement>, refElement?: HTMLElement): number {
        if (refElement) {
            this._intersectionObserver.observe(refElement);
        }

        const id = ++this._lastId;

        this._windows[id] = {
            id,
            elementRef,
            refElement,
            children: []
        };

        return id;
    }

    isOpen(id: number): boolean {
        const window = this._windows[id];

        return !!window?.view;
    }

    open(id: number, template: TemplateRef<any>) {
        if (!this.isOpen(id)) {
            const window = this._windows[id];

            const view = this._container!.createEmbeddedView(template);
            const parentId = this.findContainingWindowId(window.elementRef.nativeElement);

            if (this._windows[parentId]) {
                this._windows[parentId].children.push(id);
            }

            window.view = view;

            this.windowOpened$.next(id);
        }
    }

    close(id: number) {
        if (this.isOpen(id)) {
            const window = this._windows[id];

            window.children.forEach(childId => this.close(childId));
            window.children = [];

            const index = this._container!.indexOf(window!.view!);
            this._container!.remove(index);

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

    private windowContainsEventTarget(window: Window, event: MouseEvent): boolean {
        // Note: This method is recursive and to some extent wasteful, since the same windows are 
        //       being checked more than once. Having said that, till there's a reason to believe 
        //       this actually affects performance, no optimization will be done to avoid over-complicating 
        //       the implementation
        return window.view?.rootNodes.find(node => (node instanceof HTMLElement) && (event.target instanceof Node) && node.contains(event.target))
            || window.children.some(id => this.windowContainsEventTarget(this._windows[id], event));
    }
}
