import { ElementRef, EmbeddedViewRef, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { mock } from 'ts-mockito';

import { WindowService } from './window.service';

describe('WindowService', () => {

    class IntersectionObserverMock {
        readonly root: Element | Document | null = null;
        readonly rootMargin: string = '';
        readonly thresholds: ReadonlyArray<number> = [];

        constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
            intersectionObserverMock = this;
            intersectionObserverCallback = callback;
            intersectionObserverOptions = options;
        }

        disconnect() { }
        observe(target: Element) { }
        takeRecords() { return []; }
        unobserve(target: Element) { };
    }

    class ResizeObserverMock {
        constructor(callback: ResizeObserverCallback) {
            resizeObserverMock = this;
            resizeObserverCallback = callback;
        }

        disconnect() { }
        observe(target: Element) { }
        unobserve(target: Element) { };
    }

    let intersectionObserverMock: IntersectionObserverMock;
    let intersectionObserverCallback: IntersectionObserverCallback;
    let intersectionObserverOptions: IntersectionObserverInit | undefined;

    let resizeObserverMock: ResizeObserverMock;
    let resizeObserverCallback: ResizeObserverCallback;

    let containerMock: ViewContainerRef;
    let templateMock: TemplateRef<any>;
    let viewMock1: EmbeddedViewRef<any>;
    let viewMock2: EmbeddedViewRef<any>;
    let viewMock3: EmbeddedViewRef<any>;

    let windowService: WindowService;

    let windowElement: HTMLElement;
    let windowRef: ElementRef<HTMLElement>;
    let windowRefElement: HTMLElement;

    beforeEach(() => {
        global.IntersectionObserver = IntersectionObserverMock;
        global.ResizeObserver = ResizeObserverMock;

        templateMock = mock(TemplateRef);
        containerMock = mock(ViewContainerRef);
        viewMock1 = mock(EmbeddedViewRef);
        viewMock2 = mock(EmbeddedViewRef);
        viewMock3 = mock(EmbeddedViewRef);

        containerMock.createEmbeddedView = jest.fn().mockReturnValueOnce(viewMock1).mockReturnValueOnce(viewMock2).mockReturnValueOnce(viewMock3);
        containerMock.indexOf = jest.fn().mockImplementation((view: ViewRef) => (view === viewMock1) ? 123 : (view === viewMock2) ? 456 : 789);
        containerMock.remove = jest.fn();

        TestBed.configureTestingModule({
            providers: [
                WindowService
            ]
        });

        windowService = TestBed.inject(WindowService);

        windowElement = document.createElement('div');
        windowRef = new ElementRef(windowElement);
        windowRefElement = document.createElement('span');
    });

    describe('on init', () => {
        it('creates an intersection observer', () => {
            expect(intersectionObserverMock).toBeDefined();
            expect(intersectionObserverOptions).toEqual({ threshold: 1 });
        });

        it('creates a resize observer', () => {
            expect(resizeObserverMock).toBeDefined();
        });
    });

    describe('on scroll', () => {
        let childElement: HTMLElement;
        let parentElement: HTMLElement;
        let grandParentElement: HTMLElement;

        let id1: number;
        let id2: number;
        let id3: number;

        beforeEach(() => {
            windowService.registerContainer(containerMock);

            childElement = createDivWithClass('child');
            parentElement = createDivWithClass('parent');
            grandParentElement = createDivWithClass('grandParent');

            parentElement.appendChild(childElement);
            grandParentElement.appendChild(parentElement);
            document.body.appendChild(grandParentElement);

            id1 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), grandParentElement);
            id2 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), parentElement);
            id3 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), childElement);
        });

        it('fires an event with the id of the windows referencing the scrolled element', () => {
            const windowIds: number[] = [];
            windowService.windowMoved$.subscribe(id => windowIds.push(id));

            childElement.dispatchEvent(new Event('scroll'));

            expect(windowIds.sort()).toEqual([id3]);
        });

        it('fires an event with the ids of all the windows which reference elements are contained within the scrolled element', () => {
            const windowIds: number[] = [];
            windowService.windowMoved$.subscribe(id => windowIds.push(id));

            grandParentElement.dispatchEvent(new Event('scroll'));

            expect(windowIds.sort()).toEqual([id1, id2, id3]);
        });
    });

    describe('on click', () => {
        beforeEach(() => {
            // Note: It is not good to spy on the unit under test, but since the close functionality is considerable, it's better than repeating all the tests
            // TODO: Consider refactoring the functionalities of open/close/etc. into sub-services
            jest.spyOn(windowService, 'close');
        });

        it('closes all windows', () => {
            let id1 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), document.createElement('a'));
            let id2 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), document.createElement('div'));
            let id3 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), document.createElement('li'));

            document.documentElement.dispatchEvent(new Event('click'));

            expect(windowService.close).toHaveBeenNthCalledWith(1, id1);
            expect(windowService.close).toHaveBeenNthCalledWith(2, id2);
            expect(windowService.close).toHaveBeenNthCalledWith(3, id3);
        });

        describe('does not close a window that', () => {
            beforeEach(() => {
                windowService.registerContainer(containerMock);
            });

            it('references the clicked element', () => {
                let refElement = document.documentElement.appendChild(document.createElement('div'));
                let id1 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), document.createElement('a'));
                let id2 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), refElement);
                let id3 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), document.createElement('li'));

                refElement.dispatchEvent(new Event('click'));

                expect(windowService.close).toHaveBeenNthCalledWith(1, id1);
                expect(windowService.close).toHaveBeenNthCalledWith(2, id3);
                expect(windowService.close).not.toHaveBeenCalledWith(id2);
            });

            it('contains the clicked element', () => {
                let outerElement = document.documentElement.appendChild(document.createElement('div'));
                let innerElement = outerElement.appendChild(document.createElement('a'));
                Object.defineProperty(viewMock1, 'rootNodes', { value: [outerElement] });
                let id1 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')));
                let id2 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')));
                let id3 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')));
                windowService.open(id3, templateMock);

                innerElement.dispatchEvent(new Event('click'));

                expect(windowService.close).toHaveBeenNthCalledWith(1, id1);
                expect(windowService.close).toHaveBeenNthCalledWith(2, id2);
                expect(windowService.close).not.toHaveBeenCalledWith(id3);
            });

            it('is an ancestor of the window containing the clicked element', () => {
                let outerElement = document.documentElement.appendChild(document.createElement('div'));
                let innerElement = outerElement.appendChild(document.createElement('a'));
                Object.defineProperty(viewMock1, 'rootNodes', { value: [document.createElement('div')] });
                Object.defineProperty(viewMock2, 'rootNodes', { value: [document.createElement('div')] });
                Object.defineProperty(viewMock3, 'rootNodes', { value: [outerElement] });
                let id1 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), undefined);
                let id2 = windowService.registerWindow(new ElementRef<HTMLElement>(createDivWithParent(id1)), undefined);
                let id3 = windowService.registerWindow(new ElementRef<HTMLElement>(createDivWithParent(id2)), undefined);
                windowService.open(id1, templateMock);
                windowService.open(id2, templateMock);
                windowService.open(id3, templateMock);

                innerElement.dispatchEvent(new Event('click'));

                expect(windowService.close).not.toHaveBeenCalledWith(id1);
                expect(windowService.close).not.toHaveBeenCalledWith(id2);
                expect(windowService.close).not.toHaveBeenCalledWith(id3);
            });

            it('should be kept open when clicked outside', () => {
                let refElement = document.documentElement.appendChild(document.createElement('div'));
                let id1 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')));
                let id2 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), undefined, { onClickOutside: true });
                let id3 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), undefined, { onClickOutside: false });

                refElement.dispatchEvent(new Event('click'));

                expect(windowService.close).toHaveBeenNthCalledWith(1, id1);
                expect(windowService.close).toHaveBeenNthCalledWith(2, id3);
                expect(windowService.close).not.toHaveBeenCalledWith(id2);
            });
        });
    });

    describe('on resize', () => {

        let childElement: HTMLElement;
        let parentElement: HTMLElement;
        let grandParentElement: HTMLElement;

        let id1: number;
        let id2: number;
        let id3: number;

        beforeEach(() => {
            windowService.registerContainer(containerMock);

            childElement = createDivWithClass('child');
            parentElement = createDivWithClass('parent');
            grandParentElement = createDivWithClass('grandParent');

            parentElement.appendChild(childElement);
            grandParentElement.appendChild(parentElement);
            document.body.appendChild(grandParentElement);

            id1 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), grandParentElement);
            id2 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), parentElement);
            id3 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), childElement);
        });

        it('fires an event with the id of the windows referencing the resized element', () => {
            const windowIds: number[] = [];
            windowService.windowMoved$.subscribe(id => windowIds.push(id));

            const entry = {
                borderBoxSize: [],
                contentBoxSize: [],
                contentRect: mockDOMRect(),
                devicePixelContentBoxSize: [],
                target: childElement,
            };

            resizeObserverCallback([entry], resizeObserverMock);

            expect(windowIds.sort()).toEqual([id3]);
        });

        it('fires an event with the ids of all the windows which reference elements are contained within the scrolled element', () => {
            const windowIds: number[] = [];
            windowService.windowMoved$.subscribe(id => windowIds.push(id));

            const entry = {
                borderBoxSize: [],
                contentBoxSize: [],
                contentRect: mockDOMRect(),
                devicePixelContentBoxSize: [],
                target: grandParentElement,
            };

            resizeObserverCallback([entry], resizeObserverMock);

            expect(windowIds.sort()).toEqual([id1, id2, id3]);
        });
    });

    describe('on intersection', () => {
        it('close any windows referencing the element', () => {
            // Note: It is not good to spy on the unit under test, but since the close functionality is considerable, it's better than repeating all the tests
            // TODO: Consider refactoring the functionalities of open/close/etc. into sub-services
            jest.spyOn(windowService, 'close');
            const refElement = document.createElement('button');
            const id1 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), refElement);
            const id2 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')));
            const id3 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), refElement);
            const entry = {
                boundingClientRect: mockDOMRect(),
                intersectionRatio: 0,
                intersectionRect: mockDOMRect(),
                isIntersecting: false,
                rootBounds: null,
                target: refElement,
                time: 0
            };

            intersectionObserverCallback([entry], intersectionObserverMock);

            expect(windowService.close).toHaveBeenNthCalledWith(1, id1);
            expect(windowService.close).toHaveBeenNthCalledWith(2, id3);
        });

        describe('does not close windows if', () => {
            it('supposed to keep it open', () => {
                // Note: It is not good to spy on the unit under test, but since the close functionality is considerable, it's better than repeating all the tests
                // TODO: Consider refactoring the functionalities of open/close/etc. into sub-services
                jest.spyOn(windowService, 'close');
                const refElement = document.createElement('button');
                let id1 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), refElement, { onIntersection: false });
                let id2 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), refElement, { onIntersection: true });
                let id3 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), refElement, { onIntersection: false });
                const entry = {
                    boundingClientRect: mockDOMRect(),
                    intersectionRatio: 0,
                    intersectionRect: mockDOMRect(),
                    isIntersecting: false,
                    rootBounds: null,
                    target: refElement,
                    time: 0
                };

                intersectionObserverCallback([entry], intersectionObserverMock);

                expect(windowService.close).toHaveBeenNthCalledWith(1, id1);
                expect(windowService.close).not.toHaveBeenCalledWith(id2);
                expect(windowService.close).toHaveBeenNthCalledWith(2, id3);
            });

            it('does not close windows if intersecting is "true"', () => {
                // Note: It is not good to spy on the unit under test, but since the close functionality is considerable, it's better than repeating all the tests
                // TODO: Consider refactoring the functionalities of open/close/etc. into sub-services
                jest.spyOn(windowService, 'close');
                const refElement = document.createElement('button');
                windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), refElement);
                windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')));
                windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), refElement);
                const entry = {
                    boundingClientRect: mockDOMRect(),
                    intersectionRatio: 0,
                    intersectionRect: mockDOMRect(),
                    isIntersecting: true,
                    rootBounds: null,
                    target: refElement,
                    time: 0
                };

                intersectionObserverCallback([entry], intersectionObserverMock);

                expect(windowService.close).not.toHaveBeenCalled();
            });
        });
    });

    describe('registerWindow', () => {
        it('returns consecutive numbers ids', () => {
            let id1 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), document.createElement('a'));
            let id2 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), document.createElement('div'));
            let id3 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), document.createElement('li'));

            expect(id1).toEqual(1);
            expect(id2).toEqual(2);
            expect(id3).toEqual(3);
        });

        it('starts observing resizing for the reference elements', () => {
            jest.spyOn(resizeObserverMock, 'observe');
            let refElement1 = document.createElement('a');
            let refElement2 = document.createElement('div');

            windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), refElement1);
            windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')));
            windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), refElement2);

            expect(resizeObserverMock.observe).toHaveBeenNthCalledWith(1, refElement1);
            expect(resizeObserverMock.observe).toHaveBeenNthCalledWith(2, refElement2);
        });

        it('starts observing intersections for the reference elements', () => {
            jest.spyOn(intersectionObserverMock, 'observe');
            let refElement1 = document.createElement('a');
            let refElement2 = document.createElement('div');

            windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), refElement1);
            windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')));
            windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), refElement2);

            expect(intersectionObserverMock.observe).toHaveBeenNthCalledWith(1, refElement1);
            expect(intersectionObserverMock.observe).toHaveBeenNthCalledWith(2, refElement2);
        });
    });

    describe('unregisterWindow', () => {
        // TODO: add tests
    });

    describe('isOpen', () => {
        it('returns "false" if a window with the specified id was never registered', () => {
            windowService.registerContainer(containerMock);

            const open = windowService.isOpen(123);

            expect(open).toEqual(false);
        });

        it('returns "false" if the window was never opened', () => {
            windowService.registerContainer(containerMock);
            const id = windowService.registerWindow(windowRef, windowRefElement);

            const open = windowService.isOpen(id);

            expect(open).toEqual(false);
        });

        it('returns "true" if the window is open', () => {
            windowService.registerContainer(containerMock);
            const id = windowService.registerWindow(windowRef, windowRefElement);
            windowService.open(id, templateMock);

            const open = windowService.isOpen(id);

            expect(open).toEqual(true);
        });

        it('returns "false" if the window closed after it was opened', () => {
            windowService.registerContainer(containerMock);
            const id = windowService.registerWindow(windowRef, windowRefElement);
            windowService.open(id, templateMock);
            windowService.close(id);

            const open = windowService.isOpen(id);

            expect(open).toEqual(false);
        });
    });

    describe('open', () => {
        it('creates an embedded view of the template in the registered container', () => {
            windowService.registerContainer(containerMock);
            const id = windowService.registerWindow(windowRef, windowRefElement);

            windowService.open(id, templateMock);

            expect(containerMock.createEmbeddedView).toHaveBeenCalledWith(templateMock);
        });

        it('emits an event with the id of the window', () => {
            let lastEvent: number | undefined;
            windowService.windowOpened$.subscribe(id => lastEvent = id);
            windowService.registerContainer(containerMock);
            const id = windowService.registerWindow(windowRef, windowRefElement);

            windowService.open(id, templateMock);

            expect(lastEvent).toEqual(1);
        });

        describe('if no container was registered', () => {
            it('does not create a new view if the window is already open', () => {
                const id = windowService.registerWindow(windowRef, windowRefElement);

                windowService.open(id, templateMock);

                expect(containerMock.createEmbeddedView).not.toHaveBeenCalled();
            });

            it('does not emit an event with the id of the window', () => {
                let lastEvent: number | undefined;
                const id = windowService.registerWindow(windowRef, windowRefElement);
                windowService.windowOpened$.subscribe(id => lastEvent = id);

                windowService.open(id, templateMock);

                expect(lastEvent).toBeUndefined();
            });
        });

        describe('if the window is already open', () => {
            it('does not create a new view if the window is already open', () => {
                windowService.registerContainer(containerMock);
                const id = windowService.registerWindow(windowRef, windowRefElement);
                windowService.open(id, templateMock);
                jest.resetAllMocks();

                windowService.open(id, templateMock);

                expect(containerMock.createEmbeddedView).not.toHaveBeenCalled();
            });

            it('does not emit an event with the id of the window', () => {
                let lastEvent: number | undefined;
                windowService.registerContainer(containerMock);
                const id = windowService.registerWindow(windowRef, windowRefElement);
                windowService.open(id, templateMock);
                windowService.windowOpened$.subscribe(id => lastEvent = id);

                windowService.open(id, templateMock);

                expect(lastEvent).toBeUndefined();
            });
        });
    });

    describe('close', () => {
        it('finds the index of the view to remove', () => {
            windowService.registerContainer(containerMock);
            const id = windowService.registerWindow(windowRef, windowRefElement);
            windowService.open(id, templateMock);

            windowService.close(id);

            expect(containerMock.indexOf).toHaveBeenCalledWith(viewMock1);
        });

        it('does not look for the index of the view if the window is not registered', () => {
            windowService.registerContainer(containerMock);

            windowService.close(123);

            expect(containerMock.indexOf).not.toHaveBeenCalled();
        });

        it('removes the view from the container', () => {
            windowService.registerContainer(containerMock);
            const id = windowService.registerWindow(windowRef, windowRefElement);
            windowService.open(id, templateMock);

            windowService.close(id);

            expect(containerMock.remove).toHaveBeenCalledWith(123);
        });

        it('emits an event with the id of the window', () => {
            let lastEvent: number | undefined;
            windowService.windowClosed$.subscribe(id => lastEvent = id);
            windowService.registerContainer(containerMock);
            const id = windowService.registerWindow(windowRef, windowRefElement);
            windowService.open(id, templateMock);

            windowService.close(id);

            expect(lastEvent).toEqual(1);
        });

        describe('if the window is not open', () => {
            it('does not remove a view from the container', () => {
                windowService.registerContainer(containerMock);
                const id = windowService.registerWindow(windowRef, windowRefElement);

                windowService.close(id);

                expect(containerMock.remove).not.toHaveBeenCalled();
            });

            it('emits an event with the id of the window', () => {
                let lastEvent: number | undefined;
                windowService.windowClosed$.subscribe(id => lastEvent = id);
                windowService.registerContainer(containerMock);
                const id = windowService.registerWindow(windowRef, windowRefElement);

                windowService.close(id);

                expect(lastEvent).toBeUndefined();
            });
        });

        it('closes any child windows first', () => {
            windowService.registerContainer(containerMock);
            let id1 = windowService.registerWindow(new ElementRef<HTMLElement>(document.createElement('div')), undefined);
            let id2 = windowService.registerWindow(new ElementRef<HTMLElement>(createDivWithParent(id1)), undefined);
            let id3 = windowService.registerWindow(new ElementRef<HTMLElement>(createDivWithParent(id2)), undefined);

            windowService.open(id1, templateMock);
            windowService.open(id2, templateMock);
            windowService.open(id3, templateMock);

            windowService.close(id1);

            expect(containerMock.remove).toHaveBeenNthCalledWith(1, 789);
            expect(containerMock.remove).toHaveBeenNthCalledWith(2, 456);
            expect(containerMock.remove).toHaveBeenNthCalledWith(3, 123);
        });
    });

    describe('closeContainingWindow', () => {

        let windowElements: HTMLElement[];
        let windowRefs: ElementRef<HTMLElement>[];
        let ids: number[];

        let outerElement: HTMLElement;
        let innerElement: HTMLElement;

        beforeEach(() => {
            windowService.registerContainer(containerMock);

            windowElements = ['div', 'ul', 'span'].map((tagName: string) => document.createElement(tagName));
            windowRefs = windowElements.map((element: HTMLElement) => new ElementRef(element));
            ids = windowRefs.map((windowRef: ElementRef<HTMLElement>) => windowService.registerWindow(windowRef));

            innerElement = document.createElement('span');

            outerElement = document.createElement('li');
            outerElement.setAttribute('data-window-id', '2');
            outerElement.append(innerElement);
        });

        it('closes the window directly containing the element', () => {
            windowService.open(ids[1], templateMock);

            windowService.closeContainingWindow(outerElement);

            expect(containerMock.indexOf).toHaveBeenCalledWith(viewMock1);
            expect(containerMock.remove).toHaveBeenCalledWith(123);
        });

        it('closes the window indirectly containing the element', () => {
            windowService.open(ids[1], templateMock);

            windowService.closeContainingWindow(innerElement);

            expect(containerMock.indexOf).toHaveBeenCalledWith(viewMock1);
            expect(containerMock.remove).toHaveBeenCalledWith(123);
        });

        it('does not try to close if no window contains the element', () => {
            const fakeElement = document.createElement('table');

            windowService.closeContainingWindow(fakeElement);

            expect(containerMock.indexOf).not.toHaveBeenCalled();
            expect(containerMock.remove).not.toHaveBeenCalled();
        });
    });
});

function createDivWithParent(parentId: number): HTMLElement {
    const innerDiv = document.createElement('div');
    const outerDiv = document.createElement('div');

    outerDiv.setAttribute('data-window-id', '' + parentId);
    outerDiv.append(innerDiv);

    return innerDiv;
}

function createDivWithClass(className: string): HTMLElement {
    const divElement = document.createElement('div');

    divElement.className = className;

    return divElement;
}

function mockDOMRect() {
    return { x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON: () => { } }
}
