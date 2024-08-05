import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private selectedCategorySubject: BehaviorSubject<string> = new BehaviorSubject<string>('all products');
  selectedCategory$: Observable<string> = this.selectedCategorySubject.asObservable();

  private badgeTotalSubject: BehaviorSubject<string> = new BehaviorSubject<string>('0');
  badgeTotal$: Observable<string> = this.badgeTotalSubject.asObservable();

  constructor() { }

  setSelectedCategory(category: string): void {
    this.selectedCategorySubject.next(category);
  }

  setBadgeTotal(count: string): void {
    this.badgeTotalSubject.next(count);
  }
}
