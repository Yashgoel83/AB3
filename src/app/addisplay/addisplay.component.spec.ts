import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddisplayComponent } from './addisplay.component';

describe('AddisplayComponent', () => {
  let component: AddisplayComponent;
  let fixture: ComponentFixture<AddisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
