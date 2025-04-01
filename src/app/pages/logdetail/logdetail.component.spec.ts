import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogdetailComponent } from './logdetail.component';

describe('LogdetailComponent', () => {
  let component: LogdetailComponent;
  let fixture: ComponentFixture<LogdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
