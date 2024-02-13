import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClothingFormComponent } from './clothingForm.component';

describe('ClothingFormComponent', () => {
  let component: ClothingFormComponent;
  let fixture: ComponentFixture<ClothingFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClothingFormComponent]
    });
    fixture = TestBed.createComponent(ClothingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
