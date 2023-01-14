import { CarsModel } from "./CarsModel";

export class CarsController {
  model: CarsModel;

  constructor(model: CarsModel) {
    this.model = model;
  }

  public async handleGetCars() {
    return this.model.getCars();
  }
}
