import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;
    let element: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                AppComponent
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    describe('has', () => {
        describe('<div> element with', () => {
            it('class "test-application"', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('div.test-application'));

                expect(divElement !== null).toBeTruthy();
            });

            describe('<div> element with', () => {
                it('class "title"', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.test-application div.title'));

                    expect(divElement !== null).toBeTruthy();
                });

                describe('<h1> element with', () => {
                    it('the expected text', () => {
                        fixture.detectChanges();

                        let headerElement = element.query(By.css('.title h1'));

                        expect(headerElement.nativeElement.textContent).toEqual('ngx-window Test Application');
                    });
                });
            });
        });
    });
});
