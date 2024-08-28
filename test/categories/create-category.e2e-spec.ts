import { CreateCategoryFixture } from "src/nest-modules/categories-modules/testing/category-fixture";
import { ICategoryRepository } from "@core/category/domain/category.repository";
import { CATEGORY_PROVIDERS } from "src/nest-modules/categories-modules/categories.provider";
import { startApp, StartHelper } from "src/nest-modules/shared-module/testing/helper";
import request from 'supertest';

describe('CategoriesController (e2e)', () => {
  const appHelper: StartHelper = startApp();
  let categoryRepo: ICategoryRepository;

  beforeEach(async () => {
    categoryRepo = appHelper.app.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide
    );
  });

  describe('/categories (POST)', () => {
    const arrange = CreateCategoryFixture.arrangeForCreate();

    test.each(arrange)('when body is $send_data', async ({ send_data }) => {
      const res = await request(appHelper.app.getHttpServer())
        .post('/categories')
        .send(send_data)
        .expect(201);

      const keysInResponse = CreateCategoryFixture.keysInResponse;
      expect(Object.keys(res.body)).toStrictEqual(['data'])
    });
  });
});