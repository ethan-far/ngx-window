import { ElementRef, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { mock } from 'ts-mockito';

import { WindowService } from './window.service';

describe('WindowService', () => {

    let containerMock: ViewContainerRef;
    let templateMock: TemplateRef<any>;
    let viewMock1: ViewRef;
    let viewMock2: ViewRef;
    let viewMock3: ViewRef;

    let windowService: WindowService;

    let windowElement: HTMLElement;
    let windowRef: ElementRef<HTMLElement>;
    let windowRefElement: HTMLElement;

    beforeEach(() => {
        templateMock = mock(TemplateRef);
        containerMock = mock(ViewContainerRef);
        viewMock1 = mock(ViewRef);
        viewMock2 = mock(ViewRef);
        viewMock3 = mock(ViewRef);

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

            expect(windowIds.sort()).toEqual([3]);
        });

        it('fires an event with the ids of all the windows which reference elements are contained within the scrolled element', () => {
            const windowIds: number[] = [];
            windowService.windowMoved$.subscribe(id => windowIds.push(id));

            grandParentElement.dispatchEvent(new Event('scroll'));

            expect(windowIds.sort()).toEqual([1, 2, 3]);
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

        describe('if the window is already open', () => {
            it('does not create a new view if the window is already open', () => {
                windowService.registerContainer(containerMock);
                const id = windowService.registerWindow(windowRef, windowRefElement);
                windowService.open(id, templateMock);
                jest.resetAllMocks();

                windowService.open(id, templateMock);

                expect(containerMock.createEmbeddedView).not.toHaveBeenCalled();
            });

            it('emits an event with the id of the window', () => {
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
