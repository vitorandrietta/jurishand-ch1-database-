import knex from 'knex';
import fs from 'fs';
import { UserProvidedFields } from '~/db/memory_db';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const establishConection = () =>
  knex({
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5438,
      user: 'postgres',
      password: process.env.PASSWORD,
      database: 'postgres',
    },
  });

describe('tests for database manipulation', () => {
  const sampleUser: UserProvidedFields = {
    id: 1,
    nome: 'victor andrietta',
    password: 'yudg2347a',
    email: 'vitorandrietta@gmail.com',
  };

  const connection = establishConection();
  beforeAll(async () => {
    const userTable = fs.readFileSync(path.resolve(__dirname, '../user_table.sql')).toString();
    const addUserProc = fs.readFileSync(path.resolve(__dirname, '../add_user.sql')).toString();
    const updateUserProc = fs.readFileSync(path.resolve(__dirname, '../upd_user.sql')).toString();
    const selUserProc = fs
      .readFileSync(path.resolve(__dirname, '../sel_user_by_id.sql'))
      .toString();
    const delUserProc = fs.readFileSync(path.resolve(__dirname, '../del_user.sql')).toString();
    await connection.raw(userTable);
    await Promise.all([
      connection.raw(addUserProc),
      connection.raw(updateUserProc),
      connection.raw(selUserProc),
      connection.raw(delUserProc),
    ]);
  });

  afterAll(() => connection.destroy());

  it('should successfully insert a user', async () => {
    const { nome, password, email } = sampleUser;
    await connection.raw(`call INS_USER('${nome}', '${email}' , '${password}' )`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertedUser = (await connection.raw('SELECT SEL_USER(1)')) as any;
    const insertedUserFields = insertedUser?.rows[0]['sel_user']
      ?.replace('(', '')
      .replace(')', '')
      .replace('\\"', '')
      .replace('\\', '')
      .replace('"', '')
      .split(',');
    expect(insertedUserFields?.length).toBe(6);
    const insertedUserObj: Omit<UserProvidedFields, 'password'> = {
      id: parseInt(insertedUserFields[0], 10),
      nome: insertedUserFields[1].replace('"', ''),
      email: insertedUserFields[2],
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...sampleUserWithoutPass } = sampleUser;
    expect(insertedUserObj).toMatchObject(sampleUserWithoutPass);
  });

  it('should successfully update a user field', async () => {
    const newUserName = 'JOAQUIM';
    await connection.raw(`call UPD_USER(1, 'NOME' , '${newUserName}' )`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertedUser = (await connection.raw('SELECT SEL_USER(1)')) as any;
    const insertedUserFields = insertedUser?.rows[0]['sel_user']
      ?.replace('(', '')
      .replace(')', '')
      .replace('\\"', '')
      .replace('\\', '')
      .split(',');
    expect(insertedUserFields?.length).toBe(6);

    const insertedUserObj: Omit<UserProvidedFields, 'password'> = {
      id: parseInt(insertedUserFields[0], 10),
      nome: insertedUserFields[1],
      email: insertedUserFields[2],
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...sampleUserWithoutPass } = sampleUser;
    expect(insertedUserObj).toMatchObject({ ...sampleUserWithoutPass, nome: newUserName });
  });

  it('should successfully delete a user', async () => {
    await connection.raw('call DEL_USER(1)');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deletedUserQuery = (await connection.raw('SELECT SEL_USER(1)')) as any;
    expect(deletedUserQuery.rowCount).toBe(0);
  });
});
