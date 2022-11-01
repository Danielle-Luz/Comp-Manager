import { editLoggetUserModal } from "../../scripts/modals.js";
import { createDefaultSelectOption, renderAllCards, renderSectorsBySelectedCompany } from "../../scripts/render.js";
import { getAllCompanies } from "../../scripts/requests.js";

const companies = await getAllCompanies();

companies.unshift({name:"Selecionar empresa"});

renderAllCards(companies, "#company-names", createDefaultSelectOption);

await renderSectorsBySelectedCompany();

addCreateDepartmentEvent();

function addCreateDepartmentEvent() {
  const createButton = document.getElementById("create-company");

  createButton.addEventListener("click", () => {
    editLoggetUserModal();
  });
}