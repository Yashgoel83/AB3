import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosComponentComponent } from './videos-component.component';

describe('VideosComponentComponent', () => {
  let component: VideosComponentComponent;
  let fixture: ComponentFixture<VideosComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideosComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideosComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
