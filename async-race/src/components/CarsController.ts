import { CarsModel } from "./CarsModel";

export class CarsController {
  model: CarsModel;

  constructor(model: CarsModel) {
    this.model = model;
  }

  public async handleGetCars() {
    return this.model.getCars();
  }

  public async handleGetCarsOnPage(page: number) {
    return this.model.getCarsOnPage(page);
  }

  public async handleCreateCar(name: string, color: string) {
    // if (!name || !color) {
    //   throw Error("Укажите name и color");
    // }

    // const cars = await this.model.getCars();
    // for (let i = 0; i < cars.length; i += 1) {
    //   const car = cars[i];
    //   if (car.name === name && car.color === color) {
    //     throw Error("Такая машина уже есть");
    //   }
    // }

    return this.model.createCar(name, color);
  }

  public async handleUpdateCar(name: string, color: string, id: string) {
    if (!name || !color) {
      throw Error("Укажите name и color");
    }

    const cars = await this.model.getCars();
    const carsId = cars.map((x) => String(x.id));
    if (!carsId.includes(String(id))) {
      throw Error("Такой машины нет");
    }
    return this.model.updateCar(name, color, id);
  }

  public async handleRemoveCar(id: string) {
    const cars = await this.model.getCars();
    const carsId = cars.map((x) => String(x.id));
    if (!carsId.includes(String(id))) {
      throw Error("Такой машины нет");
    }
    return this.model.removeCar(id);
  }

  public async handleSwitchEngine(id: string, state: string) {
    const cars = await this.model.getCars();
    const carsId = cars.map((x) => String(x.id));
    if (!carsId.includes(String(id))) {
      throw Error("Такой машины нет");
    }
    return this.model.switchEngine(id, state);
  }

  public async handleDriveEngine(id: string) {
    const cars = await this.model.getCars();
    const carsId = cars.map((x) => String(x.id));
    if (!carsId.includes(String(id))) {
      throw Error("Такой машины нет");
    }
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
}
