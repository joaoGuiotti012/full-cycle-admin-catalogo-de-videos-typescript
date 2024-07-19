import { Entity } from "../../shared/domain/entity";
import { EntityValidationError } from "../../shared/domain/validators/validation.error";
import { ValueObject } from "../../shared/domain/value-object";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { CategoryValidaotrFactory } from "./category.validator";

export type CategoryConstructorProps = {
  category_id?: Uuid;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
}

export type CategoryCreateCommand = {
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
}

export class Category extends Entity {
  category_id: Uuid;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;

  constructor(props: CategoryConstructorProps) {
    super();
    this.category_id = props.category_id ?? Uuid.create();
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  get entity_id(): ValueObject {
    return this.category_id;
  }

  // Factory method
  // Eventos de dominio
  static create(props: CategoryCreateCommand): Category {
    const category = new Category(Object.assign(props));
    Category.validate(category);
    return category;
  }

  update(props: Partial<CategoryConstructorProps>): Category {
    Object.assign(this, props);
    return this;
  }

  changeName(name: string): void {
    this.name = name;
    Category.validate(this);
  }

  changeDescription(description: string) {
    this.description = description;
    Category.validate(this);
  }

  activate() {
    this.is_active = true;
  }

  deactivate() {
    this.is_active = false;
  }

  static validate(entity: Category) {
    const validator = CategoryValidaotrFactory.create();
    const isValid = validator.validate(entity);
    if (!isValid)
      throw new EntityValidationError(validator.errors);
  }

  toJSON() {
    return {
      ...this,
      category_id: this.category_id?.id
    }
  }
}
//livres de efeitos colatereias
//imutalidade 