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

                        let dropDownElement = element.query(By.css('.box.simple ngx-test-drop-down.simple-drop-down'));

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

                        let dropDownElement = element.query(By.css('.box.close-from-within ngx-test-drop-down.close-from-within-drop-down'));

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

                        let dropDownElement = element.query(By.css('.box.child-windows ngx-test-drop-down.child-windows-drop-down'));

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

            describe('<div> element with', () => {
                it('classes "box outside-scroll"', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.drop-down-page div.box.outside-scroll'));

                    expect(divElement !== null).toBeTruthy();
                });

                it('the expected title', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.box.outside-scroll'));

                    expect(divElement.attributes['title']).toEqual('Outside scroll');
                });

                describe('<div> element with', () => {
                    it('classes "scrollable"', () => {
                        fixture.detectChanges();

                        let divElement = element.query(By.css('.box.outside-scroll div.scrollable'));

                        expect(divElement !== null).toBeTruthy();
                    });

                    describe('<ngx-test-drop-down> component with', () => {
                        it('class "scrolled-drop-down"', () => {
                            fixture.detectChanges();

                            let dropDownElement = element.query(By.css('.outside-scroll .scrollable ngx-test-drop-down.scrolled-drop-down'));

                            expect(dropDownElement !== null).toBeTruthy();
                        });

                        it('the expected title', () => {
                            fixture.detectChanges();

                            let dropDownElement = element.query(By.css('.scrolled-drop-down'));
                            let dropDownComponent = dropDownElement.componentInstance as DropDownComponent;

                            expect(dropDownComponent.title).toEqual('Scrolled');
                        });

                        describe('<div> element with', () => {
                            it('class "scrolled-content"', () => {
                                fixture.detectChanges();

                                let divElement = element.query(By.css('.scrolled-drop-down div.scrolled-content'));

                                expect(divElement !== null).toBeTruthy();
                            });

                            it('the expected text', () => {
                                fixture.detectChanges();

                                let divElement = element.query(By.css('.scrolled-content'));

                                expect(divElement.nativeElement.textContent).toMatch('This drop down is in a scrollable area. It will follow the reference element when scrolled.');
                            });
                        });
                    });
                });
            });

            describe('<div> element with', () => {
                it('classes "box multi-scroll"', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.drop-down-page div.box.multi-scroll'));

                    expect(divElement !== null).toBeTruthy();
                });

                it('the expected title', () => {
                    fixture.detectChanges();

                    let divElement = element.query(By.css('.box.multi-scroll'));

                    expect(divElement.attributes['title']).toEqual('Multi scroll');
                });

                describe('<div> element with', () => {
                    it('classes "scrollable"', () => {
                        fixture.detectChanges();

                        let divElement = element.query(By.css('.box.multi-scroll div.scrollable'));

                        expect(divElement !== null).toBeTruthy();
                    });

                    describe('<ngx-test-drop-down> component with', () => {
                        it('class "scroll-drop-down-level1"', () => {
                            fixture.detectChanges();

                            let dropDownElement = element.query(By.css('.multi-scroll .scrollable ngx-test-drop-down.scroll-drop-down-level1'));

                            expect(dropDownElement !== null).toBeTruthy();
                        });

                        it('the expected title', () => {
                            fixture.detectChanges();

                            let dropDownElement = element.query(By.css('.scroll-drop-down-level1'));
                            let dropDownComponent = dropDownElement.componentInstance as DropDownComponent;

                            expect(dropDownComponent.title).toEqual('Scroll level 1');
                        });

                        describe('<div> element with', () => {
                            it('classes "scrollable"', () => {
                                fixture.detectChanges();

                                let divElement = element.query(By.css('.scroll-drop-down-level1 div.scrollable'));

                                expect(divElement !== null).toBeTruthy();
                            });

                            describe('<ngx-test-drop-down> component with', () => {
                                it('class "scroll-drop-down-level2"', () => {
                                    fixture.detectChanges();

                                    let dropDownElement = element.query(By.css('.scroll-drop-down-level1 .scrollable ngx-test-drop-down.scroll-drop-down-level2'));

                                    expect(dropDownElement !== null).toBeTruthy();
                                });

                                it('the expected title', () => {
                                    fixture.detectChanges();

                                    let dropDownElement = element.query(By.css('.scroll-drop-down-level2'));
                                    let dropDownComponent = dropDownElement.componentInstance as DropDownComponent;

                                    expect(dropDownComponent.title).toEqual('Scroll level 2');
                                });

                                describe('<div> element with', () => {
                                    it('classes "scrollable"', () => {
                                        fixture.detectChanges();

                                        let divElement = element.query(By.css('.scroll-drop-down-level2 div.scrollable'));

                                        expect(divElement !== null).toBeTruthy();
                                    });

                                    describe('<ngx-test-drop-down> component with', () => {
                                        it('class "scroll-drop-down-level3"', () => {
                                            fixture.detectChanges();

                                            let dropDownElement = element.query(By.css('.scroll-drop-down-level2 .scrollable ngx-test-drop-down.scroll-drop-down-level3'));

                                            expect(dropDownElement !== null).toBeTruthy();
                                        });

                                        it('the expected title', () => {
                                            fixture.detectChanges();

                                            let dropDownElement = element.query(By.css('.scroll-drop-down-level3'));
                                            let dropDownComponent = dropDownElement.componentInstance as DropDownComponent;

                                            expect(dropDownComponent.title).toEqual('Scroll level 3');
                                        });

                                        describe('<div> element with', () => {
                                            it('classes "scrollable"', () => {
                                                fixture.detectChanges();

                                                let divElement = element.query(By.css('.scroll-drop-down-level3 div.scrollable'));

                                                expect(divElement !== null).toBeTruthy();
                                            });

                                            it('the expected text', () => {
                                                fixture.detectChanges();

                                                let divElement = element.query(By.css('.scroll-drop-down-level3 .scrollable'));

                                                expect(divElement.nativeElement.textContent).toMatch('This is the inner most scrollable window.');
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

