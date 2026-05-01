import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployee } from './view-employee';

describe('ViewEmployee', () => {
  let component: ViewEmployee;
  let fixture: ComponentFixture<ViewEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEmployee],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEmployee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
