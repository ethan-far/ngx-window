import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockDirective } from 'ng-mocks';
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

            describe('<nav> element with', () => {
                it('class "main-navigation"', () => {
                    fixture.detectChanges();

                    let navigationElement = element.query(By.css('nav.main-navigation'));

                    expect(navigationElement !== null).toBeTruthy();
                });

                describe('<ol> element with', () => {
                    it('class "link-list"', () => {
                        fixture.detectChanges();

                        let listElement = element.query(By.css('.main-navigation ol.link-list'));

                        expect(listElement !== null).toBeTruthy();
                    });

                    describe('<li> element with', () => {
                        it('class "drop-downs"', () => {
                            fixture.detectChanges();

                            let itemElement = element.query(By.css('.link-list li.drop-downs'));

                            expect(itemElement !== null).toBeTruthy();
                        });

                        it('the expected text', () => {
                            fixture.detectChanges();

                            let itemElement = element.query(By.css('.drop-downs'));

                            expect(itemElement.nativeElement.textContent).toEqual('Drop downs');
                        });

                        it('router link to the relevant page', () => {
                            fixture.detectChanges();

                            let itemElement = element.query(By.css('.drop-downs'));

                            expect(itemElement.attributes['routerLink']).toEqual('/drop-downs');
                        });
                    });
                });
            });

            describe('<router-outlet> component with', () => {
                it('class "main-content"', () => {
                    fixture.detectChanges();

                    let routerOutletElement = element.query(By.css('router-outlet.main-content'));

                    expect(routerOutletElement !== null).toBeTruthy();
                });
            });
        });
    });
});
