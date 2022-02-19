import { MemoryDb, UserProvidedFields } from '../index';

const sampleUser: UserProvidedFields = {
  id: 1,
  nome: 'victor andrietta',
  password: 'yudg2347a',
  email: 'vitorandrietta@gmail.com',
};

describe('test memory database functionalities', () => {
  afterAll(() => MemoryDb.clear());
  beforeAll(() => MemoryDb.clear());
  it('should successfully insert user', () => {
    expect(MemoryDb.insert(sampleUser)).toBe(true);
    const selectedUser = MemoryDb.select(sampleUser.id);
    expect(selectedUser).toMatchObject(sampleUser);
  });
  it('should successfully update user', () => {
    const modifiedUser = { ...sampleUser, nome: 'jow lemos', email: 'jowlemos@gmail.com' };
    expect(MemoryDb.update(modifiedUser)).toBe(true);
    const selectedUser = MemoryDb.select(sampleUser.id);
    expect(selectedUser).toMatchObject(modifiedUser);
  });
  it('should successfully delete user', () => {
    expect(MemoryDb.delete(sampleUser.id)).toBe(true);
    const selectedUser = MemoryDb.select(sampleUser.id);
    expect(selectedUser).toBe(undefined);
  });
});
