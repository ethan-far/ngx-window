import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { MovableComponent } from './movable.component';
import { ResizableComponent } from './resizable.component';
import { ResizeAndMovePageComponent } from './resize-and-move-page.component';

describe('ResizeAndMovePageComponent', () => {

    let fixture: ComponentFixture<ResizeAndMovePageComponent>;
    let component: ResizeAndMovePageComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                ResizeAndMovePageComponent,
                MockComponent(ResizableComponent),
                MockComponent(MovableComponent)
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResizeAndMovePageComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    describe('has', () => {
        describe('<div> element with', () => {
            it('class "resize-and-move-page"', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('div.resize-and-move-page'));

                expect(divElement !== null).toBeTruthy();
            });

            describe('<ngx-test-resizable> component with', () => {
                it('class "resizable"', () => {
                    fixture.detectChanges();

                    let resizableElement = element.query(By.css('.resize-and-move-page ngx-test-resizable.resizable'));

                    expect(resizableElement !== null).toBeTruthy();
                });
            });

            describe('<ngx-test-movable> component with', () => {
                it('class "movable"', () => {
                    fixture.detectChanges();

                    let movableElement = element.query(By.css('.resize-and-move-page ngx-test-movable.movable'));

                    expect(movableElement !== null).toBeTruthy();
                });
            });

            describe('drag over event handler that', () => {

                let eventMock: Event;

                beforeEach(() => {
                    eventMock = new Event('dragover');
                });

                it('prevents the default behavior of the event to allow drop', () => {
                    jest.spyOn(eventMock, 'preventDefault');
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.resize-and-move-page'));
                    divElement.triggerEventHandler('dragover', eventMock);

                    expect(eventMock.preventDefault).toHaveBeenCalled();
                });
            });
        });
    });
});