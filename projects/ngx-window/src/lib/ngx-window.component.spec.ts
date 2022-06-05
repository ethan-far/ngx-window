import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxWindowComponent } from './ngx-window.component';

describe('NgxWindowComponent', () => {
  let component: NgxWindowComponent;
  let fixture: ComponentFixture<NgxWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
