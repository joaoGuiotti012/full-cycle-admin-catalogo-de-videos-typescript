import { EntityValidationError } from "../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe('Category Unit Tests', () => {
  let validateSpy: any;
  beforeEach(() => {
    validateSpy = jest.spyOn(Category, "validate");
  });

  describe('Constructor', () => {
    // Triple AAA (Arrange Action Assert)
    it('Should create a category with default values', () => {
      let categoty = new Category({
        name: 'Movie',
        description: 'Movie about anything',
        created_at: new Date()
      });
      const created_at = new Date();
      categoty = new Category({
        name: 'Movie',
        description: 'Movie description',
        is_active: false,
        created_at
      });
      expect(categoty.category_id).toBeInstanceOf(Uuid);
      expect(categoty.name).toBe('Movie');
      expect(categoty.description).toBe('Movie description');
      expect(categoty.is_active).toBeFalsy();
      expect(categoty.created_at).toBe(created_at);
    });
  });

  describe('Created command', () => {
    test('should create a category', () => {
      const category = Category.create({ name: 'Movie' });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('Should create a category with description', () => {
      const category = Category.create({
        name: 'Movie with description',
        description: 'Some Description'
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie with description');
      expect(category.description).toBe('Some Description');
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('Should create a categor with is_active', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: false,
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(false);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('Should active a category', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: false
      });

      category.activate();
      expect(category.is_active).toBe(true);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('Should disable a category', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: true
      });
      category.deactivate();
      expect(category.is_active).toBe(false);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update Command', () => {
    test('Should update a category', () => {
      const category = Category.create({ name: 'Movie', description: 'Description' });
      const updatedCategory = category.update({ name: 'Updated Name' });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Updated Name');
      expect(updatedCategory.name).toBe('Updated Name');
      expect(category.description).toBe('Description');
      expect(updatedCategory.description).toBe('Description');
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('category_id field', () => {
    const arrange = [{ category_id: null }, { category_id: undefined }, { category_id: Uuid.create() }];
    test.each(arrange)('id = %j', ({ category_id }) => {
      const category = Category.create({
        category_id: category_id,
        name: 'Movie'
      } as any);
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    })
  });

  test('Should change a category name', () => {
    const category = Category.create({
      name: 'Movie',
    });
    category.changeName('Movie name changed');
    expect(category.name).toBe('Movie name changed');
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  test('Should change a category description', () => {
    const category = Category.create({ name: 'Movie', description: 'Description' });
    category.changeDescription('Description Changed');
    expect(category.description).toBe('Description Changed');
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

});

describe('Category Validator', () => {
  describe('Create Command', () => {
    test('Should an invalid category with name property', () => {
      expect(() => Category.create({ name: null }))
        .containsErrorMessages({
          "name": [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters"
          ]
        });

      expect(() => Category.create({ name: '' }))
        .containsErrorMessages({
          name: ["name should not be empty"]
        });

      const category = Category.create({ name: 'nome' });
      expect(() => category.changeName(''))
        .containsErrorMessages({
          name: ["name should not be empty"]
        });

      expect(() => Category.create({ name: 't'.repeat(256) }))
        .containsErrorMessages({
          name: ["name must be shorter than or equal to 255 characters"]
        });

      expect(() => category.changeName('t'.repeat(256)))
        .containsErrorMessages({
          name: ["name must be shorter than or equal to 255 characters"]
        });
    });

    test('Should an invalid category with description', () => {
      expect(() => Category.create(Object.assign({ name: 'nome', description: 122 })))
        .containsErrorMessages({
          description: ["description must be a string",]
        })
    });
  });
})