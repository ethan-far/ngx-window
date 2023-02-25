import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ResizableComponent } from './resizable.component';

describe('ResizableComponent', () => {

    let fixture: ComponentFixture<ResizableComponent>;
    let component: ResizableComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                ResizableComponent
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
        });
    });
});