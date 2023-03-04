import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { WindowComponent } from '../../../../projects/ngx-window/src/public-api';
import { DropDownComponent } from './drop-down.component';

describe('DropDownComponent', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestHostComponent,
                DropDownComponent,
                MockComponent(WindowComponent)
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    describe('has', () => {
        describe('<button> element with', () => {
            it('class "drop-down-button"', () => {
                fixture.detectChanges();

                let buttonElement = element.query(By.css('button.drop-down-button'));

                expect(buttonElement !== null).toBeTruthy();
            });

            it('the provided "title" as text', () => {
                component.dropDown.title = 'Test title';
                fixture.detectChanges();

                let buttonElement = element.query(By.css('.drop-down-button'));

                expect(buttonElement.nativeElement.textContent).toEqual('Test title');
            });

            it('class "open" if the drop down is visible', () => {
                component.dropDown.windowVisible = true;
                fixture.detectChanges();

                let buttonElemenet = element.query(By.css('.drop-down-button'));

                expect(buttonElemenet.classes['open']).toBeTruthy();
            });

            it('out class "open" if the drop down is not visible', () => {
                component.dropDown.windowVisible = false;
                fixture.detectChanges();

                let buttonElemenet = element.query(By.css('.drop-down-button'));

                expect(buttonElemenet.classes['open']).toBeFalsy();
            });

            it('click handler that toggles the drop down', () => {
                fixture.detectChanges();
                jest.spyOn(component.dropDown.dropDownWindow, 'toggle');

                let buttonElemenet = element.query(By.css('.drop-down-button'));
                buttonElemenet.triggerEventHandler('click', {});

                expect(component.dropDown.dropDownWindow.toggle).toHaveBeenCalled();
            });
        });

        describe('visibility change event listener that', () => {
            describe('changes "dropDownVisible" to', () => {
                it('"true" when the drop down becomes visible', () => {
                    fixture.detectChanges();

                    let windowElement = element.query(By.css('.drop-down-window'));
                    let windowComponent = windowElement.componentInstance as WindowComponent;
                    windowComponent.visibleChange.emit(true);

                    expect(component.dropDown.windowVisible).toEqual(true);
                });

                it('"false" when the drop down becomes invisible', () => {
                    component.dropDown.windowVisible = true;
                    fixture.detectChanges();

                    let windowElement = element.query(By.css('.drop-down-window'));
                    let windowComponent = windowElement.componentInstance as WindowComponent;
                    windowComponent.visibleChange.emit(false);

                    expect(component.dropDown.windowVisible).toEqual(false);
                });
            });
        });

        describe('<ngx-window> component with', () => {
            it('class "drop-down-window"', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('ngx-window.drop-down-window'));

                expect(windowElement !== null).toBeTruthy();
            });

            it('"refElement" set to the button', () => {
                fixture.detectChanges();

                let buttonElement = element.query(By.css('.drop-down-button'));
                let windowElement = element.query(By.css('.drop-down-window'));
                let windowComponent = windowElement.componentInstance as WindowComponent;

                expect(windowComponent.refElement).toBe(buttonElement.nativeElement);
            });

            it('"width" set to 200', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('.drop-down-window'));
                let windowComponent = windowElement.componentInstance as WindowComponent;

                expect(windowComponent.width).toEqual(200);
            });

            it('"height" set to 250', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('.drop-down-window'));
                let windowComponent = windowElement.componentInstance as WindowComponent;

                expect(windowComponent.height).toEqual(250);
            });

            it('"options" set to bottom alignment', () => {
                fixture.detectChanges();

                let windowElement = element.query(By.css('.drop-down-window'));
                let windowComponent = windowElement.componentInstance as WindowComponent;

                expect(windowComponent.options?.alignment).toEqual({ reference: { vertical: 'bottom' } });
            });

            describe('<div> element with', () => {
                it('class "drop-down-content"', () => {
                    fixture.detectChanges();

                    let contentElement = element.query(By.css('.drop-down-window div.drop-down-content'));

                    expect(contentElement !== null).toBeTruthy();
                });

                it('the content of the drop down component', () => {
                    fixture.detectChanges();

                    let contentElement = element.query(By.css('.drop-down-content'));

                    expect(contentElement.nativeElement.textContent).toEqual('Test content');
                });
            });
        });
    });
});

@Component({
    template: `
        <ngx-test-drop-down #dropDown>
            <span>Test content</span>
        </ngx-test-drop-down>
    `
})
class TestHostComponent {
    @ViewChild('dropDown', { static: true }) dropDown!: DropDownComponent;
}