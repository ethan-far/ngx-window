import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ResizeAndMovePageComponent } from './resize-and-move-page.component';

describe('ResizeAndMovePageComponent', () => {

    let fixture: ComponentFixture<ResizeAndMovePageComponent>;
    let component: ResizeAndMovePageComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                ResizeAndMovePageComponent
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
        });
    });

});