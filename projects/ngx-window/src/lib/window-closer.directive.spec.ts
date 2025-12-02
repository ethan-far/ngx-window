import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { mock } from 'ts-mockito';
import { WindowCloserDirective } from './window-closer.directive';
import { WindowService } from './window.service';

describe('WindowCloserDirective', () => {

    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let element: DebugElement;

    let windowServiceMock: WindowService;

    beforeEach(waitForAsync(() => {
        windowServiceMock = mock(WindowService);

        TestBed.configureTestingModule({
            declarations: [
                TestComponent,
                WindowCloserDirective
            ],
            providers: [
                { provide: WindowService, useFactory: () => windowServiceMock }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    describe('close', () => {
        it('uses the window services to close the containing window', () => {
            jest.spyOn(windowServiceMock, 'closeContainingWindow');
            fixture.detectChanges();

            let divElement = element.query(By.css('div'));
            component.close();

            expect(windowServiceMock.closeContainingWindow).toHaveBeenCalledWith(divElement.nativeElement);
        });
    });
});

@Component({
    template: '<div ngxWindowCloser></div>',
    standalone: false
})
export class TestComponent {
    @ViewChild(WindowCloserDirective) windowCloser!: WindowCloserDirective;

    close() {
        this.windowCloser.close();
    }
}
