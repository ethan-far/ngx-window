import { Component, DebugElement, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { mock } from 'ts-mockito';
import { AlignmentService } from './alignment.service';
import { ElementPositionService } from './element-position.service';

import { WindowComponent } from './window.component';
import { WindowService } from './window.service';

describe('WindowComponent', () => {

    let windowServiceMock: WindowService;
    let elementPositionServiceMock: ElementPositionService;
    let alignmentServiceMock: AlignmentService;

    let elementMock: HTMLElement;
    let containerRef: ViewContainerRef;

    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        windowServiceMock = mock(WindowService);
        Object.defineProperty(windowServiceMock, 'windowOpened$', { value: new Subject() });
        Object.defineProperty(windowServiceMock, 'windowClosed$', { value: new Subject() });
        Object.defineProperty(windowServiceMock, 'windowMoved$', { value: new Subject() });

        elementPositionServiceMock = mock(ElementPositionService);
        alignmentServiceMock = mock(AlignmentService);

        elementMock = document.createElement('div');

        jest.spyOn(windowServiceMock, 'registerContainer').mockImplementation(
            (container: ViewContainerRef) => { containerRef = container });
        jest.spyOn(windowServiceMock, 'registerWindow').mockReturnValue(1234);
        jest.spyOn(windowServiceMock, 'open');
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
                { provide: ElementPositionService, useFactory: () => elementPositionServiceMock },
                { provide: AlignmentService, useFactory: () => alignmentServiceMock }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    describe('on init', () => {
        it('registers the window', () => {
            const elementMock = document.createElement('span');
            component.window.refElement = elementMock;
            component.window.options = {
                visibility: {
                    keepOpen: {
                        onClickOutside: true
                    }
                }
            };

            jest.spyOn(windowServiceMock, 'registerWindow');
            fixture.detectChanges();

            expect(windowServiceMock.registerWindow).toHaveBeenCalledWith(expect.any(ElementRef), elementMock, { onClickOutside: true });
        });
    });

    describe('after content checked', () => {
        describe('if the "startOpen" option is set to', () => {
            describe('"true"', () => {
                it('tries to open the window', () => {
                    component.window.options = { visibility: { startOpen: true } };
                    fixture.detectChanges();

                    component.window.ngAfterContentChecked();

                    expect(windowServiceMock.open).toHaveBeenCalledWith(1234, expect.any(TemplateRef));
                });

                it('tries again if was not yet opened', () => {
                    component.window.options = { visibility: { startOpen: true } };
                    fixture.detectChanges();

                    component.window.ngAfterContentChecked();
                    component.window.ngAfterContentChecked();

                    // Note: The first call to "ngAfterContentChecked" is due to the change detection
                    expect(windowServiceMock.open).toHaveBeenCalledTimes(3);
                });

                it('does not try again if already opened', () => {
                    component.window.options = { visibility: { startOpen: true } };
                    fixture.detectChanges();

                    component.window.ngAfterContentChecked();
                    windowServiceMock.windowOpened$.next(1234);
                    component.window.ngAfterContentChecked();

                    // Note: The first call to "ngAfterContentChecked" is due to the change detection
                    expect(windowServiceMock.open).toHaveBeenCalledTimes(2);
                });
            });

            describe('"false"', () => {
                it('does not try to open the window', () => {
                    component.window.options = { visibility: { startOpen: false } };
                    fixture.detectChanges();

                    component.window.ngAfterContentChecked();

                    expect(windowServiceMock.open).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('on window resize', () => {
        it('triggers a change detection cycle', () => {
            jest.spyOn(windowServiceMock, 'isOpen').mockReturnValue(true);
            fixture.detectChanges();
            const spy = jest.spyOn((component.window as any).changeDetectorRef, 'detectChanges');

            window.dispatchEvent(new Event('resize'));

            expect(spy).toHaveBeenCalled();
        });

        it('does not trigger a change detection cycle if the window is not open', () => {
            jest.spyOn(windowServiceMock, 'isOpen').mockReturnValue(false);
            fixture.detectChanges();
            const spy = jest.spyOn((component.window as any).changeDetectorRef, 'detectChanges');

            window.dispatchEvent(new Event('resize'));

            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('on reference element moved', () => {
        it('triggers a change detection cycle', () => {
            jest.spyOn(windowServiceMock, 'isOpen').mockReturnValue(true);
            fixture.detectChanges();
            const spy = jest.spyOn((component.window as any).changeDetectorRef, 'detectChanges');

            windowServiceMock.windowMoved$.next(1234);

            expect(spy).toHaveBeenCalled();
        });

        describe('does not trigger a change detection cycle if', () => {
            it('a different window was scrolled', () => {
                jest.spyOn(windowServiceMock, 'isOpen').mockReturnValue(true);
                fixture.detectChanges();
                const spy = jest.spyOn((component.window as any).changeDetectorRef, 'detectChanges');

                windowServiceMock.windowMoved$.next(987);

                expect(spy).not.toHaveBeenCalled();
            });

            it('the window is not open', () => {
                jest.spyOn(windowServiceMock, 'isOpen').mockReturnValue(false);
                fixture.detectChanges();
                const spy = jest.spyOn((component.window as any).changeDetectorRef, 'detectChanges');

                windowServiceMock.windowMoved$.next(1234);

                expect(spy).not.toHaveBeenCalled();
            });
        });
    });

    describe('notifies of visibility', () => {
        it('when the window is opened or closed', () => {
            const visibility: boolean[] = [];
            fixture.detectChanges();
            component.window.visibleChange.subscribe(visible => visibility.push(visible));

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
            fixture.detectChanges();

            component.window.open();

            expect(windowServiceMock.open).toHaveBeenCalledWith(1234, jasmine.any(TemplateRef));
        });
    });

    describe('"close"', () => {
        it('closes the window using the service', () => {
            fixture.detectChanges();
            component.window.open();

            component.window.close();

            expect(windowServiceMock.close).toHaveBeenCalledWith(1234);
        });
    });

    describe('"toggle"', () => {
        describe('when closed', () => {
            beforeEach(() => {
                jest.spyOn(windowServiceMock, 'isOpen').mockReturnValue(false);
            });

            it('opens the window using the service', () => {
                fixture.detectChanges();

                component.window.toggle();

                expect(windowServiceMock.open).toHaveBeenCalledWith(1234, jasmine.any(TemplateRef));
            });
        });

        describe('when open', () => {
            beforeEach(() => {
                jest.spyOn(windowServiceMock, 'isOpen').mockReturnValue(true);
            });

            it('closes the window using the service', () => {
                fixture.detectChanges();
                component.window.open();

                component.window.toggle();

                expect(windowServiceMock.close).toHaveBeenCalledWith(1234);
            });
        });
    });

    describe('has', () => {

        beforeEach(() => {
            jest.spyOn(windowServiceMock, 'open').mockImplementation(
                (id: number, template: TemplateRef<any>) => {
                    containerRef.createEmbeddedView(template, {});
                });

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
                it('to the offset after alignment', () => {
                    jest.spyOn(alignmentServiceMock, 'align').mockReturnValue({ top: 123, left: 456 });
                    component.window.topOffset = 50;
                    component.window.leftOffset = 100;
                    component.window.width = 180;
                    component.window.height = 240;
                    component.window.refElement = elementMock;
                    component.window.options = {
                        alignment: {
                            window: { horizontal: 'left', vertical: 'center' },
                            reference: { horizontal: 'right', vertical: 'bottom' }
                        }
                    };
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.window'));

                    expect(alignmentServiceMock.align).toHaveBeenCalledWith(
                        { top: 50, left: 100, width: 180, height: 240 },
                        { horizontal: 'left', vertical: 'center' },
                        { top: 200, left: 100, width: 400, height: 300 },
                        { horizontal: 'right', vertical: 'bottom' }
                    );
                    expect(divElement.styles['top']).toEqual('123px');
                    expect(divElement.styles['left']).toEqual('456px');
                });

                it('rounded to the nearest pixel 100th', () => {
                    jest.spyOn(alignmentServiceMock, 'align').mockReturnValue({ top: 250.002, left: 200.007 });
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.window'));

                    expect(divElement.styles['top']).toEqual('250px');
                    expect(divElement.styles['left']).toEqual('200.01px');
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
        beforeEach(() => {
            jest.spyOn(windowServiceMock, 'open').mockImplementation(
                (id: number, template: TemplateRef<any>) => {
                    containerRef.createEmbeddedView(template, {});
                });

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