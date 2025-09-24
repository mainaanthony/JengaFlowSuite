import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnDestroy {
  @Input() placeholder = 'Search';
  @Output() search = new EventEmitter<string>();

  // Reactive form control for the search input
  searchControl = new FormControl('');

  private sub = this.searchControl.valueChanges.pipe(
    debounceTime(300)
  ).subscribe(value => {
    // emit debounced search values so parent components can react
    this.search.emit(value ?? '');
    console.log('Search (debounced)', value);
  });

  onSearch(value?: string) {
    const q = value ?? this.searchControl.value ?? '';
    this.search.emit(q);
    console.log('Search (submit)', q);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
