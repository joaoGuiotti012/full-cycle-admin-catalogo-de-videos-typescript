import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { applyGlobalConfigApp } from "src/nest-modules/global.config";

export interface StartHelper {
  app: INestApplication;
}

export function startApp(): StartHelper {
  let _app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    _app = moduleFixture.createNestApplication();
    applyGlobalConfigApp(_app);
    await _app.init();
  });

  afterEach(async () => {
    await _app?.close();
  });

  // utilziar essa tecnica de retornar uma isntancia de uma variavel usando app
  // garante que consigamos usar em outro contexto de teste o app que é aplicação nest
  return {
    get app() {
      return _app;
    }
  }
}