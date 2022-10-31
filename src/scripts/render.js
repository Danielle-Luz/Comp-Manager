import { getAllCompanies, getAllCompaniesBySector } from "./requests.js";

export function renderAllCards (list, containerId, createCardFunction) {
  const container = document.querySelector(containerId);

  container.innerHTML = "";

  list.forEach( data => {
    const card = createCardFunction(data);

    if (card.constructor === String) {
      container.insertAdjacentHTML("beforeend", card);
    } else {
      container.insertAdjacentElement("beforeend", card);
    }
  });
}

export function createCompanyCard ({name, opening_hours, sectors:{description}}) {
  const card = `
  <li class="d-flex flex-column full-width justify-between organization-card">
    <h3 class="title-4">${name}</h3>
    <div class="d-flex details flex-column">
      <span class="text-4">${opening_hours}</span>
      <span class="button-outline text-4">${description}</span>
    </div>
  </li>
  `;

  return card;
}

export function createCompanySelectOption ({description}) {
  const spanOption = document.createElement("span");

  spanOption.classList = "text-4";

  spanOption.innerText = description;

  spanOption.addEventListener("click", async () => {
    let companies = [];
    
    if (description != "Todos") {
      companies = await getAllCompaniesBySector(spanOption.innerText);
    } else {
      companies = await getAllCompanies();
    }

    renderAllCards(companies, ".organizations-list", createCompanyCard);
  });

  return spanOption;
}
