import { Component, OnInit, OnDestroy } from '@angular/core';
import { fromEvent, Subject, BehaviorSubject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { MENU_DATA } from '../../constants/menu';

@Component({
  selector: 'app-layout-option-one',
  templateUrl: './option-one.component.html',
  styleUrls: ['./option-one.component.scss'],
})
export class OptionOneComponent implements OnInit, OnDestroy {
  private unsubscriber$: Subject<any> = new Subject();
  public screenWidth$: BehaviorSubject<number> = new BehaviorSubject(null);
  public mediaBreakpoint$: BehaviorSubject<string> = new BehaviorSubject(null);
  menu: {
    path: string[];
    text: string;
  }[] = MENU_DATA;
  sideNavMode: 'side' | 'push' = 'side';

  ngOnInit(): void {
    this._setScreenWidth(window.innerWidth);
    this._setMediaBreakpoint(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber$))
      .subscribe((evt: any) => {
        this._setScreenWidth(evt.target.innerWidth);
        this._setMediaBreakpoint(evt.target.innerWidth);

        this.changeSidenavMode();
      });

    this.changeSidenavMode();
  }

  changeSidenavMode() {
    console.log(this.mediaBreakpoint$.value);
    if (
      this.mediaBreakpoint$.value === 'sm' ||
      this.mediaBreakpoint$.value === 'xs' ||
      this.mediaBreakpoint$.value === 'md'
    ) {
      this.sideNavMode = 'push';
    } else {
      this.sideNavMode = 'side';
    }
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  private _setScreenWidth(width: number): void {
    this.screenWidth$.next(width);
  }

  private _setMediaBreakpoint(width: number): void {
    if (width < 576) {
      this.mediaBreakpoint$.next('xs');
    } else if (width >= 576 && width < 768) {
      this.mediaBreakpoint$.next('sm');
    } else if (width >= 768 && width < 992) {
      this.mediaBreakpoint$.next('md');
    } else if (width >= 992 && width < 1200) {
      this.mediaBreakpoint$.next('lg');
    } else if (width >= 1200 && width < 1600) {
      this.mediaBreakpoint$.next('xl');
    } else {
      this.mediaBreakpoint$.next('xxl');
    }
  }
}
