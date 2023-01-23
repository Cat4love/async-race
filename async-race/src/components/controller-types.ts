import { Model } from "./model";

import { ICar, IEngine, IDriveEngine, IWinner } from "./model-types";

export interface IController {
  model: Model;

  handleGetCars(): Promise<ICar[] | null>;

  handleGetCarsOnPage(page: number): Promise<ICar[] | null>;

  handleCreateCar(name: string, color: string): Promise<ICar[] | null>;

  handleUpdateCar(
    name: string,
    color: string,
    id: string
  ): Promise<ICar[] | null>;

  handleRemoveCar(id: string): Promise<ICar[] | null>;

  handleSwitchEngine(id: string, state: string): Promise<IEngine | null>;

  handleDriveEngine(id: string): Promise<IDriveEngine | null>;

  handleGetWinners(): Promise<IWinner[] | null>;

  handleGetWinnersOnPage(
    page: number,
    sort?: string,
    order?: string
  ): Promise<IWinner[] | null>;

  handleGetWinner(id: string): Promise<IWinner | null>;

  handleUpdateWinner(
    id: string,
    wins: number,
    time: number
  ): Promise<IWinner[] | null>;

  handleEraseWinner(id: string): Promise<void>;

  handleGenerateRandomCars(): Promise<string>;

  handleGetRandomCarName(): string;

  handleGetRandomColor(): string;
}
