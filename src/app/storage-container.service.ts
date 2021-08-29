import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { StorageContainer } from "./storage-container";

@Injectable()
export class StorageContainerService {

  list(): Observable<StorageContainer[]>{
    return of([]);
  }

  get(id: number | string): Observable<StorageContainer> {
    return of({
      id: '1',
      name: 'container',
      allowsSamples: false
    });
  }
}