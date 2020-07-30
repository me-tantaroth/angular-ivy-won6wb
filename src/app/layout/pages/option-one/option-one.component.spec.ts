import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionOneComponent } from './option-one.component';

describe('OptionOneComponent', () => {
  let component: OptionOneComponent;
  let fixture: ComponentFixture<OptionOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
