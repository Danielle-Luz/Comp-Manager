import { createCompanyCard, createCompanySelectOption, renderAllCards } from "../../scripts/render.js";
import { getAllCompanies, getAllSectors } from "../../scripts/requests.js";

const companies = await getAllCompanies();

const sectors = await getAllSectors();

renderAllCards(companies, ".organizations-list", createCompanyCard);

renderAllCards(sectors, "#sectors", createCompanySelectOption);