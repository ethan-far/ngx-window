import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { AppComponent } from './app.component';
import { LinkComponent } from './link.component';

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
                AppComponent,
                MockComponent(LinkComponent)
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

                    describe('<ngx-test-link> component with', () => {
                        it('class "drop-downs"', () => {
                            fixture.detectChanges();

                            let linkElement = element.query(By.css('.link-list ngx-test-link.drop-downs'));

                            expect(linkElement !== null).toBeTruthy();
                        });

                        it('the expected title', () => {
                            fixture.detectChanges();

                            let linkElement = element.query(By.css('.drop-downs'));
                            let linkComponent = linkElement.componentInstance as LinkComponent;

                            expect(linkComponent.title).toEqual('Drop downs');
                        });

                        it('the expected url', () => {
                            fixture.detectChanges();

                            let linkElement = element.query(By.css('.drop-downs'));
                            let linkComponent = linkElement.componentInstance as LinkComponent;

                            expect(linkComponent.url).toEqual('/drop-downs');
                        });
                    });

                    describe('<ngx-test-link> component with', () => {
                        it('class "resize-and-move"', () => {
                            fixture.detectChanges();

                            let linkElement = element.query(By.css('.link-list ngx-test-link.resize-and-move'));

                            expect(linkElement !== null).toBeTruthy();
                        });

                        it('the expected title', () => {
                            fixture.detectChanges();

                            let linkElement = element.query(By.css('.resize-and-move'));
                            let linkComponent = linkElement.componentInstance as LinkComponent;

                            expect(linkComponent.title).toEqual('Resize & Move');
                        });

                        it('the expected url', () => {
                            fixture.detectChanges();

                            let linkElement = element.query(By.css('.resize-and-move'));
                            let linkComponent = linkElement.componentInstance as LinkComponent;

                            expect(linkComponent.url).toEqual('/resize-and-move');
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
