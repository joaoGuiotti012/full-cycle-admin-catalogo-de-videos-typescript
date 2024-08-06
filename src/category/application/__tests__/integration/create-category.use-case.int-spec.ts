import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../shared/infra/helpers/helpers";
import { CategorySequelizeRepository } from "../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../infra/db/sequelize/category.model";
import { CreateCategoryUseCase } from "../../create-category.use-case";

describe('CreateCategoryUseCase Integration Test', () => {
  let useCase!: CreateCategoryUseCase;
  let repository!: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase(repository);
  });

  it('Should create a category', async () => {
    let output = await useCase.execute({ name: 'test' });
    let entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'test',
      description: null,
      is_active: true,
      created_at: entity.created_at,
    });

    output = await useCase.execute({ name: 'test', description: 'Some description', is_active: false });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'test',
      description: 'Some description',
      is_active: false,
      created_at: entity.created_at,
    });

  });

});
