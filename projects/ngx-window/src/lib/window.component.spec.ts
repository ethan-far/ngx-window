import { Component, DebugElement, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AlignmentService } from './alignment.service';
import { Subject } from 'rxjs';
import { mock } from 'ts-mockito';
import { ElementPositionService } from './element-position.service';
import { ResolvedWindowPlacement } from './window.types';

import { WindowComponent } from './window.component';
import { WindowPlacementService } from './window-placement.service';
import { WindowService } from './window.service';

describe('WindowComponent', () => {

    class ResizeObserverMock {
        constructor(callback: ResizeObserverCallback) {
            resizeObserverCallback = callback;
            resizeObserverInstance = this;
        }

        disconnect = jest.fn();
        observe = jest.fn();
        unobserve = jest.fn();
    }

    let windowServiceMock: WindowService;
    let elementPositionServiceMock: ElementPositionService;
    let windowPlacementServiceMock: WindowPlacementService;
    let resizeObserverCallback: ResizeObserverCallback;
    let resizeObserverInstance: ResizeObserverMock | undefined;
    let originalResizeObserver: typeof ResizeObserver | undefined;

    let elementMock: HTMLElement;
    let containerRef: ViewContainerRef;

    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;
    let element: DebugElement;
    let currentPlacement: ResolvedWindowPlacement;

    beforeEach(waitForAsync(() => {
        originalResizeObserver = window.ResizeObserver;
        window.ResizeObserver = ResizeObserverMock as any;
        resizeObserverInstance = undefined;
        windowServiceMock = mock(WindowService);
        Object.defineProperty(windowServiceMock, 'windowOpened$', { value: new Subject() });
        Object.defineProperty(windowServiceMock, 'windowClosed$', { value: new Subject() });
        Object.defineProperty(windowServiceMock, 'windowMoved$', { value: new Subject() });

        elementPositionServiceMock = mock(ElementPositionService);
        windowPlacementServiceMock = mock(WindowPlacementService);

        elementMock = document.createElement('div');

        jest.spyOn(windowServiceMock, 'registerContainer').mockImplementation(
            (container: ViewContainerRef) => { containerRef = container });
        jest.spyOn(windowServiceMock, 'registerWindow').mockReturnValue(1234);
        jest.spyOn(windowServiceMock, 'open');
        jest.spyOn(windowServiceMock, 'close');
        jest.spyOn(windowServiceMock, 'getWindowElement').mockReturnValue(undefined);
        jest.spyOn(windowServiceMock, 'measure').mockImplementation((id, template, read) => read(elementMock));

        jest.spyOn(elementPositionServiceMock, 'getPosition').mockReturnValue({
            top: 200, left: 100, width: 400, height: 300
        });
        currentPlacement = placement({ top: 123, left: 456 });
        jest.spyOn(windowPlacementServiceMock, 'resolvePlacement').mockImplementation(() => currentPlacement);
        jest.spyOn(windowPlacementServiceMock, 'getBestFit').mockImplementation(() => ({
            ...currentPlacement, fitsViewport: true
        }));
        jest.spyOn(windowPlacementServiceMock, 'resolve').mockImplementation((request) =>
            (windowPlacementServiceMock.resolvePlacement as any)(request).offset);

        TestBed.configureTestingModule({
            declarations: [
                WindowComponent, TestHostComponent
            ],
            providers: [
                { provide: WindowService, useFactory: () => windowServiceMock },
                { provide: ElementPositionService, useFactory: () => elementPositionServiceMock },
                { provide: WindowPlacementService, useFactory: () => windowPlacementServiceMock }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    afterEach(() => {
        window.ResizeObserver = originalResizeObserver as any;
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

    describe('notifies of placement', () => {
        beforeEach(() => {
            jest.spyOn(windowServiceMock, 'isOpen').mockReturnValue(true);
            fixture.detectChanges();
            component.window.open();
        });

        it('when the window is opened', async () => {
            const placements: ResolvedWindowPlacement[] = [];
            component.window.placementChange.subscribe((placement) => placements.push(placement));

            windowServiceMock.windowOpened$.next(1234);
            fixture.detectChanges();
            await waitForTimer();

            expect(placements).toEqual([placement({ top: 123, left: 456 })]);
        });

        it('when the active placement changes after opening', async () => {
            const placements: ResolvedWindowPlacement[] = [];
            component.window.placementChange.subscribe((placement) => placements.push(placement));

            windowServiceMock.windowOpened$.next(1234);
            fixture.detectChanges();
            await waitForTimer();
            currentPlacement = placement(
                { top: 222, left: 333 },
                1,
                'adaptive',
                {
                    reference: { vertical: 'top' },
                    window: { vertical: 'bottom' }
                },
                -12,
                0
            );

            windowServiceMock.windowMoved$.next(1234);
            fixture.detectChanges();

            expect(placements).toEqual([
                placement({ top: 123, left: 456 }),
                placement(
                    { top: 222, left: 333 },
                    1,
                    'adaptive',
                    {
                        reference: { vertical: 'top' },
                        window: { vertical: 'bottom' }
                    },
                    -12,
                    0
                )
            ]);
        });

        it('does not notify again when only the pixel offset changes within the same placement', async () => {
            const placements: ResolvedWindowPlacement[] = [];
            component.window.placementChange.subscribe((placement) => placements.push(placement));

            windowServiceMock.windowOpened$.next(1234);
            fixture.detectChanges();
            await waitForTimer();
            currentPlacement = placement({ top: 200, left: 300 });

            windowServiceMock.windowMoved$.next(1234);
            fixture.detectChanges();

            expect(placements).toEqual([placement({ top: 123, left: 456 })]);
        });

        it('syncs placement changes during change detection even without a move event', async () => {
            const placements: ResolvedWindowPlacement[] = [];
            component.window.placementChange.subscribe((placement) => placements.push(placement));

            windowServiceMock.windowOpened$.next(1234);
            fixture.detectChanges();
            await waitForTimer();
            fixture.detectChanges();
            await waitForTimer();

            currentPlacement = placement(
                { top: 222, left: 333 },
                1,
                'adaptive',
                {
                    reference: { vertical: 'top' },
                    window: { vertical: 'bottom' }
                },
                -12,
                0
            );

            component.window.ngAfterContentChecked();
            fixture.detectChanges();
            await waitForTimer();

            expect(placements).toEqual([
                placement({ top: 123, left: 456 }),
                placement(
                    { top: 222, left: 333 },
                    1,
                    'adaptive',
                    {
                        reference: { vertical: 'top' },
                        window: { vertical: 'bottom' }
                    },
                    -12,
                    0
                )
            ]);
        });
    });

    describe('getBestFit', () => {
        it('returns placement metadata and viewport fit for explicit dimensions without rendering a measurement view', async () => {
            fixture.detectChanges();

            const result = component.window.getBestFit();
            fixture.detectChanges();

            expect(await result).toEqual({ ...currentPlacement, fitsViewport: true });
            expect(windowPlacementServiceMock.getBestFit).toHaveBeenCalledWith(expect.objectContaining({ width: 123, height: 456 }));
            expect(windowServiceMock.measure).not.toHaveBeenCalled();
        });

        it('reports when no configured placement fits', async () => {
            fixture.detectChanges();
            jest.spyOn(windowPlacementServiceMock, 'getBestFit').mockReturnValue({ ...currentPlacement, fitsViewport: false });

            const result = component.window.getBestFit();
            fixture.detectChanges();

            expect((await result).fitsViewport).toBe(false);
        });

        it('measures automatic dimensions from the current rendered content', async () => {
            component.width = undefined;
            component.height = undefined;
            fixture.detectChanges();
            jest.spyOn(elementMock, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ width: 300, height: 400 }));

            const result = component.window.getBestFit();
            fixture.detectChanges();
            await result;

            expect(windowServiceMock.measure).toHaveBeenCalledWith(1234, expect.any(TemplateRef), expect.any(Function));
            expect(windowPlacementServiceMock.getBestFit).toHaveBeenCalledWith(expect.objectContaining({ width: 300, height: 400 }));
        });

        it.each([
            [150, undefined, 150, 400],
            [undefined, 250, 300, 250]
        ])('preserves an explicit dimension while measuring the missing dimension (%s, %s)', async (width, height, expectedWidth, expectedHeight) => {
            component.width = width;
            component.height = height;
            fixture.detectChanges();
            jest.spyOn(elementMock, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ width: 300, height: 400 }));

            const result = component.window.getBestFit();
            fixture.detectChanges();
            await result;

            expect(windowPlacementServiceMock.getBestFit).toHaveBeenCalledWith(expect.objectContaining({ width: expectedWidth, height: expectedHeight }));
        });

        it('uses current reference geometry, offsets, and adaptive options after the next render', async () => {
            fixture.detectChanges();

            const result = component.window.getBestFit();
            component.width = 240;
            component.window.refElement = elementMock;
            component.window.options = {
                alignment: { reference: { vertical: 'bottom' } },
                adaptivePosition: { viewportPadding: 12, placements: [{ alignment: { window: { vertical: 'bottom' } } }] }
            };
            fixture.detectChanges();
            await result;

            expect(windowPlacementServiceMock.getBestFit).toHaveBeenCalledWith({
                alignment: component.window.options.alignment,
                adaptivePlacements: component.window.options.adaptivePosition!.placements,
                width: 240,
                height: 456,
                referencePosition: { top: 200, left: 100, width: 400, height: 300 },
                topOffset: 135,
                leftOffset: 246,
                viewportPadding: 12
            });
        });

        it('remeasures after previously opened content changes instead of reusing cached dimensions', async () => {
            component.width = undefined;
            component.height = undefined;
            fixture.detectChanges();
            jest.spyOn(elementMock, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ width: 180, height: 240 }));
            jest.spyOn(windowServiceMock, 'getWindowElement').mockReturnValue(elementMock);
            component.window.open();
            windowServiceMock.windowOpened$.next(1234);
            windowServiceMock.windowClosed$.next(1234);
            jest.spyOn(elementMock, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ width: 320, height: 480 }));

            const result = component.window.getBestFit();
            fixture.detectChanges();
            await result;

            expect(windowPlacementServiceMock.getBestFit).toHaveBeenCalledWith(expect.objectContaining({ width: 320, height: 480 }));
        });

        it('does not open, close, or emit visibility and placement events during measurement', async () => {
            component.width = undefined;
            fixture.detectChanges();
            const visibility = jest.fn();
            const placements = jest.fn();
            component.window.visibleChange.subscribe(visibility);
            component.window.placementChange.subscribe(placements);

            const result = component.window.getBestFit();
            fixture.detectChanges();
            await result;

            expect(windowServiceMock.open).not.toHaveBeenCalled();
            expect(windowServiceMock.close).not.toHaveBeenCalled();
            expect(visibility).not.toHaveBeenCalled();
            expect(placements).not.toHaveBeenCalled();
        });

        it('supports multiple pending measurements', async () => {
            fixture.detectChanges();

            const first = component.window.getBestFit();
            const second = component.window.getBestFit();
            fixture.detectChanges();

            expect(await first).toEqual(await second);
            expect(windowPlacementServiceMock.getBestFit).toHaveBeenCalledTimes(2);
        });

        it('rejects when the measurement fails', async () => {
            component.width = undefined;
            fixture.detectChanges();
            jest.spyOn(windowServiceMock, 'measure').mockImplementation(() => { throw new Error('Measurement failed'); });

            const result = component.window.getBestFit();
            const rejection = expect(result).rejects.toThrow('Measurement failed');
            fixture.detectChanges();

            await rejection;
        });

        it('cancels pending measurement when closed', async () => {
            fixture.detectChanges();
            const result = component.window.getBestFit();
            const rejection = expect(result).rejects.toMatchObject({ name: 'AbortError' });

            component.window.close();
            fixture.detectChanges();

            await rejection;
            expect(windowPlacementServiceMock.getBestFit).not.toHaveBeenCalled();
        });

        it('cancels pending measurement when the service closes the window', async () => {
            fixture.detectChanges();
            const result = component.window.getBestFit();
            const rejection = expect(result).rejects.toMatchObject({ name: 'AbortError' });

            windowServiceMock.windowClosed$.next(1234);
            fixture.detectChanges();

            await rejection;
            expect(windowPlacementServiceMock.getBestFit).not.toHaveBeenCalled();
        });

        it('cancels pending measurement when destroyed', async () => {
            fixture.detectChanges();
            const result = component.window.getBestFit();
            const rejection = expect(result).rejects.toMatchObject({ name: 'AbortError' });

            fixture.destroy();

            await rejection;
            expect(windowPlacementServiceMock.getBestFit).not.toHaveBeenCalled();
        });

        it('rejects measurement requested after destruction', async () => {
            fixture.detectChanges();
            fixture.destroy();

            await expect(component.window.getBestFit()).rejects.toMatchObject({ name: 'AbortError' });
        });
    });

    describe('"open"', () => {
        it('opens the window using the service', () => {
            fixture.detectChanges();

            component.window.open();

            expect(windowServiceMock.open).toHaveBeenCalledWith(1234, expect.any(TemplateRef));
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

                expect(windowServiceMock.open).toHaveBeenCalledWith(1234, expect.any(TemplateRef));
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

                    expect(windowPlacementServiceMock.resolvePlacement).toHaveBeenCalledWith({
                        alignment: {
                            window: { horizontal: 'left', vertical: 'center' },
                            reference: { horizontal: 'right', vertical: 'bottom' }
                        },
                        adaptivePlacements: undefined,
                        height: 240,
                        leftOffset: 100,
                        referencePosition: { top: 200, left: 100, width: 400, height: 300 },
                        topOffset: 50,
                        viewportPadding: undefined,
                        width: 180
                    });
                    expect(divElement.styles['top']).toEqual('123px');
                    expect(divElement.styles['left']).toEqual('456px');
                });

                it('rounded to the nearest pixel 100th', () => {
                    currentPlacement = placement({ top: 250.002, left: 200.007 });
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
        });
    });

    describe('when width and height are not provided', () => {
        beforeEach(() => {
            jest.spyOn(windowServiceMock, 'open').mockImplementation(
                (id: number, template: TemplateRef<any>) => {
                    containerRef.createEmbeddedView(template, {});
                });

            component.width = undefined;
            component.height = undefined;
            fixture.detectChanges();
        });

        it('uses the measured size when resolving the position after opening', () => {
            const windowElementMock = document.createElement('div');
            jest.spyOn(windowElementMock, 'getBoundingClientRect').mockReturnValue({
                x: 0, y: 0, top: 0, left: 0, right: 180, bottom: 240, width: 180, height: 240, toJSON: () => { }
            });
            jest.spyOn(windowServiceMock, 'getWindowElement').mockReturnValue(windowElementMock);

            component.window.open();
            windowServiceMock.windowOpened$.next(1234);
            fixture.detectChanges();

            expect(windowPlacementServiceMock.resolvePlacement).toHaveBeenCalledWith({
                alignment: undefined,
                adaptivePlacements: undefined,
                height: 240,
                leftOffset: 246,
                referencePosition: undefined,
                topOffset: 135,
                viewportPadding: undefined,
                width: 180
            });
        });

        it('keeps the window hidden until its size is measured', () => {
            const windowElementMock = document.createElement('div');
            jest.spyOn(windowElementMock, 'getBoundingClientRect').mockReturnValue({
                x: 0, y: 0, top: 0, left: 0, right: 180, bottom: 240, width: 180, height: 240, toJSON: () => { }
            });
            jest.spyOn(windowServiceMock, 'getWindowElement').mockReturnValue(windowElementMock);

            component.window.open();
            fixture.detectChanges();

            let divElement = element.query(By.css('.window'));
            expect(divElement.styles['visibility']).toEqual('hidden');

            windowServiceMock.windowOpened$.next(1234);
            fixture.detectChanges();

            divElement = element.query(By.css('.window'));
            expect(divElement.styles['visibility']).toEqual('');
        });

        it('observes the rendered window and remeasures it when the content size changes', () => {
            const windowElementMock = document.createElement('div');
            const detectChangesSpy = jest.spyOn((component.window as any).changeDetectorRef, 'detectChanges');
            const measureSpy = jest.spyOn(component.window as any, 'measureWindow');
            const rects = [
                { x: 0, y: 0, top: 0, left: 0, right: 180, bottom: 240, width: 180, height: 240, toJSON: () => { } },
                { x: 0, y: 0, top: 0, left: 0, right: 210, bottom: 280, width: 210, height: 280, toJSON: () => { } }
            ];
            jest.spyOn(windowElementMock, 'getBoundingClientRect').mockImplementation(() => rects.shift()! as DOMRect);
            jest.spyOn(windowServiceMock, 'getWindowElement').mockReturnValue(windowElementMock);

            component.window.open();
            windowServiceMock.windowOpened$.next(1234);

            expect(resizeObserverInstance?.observe).toHaveBeenCalledWith(windowElementMock);

            resizeObserverCallback([], resizeObserverInstance as unknown as ResizeObserver);
            fixture.detectChanges();

            expect(measureSpy).toHaveBeenCalled();
            expect(detectChangesSpy).toHaveBeenCalled();
            expect(windowPlacementServiceMock.resolvePlacement).toHaveBeenCalledWith({
                alignment: undefined,
                adaptivePlacements: undefined,
                height: 280,
                leftOffset: 246,
                referencePosition: undefined,
                topOffset: 135,
                viewportPadding: undefined,
                width: 210
            });
        });

        it('skips setting up a resize observer when ResizeObserver is unavailable', () => {
            const windowElementMock = document.createElement('div');
            jest.spyOn(windowElementMock, 'getBoundingClientRect').mockReturnValue({
                x: 0, y: 0, top: 0, left: 0, right: 180, bottom: 240, width: 180, height: 240, toJSON: () => { }
            });
            jest.spyOn(windowServiceMock, 'getWindowElement').mockReturnValue(windowElementMock);
            window.ResizeObserver = undefined as any;

            component.window.open();
            windowServiceMock.windowOpened$.next(1234);
            fixture.detectChanges();

            expect(resizeObserverInstance).toBeUndefined();
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

describe('WindowComponent getBestFit with rendered content', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;
    let service: WindowService;
    let originalIntersectionObserver: typeof IntersectionObserver;
    let originalResizeObserver: typeof ResizeObserver;
    let rectSpy: jest.SpyInstance;

    beforeEach(() => {
        originalIntersectionObserver = window.IntersectionObserver;
        originalResizeObserver = window.ResizeObserver;
        const observer = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
        window.IntersectionObserver = observer as any;
        window.ResizeObserver = observer as any;
        window.innerWidth = 1200;
        window.innerHeight = 900;
        Object.defineProperty(window, 'scrollX', { value: 0, configurable: true });
        Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
        TestBed.configureTestingModule({
            declarations: [WindowComponent, TestHostComponent],
            providers: [provideRouter([]), WindowService, ElementPositionService, AlignmentService, WindowPlacementService]
        });
        fixture = TestBed.createComponent(TestHostComponent);
        host = fixture.componentInstance;
        host.width = undefined;
        host.height = undefined;
        service = TestBed.inject(WindowService);
        rectSpy = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
            const content = this.querySelector('.transclusion-test');

            return DOMRect.fromRect({ width: (content?.textContent?.length ?? 0) * 10, height: 200 });
        });
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        rectSpy.mockRestore();
        window.IntersectionObserver = originalIntersectionObserver;
        window.ResizeObserver = originalResizeObserver;
    });

    it('renders the measurement invisibly and removes it without opening the window', async () => {
        const visibility = jest.fn();
        host.window.visibleChange.subscribe(visibility);
        const states: { hidden: string, inert: boolean, ariaHidden: string | null }[] = [];
        rectSpy.mockImplementation(function (this: HTMLElement) {
            states.push({ hidden: this.style.visibility, inert: this.hasAttribute('inert'), ariaHidden: this.getAttribute('aria-hidden') });

            return DOMRect.fromRect({ width: 300, height: 400 });
        });

        const pending = host.window.getBestFit();
        fixture.detectChanges();
        const result = await pending;

        expect(result.fitsViewport).toBe(true);
        expect(states).toEqual([{ hidden: 'hidden', inert: true, ariaHidden: 'true' }]);
        expect(service.isOpen(host.window.id!)).toBe(false);
        expect(host.container.length).toBe(0);
        expect(fixture.nativeElement.querySelector('.window')).toBeNull();
        expect(visibility).not.toHaveBeenCalled();
    });

    it('measures updated projected content and can open it afterward', async () => {
        const first = host.window.getBestFit();
        fixture.detectChanges();
        await first;

        host.contentText = 'Current projected content';
        const second = host.window.getBestFit();
        fixture.detectChanges();
        await second;
        host.window.open();
        fixture.detectChanges();

        const element = service.getWindowElement(host.window.id!)!;
        expect(element.querySelector('.transclusion-test')!.textContent).toBe('Current projected content');
        expect(element.style.visibility).toBe('');
        expect(element.hasAttribute('inert')).toBe(false);
        expect(element.hasAttribute('aria-hidden')).toBe(false);
        expect(service.isOpen(host.window.id!)).toBe(true);
    });

    it('keeps an already open window visible and retains its rendered content during measurement', async () => {
        host.window.open();
        fixture.detectChanges();
        const originalElement = service.getWindowElement(host.window.id!);
        const originalContent = originalElement!.querySelector('.transclusion-test');
        const visibility = jest.fn();
        host.window.visibleChange.subscribe(visibility);

        const pending = host.window.getBestFit();
        fixture.detectChanges();
        await pending;

        expect(service.getWindowElement(host.window.id!)).toBe(originalElement);
        expect(originalElement!.querySelector('.transclusion-test')).toBe(originalContent);
        expect(originalElement!.style.visibility).toBe('');
        expect(host.container.length).toBe(1);
        expect(visibility).not.toHaveBeenCalled();
    });

    it('remeasures changed content on each call instead of treating a closed window as zero-sized', async () => {
        host.contentText = 'A'.repeat(10);
        const first = host.window.getBestFit();
        fixture.detectChanges();
        const firstResult = await first;

        host.contentText = 'A'.repeat(200);
        const second = host.window.getBestFit();
        fixture.detectChanges();
        const secondResult = await second;

        expect(firstResult.fitsViewport).toBe(true);
        expect(secondResult.fitsViewport).toBe(false);
        expect(host.container.length).toBe(0);
    });
});

@Component({
    template: `    
        <ngx-window [width]="width" [height]="height" [topOffset]="135" [leftOffset]="246"
            (visibleChange)="windowVisible=$event" (placementChange)="placementChanges.push($event)" #window>
            <p class="transclusion-test">{{ contentText }}</p>
        </ngx-window>
        <div #container class="TESKTJSLEKJWLEKTJWELKT"> 
        </div>
    `,
    standalone: false
})
class TestHostComponent implements OnInit {
    @ViewChild('container', { static: true, read: ViewContainerRef }) container!: ViewContainerRef;
    @ViewChild('window', { static: true }) window!: WindowComponent;

    contentText = 'test content';
    width: number | undefined = 123;
    height: number | undefined = 456;
    windowVisible?: boolean;
    placementChanges: ResolvedWindowPlacement[] = [];

    constructor(private windowService: WindowService) { }

    ngOnInit() {
        this.windowService.registerContainer(this.container);
    }
}

function placement(
    offset: { top: number, left: number },
    placementIndex: number = 0,
    source: 'primary' | 'adaptive' = 'primary',
    alignment: ResolvedWindowPlacement['alignment'] = undefined,
    topOffset: number = 135,
    leftOffset: number = 246
): ResolvedWindowPlacement {
    return {
        offset,
        placementIndex,
        source,
        alignment,
        topOffset,
        leftOffset
    };
}

function waitForTimer() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}
