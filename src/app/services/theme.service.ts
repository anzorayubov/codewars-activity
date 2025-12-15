import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  private readonly THEME_ATTRIBUTE = 'data-theme';

  // BehaviorSubject for reactive theme management
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  public theme$: Observable<Theme> = this.themeSubject.asObservable();

  constructor() {
    // Apply the initial theme on service initialization
    this.applyTheme(this.themeSubject.value);
  }

  /**
   * Gets initial theme from localStorage or defaults to 'light'
   */
  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
  }

  /**
   * Toggles between light and dark themes
   */
  public toggleTheme(): void {
    const newTheme: Theme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Sets a specific theme
   */
  public setTheme(theme: Theme): void {
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  /**
   * Gets the current theme value
   */
  public getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  /**
   * Applies theme by setting data-theme attribute on body element
   */
  private applyTheme(theme: Theme): void {
    document.body.setAttribute(this.THEME_ATTRIBUTE, theme);
  }
}
