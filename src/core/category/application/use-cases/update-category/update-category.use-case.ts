import { IUseCase } from "../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { ICategoryRepository } from "../../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output";
import { UpdateCategoryInput } from "./update-category.input";

export type UpdateCategoryOutput = CategoryOutput;

export class UpdateCategoryUseCase
  implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput> {

  constructor(private readonly categoryRepo: ICategoryRepository) { }

  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const uuid = new Uuid(input.id);
    const entity = await this.categoryRepo.findById(uuid);

    if (!entity) {
      throw new NotFoundError(input.id, Category);
    }

    input.name && entity.changeName(input.name);

    if (!!input.description)
      entity.changeDescription(input.description);

    if (input.is_active === true)
      entity.activate()

    if (input.is_active === false)
      entity.deactivate();

    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }

    await this.categoryRepo.update(entity);

    return CategoryOutputMapper.toOutput(entity)
  }

}