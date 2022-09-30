import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { APIResponse, Game } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getGameList(ordering: string, searchTerm?: string): Observable<APIResponse<Game>> {
    let params = new HttpParams().set('ordering', ordering);
    if (searchTerm) {
      params = new HttpParams().set('ordering', ordering).set('search', searchTerm)
    }

    return this.http.get<APIResponse<Game>>(`${env.BASE_URL}/games?${env.API_KEY}`, { params: params });
  }

  getGameDetails(id: string): Observable<Game> {

    const gameTrailersRequest = this.http.get(
      `${env.BASE_URL}/games/${id}/movies?${env.API_KEY}`
    );
    const gameScreenshotsRequest = this.http.get(
      `${env.BASE_URL}/games/${id}/screenshots?${env.API_KEY}`
    );
    const gameInfoRequest = this.http.get(`${env.BASE_URL}/games/${id}?${env.API_KEY}`)

    return forkJoin({
      gameInfoRequest,
      gameScreenshotsRequest,
      gameTrailersRequest
    }).pipe(
      map((resp: any) => {
        return {
          ...resp['gameInfoRequest'],
          screenshots: resp['gameScreenshotsRequest']?.results,
          trailers: resp['gameTrailersRequest']?.results
        }
      }))
  }


}