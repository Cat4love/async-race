import { Model } from "./model";
import { IController } from "./controller-types";

export class Controller implements IController {
  model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  async handleGetCars() {
    return this.model.getCars();
  }

  async handleGetCarsOnPage(page: number) {
    return this.model.getCarsOnPage(page);
  }

  async handleCreateCar(name: string, color: string) {
    return this.model.createCar(name, color);
  }

  async handleUpdateCar(name: string, color: string, id: string) {
    return this.model.updateCar(name, color, id);
  }

  async handleRemoveCar(id: string) {
    return this.model.removeCar(id);
  }

  async handleSwitchEngine(id: string, state: string) {
    return this.model.switchEngine(id, state);
  }

  async handleDriveEngine(id: string) {
    return this.model.driveEngine(id);
  }

  async handleGetWinners() {
    return this.model.getWinners();
  }

  async handleGetWinnersOnPage(page: number, sort?: string, order?: string) {
    return this.model.getWinnerssOnPage(page, sort, order);
  }

  async handleGetWinner(id: string) {
    return this.model.getWinner(id);
  }

  async handleCreateWinner(id: string, wins: number, time: number) {
    return this.model.createWinner(id, wins, time);
  }

  async handleUpdateWinner(id: string, wins: number, time: number) {
    return this.model.updateWinner(id, wins, time);
  }

  async handleEraseWinner(id: string) {
    return this.model.eraseWinner(id);
  }

  async handleGenerateRandomCars() {
    return this.model.generateRandomCars();
  }

  handleGetRandomCarName() {
    return this.model.getRandomCarName();
  }

  handleGetRandomColor() {
    return this.model.getRandomColor();
  }
}
