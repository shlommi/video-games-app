import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Game } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public sort: string = '';
  public games: Array<Game> = [];
  private routeSubscription: Subscription = new Subscription();
  private gamesSubscription: Subscription = new Subscription();
  constructor(private httpService: HttpService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGames('metacrit', params['game-search'])
      } else {
        this.searchGames('metacrit');
      }
    })
  }
  searchGames(sort: string, search?: string): void {
    this.gamesSubscription = this.httpService.getGameList(sort, search).subscribe((gameList: APIResponse<Game>) => {
      this.games = gameList.results

    })
  }

  openGameDetails(gameId: number): void {
    this.router.navigate(['details', gameId])
  }


  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
    if (this.gamesSubscription) {
      this.gamesSubscription.unsubscribe()
    }
  }

}
