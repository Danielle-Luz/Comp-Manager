import { toggleOptions } from "../../scripts/dropdown.js";
import { createCompanyCard, createCompanySelectOption, renderAllCards } from "../../scripts/render.js";
import { getAllCompanies, getAllSectors } from "../../scripts/requests.js";

const companies = await getAllCompanies();

const sectors = await getAllSectors();

sectors.unshift({description: "Todos"}); 

toggleOptions();

renderAllCards(companies, ".organizations-list", createCompanyCard);

renderAllCards(sectors, ".sectors", createCompanySelectOption);

showSelect();

function showSelect () {
  const select = document.querySelector(".select-sectors");

  const sectorsList = document.querySelector(".sectors");

  select.addEventListener("click", () => {
    if (sectorsList.classList.contains("d-none")) {
      sectorsList.classList.remove("d-none");
    }
  });

  select.addEventListener("mouseleave", () => {
    sectorsList.addEventListener("mouseleave", () => {
      sectorsList.classList.add("d-none");
    });
  });
}
