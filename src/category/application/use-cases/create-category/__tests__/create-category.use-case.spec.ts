import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { CreateCategoryUseCase } from "../create-category.use-case";

describe('CreateCategoryUseCase Unit Test', () => {
  let useCase!: CreateCategoryUseCase;
  let repository!: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  it('Should create a category', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    let output = await useCase.execute({ name: 'test' });
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].category_id.id,
      name: 'test',
      description: null,
      is_active : true,
      created_at: repository.items[0].created_at,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'Some description',
      is_active: false,
    });

    expect(output).toStrictEqual({
      id: repository.items[1].category_id.id,
      name: 'test',
      description: 'Some description',
      is_active: false,
      created_at: repository.items[1].created_at,
    });
  });


});