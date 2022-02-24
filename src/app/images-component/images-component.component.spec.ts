import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesComponentComponent } from './images-component.component';

describe('ImagesComponentComponent', () => {
  let component: ImagesComponentComponent;
  let fixture: ComponentFixture<ImagesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagesComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
