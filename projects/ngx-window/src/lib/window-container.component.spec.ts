import { DebugElement, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WindowContainerComponent } from './window-container.component';
import { WindowService } from './window.service';
import { mock } from 'ts-mockito';

describe('NgxWindowContainerComponent', () => {

    let fixture: ComponentFixture<WindowContainerComponent>;
    let component: WindowContainerComponent;
    let element: DebugElement;

    let ngxWindowServiceMock: WindowService;

    beforeEach(waitForAsync(() => {
        ngxWindowServiceMock = mock(WindowService);

        TestBed.configureTestingModule({
            declarations: [
                WindowContainerComponent
            ],
            providers: [
                { provide: WindowService, useFactory: () => ngxWindowServiceMock }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WindowContainerComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;

        jest.spyOn(ngxWindowServiceMock, 'registerContainer');
    });

    it('registers its container', () => {
        fixture.detectChanges();

        expect(ngxWindowServiceMock.registerContainer).toHaveBeenCalledWith(expect.any(ViewContainerRef));
    });

    describe('has', () => {
        describe('<div> element with', () => {
            it('class "ngx-window-container', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('div.ngx-window-container'));

                expect(divElement !== null).toBeTruthy();
            });
        });
    });
});
