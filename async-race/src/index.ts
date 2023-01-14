import { CarsView } from "./components/CarsView";
import { CarsController } from "./components/CarsController";
import { CarsModel } from "./components/CarsModel";

const usersModel = new CarsModel();
const usersController = new CarsController(usersModel);
const usersView = new CarsView(
  document.querySelector("body") as HTMLElement,
  usersController
);

console.log(usersView);
