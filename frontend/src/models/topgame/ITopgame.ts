import { RankingInterface } from "./IRanking";
import { GamesInterface } from "../game/IGame";
import { AdminsInterface } from "../admin/IAdmin";

export interface TopgameInterface {
    ID:             number,
	Comment:        string,
	Date:           Date,
	Ranking_ID:     number,
	Ranking:        RankingInterface,
	Admin_ID:       number,
	Admin:          AdminsInterface,
	Game_ID:        number,
	Game:           GamesInterface,
}