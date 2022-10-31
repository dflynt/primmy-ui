import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalHeaderComponent } from './journal-header.component';

describe('JournalHeaderComponent', () => {
  let component: JournalHeaderComponent;
  let fixture: ComponentFixture<JournalHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
