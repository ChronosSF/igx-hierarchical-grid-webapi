import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, merge, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Transaction } from 'igniteui-angular';

@Injectable()
export class RemoteService {

    remoteData: Observable<any[]>;
    _remoteData: BehaviorSubject<any[]>;
    url = `api/`;
    urlBuilder;

    constructor(private http: HttpClient) {
        this._remoteData = new BehaviorSubject([]);
        this.remoteData = this._remoteData.asObservable();
    }

    getData(state?: any, cb?: (any) => void) {
        return this.http.get(this.buildUrl(state)).pipe(
            map(response => response),
        )
        .subscribe(d => {
            this._remoteData.next(d['value']);
            if (cb) {
                cb(d);
            }
        });
    }

    create(state: any, transaction: Transaction): Observable<Object> {
        return this.http.post(this.buildUrl(state), transaction.newValue).pipe(
            map(response => response)
        );
    }

    update(state: any, transactions: Transaction[]): Observable<Object> {
        const payload = [];
        transactions.forEach(t => payload.push(t.newValue));
        return this.http.put(this.buildUrl(state, transactions), payload).pipe(
            map(response => response)
        )
    }

    remove(state: any, transactions: Transaction[]): Observable<Object> {
        return this.http.delete(this.buildUrl(state, transactions)).pipe(
            map(response => response)
        )
    }

    buildUrl(dataState: any, transactions?: Transaction[]) {
        return this.urlBuilder(dataState, transactions);
    }
}
