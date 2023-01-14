import { CarsView } from "./components/CarsView";
import { CarsController } from "./components/CarsController";
import { CarsModel } from "./components/CarsModel";

const carsModel = new CarsModel();
const carsController = new CarsController(carsModel);
const carsView = new CarsView(
  document.querySelector("body") as HTMLElement,
  carsController
);

carsView.mount();
