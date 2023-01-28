import { ElementRef, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { mock } from 'ts-mockito';

import { WindowService } from './window.service';

describe('WindowService', () => {

    let containerMock: ViewContainerRef;
    let templateMock: TemplateRef<any>;
    let viewMock: ViewRef;

    let windowService: WindowService;

    let windowElement: HTMLElement;
    let windowRef: ElementRef<HTMLElement>;
    let windowRefElement: HTMLElement;

    beforeEach(() => {

        templateMock = mock(TemplateRef);
        containerMock = mock(ViewContainerRef);
        viewMock = mock(ViewRef);

        containerMock.createEmbeddedView = jest.fn().mockReturnValue(viewMock);
        containerMock.indexOf = jest.fn().mockReturnValue(123);
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

    describe('open', () => {
        it('creates an embedded view of the template in the registered container', () => {
            windowService.registerContainer(containerMock);
            const id = windowService.registerWindow(windowRef, windowRefElement);

            windowService.open(id, templateMock);

            expect(containerMock.createEmbeddedView).toHaveBeenCalledWith(templateMock);
        });

        it('returns the created view', () => {
            windowService.registerContainer(containerMock);
            const id = windowService.registerWindow(windowRef, windowRefElement);

            const view = windowService.open(id, templateMock);

            expect(view).toEqual(viewMock);
        });
    });

    describe('close', () => {
        it('finds the index of the view to remove', () => {
            windowService.registerContainer(containerMock);
            const id = windowService.registerWindow(windowRef, windowRefElement);
            const view = windowService.open(id, templateMock);

            windowService.close(view);

            expect(containerMock.indexOf).toHaveBeenCalledWith(view);
        });

        it('removes the view from the container', () => {
            windowService.registerContainer(containerMock);
            const id = windowService.registerWindow(windowRef, windowRefElement);
            const view = windowService.open(id, templateMock);

            windowService.close(view);

            expect(containerMock.remove).toHaveBeenCalledWith(123);
        });
    });
});
