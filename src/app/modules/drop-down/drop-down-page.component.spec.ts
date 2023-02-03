import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent, MockDirective, ngMocks } from 'ng-mocks';
import { WindowCloserDirective } from '../../../../projects/ngx-window/src/lib/window-closer.directive';
import { WindowComponent } from '../../../../projects/ngx-window/src/public-api';
import { DropDownPageComponent } from './drop-down-page.component';

describe('DropDownPageComponent', () => {

    let fixture: ComponentFixture<DropDownPageComponent>;
    let component: DropDownPageComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                DropDownPageComponent,
                MockComponent(WindowComponent),
                MockDirective(WindowCloserDirective)
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DropDownPageComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    describe('has', () => {
        describe('<div> element with', () => {
            it('class "drop-down-page"', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('div.drop-down-page'));

                expect(divElement !== null).toBeTruthy();
            });

            describe('<div> element with', () => {
                it('classes "box simple"', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.drop-down-page div.box.simple'));

                    expect(divElement !== null).toBeTruthy();
                });

                it('the expected title', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.box.simple'));

                    expect(divElement.attributes['title']).toEqual('Simple');
                });

                describe('<button> element with', () => {
                    it('class "simple-drop-down-button"', () => {
                        fixture.detectChanges();

                        let buttonElemenet = element.query(By.css('.box.simple button.simple-drop-down-button'));

                        expect(buttonElemenet !== null).toBeTruthy();
                    });

                    it('class "open" if the drop down is visible', () => {
                        component.simpleDropDownWindowVisible = true;
                        fixture.detectChanges();

                        let buttonElemenet = element.query(By.css('.simple-drop-down-button'));

                        expect(buttonElemenet.classes['open']).toBeTruthy();
                    });

                    it('out class "open" if the drop down is not visible', () => {
                        component.simpleDropDownWindowVisible = false;
                        fixture.detectChanges();

                        let buttonElemenet = element.query(By.css('.simple-drop-down-button'));

                        expect(buttonElemenet.classes['open']).toBeFalsy();
                    });

                    it('the expect text', () => {
                        fixture.detectChanges();

                        let buttonElemenet = element.query(By.css('.simple-drop-down-button'));

                        expect(buttonElemenet.nativeElement.textContent).toEqual('Simple');
                    });

                    it('click handler that toggles the drop down', () => {
                        fixture.detectChanges();
                        jest.spyOn(component.simpleDropDown, 'toggle');

                        let buttonElemenet = element.query(By.css('.simple-drop-down-button'));
                        buttonElemenet.triggerEventHandler('click', {});

                        expect(component.simpleDropDown.toggle).toHaveBeenCalled();
                    });

                    describe('visibility change event listener that', () => {
                        describe('changes "simpleDropDownVisible" to', () => {
                            it('"true" when the drop down becomes visible', () => {
                                fixture.detectChanges();

                                let windowElement = element.query(By.css('.simple-drop-down'));
                                let windowComponent = windowElement.componentInstance as WindowComponent;
                                windowComponent.visibleChange.emit(true);

                                expect(component.simpleDropDownWindowVisible).toEqual(true);
                            });

                            it('"false" when the drop down becomes invisible', () => {
                                component.simpleDropDownWindowVisible = true;
                                fixture.detectChanges();

                                let windowElement = element.query(By.css('.simple-drop-down'));
                                let windowComponent = windowElement.componentInstance as WindowComponent;
                                windowComponent.visibleChange.emit(false);

                                expect(component.simpleDropDownWindowVisible).toEqual(false);
                            });
                        });
                    });
                });

                describe('<ngx-window> component with', () => {
                    it('class "simple-drop-down"', () => {
                        fixture.detectChanges();

                        let windowElement = element.query(By.css('ngx-window.simple-drop-down'));

                        expect(windowElement !== null).toBeTruthy();
                    });

                    it('"refElement" set to the button', () => {
                        fixture.detectChanges();

                        let buttonElement = element.query(By.css('.simple-drop-down-button'));
                        let windowElement = element.query(By.css('.simple-drop-down'));
                        let windowComponent = windowElement.componentInstance as WindowComponent;

                        expect(windowComponent.refElement).toBe(buttonElement.nativeElement);
                    });

                    it('"width" set to 200', () => {
                        fixture.detectChanges();

                        let windowElement = element.query(By.css('.simple-drop-down'));
                        let windowComponent = windowElement.componentInstance as WindowComponent;

                        expect(windowComponent.width).toEqual(200);
                    });

                    it('"height" set to 250', () => {
                        fixture.detectChanges();

                        let windowElement = element.query(By.css('.simple-drop-down'));
                        let windowComponent = windowElement.componentInstance as WindowComponent;

                        expect(windowComponent.height).toEqual(250);
                    });

                    it('"options" set to bottom alignment', () => {
                        fixture.detectChanges();

                        let windowElement = element.query(By.css('.simple-drop-down'));
                        let windowComponent = windowElement.componentInstance as WindowComponent;

                        expect(windowComponent.options?.alignment?.alignToBottom).toEqual(true);
                    });

                    describe('<div> element with', () => {
                        it('classes "simple drop-down-content"', () => {
                            fixture.detectChanges();

                            let divElement = element.query(By.css('.simple-drop-down div.simple.drop-down-content'));

                            expect(divElement !== null).toBeTruthy();
                        });

                        it('the expected text', () => {
                            fixture.detectChanges();

                            let divElement = element.query(By.css('.simple.drop-down-content'));

                            expect(divElement.nativeElement.textContent).toEqual('This is a simple drop down with no content. Click outside to close.');
                        });
                    });
                });
            });

            describe('<div> element with', () => {
                it('classes "box close-from-within"', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.drop-down-page div.box.close-from-within'));

                    expect(divElement !== null).toBeTruthy();
                });

                it('the expected title', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.box.close-from-within'));

                    expect(divElement.attributes['title']).toEqual('Close from within');
                });

                describe('<button> element with', () => {
                    it('class "close-from-within-drop-down-button"', () => {
                        fixture.detectChanges();

                        let buttonElemenet = element.query(By.css('.box.close-from-within button.close-from-within-drop-down-button'));

                        expect(buttonElemenet !== null).toBeTruthy();
                    });

                    it('class "open" if the drop down is visible', () => {
                        component.closeFromWithinDropDownWindowVisible = true;
                        fixture.detectChanges();

                        let buttonElemenet = element.query(By.css('.close-from-within-drop-down-button'));

                        expect(buttonElemenet.classes['open']).toBeTruthy();
                    });

                    it('out class "open" if the drop down is not visible', () => {
                        component.closeFromWithinDropDownWindowVisible = false;
                        fixture.detectChanges();

                        let buttonElemenet = element.query(By.css('.close-from-within-drop-down-button'));

                        expect(buttonElemenet.classes['open']).toBeFalsy();
                    });

                    it('the expect text', () => {
                        fixture.detectChanges();

                        let buttonElemenet = element.query(By.css('.close-from-within-drop-down-button'));

                        expect(buttonElemenet.nativeElement.textContent).toEqual('Close from within');
                    });

                    it('click handler that toggles the drop down', () => {
                        fixture.detectChanges();
                        jest.spyOn(component.closeFromWithinDropDown, 'toggle');

                        let buttonElemenet = element.query(By.css('.close-from-within-drop-down-button'));
                        buttonElemenet.triggerEventHandler('click', {});

                        expect(component.closeFromWithinDropDown.toggle).toHaveBeenCalled();
                    });
                });

                describe('visibility change event listener that', () => {
                    describe('changes "simpleDropDownVisible" to', () => {
                        it('"true" when the drop down becomes visible', () => {
                            fixture.detectChanges();

                            let windowElement = element.query(By.css('.close-from-within-drop-down'));
                            let windowComponent = windowElement.componentInstance as WindowComponent;
                            windowComponent.visibleChange.emit(true);

                            expect(component.closeFromWithinDropDownWindowVisible).toEqual(true);
                        });

                        it('"false" when the drop down becomes invisible', () => {
                            component.simpleDropDownWindowVisible = true;
                            fixture.detectChanges();

                            let windowElement = element.query(By.css('.close-from-within-drop-down'));
                            let windowComponent = windowElement.componentInstance as WindowComponent;
                            windowComponent.visibleChange.emit(false);

                            expect(component.closeFromWithinDropDownWindowVisible).toEqual(false);
                        });
                    });
                });

                describe('<ngx-window> component with', () => {
                    it('class "close-from-within-drop-down"', () => {
                        fixture.detectChanges();

                        let windowElement = element.query(By.css('ngx-window.close-from-within-drop-down'));

                        expect(windowElement !== null).toBeTruthy();
                    });

                    it('"refElement" set to the button', () => {
                        fixture.detectChanges();

                        let buttonElement = element.query(By.css('.close-from-within-drop-down-button'));
                        let windowElement = element.query(By.css('.close-from-within-drop-down'));
                        let windowComponent = windowElement.componentInstance as WindowComponent;

                        expect(windowComponent.refElement).toBe(buttonElement.nativeElement);
                    });

                    it('"width" set to 200', () => {
                        fixture.detectChanges();

                        let windowElement = element.query(By.css('.close-from-within-drop-down'));
                        let windowComponent = windowElement.componentInstance as WindowComponent;

                        expect(windowComponent.width).toEqual(200);
                    });

                    it('"height" set to 250', () => {
                        fixture.detectChanges();

                        let windowElement = element.query(By.css('.close-from-within-drop-down'));
                        let windowComponent = windowElement.componentInstance as WindowComponent;

                        expect(windowComponent.height).toEqual(250);
                    });

                    it('"options" set to bottom alignment', () => {
                        fixture.detectChanges();

                        let windowElement = element.query(By.css('.close-from-within-drop-down'));
                        let windowComponent = windowElement.componentInstance as WindowComponent;

                        expect(windowComponent.options?.alignment?.alignToBottom).toEqual(true);
                    });

                    describe('<div> element with', () => {
                        it('classes "close-from-within drop-down-content"', () => {
                            fixture.detectChanges();

                            let divElement = element.query(By.css('.close-from-within-drop-down div.close-from-within.drop-down-content'));

                            expect(divElement !== null).toBeTruthy();
                        });

                        it('the expected text', () => {
                            fixture.detectChanges();

                            let divElement = element.query(By.css('.close-from-within.drop-down-content'));

                            expect(divElement.nativeElement.textContent).toMatch('Click the button below to close the dropdown.');
                        });

                        describe('<button> element with', () => {
                            it('classes "close-button"', () => {
                                fixture.detectChanges();

                                let buttonElement = element.query(By.css('.close-from-within.drop-down-content button.close-button'));

                                expect(buttonElement !== null).toBeTruthy();
                            });

                            it('the expected text', () => {
                                fixture.detectChanges();

                                let buttonElement = element.query(By.css('.close-from-within.drop-down-content .close-button'));

                                expect(buttonElement.nativeElement.textContent).toEqual('Close drop down');
                            });

                            it('click handler that toggles the closes the window', () => {
                                fixture.detectChanges();
                                let buttonElement = element.query(By.css('.close-from-within.drop-down-content .close-button'));

                                let windowCloserDirective = ngMocks.get(buttonElement, WindowCloserDirective);
                                jest.spyOn(windowCloserDirective, 'close');

                                buttonElement.triggerEventHandler('click', {});

                                expect(windowCloserDirective.close).toHaveBeenCalled();
                            });
                        });
                    });
                });
            });
        });
    });
});

