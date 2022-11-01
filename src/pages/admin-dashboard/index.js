import { createDefaultSelectOption, renderAllCards, renderSectorsBySelectedCompany } from "../../scripts/render.js";
import { getAllCompanies } from "../../scripts/requests.js";

const companies = await getAllCompanies();

companies.unshift({name:"Selecionar empresa"});

renderAllCards(companies, "#company-names", createDefaultSelectOption);

renderSectorsBySelectedCompany();