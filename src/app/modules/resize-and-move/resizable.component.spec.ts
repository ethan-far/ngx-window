import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { NgxWindowModule, WindowComponent } from '../../../../projects/ngx-window/src/public-api';
import { ResizableComponent } from './resizable.component';

describe('ResizableComponent', () => {

    let fixture: ComponentFixture<ResizableComponent>;
    let component: ResizableComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                ResizableComponent,
                MockComponent(WindowComponent)
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResizableComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    describe('has', () => {
        describe('<div> element with', () => {
            it('class "resizable"', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('div.resizable'));

                expect(divElement !== null).toBeTruthy();
            });

            it('the expected text', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('.resizable'));

                expect(divElement.nativeElement.textContent).toEqual('Resize me');
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

                let divElement = element.query(By.css('div.resizable'));
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
                            onClickOutside: true
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

                let divElement = element.query(By.css('div.resizable'));
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
                            onClickOutside: true
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

                let divElement = element.query(By.css('div.resizable'));
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
                            onClickOutside: true
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

                let divElement = element.query(By.css('div.resizable'));
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
                            onClickOutside: true
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