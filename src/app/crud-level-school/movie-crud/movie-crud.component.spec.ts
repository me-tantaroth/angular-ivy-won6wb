import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieCrudComponent } from './movie-crud.component';

describe('MovieCrudComponent', () => {
  let component: MovieCrudComponent;
  let fixture: ComponentFixture<MovieCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
