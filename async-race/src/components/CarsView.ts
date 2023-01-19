import { CarsController } from "./CarsController";
import "../index.scss";

export class CarsView {
  controller: CarsController;

  root: HTMLElement;

  private main!: HTMLElement;

  private form!: HTMLFormElement;

  private inputName!: HTMLInputElement;

  private inputColor!: HTMLInputElement;

  private createCar!: HTMLButtonElement;

  private updateName!: HTMLInputElement;

  private updateColor!: HTMLInputElement;

  private updateCar!: HTMLButtonElement;

  private garage!: HTMLDivElement;

  private boxes!: HTMLDivElement;

  private selectCar!: HTMLButtonElement;

  private selectCardId!: string | null;

  private removeCar!: HTMLButtonElement;

  private startEngine!: HTMLButtonElement;

  private stopEngine!: HTMLButtonElement;

  private race!: HTMLButtonElement;

  private raceMode!: boolean;

  private reset!: HTMLButtonElement;

  private winner!: HTMLParagraphElement;

  private generateCars!: HTMLButtonElement;

  private car!: HTMLElement;

  private pagination!: HTMLDivElement;

  private prev!: HTMLButtonElement;

  private next!: HTMLButtonElement;

  private pageCount = 1;

  constructor(root: HTMLElement, controller: CarsController) {
    this.root = root;
    this.controller = controller;
  }

  private createCarClick = async () => {
    if (this.raceMode === false) {
      if (
        this.inputName instanceof HTMLInputElement &&
        this.inputColor instanceof HTMLInputElement
      ) {
        const create = await this.controller.handleCreateCar(
          (this.inputName.value = "Auto"),
          this.inputColor.value
        );
        await this.updateGarage();
        await this.updatePuginationButtons();
        this.inputName.value = "";
        console.log("create:", create);
      }
    }
  };

  private updateCarClick = async () => {
    if (this.raceMode === false) {
      if (
        this.updateName instanceof HTMLInputElement &&
        this.updateColor instanceof HTMLInputElement &&
        this.selectCardId !== null
      ) {
        const update = await this.controller.handleUpdateCar(
          this.updateName.value,
          this.updateColor.value,
          this.selectCardId
        );
        await this.updateGarage();
        this.updateCar.style.background = "none";
        this.updateName.value = "";
        this.updateColor.value = "#0000000";
        this.selectCardId = null;
        console.log("update:", update);
      }
    }
  };

  private selectCarClick = (event: Event) => {
    if (this.raceMode === false) {
      const target = event.target as HTMLButtonElement;
      this.selectCardId = target.getAttribute("data-id");
      const color = target.getAttribute("data-color");
      const name = target.getAttribute("data-name");
      if (color !== null && name !== null) {
        this.updateName.value = name;
        this.updateColor.value = color;
      }
      this.updateCar.style.background = "aquamarine";
    }
  };

  private removeCarClick = async (event: Event) => {
    if (this.raceMode === false) {
      const target = event.target as HTMLButtonElement;
      const id = target.getAttribute("data-id");
      if (id === this.selectCardId) {
        this.updateCar.style.background = "none";
        this.updateName.value = "";
        this.updateColor.value = "#000000";
      }
      if (id !== null) {
        await this.controller.handleRemoveCar(id);
      }
      await this.updateGarage();
      await this.updatePuginationButtons();
    }
  };

  private startEngineClick = async (id: string) => {
    let target = null;
    let sibling = null;
    let result = null;

    if (id !== null) {
      const startButtons = document.querySelectorAll(".box__start");
      for (let i = 0; i < startButtons.length; i += 1) {
        if (startButtons[i].attributes[1].value === String(id)) {
          target = startButtons[i] as HTMLButtonElement;
          target.style.background = "none";
          if (target.nextSibling !== null) {
            sibling = target.nextSibling as HTMLButtonElement;
          }
        }
      }

      const start = await this.controller.handleSwitchEngine(id, "started");
      const duration = Number(start.distance) / Number(start.velocity);
      const car = document.getElementById(`car${id}`);
      const carName = car?.getAttribute("data-name");

      if (car !== null) {
        car.style.animationDuration = `${duration}ms`;
        car.style.animationName = "slidein";
        car.style.animationFillMode = "forwards";
        car.style.animationTimingFunction = "linear";
        car.style.animationPlayState = "running";
        try {
          const drive = await this.controller.handleDriveEngine(id);

          if (!drive.success) {
            car.style.animationPlayState = "paused";
            result = Promise.reject(new Error(`${carName}: сломался`));
            console.log(id, "сломался");
          } else {
            console.log(id, "финишировал");
            result = [id, carName, duration];
          }
          if (!this.raceMode && sibling !== null) {
            sibling.style.background = "red";
            sibling.addEventListener(
              "click",
              () => {
                this.stopEngineClick(id);
              },
              { once: true }
            );
          }
          return await result;
        } catch (error) {
          console.log(error);
          return await result;
        }
      }
    }
    return null;
  };

  private stopEngineClick = async (id: string) => {
    let target = null;
    let sibling = null;

    await this.controller.handleSwitchEngine(id, "stopped");
    if (id !== null) {
      const car = document.getElementById(`car${id}`);
      if (car !== null) {
        car.style.animationPlayState = "paused";
        car.style.animationName = "";
      }

      const stopButtons = document.querySelectorAll(".box__stop");
      for (let i = 0; i < stopButtons.length; i += 1) {
        if (stopButtons[i].attributes[1].value === String(id)) {
          target = stopButtons[i] as HTMLButtonElement;
          target.style.background = "none";
          if (target.previousSibling !== null) {
            sibling = target.previousSibling as HTMLButtonElement;
          }
        }
      }

      if (sibling !== null) {
        sibling.addEventListener(
          "click",
          () => {
            this.startEngineClick(id);
          },
          { once: true }
        );
        sibling.style.background = "green";
      }

      console.log("stop", id);
    }
  };

  private raceClick = async () => {
    this.raceSwitch(true);
    const cars = await this.controller.handleGetCarsOnPage(this.pageCount);
    const carId = cars.map((car) => car.id);
    const promises = carId.map(async (car) => {
      const start = await this.startEngineClick(car);
      return start;
    });
    try {
      const winner = await Promise.any(promises).then((value) => {
        return value;
      });
      if (winner !== null) {
        this.winner.innerHTML = `"${winner[1]} went first ${(
          Number(winner[2]) / 1000
        ).toFixed(2)}s"`;
        this.winner.style.color = "green";
        this.winner.style.display = "block";
      }
    } catch (error) {
      this.winner.style.color = "red";
      this.winner.innerHTML = '"all cars are broken"';
      this.winner.style.display = "block";
    }

    await Promise.allSettled(promises).then((results) => results);
    console.log("ЗАЕЗД ОКОНЧЕН");
    this.reset.style.background = "green";
    this.reset.addEventListener("click", this.resetClick, { once: true });
  };

  resetClick = async () => {
    this.raceSwitch(false);

    const cars = await this.controller.handleGetCarsOnPage(this.pageCount);
    const carId = cars.map((car) => car.id);
    const promises = carId.map(async (car) => {
      const stop = await this.stopEngineClick(car);
      return stop;
    });
    await Promise.all(promises);
    this.race.style.background = "green";
    this.race.addEventListener("click", this.raceClick, { once: true });
  };

  private prevClick = () => {
    if (this.pageCount > 1) {
      this.pageCount -= 1;
    }
    this.resetClick();
    this.updateGarage();
    this.updatePuginationButtons();
  };

  private nextClick = async () => {
    const cars = await this.controller.handleGetCarsOnPage(this.pageCount + 1);
    if (cars.length > 0) {
      this.pageCount += 1;
    }
    this.resetClick();
    this.updateGarage();
    this.updatePuginationButtons();
  };

  raceSwitch = (flag: boolean) => {
    const selectButtonsCollection =
      document.getElementsByClassName("box__select");
    const selectButtons = [...selectButtonsCollection];
    const removeButtonsCollection =
      document.getElementsByClassName("box__remove");
    const removeButtons = [...removeButtonsCollection];
    if (flag) {
      this.raceMode = true;
      this.race.style.background = "none";
      this.prev.style.background = "none";
      this.next.style.background = "none";
      this.next.removeEventListener("click", this.nextClick);
      this.prev.removeEventListener("click", this.prevClick);
      this.createCar.style.background = "none";
      this.updateCar.style.background = "none";
      this.generateCars.style.background = "none";
      for (let i = 0; i < selectButtons.length; i += 1) {
        const select = selectButtons[i] as HTMLButtonElement;
        select.style.background = "none";
        const remove = removeButtons[i] as HTMLButtonElement;
        remove.style.background = "none";
      }
    } else {
      this.raceMode = false;
      this.reset.style.background = "none";
      this.winner.style.display = "none";
      this.next.addEventListener("click", this.nextClick);
      this.prev.addEventListener("click", this.prevClick);
      this.updatePuginationButtons();
      this.createCar.style.background = "aquamarine";
      this.generateCars.style.background = "aquamarine";
      if (this.selectCardId !== null && this.selectCardId !== undefined) {
        console.log("ok");
        this.updateCar.style.background = "aquamarine";
      }
      for (let i = 0; i < selectButtons.length; i += 1) {
        const select = selectButtons[i] as HTMLButtonElement;
        select.style.background = "aquamarine";
        const remove = removeButtons[i] as HTMLButtonElement;
        remove.style.background = "aquamarine";
      }
    }
  };

  private createForm() {
    this.form = document.createElement("form");
    this.form.className = "garage__form form";

    const fieldsetCreate = document.createElement("fieldset");
    fieldsetCreate.className = "form__fieldset fieldset";

    this.inputName = document.createElement("input");
    this.inputName.className = "fieldset__input_text";
    this.inputName.type = "text";
    this.inputName.placeholder = "Enter car name";

    this.inputColor = document.createElement("input");
    this.inputColor.className = "fieldset__input_color";
    this.inputColor.type = "color";

    this.createCar = document.createElement("button");
    this.createCar.className = "fieldset__button";
    this.createCar.innerText = "CREATE";
    this.createCar.style.background = "aquamarine";
    this.createCar.type = "button";
    this.createCar.addEventListener("click", this.createCarClick);

    const fieldsetUpdate = document.createElement("fieldset");
    fieldsetUpdate.className = "form__fieldset fieldset";

    this.updateName = document.createElement("input");
    this.updateName.className = "fieldset__input_text";
    this.updateName.type = "text";
    this.updateName.placeholder = "Choose a car";

    this.updateColor = document.createElement("input");
    this.updateColor.className = "fieldset__input_color";
    this.updateColor.type = "color";

    this.updateCar = document.createElement("button");
    this.updateCar.className = "fieldset__button";
    this.updateCar.innerHTML = "UPDATE";
    this.updateCar.type = "button";
    this.updateCar.style.background = "none";
    this.updateCar.addEventListener("click", this.updateCarClick);

    this.race = document.createElement("button");
    this.race.className = "form__button";
    this.race.style.background = "green";
    this.race.type = "button";
    this.race.innerHTML = "RACE";
    this.race.addEventListener("click", this.raceClick, { once: true });

    this.reset = document.createElement("button");
    this.reset.className = "form__button";
    this.reset.style.background = "none";
    this.reset.type = "button";
    this.reset.innerHTML = "RESET";

    this.generateCars = document.createElement("button");
    this.generateCars.style.background = "none";
    this.generateCars.className = "form__button";
    this.generateCars.style.background = "aquamarine";
    this.generateCars.type = "button";
    this.generateCars.innerHTML = "GENERATE";

    const formButtons = document.createElement("div");
    formButtons.className = "form__buttons";
    formButtons.append(this.race, this.reset, this.generateCars);

    fieldsetCreate.append(this.inputName, this.inputColor, this.createCar);
    fieldsetUpdate.append(this.updateName, this.updateColor, this.updateCar);
    this.form.append(fieldsetCreate, fieldsetUpdate);
    this.form.append(formButtons);
  }

  private async createBoxes() {
    const allCars = await this.controller.handleGetCars();
    let cars = await this.controller.handleGetCarsOnPage(this.pageCount);

    if (cars.length === 0 && this.pageCount > 1) {
      this.pageCount -= 1;
      cars = await this.controller.handleGetCarsOnPage(this.pageCount);
    }

    this.boxes = document.createElement("div");
    this.boxes.className = "garage__boxes boxes";

    const boxesTitle = document.createElement("p");
    boxesTitle.className = "boxes__title";
    boxesTitle.innerHTML = `Garage(${allCars.length})`;

    const boxesPageCount = document.createElement("p");
    boxesPageCount.className = "boxes__count";
    boxesPageCount.innerHTML = `Page: ${this.pageCount}`;

    this.boxes.appendChild(boxesTitle);
    this.boxes.appendChild(boxesPageCount);

    for (let i = 0; i < cars.length; i += 1) {
      const car = cars[i];

      const box = document.createElement("div");
      box.className = "boxes__box box";

      this.selectCar = document.createElement("button");
      this.selectCar.style.background = "aquamarine";
      this.selectCar.className = "box__select";
      this.selectCar.innerHTML = "SELECT";
      this.selectCar.setAttribute("data-id", car.id);
      this.selectCar.setAttribute("data-color", car.color);
      this.selectCar.setAttribute("data-name", car.name);
      this.selectCar.addEventListener("click", this.selectCarClick);

      this.removeCar = document.createElement("button");
      this.removeCar.style.background = "aquamarine";
      this.removeCar.className = "box__remove";
      this.removeCar.innerHTML = "REMOVE";
      this.removeCar.setAttribute("data-id", car.id);
      this.removeCar.addEventListener("click", this.removeCarClick);

      this.startEngine = document.createElement("button");
      this.startEngine.className = "box__start";
      this.startEngine.style.background = "green";
      this.startEngine.innerHTML = "A";
      this.startEngine.setAttribute("data-id", car.id);
      this.startEngine.addEventListener(
        "click",
        (event: Event) => {
          const target = event.target as HTMLButtonElement;
          const id = target.getAttribute("data-id");
          if (id !== null && this.raceMode === false) {
            this.startEngineClick(id);
          }
        },
        { once: true }
      );

      this.stopEngine = document.createElement("button");
      this.stopEngine.className = "box__stop";
      this.stopEngine.style.background = "none";
      this.stopEngine.innerHTML = "B";
      this.stopEngine.setAttribute("data-id", car.id);

      const boxButtons = document.createElement("div");
      boxButtons.className = "box__buttons";
      boxButtons.append(
        this.selectCar,
        this.removeCar,
        this.startEngine,
        this.stopEngine
      );

      const boxName = document.createElement("p");
      boxName.className = "box__name";
      boxName.innerHTML = car.name;

      this.car = document.createElement("div");
      this.car.id = `car${car.id}`;
      this.car.setAttribute("data-name", car.name);
      this.car.className = "box__car car";
      this.car.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M171.3 96H224v96H111.3l30.4-75.9C146.5 104 158.2 96 171.3 96zM272 192V96h81.2c9.7 0 18.9 4.4 25 12l67.2 84H272zm256.2 1L428.2 68c-18.2-22.8-45.8-36-75-36H171.3c-39.3 0-74.6 23.9-89.1 60.3L40.6 196.4C16.8 205.8 0 228.9 0 256V368c0 17.7 14.3 32 32 32H65.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H385.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H608c17.7 0 32-14.3 32-32V320c0-65.2-48.8-119-111.8-127zm-2.9 207c-6.6 18.6-24.4 32-45.3 32s-38.7-13.4-45.3-32c-1.8-5-2.7-10.4-2.7-16c0-26.5 21.5-48 48-48s48 21.5 48 48c0 5.6-1 11-2.7 16zM160 432c-20.9 0-38.7-13.4-45.3-32c-1.8-5-2.7-10.4-2.7-16c0-26.5 21.5-48 48-48s48 21.5 48 48c0 5.6-1 11-2.7 16c-6.6 18.6-24.4 32-45.3 32z"/></svg>`;
      this.car.style.fill = car.color;

      const road = document.createElement("div");
      road.className = "box__road";

      const flag = document.createElement("div");
      flag.innerHTML = `<svg width="50px" height="50px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>flag-racing-solid</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <g> <path d="M26,6V4a2,2,0,0,0-2-2H6V44a2,2,0,0,0,4,0V26H22v2a2,2,0,0,0,2,2H42V6ZM38,18H34v4h4v4H34V22H30v4H26V22H22V18H18v4H14V18H10V14h4V10H10V6h4v4h4V6h4v4h4v4h4V10h4v4h4Z"></path> <rect x="14" y="14" width="4" height="4"></rect> <rect x="18" y="10" width="4" height="4"></rect> <rect x="22" y="14" width="4" height="4"></rect> <rect x="26" y="18" width="4" height="4"></rect> <rect x="30" y="14" width="4" height="4"></rect> </g> </g> </g> </g></svg>`;
      flag.className = "box__flag";

      road.append(flag);

      box.append(boxName, this.car, road, boxButtons);

      this.boxes.append(box);
    }
  }

  private async createPuginationButtons() {
    this.pagination = document.createElement("div");
    this.pagination.className = "garage__pagination pagination";
    this.prev = document.createElement("button");
    this.prev.className = "pagination__prev";
    this.prev.innerHTML = "PREV";
    if (this.pageCount > 1) {
      this.prev.style.background = "aquamarine";
      this.prev.addEventListener("click", this.prevClick);
    } else {
      this.prev.style.background = "none";
      this.prev.removeEventListener("click", this.prevClick);
    }
    this.next = document.createElement("button");
    this.next.className = "pagination__next";
    this.next.innerHTML = "NEXT";
    const cars = await this.controller.handleGetCarsOnPage(this.pageCount + 1);
    if (cars.length > 0) {
      this.next.style.background = "aquamarine";
      this.next.addEventListener("click", this.nextClick);
    } else {
      this.next.style.background = "none";
      this.next.removeEventListener("click", this.nextClick);
    }
    this.pagination.append(this.prev, this.next);
  }

  private async updatePuginationButtons() {
    this.garage.removeChild(this.pagination);
    await this.createPuginationButtons();
    this.garage.appendChild(this.pagination);
  }

  public async updateGarage() {
    this.garage.removeChild(this.boxes);
    await this.createBoxes();
    this.garage.insertBefore(this.boxes, this.pagination);
  }

  public mount = async () => {
    this.winner = document.createElement("p");
    this.winner.innerHTML = "WINNER";
    this.winner.className = "garage__winner winner";
    this.raceMode = false;
    this.createForm();
    await this.createBoxes();
    this.createPuginationButtons();
    this.main = document.createElement("main");
    this.garage = document.createElement("div");
    this.garage.className = "garage";
    this.garage.append(this.form, this.boxes, this.pagination, this.winner);
    this.main.appendChild(this.garage);
    this.root.appendChild(this.main);
  };
}
