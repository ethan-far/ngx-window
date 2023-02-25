import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlignmentPageComponent } from './alignment-page.component';

describe('AlignmentPageComponent', () => {

    let fixture: ComponentFixture<AlignmentPageComponent>;
    let component: AlignmentPageComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                AlignmentPageComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlignmentPageComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    describe('has', () => {
        describe('<div> element with', () => {
            it('class "alignment-page"', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('div.alignment-page'));

                expect(divElement !== null).toBeTruthy();
            });
        });
    });
});