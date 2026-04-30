import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveManage } from './leave-manage';

describe('LeaveManage', () => {
  let component: LeaveManage;
  let fixture: ComponentFixture<LeaveManage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveManage],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveManage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
