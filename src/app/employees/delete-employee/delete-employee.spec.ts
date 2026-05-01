import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEmployee } from './delete-employee';

describe('DeleteEmployee', () => {
  let component: DeleteEmployee;
  let fixture: ComponentFixture<DeleteEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteEmployee],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteEmployee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
