import { IModel, ICar, IWinner, IEngine, IDriveEngine } from "./model-types";

export class Model implements IModel {
  getRandomDigit(min: number, max: number): number {
    const a = Math.ceil(min);
    const b = Math.floor(max);
    return Math.floor(Math.random() * (b - a + 1) + a);
  }

  getRandomCarName(): string {
    const names = [
      "Tesla",
      "BMW",
      "Mercedes-Benz",
      "Ford",
      "Toyota",
      "Volkswagen",
      "Reanult",
      "Nissan",
      "Mitsubishi",
      "Kia",
    ];

    const models = [
      "Model Y",
      "E39",
      "C-Class",
      "Mustang",
      "Corolla",
      "Rio",
      "Golf",
      "Duster",
      "Leaf",
      "Outlander",
    ];

    return `${names[this.getRandomDigit(0, 9)]} ${
      models[this.getRandomDigit(0, 9)]
    }`;
  }

  getRandomColor(): string {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  async generateRandomCars(): Promise<string> {
    const number = [...Array(10).keys()];
    const promises = number.map(async () => {
      const newCar = await this.createCar(
        this.getRandomCarName(),
        this.getRandomColor()
      );
      return newCar;
    });
    await Promise.all(promises);
    return "done";
  }

  async getCars(): Promise<ICar[] | null> {
    try {
      const response = await fetch(`http://localhost:3000/garage`);
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const data: Array<ICar> = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async getCarsOnPage(page: number): Promise<ICar[] | null> {
    try {
      const response = await fetch(
        `http://localhost:3000/garage?_page=${page}&_limit=7`
      );
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const data: Array<ICar> = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async createCar(name: string, color: string): Promise<ICar[] | null> {
    try {
      const response = await fetch("http://localhost:3000/garage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const data: Array<ICar> = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async updateCar(
    name: string,
    color: string,
    id: string
  ): Promise<ICar[] | null> {
    try {
      const response = await fetch(`http://localhost:3000/garage/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const data: Array<ICar> = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async removeCar(id: string): Promise<ICar[] | null> {
    try {
      const response = await fetch(`http://localhost:3000/garage/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const data: Array<ICar> = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async switchEngine(id: string, state: string): Promise<IEngine | null> {
    try {
      const response = await fetch(
        `http://localhost:3000/engine?id=${id}&status=${state}`,
        {
          method: "PATCH",
        }
      );
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const data: IEngine = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async driveEngine(id: string): Promise<IDriveEngine | null> {
    try {
      const response = await fetch(
        `http://localhost:3000/engine?id=${id}&status=drive`,
        {
          method: "PATCH",
        }
      );
      if (!response.ok) {
        if (response.status === 500) {
          const data: IDriveEngine = {
            success: false,
          };
          return data;
        }
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      } else {
        const data: IDriveEngine = await response.json();
        return data;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async getWinners(): Promise<IWinner[] | null> {
    try {
      const response = await fetch(`http://localhost:3000/winners`);
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const data: Array<IWinner> = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async getWinnerssOnPage(
    page: number,
    sort?: string,
    order?: string
  ): Promise<IWinner[] | null> {
    try {
      const response = await fetch(
        `http://localhost:3000/winners?_page=${page}&_limit=10&_sort=${sort}&_order=${order}`
      );
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const data: Array<IWinner> = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async getWinner(id: string): Promise<IWinner | null> {
    try {
      const response = await fetch(`http://localhost:3000/winners/${id}`);
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const data: IWinner = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async createWinner(
    id: string,
    wins: number,
    time: number
  ): Promise<IWinner[] | null> {
    try {
      const response = await fetch("http://localhost:3000/winners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, wins, time }),
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const data: Array<IWinner> = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async updateWinner(
    id: string,
    wins: number,
    time: number
  ): Promise<IWinner[] | null> {
    try {
      const response = await fetch(`http://localhost:3000/winners/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wins, time }),
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const data: Array<IWinner> = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async eraseWinner(id: string): Promise<void> {
    try {
      const response = await fetch(`http://localhost:3000/winners/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
