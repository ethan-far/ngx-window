import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { NgxWindowModule, WindowComponent } from '../../../../projects/ngx-window/src/public-api';
import { DropDownPageComponent } from './drop-down-page.component';

describe('DropDownPageComponent', () => {

    let fixture: ComponentFixture<DropDownPageComponent>;
    let component: DropDownPageComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                DropDownPageComponent,
                MockComponent(WindowComponent)
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

                    it('the expect text', () => {
                        fixture.detectChanges();

                        let buttonElemenet = element.query(By.css('.simple-drop-down-button'));

                        expect(buttonElemenet.nativeElement.textContent).toEqual('Simple \u25e2');
                    });

                    it('click handler that opens the drop down', () => {
                        fixture.detectChanges();
                        jest.spyOn(component.simpleDropDown, 'open');

                        let buttonElemenet = element.query(By.css('.simple-drop-down-button'));
                        buttonElemenet.triggerEventHandler('click', {});

                        expect(component.simpleDropDown.open).toHaveBeenCalled();
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
        });
    });
});

