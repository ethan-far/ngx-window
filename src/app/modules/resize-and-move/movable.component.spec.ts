import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { WindowComponent } from '../../../../projects/ngx-window/src/public-api';
import { MovableComponent } from './movable.component';

describe('MovableComponent', () => {

    let fixture: ComponentFixture<MovableComponent>;
    let component: MovableComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                MovableComponent,
                MockComponent(WindowComponent)
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MovableComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    describe('has', () => {
        describe('<div> element with', () => {
            it('class "movable"', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('div.movable'));

                expect(divElement !== null).toBeTruthy();
            });

            it('the expected text', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('.movable'));

                expect(divElement.nativeElement.textContent).toMatch('Move me');
            });

            it('"draggable" set to "true"', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('.movable'));

                expect(divElement.attributes['draggable']).toEqual('true');
            });

            describe('drag event handlers that', () => {
                it('changes the top and left styles according to the movement', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.movable'));
                    divElement.triggerEventHandler('dragstart', { x: 120, y: 240 });
                    divElement.triggerEventHandler('drag', { x: 123, y: 245 });
                    divElement.triggerEventHandler('drag', { x: 135, y: 231 });
                    divElement.triggerEventHandler('drag', { x: 147, y: 211 });

                    expect(divElement.styles['left']).toEqual('27px');
                    expect(divElement.styles['top']).toEqual('-29px');
                });
            });
        });

        describe('<ngx-window> component with', () => {
            it('classes "top window"', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.top.window'));

                expect(windowElement !== null).toBeTruthy();
            });

            it('the <div> as reference element', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('div.movable'));
                let windowElement = element.query(By.css('ngx-window.top.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.refElement).toEqual(divElement.nativeElement);
            });

            it('the expected width', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.top.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.width).toEqual(100);
            });

            it('the expected height', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.top.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.height).toEqual(30);
            });

            it('the expected topOffset', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.top.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.topOffset).toEqual(-10);
            });

            it('the expected leftOffset', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.top.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.leftOffset).toEqual(0);
            });

            it('the expected options', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.top.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.options).toEqual({
                    visibility: {
                        startOpen: true,
                        keepOpen: {
                            onClickOutside: true,
                            onIntersection: true
                        }
                    },
                    alignment: {
                        window: {
                            horizontal: 'center',
                            vertical: 'bottom'
                        },
                        reference: {
                            horizontal: 'center'
                        }
                    }
                });
            });

            describe('<span> element with', () => {
                it('class "window-content"', () => {
                    fixture.detectChanges();

                    let spanElement = element.query(By.css('.top.window span.window-content'));

                    expect(spanElement !== null).toBeTruthy();
                });

                it('the expected text', () => {
                    fixture.detectChanges();

                    let spanElement = element.query(By.css('.top.window .window-content'));

                    expect(spanElement.nativeElement.textContent).toEqual('Top');
                });
            });
        });

        describe('<ngx-window> component with', () => {
            it('classes "left window"', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.left.window'));

                expect(windowElement !== null).toBeTruthy();
            });

            it('the <div> as reference element', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('div.movable'));
                let windowElement = element.query(By.css('ngx-window.left.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.refElement).toEqual(divElement.nativeElement);
            });

            it('the expected width', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.left.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.width).toEqual(100);
            });

            it('the expected height', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.left.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.height).toEqual(30);
            });

            it('the expected topOffset', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.left.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.topOffset).toEqual(0);
            });

            it('the expected leftOffset', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.left.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.leftOffset).toEqual(-10);
            });

            it('the expected options', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.left.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.options).toEqual({
                    visibility: {
                        startOpen: true,
                        keepOpen: {
                            onClickOutside: true,
                            onIntersection: true
                        }
                    },
                    alignment: {
                        window: {
                            horizontal: 'right',
                            vertical: 'center'
                        },
                        reference: {
                            vertical: 'center'
                        }
                    }
                });
            });

            describe('<span> element with', () => {
                it('class "window-content"', () => {
                    fixture.detectChanges();

                    let spanElement = element.query(By.css('.left.window span.window-content'));

                    expect(spanElement !== null).toBeTruthy();
                });

                it('the expected text', () => {
                    fixture.detectChanges();

                    let spanElement = element.query(By.css('.left.window .window-content'));

                    expect(spanElement.nativeElement.textContent).toEqual('Left');
                });
            });
        });

        describe('<ngx-window> component with', () => {
            it('classes "right window"', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.right.window'));

                expect(windowElement !== null).toBeTruthy();
            });

            it('the <div> as reference element', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('div.movable'));
                let windowElement = element.query(By.css('ngx-window.right.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.refElement).toEqual(divElement.nativeElement);
            });

            it('the expected width', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.right.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.width).toEqual(100);
            });

            it('the expected height', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.right.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.height).toEqual(30);
            });

            it('the expected topOffset', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.right.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.topOffset).toEqual(0);
            });

            it('the expected leftOffset', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.right.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.leftOffset).toEqual(10);
            });

            it('the expected options', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.right.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.options).toEqual({
                    visibility: {
                        startOpen: true,
                        keepOpen: {
                            onClickOutside: true,
                            onIntersection: true
                        }
                    },
                    alignment: {
                        window: {
                            vertical: 'center'
                        },
                        reference: {
                            horizontal: 'right',
                            vertical: 'center'
                        }
                    }
                });
            });

            describe('<span> element with', () => {
                it('class "window-content"', () => {
                    fixture.detectChanges();

                    let spanElement = element.query(By.css('.right.window span.window-content'));

                    expect(spanElement !== null).toBeTruthy();
                });

                it('the expected text', () => {
                    fixture.detectChanges();

                    let spanElement = element.query(By.css('.right.window .window-content'));

                    expect(spanElement.nativeElement.textContent).toEqual('Right');
                });
            });
        });

        describe('<ngx-window> component with', () => {
            it('classes "bottom window"', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.bottom.window'));

                expect(windowElement !== null).toBeTruthy();
            });

            it('the <div> as reference element', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('div.movable'));
                let windowElement = element.query(By.css('ngx-window.bottom.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.refElement).toEqual(divElement.nativeElement);
            });

            it('the expected width', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.bottom.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.width).toEqual(100);
            });

            it('the expected height', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.bottom.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.height).toEqual(30);
            });

            it('the expected topOffset', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.bottom.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.topOffset).toEqual(10);
            });

            it('the expected leftOffset', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.bottom.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.leftOffset).toEqual(0);
            });

            it('the expected options', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.bottom.window'));
                let WindowComponent = windowElement.componentInstance as WindowComponent;

                expect(WindowComponent.options).toEqual({
                    visibility: {
                        startOpen: true,
                        keepOpen: {
                            onClickOutside: true,
                            onIntersection: true
                        }
                    },
                    alignment: {
                        window: {
                            horizontal: 'center'
                        },
                        reference: {
                            horizontal: 'center',
                            vertical: 'bottom'
                        }
                    }
                });
            });

            describe('<span> element with', () => {
                it('class "window-content"', () => {
                    fixture.detectChanges();

                    let spanElement = element.query(By.css('.bottom.window span.window-content'));

                    expect(spanElement !== null).toBeTruthy();
                });

                it('the expected text', () => {
                    fixture.detectChanges();

                    let spanElement = element.query(By.css('.bottom.window .window-content'));

                    expect(spanElement.nativeElement.textContent).toEqual('Bottom');
                });
            });
        });
    });
});