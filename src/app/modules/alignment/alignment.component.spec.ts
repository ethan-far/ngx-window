import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlignmentComponent } from './alignment.component';

describe('AlignmentComponent', () => {

    let fixture: ComponentFixture<AlignmentComponent>;
    let component: AlignmentComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                AlignmentComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlignmentComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    describe('has', () => {
        describe('<div> element with', () => {
            it('class "alignment"', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('div.alignment'));

                expect(divElement !== null).toBeTruthy();
            });
        });
    });
});
