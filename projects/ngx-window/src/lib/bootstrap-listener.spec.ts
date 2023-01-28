import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { installWindowContainer } from './bootstrap-listener';

describe('installWindowContainer', () => {

    let applicationRef: ApplicationRef;
    let injector: Injector;
    let componentFactoryResolver: ComponentFactoryResolver;

    let listener: (component: ComponentRef<any>) => void;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        applicationRef = TestBed.inject(ApplicationRef);
        injector = TestBed.inject(Injector);
        componentFactoryResolver = TestBed.inject(ComponentFactoryResolver);

        listener = installWindowContainer(applicationRef, injector, componentFactoryResolver);
    });

    describe('creates a <ngx-window-container> component', () => {
        it('and attaches it to the application view hierarchy', () => {
            jest.spyOn(applicationRef, 'attachView');

            listener(<unknown>null as ComponentRef<any>);

            expect(applicationRef.attachView).toHaveBeenCalled();
        });

        it('and adds it to <body>', () => {
            listener(<unknown>null as ComponentRef<any>);

            let windowContainerElement = document.getElementsByTagName('ngx-window-container');
            expect(windowContainerElement.length).toEqual(1);
        });

        it('only once', () => {
            jest.spyOn(applicationRef, 'attachView');

            listener(<unknown>null as ComponentRef<any>);
            listener(<unknown>null as ComponentRef<any>);
            listener(<unknown>null as ComponentRef<any>);

            let windowContainerElement = document.getElementsByTagName('ngx-window-container');
            expect(applicationRef.attachView).toHaveBeenCalledTimes(1);
            expect(windowContainerElement.length).toEqual(1);
        });
    });
});
