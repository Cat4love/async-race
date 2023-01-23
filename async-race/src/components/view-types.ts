import { Controller } from "./сontroller";

export interface IResult {
  id: string;
  carName: string | null | undefined;
  duration: number;
}

export interface IView {
  controller: Controller;

  saveState: () => void;

  updateState: () => void;

  createCarClick: () => Promise<void>;

  updateCarClick: () => Promise<void>;

  selectCarClick: (event: Event) => void;

  removeCarClick: (event: Event) => Promise<void>;

  startEngineClick: (id: string) => Promise<IResult | null>;

  stopEngineClick: (id: string) => Promise<void>;

  raceClick: () => Promise<void>;

  writeWinner: (winner: IResult) => Promise<void>;

  eraseWinner: (id: string) => Promise<void>;

  resetClick: () => Promise<void>;

  prevClick: () => Promise<void>;

  nextClick: () => Promise<void>;

  driveSwitch: () => Promise<void>;

  createForm(): void;

  generateRandomCarsClick: () => Promise<void>;

  createBoxes(): Promise<void>;

  createPuginationGarage(): Promise<void>;

  updateBoxes(): Promise<void>;

  updatePaginationGarage: () => Promise<void>;

  createGarage: () => Promise<void>;

  createNavigationButton: () => void;

  switchPage: () => void;

  createPuginationWinners(): Promise<void>;

  prevWinClick: () => Promise<void>;

  nextWinClick: () => Promise<void>;

  createWinners: () => Promise<void>;

  updateWinners: () => Promise<void>;

  updatePuginationWinners: () => Promise<void>;

  mount: () => Promise<void>;
}
