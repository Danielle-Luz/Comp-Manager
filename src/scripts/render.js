import { getAllCompanies, getAllCompaniesBySector, getCoworkers, getUserInfo } from "./requests.js";

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

export function createCoworkCard({username, professional_level}) {
  const coworkerCard = `
  <li class="card-employee d-flex flex-column">
    <h3 class="title-5">${username}</h3>
    <span class="text-4">${professional_level}</span>
  </li>
  `;

  return coworkerCard;
}

export async function setCoworkers () {
  const userInfo = await getUserInfo();
  const {department_uuid} = userInfo;
  
  const companyInfoContainer = document.querySelector(".company-info");

  if (!department_uuid) {
    const noJobMessage = `
    <div class="align-center cards-container d-flex justify-center message-wrapper">
      <h2 class="title-1">Você ainda não foi contratado</h2>
    </div>
    `;

    companyInfoContainer.innerHTML = noJobMessage;
  } else {
    const departmentInfo = await getCoworkers();
    const {name, users, company_uuid} = departmentInfo[0];
    const companyName = await getCompanyNameById(company_uuid);

    const wrapperDiv = document.createElement("div");
    const title = document.createElement("h1");
    const employeesList = document.createElement("ul");

    title.classList = "cards-title title-3";
    employeesList.classList = "align-center cards-container d-flex flex-column fit-height";

    title.innerText = `${companyName} - ${name}`;

    employeesList.id = "employees-list";

    wrapperDiv.append(title, employeesList);

    companyInfoContainer.innerHTML = "";

    companyInfoContainer.appendChild(wrapperDiv);

    renderAllCards(users, "#employees-list", createCoworkCard);
  }
}

async function getCompanyNameById (searchedId) {
  const companies = await getAllCompanies();

  const {name} = companies.find( ({uuid}) => uuid == searchedId);

  return name;
}

export function createDefaultSelectOption ({name, uuid}) {
  const option = document.createElement("option");

  option.innerText = name;

  option.setAttribute("data-id", uuid);

  return option;
}

export function renderSectorsBySelectedCompany () {
  const select = document.getElementById("company-names");
  
  select.addEventListener("input", async () => {
    const options = [...select.querySelectorAll("option")];

    const company = select.value;
    
    const selectedOption = options.find( option => option.innerText == company);

    const id = selectedOption.getAttribute("data-id");

    let sectors;
    if (company == "Selecionar empresa") {
      sectors = await getAllCompanies();

    } else {
      sectors = await getCompanySectors(id);
    }

    renderAllCards(sectors, "#company-list", createSectorCard);
  });
}

function createSectorCard ({uuid, name, description}, companyName) {
  const card = document.createElement("li");
  const sectorNameTitle = document.createElement("h3");
  const descriptionSpan = document.createElement("span");
  const companyNameSpan = document.createElement("span");
  const buttonGroup = document.createElement("div");
  const buttonEye = document.createElement("button");
  const buttonEyeIcon = document.createElement("img");
  const buttonEdit = document.createElement("button");
  const buttonEditIcon = document.createElement("img");
  const buttonDelete = document.createElement("button");
  const buttonDeleteIcon = document.createElement("img");

  card.classList = "d-flex flex-column full-width organization-card";
  sectorNameTitle.classList = "title-4";
  descriptionSpan.classList = "text-4";
  companyNameSpan.classList = "text-4";
  buttonGroup.classList = "d-flex full-width justify-center button-group";
  buttonEye.classList = "button-icon";
  buttonEdit.classList = "button-icon";
  buttonDelete.classList = "button-icon";

  buttonEye.setAttribute("aria-label", "visualizar informações sobre o departamento")
  buttonEdit.setAttribute("aria-label", "editar departamento")
  buttonDelete.setAttribute("aria-label", "deletar departamento")
  
  sectorNameTitle.innerText = name;
  descriptionSpan.innerText = description;
  companyNameSpan.innerText = companyName;
  
  card.setAttribute("data-id", uuid);

  buttonEyeIcon.src = "../../assets/imgs/eye.svg";
  buttonEditIcon.src = "../../assets/imgs/black-pencil.svg";
  buttonDeleteIcon.src = "../../assets/imgs/black-trash.svg";
  
  buttonEyeIcon.alt = "ícone de olho";
  buttonEditIcon.alt = "ícone de lápis preto";
  buttonDeleteIcon.alt = "ícone de lixeira preta";

  buttonEye.appendChild(buttonEyeIcon);
  buttonEdit.appendChild(buttonEditIcon);
  buttonDelete.appendChild(buttonDeleteIcon);

  buttonGroup.append(buttonEye, buttonEdit, buttonDelete);

  card.append(sectorNameTitle, descriptionSpan, companyNameSpan, buttonGroup);

  return card;
}