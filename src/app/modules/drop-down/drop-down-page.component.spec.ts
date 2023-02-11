import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent, MockDirective, ngMocks } from 'ng-mocks';
import { WindowCloserDirective } from '../../../../projects/ngx-window/src/lib/window-closer.directive';
import { WindowComponent } from '../../../../projects/ngx-window/src/public-api';
import { DropDownPageComponent } from './drop-down-page.component';
import { DropDownComponent } from './drop-down.component';

describe('DropDownPageComponent', () => {

    let fixture: ComponentFixture<DropDownPageComponent>;
    let component: DropDownPageComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                DropDownPageComponent,
                MockComponent(DropDownComponent),
                MockComponent(WindowComponent),
                MockDirective(WindowCloserDirective)
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DropDownPageComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    describe('has', () => {
        describe('<div> element with', () => {
            it('class "drop-down-page"', () => {
                fixture.detectChanges();

                let divElement = element.query(By.css('div.drop-down-page'));

                expect(divElement !== null).toBeTruthy();
            });

            describe('<div> element with', () => {
                it('classes "box simple"', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.drop-down-page div.box.simple'));

                    expect(divElement !== null).toBeTruthy();
                });

                it('the expected title', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.box.simple'));

                    expect(divElement.attributes['title']).toEqual('Simple');
                });

                describe('<ngx-test-drop-down> component with', () => {
                    it('class "simple-drop-down"', () => {
                        fixture.detectChanges();

                        let dropDownElement = element.query(By.css('ngx-test-drop-down.simple-drop-down'));

                        expect(dropDownElement !== null).toBeTruthy();
                    });

                    it('the expected title', () => {
                        fixture.detectChanges();

                        let dropDownElement = element.query(By.css('.simple-drop-down'));
                        let dropDownComponent = dropDownElement.componentInstance as DropDownComponent;

                        expect(dropDownComponent.title).toEqual('Simple');
                    });

                    describe('<div> element with', () => {
                        it('class "simple-content"', () => {
                            fixture.detectChanges();

                            let divElement = element.query(By.css('.simple-drop-down div.simple-content'));

                            expect(divElement !== null).toBeTruthy();
                        });

                        it('the expected text', () => {
                            fixture.detectChanges();

                            let divElement = element.query(By.css('.simple-content'));

                            expect(divElement.nativeElement.textContent).toEqual('This is a simple drop down with no content. Click outside to close.');
                        });
                    });
                });
            });

            describe('<div> element with', () => {
                it('classes "box close-from-within"', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.drop-down-page div.box.close-from-within'));

                    expect(divElement !== null).toBeTruthy();
                });

                it('the expected title', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.box.close-from-within'));

                    expect(divElement.attributes['title']).toEqual('Close from within');
                });

                describe('<ngx-test-drop-down> component with', () => {
                    it('class "close-from-within-drop-down"', () => {
                        fixture.detectChanges();

                        let dropDownElement = element.query(By.css('ngx-test-drop-down.close-from-within-drop-down'));

                        expect(dropDownElement !== null).toBeTruthy();
                    });

                    it('the expected title', () => {
                        fixture.detectChanges();

                        let dropDownElement = element.query(By.css('.close-from-within-drop-down'));
                        let dropDownComponent = dropDownElement.componentInstance as DropDownComponent;

                        expect(dropDownComponent.title).toEqual('Close from within');
                    });

                    describe('<div> element with', () => {
                        it('class "close-from-within-content"', () => {
                            fixture.detectChanges();

                            let divElement = element.query(By.css('.close-from-within-drop-down div.close-from-within-content'));

                            expect(divElement !== null).toBeTruthy();
                        });

                        it('the expected text', () => {
                            fixture.detectChanges();

                            let divElement = element.query(By.css('.close-from-within-content'));

                            expect(divElement.nativeElement.textContent).toMatch('Click the button below to close the dropdown.');
                        });

                        describe('<button> element with', () => {
                            it('class "close-button"', () => {
                                fixture.detectChanges();

                                let buttonElement = element.query(By.css('.close-from-within-content button.close-button'));

                                expect(buttonElement !== null).toBeTruthy();
                            });

                            it('the expected text', () => {
                                fixture.detectChanges();

                                let buttonElement = element.query(By.css('.close-from-within-content button.close-button'));

                                expect(buttonElement.nativeElement.textContent).toEqual('Close drop down');
                            });

                            it('click handler that toggles the closes the window', () => {
                                fixture.detectChanges();
                                let buttonElement = element.query(By.css('.close-from-within-content .close-button'));

                                let windowCloserDirective = ngMocks.get(buttonElement, WindowCloserDirective);
                                jest.spyOn(windowCloserDirective, 'close');

                                buttonElement.triggerEventHandler('click', {});

                                expect(windowCloserDirective.close).toHaveBeenCalled();
                            });
                        });
                    });
                });
            });

            describe('<div> element with', () => {
                it('classes "box child-windows"', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.drop-down-page div.box.child-windows'));

                    expect(divElement !== null).toBeTruthy();
                });

                it('the expected title', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.box.child-windows'));

                    expect(divElement.attributes['title']).toEqual('Child windows');
                });

                describe('<ngx-test-drop-down> component with', () => {
                    it('class "child-windows-drop-down"', () => {
                        fixture.detectChanges();

                        let dropDownElement = element.query(By.css('ngx-test-drop-down.child-windows-drop-down'));

                        expect(dropDownElement !== null).toBeTruthy();
                    });

                    it('the expected title', () => {
                        fixture.detectChanges();

                        let dropDownElement = element.query(By.css('.child-windows-drop-down'));
                        let dropDownComponent = dropDownElement.componentInstance as DropDownComponent;

                        expect(dropDownComponent.title).toEqual('Child windows');
                    });

                    describe('<div> element with', () => {
                        it('class "child-windows-content"', () => {
                            fixture.detectChanges();

                            let divElement = element.query(By.css('.child-windows-drop-down div.child-windows-content'));

                            expect(divElement !== null).toBeTruthy();
                        });

                        it('the expected text', () => {
                            fixture.detectChanges();

                            let divElement = element.query(By.css('.child-windows-content'));

                            expect(divElement.nativeElement.textContent).toMatch('Click the buttons below to open child windows.');
                        });

                        describe('<ngx-test-drop-down> component with', () => {
                            it('class "child-window-1-drop-down"', () => {
                                fixture.detectChanges();

                                let dropDownElement = element.query(By.css('.child-windows-content ngx-test-drop-down.child-window-1-drop-down'));

                                expect(dropDownElement !== null).toBeTruthy();
                            });

                            it('the expected title', () => {
                                fixture.detectChanges();

                                let dropDownElement = element.query(By.css('.child-window-1-drop-down'));
                                let dropDownComponent = dropDownElement.componentInstance as DropDownComponent;

                                expect(dropDownComponent.title).toEqual('Child #1');
                            });

                            describe('<div> element with', () => {
                                it('class "child-window-1-content"', () => {
                                    fixture.detectChanges();

                                    let divElement = element.query(By.css('.child-window-1-drop-down div.child-window-1-content'));

                                    expect(divElement !== null).toBeTruthy();
                                });

                                it('the expected text', () => {
                                    fixture.detectChanges();

                                    let divElement = element.query(By.css('.child-window-1-content'));

                                    expect(divElement.nativeElement.textContent).toMatch('Click the button below to open grandchild window.');
                                });

                                describe('<ngx-test-drop-down> component with', () => {
                                    it('class "grandchild-window-drop-down"', () => {
                                        fixture.detectChanges();

                                        let dropDownElement = element.query(By.css('.child-window-1-content ngx-test-drop-down.grandchild-window-drop-down'));

                                        expect(dropDownElement !== null).toBeTruthy();
                                    });

                                    it('the expected title', () => {
                                        fixture.detectChanges();

                                        let dropDownElement = element.query(By.css('.grandchild-window-drop-down'));
                                        let dropDownComponent = dropDownElement.componentInstance as DropDownComponent;

                                        expect(dropDownComponent.title).toEqual('Grandchild');
                                    });

                                    describe('<div> element with', () => {
                                        it('class "grandchild-window-content"', () => {
                                            fixture.detectChanges();

                                            let divElement = element.query(By.css('.grandchild-window-drop-down div.grandchild-window-content'));

                                            expect(divElement !== null).toBeTruthy();
                                        });

                                        it('the expected text', () => {
                                            fixture.detectChanges();

                                            let divElement = element.query(By.css('.grandchild-window-content'));

                                            expect(divElement.nativeElement.textContent).toMatch('This is a simple drop down with no content. Click outside to close.');
                                        });
                                    });
                                });
                            });
                        });

                        describe('<ngx-test-drop-down> component with', () => {
                            it('class "child-window-2-drop-down"', () => {
                                fixture.detectChanges();

                                let dropDownElement = element.query(By.css('.child-windows-content ngx-test-drop-down.child-window-2-drop-down'));

                                expect(dropDownElement !== null).toBeTruthy();
                            });

                            it('the expected title', () => {
                                fixture.detectChanges();

                                let dropDownElement = element.query(By.css('.child-window-2-drop-down'));
                                let dropDownComponent = dropDownElement.componentInstance as DropDownComponent;

                                expect(dropDownComponent.title).toEqual('Child #2');
                            });

                            describe('<div> element with', () => {
                                it('class "child-window-2-content"', () => {
                                    fixture.detectChanges();

                                    let divElement = element.query(By.css('.child-window-2-drop-down div.child-window-2-content'));

                                    expect(divElement !== null).toBeTruthy();
                                });

                                it('the expected text', () => {
                                    fixture.detectChanges();

                                    let divElement = element.query(By.css('.child-window-2-content'));

                                    expect(divElement.nativeElement.textContent).toMatch('This is a simple drop down with no content. Click outside to close.');
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

