import { countBy, find } from "lodash";
import { Category } from "./category.entity";
import { IRepository } from "../../shared/domain/repository/repository-interface";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";

// Vernon fala no livro vermelho, que, 
// Enventualmente a gente precisa pasar aqui como parametro 
// Outras coisas que não sejam entidades, por exemplo pra fazer um filtro, eu posso 
// Trabalhar com objeto de valores, eles são auto validados
export interface ICategoryRepository extends IRepository<Category, Uuid> {
   

  // O que não pode ter no repositório, é por exemplo o changeName(isso é regra de negocio), 
  // O repository esta preocupado apenas com uma questao, que é armazenamento, mas não armezanamento em BD,
  // Cabe a ele recuperar e mandar dados
}

// memoria
// sequelize