import { Category } from "../../domain/category.entity";
import { CategoryInMemoryRepository } from "./category-in-memory.repository";

describe('CategoryInMemoryRepository', () => {
  let repo: CategoryInMemoryRepository;

  beforeEach(() => (repo = new CategoryInMemoryRepository()));

  it('Should no filter items when filter object is null', async () => {
    const items = [
      Category.create({ name: 'test' })
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repo['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it('Sould filter items using parameter', async () => {
    const items = [
      Category.create({ name: 'test' }),
      Category.create({ name: 'TEST' }),
      Category.create({ name: 'fake' })
    ];
    const filterSpy = jest.spyOn(items, 'filter');

    const itemsFiltered = await repo['applyFilter'](items, 'TEST');
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([
      items[0],
      items[1],
    ]);
  });
  it('Sould sort by created_at when sort param is null', async () => {

    const created_at = new Date();
    const createTime = (ms: number) => new Date(created_at.getTime() + ms);
    const items = [
      Category.create({ name: 'test', created_at }),
      Category.create({ name: 'test 1', created_at: createTime(100) }),
      Category.create({ name: 'test 2', created_at: createTime(400) }),
      Category.create({ name: 'test 3', created_at: createTime(900) }),
    ];
    const itemsSorted = await repo['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual(items.reverse());
  });

  it('Shloud sort by name', async () => {
    const items = [
      Category.create({ name: 'c' }),
      Category.create({ name: 'b' }),
      Category.create({ name: 'a' })
    ];

    let itemsSorted = await repo['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([
      items[2],
      items[1],
      items[0],
    ]);

    itemsSorted = await repo['applySort'](items, 'name', 'desc');
    expect(itemsSorted).toStrictEqual([
      items[0],
      items[1],
      items[2],
    ]);
  });

});