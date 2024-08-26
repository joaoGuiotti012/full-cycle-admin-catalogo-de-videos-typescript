import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  GetCategoryUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
  ListCategoriesUseCase
} from '@core/category/application/use-cases';
import { CategoryPresenter } from './category.presenter';
import { CategoryOutput } from '@core/category/application/use-cases/common/category-output';

@Controller('categories')
export class CategoriesController {

  @Inject(CreateCategoryUseCase)
  private createUseCase: CreateCategoryUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateUseCase: CreateCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private DeleteUseCase: DeleteCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private GetUseCase: GetCategoryUseCase;

  @Inject(ListCategoriesUseCase)
  private ListUseCase: ListCategoriesUseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(createCategoryDto);
    return CategoriesController.serialize(output);
  }

  @Get()
  findAll() {
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
  }
  static serialize(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }
}
