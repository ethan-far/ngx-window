import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LinkComponent } from './link.component';

describe('LinkComponent', () => {

    let fixture: ComponentFixture<LinkComponent>;
    let component: LinkComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                LinkComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LinkComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    describe('has', () => {
        describe('<li> element with', () => {
            it('class "link"', () => {
                fixture.detectChanges();

                let itemElement = element.query(By.css('li.link'));

                expect(itemElement !== null).toBeTruthy();
            });

            it('the provided text', () => {
                component.title = 'Test title';
                fixture.detectChanges();

                let itemElement = element.query(By.css('.link'));

                expect(itemElement.nativeElement.textContent).toEqual('Test title');
            });

            it('the provided url as the "routerLink"', () => {
                component.url = '/test/url';
                fixture.detectChanges();

                let itemElement = element.query(By.css('.link'));
                let routerLinkDirective = itemElement.injector.get(RouterLink);

                expect(routerLinkDirective.urlTree?.toString()).toEqual('/test/url');
            });

            it('the class "active-link" when the link is activated', () => {
                component.url = '/test/url';
                fixture.detectChanges();

                let itemElement = element.query(By.css('.link'));

                expect(itemElement.attributes['routerLinkActive']).toEqual('active-link');
            });
        });
    });
});