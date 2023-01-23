export interface ICar {
  name: string;
  color: string;
  id: string;
}
export interface IWinner {
  id: number;
  wins: number;
  time: number;
}

export interface IEngine {
  velocity: string;
  distance: string;
}

export interface IDriveEngine {
  success: boolean;
}

export interface IModel {
  getRandomCarName(): string;

  getRandomColor(): string;

  generateRandomCars(): Promise<string>;

  getCars(): Promise<ICar[] | null>;

  getCarsOnPage(page: number): Promise<ICar[] | null>;

  createCar(name: string, color: string): Promise<ICar[] | null>;

  updateCar(name: string, color: string, id: string): Promise<ICar[] | null>;

  removeCar(id: string): Promise<ICar[] | null>;

  switchEngine(id: string, state: string): Promise<IEngine | null>;

  driveEngine(id: string): Promise<IDriveEngine | null>;

  getWinners(): Promise<IWinner[] | null>;

  getWinnerssOnPage(
    page: number,
    sort?: string,
    order?: string
  ): Promise<IWinner[] | null>;

  getWinner(id: string): Promise<IWinner | null>;

  createWinner(
    id: string,
    wins: number,
    time: number
  ): Promise<IWinner[] | null>;

  updateWinner(
    id: string,
    wins: number,
    time: number
  ): Promise<IWinner[] | null>;

  eraseWinner(id: string): Promise<void>;
}
