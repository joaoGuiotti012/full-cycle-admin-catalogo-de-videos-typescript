import { Op } from "sequelize";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategorySearchParams, CategorySearchResult, ICategoryRepository } from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'created_at'];

  constructor(private categoryModel: typeof CategoryModel) { }

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at
    });
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(entities.map((e) => ({
      ...e,
      category_id: e.category_id.id,
    })));
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id;
    const model = await this._get(id);
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }
    this.categoryModel.update({
      ...entity,
      category_id: id,
    }, { where: { category_id: id } });
  }

  async delete(entity_id: Uuid): Promise<void> {
    const id = entity_id.id;
    const model = await this._get(id);
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }
    this.categoryModel.destroy({ where: { category_id: id } });
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this._get(entity_id.id);
    if (!model) 
      return null;
    return new Category({
      category_id: new Uuid(model.category_id),
      name: model.name,
      description: model.description,
      created_at: model.created_at,
      is_active: model.is_active
    })
  }

  private async _get(id: string) {
    return await this.categoryModel.findByPk(id);
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map((model) => (
      new Category({
        category_id: new Uuid(model.category_id),
        name: model.name,
        description: model.description,
        is_active: model.is_active,
        created_at: model.created_at
      })
    ));
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    // query - Contar os registros
    // query retornar os registros
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const { count, rows } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}%` },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: [[props.sort, props.sort_dir]] }
        : { order: [['created_at', 'desc']] }
      ),
      offset,
      limit
    });

    return new CategorySearchResult({
      items: rows.map((row) => {
        return new Category({
          category_id: new Uuid(row.category_id),
          name: row.name,
          description: row.description,
          is_active: row.is_active,
          created_at: row.created_at,
        });
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count
    })
  }

}