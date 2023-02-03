import { Component, DebugElement, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { mock } from 'ts-mockito';
import { ElementPositionService } from './element-position.service';

import { WindowComponent } from './window.component';
import { WindowService } from './window.service';

function using<CASES extends Array<ARGS>, ARGS extends Array<any>>(parameters: CASES, testFn: (...args: ARGS) => void) {
    parameters.forEach((param) => { testFn.apply(null, param); });
}

describe('WindowComponent', () => {

    let windowServiceMock: WindowService;
    let elementPositionServiceMock: ElementPositionService;

    let elementMock: HTMLElement;
    let viewMock: ViewRef;
    let containerRef: ViewContainerRef;

    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;
    let hostElement: DebugElement;

    beforeEach(waitForAsync(() => {
        windowServiceMock = mock(WindowService);
        Object.defineProperty(windowServiceMock, 'windowOpened$', { value: new Subject() });
        Object.defineProperty(windowServiceMock, 'windowClosed$', { value: new Subject() });

        elementPositionServiceMock = mock(ElementPositionService);

        elementMock = document.createElement('div');

        jest.spyOn(windowServiceMock, 'registerContainer').mockImplementation(
            (container: ViewContainerRef) => { containerRef = container });
        jest.spyOn(windowServiceMock, 'registerWindow').mockReturnValue(1234);
        jest.spyOn(windowServiceMock, 'open').mockImplementation(
            (id: number, template: TemplateRef<any>) => {
                viewMock = containerRef.createEmbeddedView(template, {});

                return viewMock;
            });
        jest.spyOn(windowServiceMock, 'close');

        jest.spyOn(elementPositionServiceMock, 'getPosition').mockReturnValue({
            top: 200, left: 100, width: 400, height: 300
        });

        TestBed.configureTestingModule({
            declarations: [
                WindowComponent, TestHostComponent
            ],
            providers: [
                { provide: WindowService, useFactory: () => windowServiceMock },
                { provide: ElementPositionService, useFactory: () => elementPositionServiceMock }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        hostFixture = TestBed.createComponent(TestHostComponent);
        hostComponent = hostFixture.componentInstance;
        hostElement = hostFixture.debugElement;
    });

    describe('on init', () => {
        it('registers the window', () => {
            const elementMock = document.createElement('span');
            hostComponent.window.refElement = elementMock;

            jest.spyOn(windowServiceMock, 'registerWindow');
            hostFixture.detectChanges();

            expect(windowServiceMock.registerWindow).toHaveBeenCalledWith(expect.any(ElementRef), elementMock);
        });
    });

    describe('notifies of visibility', () => {
        it('when the window is opened or closed', () => {
            const visibility: boolean[] = [];
            hostFixture.detectChanges();
            hostComponent.window.visibleChange.subscribe(visible => visibility.push(visible));

            windowServiceMock.windowOpened$.next(987);
            windowServiceMock.windowOpened$.next(1234);
            windowServiceMock.windowOpened$.next(342);
            windowServiceMock.windowClosed$.next(1234);
            windowServiceMock.windowOpened$.next(482);
            windowServiceMock.windowClosed$.next(342);
            windowServiceMock.windowClosed$.next(987);
            windowServiceMock.windowOpened$.next(1234);

            expect(visibility).toEqual([true, false, true]);
        });
    });

    describe('"open"', () => {
        it('opens the window using the service', () => {
            hostFixture.detectChanges();

            hostComponent.window.open();

            expect(windowServiceMock.open).toHaveBeenCalledWith(1234, jasmine.any(TemplateRef));
        });
    });

    describe('"close"', () => {
        it('closes the window using the service', () => {
            hostFixture.detectChanges();
            hostComponent.window.open();

            hostComponent.window.close();

            expect(windowServiceMock.close).toHaveBeenCalledWith(1234);
        });
    });

    describe('"toggle"', () => {
        describe('when closed', () => {
            beforeEach(() => {
                jest.spyOn(windowServiceMock, 'isOpen').mockReturnValue(false);
            });

            it('opens the window using the service', () => {
                hostFixture.detectChanges();

                hostComponent.window.toggle();

                expect(windowServiceMock.open).toHaveBeenCalledWith(1234, jasmine.any(TemplateRef));
            });
        });

        describe('when open', () => {
            beforeEach(() => {
                jest.spyOn(windowServiceMock, 'isOpen').mockReturnValue(true);
            });

            it('closes the window using the service', () => {
                hostFixture.detectChanges();
                hostComponent.window.open();

                hostComponent.window.toggle();

                expect(windowServiceMock.close).toHaveBeenCalledWith(1234);
            });
        });
    });

    describe('has', () => {

        let fixture: ComponentFixture<TestHostComponent>;
        let component: TestHostComponent;
        let element: DebugElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestHostComponent);
            component = fixture.componentInstance;
            element = fixture.debugElement;

            fixture.detectChanges();
            component.window.open();
        });

        describe('<div> element with', () => {
            it('class "window"', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('div.window'));

                expect(divElement !== null).toBeTruthy();
            });

            it('the "data-window-id" attribute set to the id received when registering', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('.window'));

                expect(divElement.attributes['data-window-id']).toEqual('1234');
            });

            describe('the "top" and "left" styles', () => {
                it('set to the values of "topOffset" and "leftOffset" if no reference element', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.window'));

                    expect(divElement.styles['top']).toEqual('135px');
                    expect(divElement.styles['left']).toEqual('246px');
                });

                // jest.spyOn(elementPositionServiceMock, 'getPosition').mockReturnValue({
                //     top: 200, left: 100, width: 400, height: 300
                // });

                using([
                    ['top left', false, false, false, false, 250, 200],
                    ['top right', false, true, false, false, 250, 600],
                    ['bottom left', true, false, false, false, 550, 200],
                    ['bottom right', true, true, false, false, 550, 600],
                    ['top left', false, false, true, false, 10, 200],
                    ['top right', false, true, true, false, 10, 600],
                    ['bottom left', true, false, true, false, 310, 200],
                    ['bottom right', true, true, true, false, 310, 600],
                    ['top left', false, false, false, true, 250, 20],
                    ['top right', false, true, false, true, 250, 420],
                    ['bottom left', true, false, false, true, 550, 20],
                    ['bottom right', true, true, false, true, 550, 420],
                    ['top left', false, false, true, true, 10, 20],
                    ['top right', false, true, true, true, 10, 420],
                    ['bottom left', true, false, true, true, 310, 20],
                    ['bottom right', true, true, true, true, 310, 420],
                ],
                    (alignment: string, alignToBottom: boolean,
                        alignToRight: boolean, alignFromBottom: boolean,
                        alignFromRight: boolean, expectedTop: number,
                        expectedLeft: number) => {
                        it(`are aligned to the reference element's ${alignToBottom ? 'bottom' : 'top'} ${alignToRight ? 'right' : 'left'}`, () => {
                            component.window.refElement = elementMock;
                            component.window.topOffset = 50;
                            component.window.leftOffset = 100;
                            component.window.width = 180;
                            component.window.height = 240;
                            component.window.options = {
                                alignment: {
                                    alignToBottom, alignToRight, alignFromBottom, alignFromRight
                                }
                            };
                            fixture.detectChanges();

                            let divElement = element.query(By.css('.window'));

                            expect(divElement.styles['top']).toEqual(`${expectedTop}px`);
                            expect(divElement.styles['left']).toEqual(`${expectedLeft}px`);
                        });
                    });
            });

            it('the "width" and "height" styles set to the values of "width" and "height"', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('.window'));

                expect(divElement.styles['width']).toEqual('123px');
                expect(divElement.styles['height']).toEqual('456px');
            });

            describe('click handler that', () => {

                let eventMock: any;

                beforeEach(() => {
                    eventMock = {
                        stopPropagation: jest.fn(),
                        preventDefault: jest.fn()
                    }
                });

                it('stops the propagation of the event', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.window'));
                    divElement.triggerEventHandler('click', eventMock);

                    expect(eventMock.stopPropagation).toHaveBeenCalled();
                });

                it('prevents the default of the event', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.window'));
                    divElement.triggerEventHandler('click', eventMock);

                    expect(eventMock.preventDefault).toHaveBeenCalled();
                });
            });
        });
    });

    describe('contains', () => {

        let fixture: ComponentFixture<TestHostComponent>;
        let component: TestHostComponent;
        let element: DebugElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestHostComponent);
            component = fixture.componentInstance;
            element = fixture.debugElement;

            fixture.detectChanges();
            component.window.open();
        });

        it('the contained element', () => {
            fixture.detectChanges();

            let transcludedContent = element.query(By.css('.window p.transclusion-test'));

            expect(transcludedContent.nativeElement.textContent).toContain('test content');
        });
    });
});

@Component({
    template: `    
        <ngx-window [width]="123" [height]="456" [topOffset]="135" [leftOffset]="246"
            (visibleChange)="windowVisible=$event" #window>
            <p class="transclusion-test">test content</p>
        </ngx-window>
        <div #container class="TESKTJSLEKJWLEKTJWELKT"> 
        </div>
    `
})
class TestHostComponent implements OnInit {
    @ViewChild('container', { static: true, read: ViewContainerRef }) container!: ViewContainerRef;
    @ViewChild('window', { static: true }) window!: WindowComponent;

    windowVisible?: boolean;

    constructor(private windowService: WindowService) { }

    ngOnInit() {
        this.windowService.registerContainer(this.container);
    }
}