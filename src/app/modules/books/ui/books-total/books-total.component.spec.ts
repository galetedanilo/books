import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksTotalComponent } from './books-total.component';

describe('BooksTotalComponent', () => {
  let component: BooksTotalComponent;
  let fixture: ComponentFixture<BooksTotalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BooksTotalComponent]
    });
    fixture = TestBed.createComponent(BooksTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
