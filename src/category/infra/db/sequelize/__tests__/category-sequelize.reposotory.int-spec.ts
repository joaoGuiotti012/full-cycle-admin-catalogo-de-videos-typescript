import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategorySequelizeRepository } from "../category-sequelize.repository";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";

describe('CategorySequelizeRepository Integration it', () => {
  let sequelize!: Sequelize;
  let repository!: CategorySequelizeRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory',
      models: [CategoryModel],
      logging: false,
    });
    await sequelize.sync({ force: true });
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it('Should insert a new category', async () => {
    let category = Category.fake().aCategory().withName('movie').build();
    await repository.insert(category);
    let entity = await repository.findById(category.category_id);
    expect(entity.toJSON()).toStrictEqual(category.toJSON());

    category = Category.fake().aCategory()
      .withName('Movie')
      .withDescription('Some Description')
      .build();

    await repository.insert(category);
    entity = await repository.findById(category.category_id);
    expect(entity.toJSON()).toStrictEqual(category.toJSON());
  });

  it('Should finds a entoty by id', async () => {
    let entityFound = await repository.findById(new Uuid());
    expect(entityFound).toBeNull();

    const category = Category.fake().aCategory().withName('Movie').build();
    await repository.insert(category);
    entityFound = await repository.findById(category.category_id);
    expect(category.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it('Should return all categories', async () => {
    let category = Category.fake().aCategory().withName('Movie').build();
    await repository.insert(category);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(entities[0].toJSON()).toStrictEqual(category.toJSON());
    expect(JSON.stringify(entities)).toBe(JSON.stringify([category]));
  });

  it('Should throw error on update when a entity not found', async () => {
    const category = Category.fake().aCategory().build();
    await expect(repository.update(category)).rejects.toThrow(
      new NotFoundError(category.category_id.id, Category)
    );
  });

  it('Should update a entity', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    category.changeName('Movie Update');
    await repository.update(category);

    const entityFound = await repository.findById(category.category_id);
    expect(category.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it('Should throw error on delete when a entity not found', async () => {
    const category = Category.fake().aCategory().build();
    await expect(repository.delete(category.category_id)).rejects.toThrow(
      new NotFoundError(category.category_id.id, Category)
    );
  });

  it('Should throw error on delete when a entity not found', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    await repository.delete(category.category_id);
    const entity = await repository.findById(category.category_id)
    expect(entity).toBeNull();
  });

});