export interface IUser {
  id: number;
  nome: string;
  email: string;
  password: string;
  hora_de_criacao: Date;
  hora_de_atualizacao: Date;
}

export type UserProvidedFields = Omit<IUser, 'hora_de_criacao' | 'hora_de_atualizacao'>;

export class MemoryDb {
  private static database: { [id: number]: IUser } = {};

  public static insert(user: UserProvidedFields): boolean {
    if (this.database[user.id]) {
      return false;
    }
    const now = new Date();
    this.database[user.id] = { ...user, hora_de_atualizacao: now, hora_de_criacao: now };
    return true;
  }

  public static select(id: number): IUser | undefined {
    return this.database[id];
  }

  public static update(user: Partial<UserProvidedFields> & { id: number }): boolean {
    if (!this.database[user.id]) {
      return false;
    }
    Object.entries(user).forEach(([userField, userFieldValue]) => {
      this.database[user.id][userField as keyof IUser] = userFieldValue as never;
    });
    const now = new Date();
    this.database[user.id].hora_de_atualizacao = now;
    return true;
  }

  public static delete(id: number): boolean {
    if (!this.database[id]) {
      return false;
    }
    delete this.database[id];
    return true;
  }

  public static clear(): void {
    this.database = {};
  }
}
