import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MovableComponent } from './movable.component';

describe('MovableComponent', () => {

    let fixture: ComponentFixture<MovableComponent>;
    let component: MovableComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                MovableComponent
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
        });
    });
});