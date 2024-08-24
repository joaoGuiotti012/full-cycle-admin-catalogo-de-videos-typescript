import { PaginationOutput, PaginationOutputMapper } from "../../../../shared/application/pagination-output";
import { IUseCase } from "../../../../shared/application/use-case.interface";
import { SearchParamsConstructorProps } from "../../../../shared/domain/repository/search-params";
import { CategoryFilter, CategorySearchParams, CategorySearchResult, ICategoryRepository } from "../../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output";

export class ListCategoriesUseCase
  implements IUseCase<ListcategoriesInput, ListCategoriesOutput> {

  constructor(private repo: ICategoryRepository) { }

  async execute(input: ListcategoriesInput): Promise<ListCategoriesOutput> {
    const params = new CategorySearchParams(input);
    const searchResult = await this.repo.search(params);
    return this.toOutput(searchResult);

  }

  private toOutput(searchResult: CategorySearchResult) {
    const { items: _items } = searchResult;
    const items = _items.map((item) =>
      CategoryOutputMapper.toOutput(item)
    );
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListcategoriesInput = SearchParamsConstructorProps<CategoryFilter>;
export type ListCategoriesOutput = PaginationOutput<CategoryOutput>;
