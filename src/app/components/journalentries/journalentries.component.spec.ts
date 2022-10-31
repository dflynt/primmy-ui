import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalentriesComponent } from './journalentries.component';

describe('JournalentriesComponent', () => {
  let component: JournalentriesComponent;
  let fixture: ComponentFixture<JournalentriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalentriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalentriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
