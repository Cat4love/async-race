import { Model } from "./model";

export class Controller {
  model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  public async handleGetCars() {
    return this.model.getCars();
  }

  public async handleGetCarsOnPage(page: number) {
    return this.model.getCarsOnPage(page);
  }

  public async handleCreateCar(name: string, color: string) {
    return this.model.createCar(name, color);
  }

  public async handleUpdateCar(name: string, color: string, id: string) {
    return this.model.updateCar(name, color, id);
  }

  public async handleRemoveCar(id: string) {
    return this.model.removeCar(id);
  }

  public async handleSwitchEngine(id: string, state: string) {
    return this.model.switchEngine(id, state);
  }

  public async handleDriveEngine(id: string) {
    return this.model.driveEngine(id);
  }

  public async handleGetWinners() {
    return this.model.getWinners();
  }

  public async handleGetWinnersOnPage(
    page: number,
    sort?: string,
    order?: string
  ) {
    return this.model.getWinnerssOnPage(page, sort, order);
  }

  public async handleGetWinner(id: string) {
    return this.model.getWinner(id);
  }

  public async handleCreateWinner(id: string, wins: number, time: number) {
    return this.model.createWinner(id, wins, time);
  }

  public async handleUpdateWinner(id: string, wins: number, time: number) {
    return this.model.updateWinner(id, wins, time);
  }

  public async handleEraseWinner(id: string) {
    return this.model.eraseWinner(id);
  }

  public async handleGenerateRandomCars() {
    return this.model.generateRandomCars();
  }

  public handleGetRandomCarName() {
    return this.model.getRandomCarName();
  }

  public handleGetRandomColor() {
    return this.model.getRandomColor();
  }
}
