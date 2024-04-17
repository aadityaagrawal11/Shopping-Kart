import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private selectedCategorySubject: BehaviorSubject<string> = new BehaviorSubject<string>('default');
  selectedCategory$: Observable<string> = this.selectedCategorySubject.asObservable();

  constructor() { }

  setSelectedCategory(category: string): void {
    this.selectedCategorySubject.next(category);
  }
}
