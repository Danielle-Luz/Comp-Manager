import { createCompanyModal } from "../../scripts/modals.js";
import { createDefaultSelectOption, createUserCard, renderAllCards, renderSectorsBySelectedCompany } from "../../scripts/render.js";
import { getAllCompanies, getAllUsers, redirectUser } from "../../scripts/requests.js";


await redirectUser(true, "user-dashboard");

const companies = await getAllCompanies();

const users = await getAllUsers();

companies.unshift({name:"Selecionar empresa"});

renderAllCards(companies, "#company-names", createDefaultSelectOption);

renderAllCards(users, "#users-list", createUserCard);

if (users.length == 0) {
  const usersList = document.getElementById("users-list");

  usersList.innerHTML = `
  <div class="align-center d-flex justify-center full-height full-width">
    <h2 class="title-1">Nenhum usuário cadastrado.</h2>
  </div>`;
}

await renderSectorsBySelectedCompany();

addCreateDepartmentEvent();

function addCreateDepartmentEvent() {
  const createButton = document.getElementById("create-company");

  createButton.addEventListener("click", () => {
    createCompanyModal();
  });
}