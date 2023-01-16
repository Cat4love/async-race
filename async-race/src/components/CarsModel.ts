interface ICar {
  name: string;
  color: string;
  id: string;
}

interface IEngine {
  velocity: string;
  distance: string;
}

interface IDriveEngine {
  success: boolean;
}

export class CarsModel {
  constructor() {
    this.getCars();
  }

  async getCars(): Promise<ICar[]> {
    const response = await fetch("http://localhost:3000/garage");
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data: Array<ICar> = await response.json();
    return data;
  }

  async createCar(name: string, color: string) {
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
    console.log(`Машина создана ${JSON.stringify(data)}`);
    return data;
  }

  async updateCar(name: string, color: string, id: string) {
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
    console.log(`Машина обновленв ${JSON.stringify(data)}`);
    return data;
  }

  async removeCar(id: string) {
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
    console.log(`Машина удалена ${JSON.stringify(data)}`);
    return data;
  }

  async switchEngine(id: string, state: string) {
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
  }

  async driveEngine(id: string) {
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
  }
}
