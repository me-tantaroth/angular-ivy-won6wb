import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionTwoComponent } from './option-two.component';

describe('OptionTwoComponent', () => {
  let component: OptionTwoComponent;
  let fixture: ComponentFixture<OptionTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
