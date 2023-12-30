import { Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _role: ReplaySubject<{ id: number, name: string }> = new ReplaySubject<{ id: number, name: string }>(1);

    set user(value: User) {
        this._user.next(value);
    }

    set role(value: { id: number, name: string }) {
        this._role.next(value)
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    get role$(): Observable<{ id: number, name: string }> {
        return this._role.asObservable();
    }
}
