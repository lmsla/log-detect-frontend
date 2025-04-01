import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetDialogTemplateComponent } from './target-dialog-template.component';

describe('TargetDialogTemplateComponent', () => {
  let component: TargetDialogTemplateComponent;
  let fixture: ComponentFixture<TargetDialogTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetDialogTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetDialogTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
