import { createCompanyCard, renderAllCards } from "../../scripts/render.js";
import { getAllCompanies } from "../../scripts/requests.js";

const companies = await getAllCompanies();

renderAllCards(companies, ".organizations-list", createCompanyCard);