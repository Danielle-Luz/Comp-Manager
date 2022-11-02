import { createHiredModal, deleteDepartmentModal, deleteUserModal, editDepartmentModal, editUserModal } from "./modals.js";
import { createToast } from "./popups.js";
import { fireUser, getAllCompanies, getAllCompaniesBySector, getAllDepartments, getAllUsers, getCompanySectors, getCoworkers, getNotHiredUsers, getUserInfo } from "./requests.js";

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
    <span class="text-4">${professional_level || ""}</span>
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

export async function renderSectorsBySelectedCompany () {
  const select = document.getElementById("company-names");
  
  select.addEventListener("input", async () => await renderByOption () );

  select.value = "Selecionar empresa";

  await renderByOption();
}

function createSectorCard ({uuid, name, description, companies:{name:companyName}}) {
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

  buttonEye.addEventListener("click", () => {
    createHiredModal(name, description, uuid, companyName);
  });

  buttonEdit.addEventListener("click", () => {
    editDepartmentModal(description, uuid);
  });

  buttonDelete.addEventListener("click", () => {
    deleteDepartmentModal(uuid, name);

    const companyList = document.getElementById("company-list");

    if (companyList.querySelector(".organization-card") == null) {
      companyList.innerHTML = `
      <div class="align-center d-flex justify-center full-height full-width">
        <h2 class="title-1">Nenhum departamento cadastrado.</h2>
      </div>`;
    }
  });

  buttonGroup.append(buttonEye, buttonEdit, buttonDelete);

  card.append(sectorNameTitle, descriptionSpan, companyNameSpan, buttonGroup);

  return card;
}

export async function renderByOption () {
  const select = document.getElementById("company-names");

  const company = select.value;
  
  const selectedOption = select.options[select.selectedIndex];

  const id = selectedOption.getAttribute("data-id");

  let sectors;
  if (company == "Selecionar empresa") {
    sectors = await getAllDepartments();
  } else {
    sectors = await getCompanySectors(id);
  }

  window.addEventListener("resize", () => {
    const companyList = document.getElementById("company-list");
    const usersList = document.getElementById("users-list");

    if(window.matchMedia("(min-width: 1160px)").matches && companyList.querySelector(".organization-card") != null) {
      companyList.classList.remove("align-center");
      usersList.classList.remove("align-center");
    } else {
      companyList.classList.add("align-center");
      usersList.classList.add("align-center");
    }
  })

  renderAllCards(sectors, "#company-list", createSectorCard);

  if (sectors.length == 0) {
    const companyList = document.getElementById("company-list");

    companyList.innerHTML = `
    <div class="align-center d-flex justify-center full-height full-width">
      <h2 class="title-1">Nenhum departamento cadastrado.</h2>
    </div>`;
  }
}

export async function setUserInfo () {
  const userInfo = await getUserInfo();

  const username = document.getElementById("username");
  const email = document.getElementById("user-email");
  const professionalLevel = document.getElementById("user-level");
  const typeOfWork = document.getElementById("user-work");

  username.innerText = userInfo.username;
  email.innerText = userInfo.email;
  professionalLevel.innerText = userInfo.professional_level || "";
  typeOfWork.innerText = userInfo.kind_of_work || "";
}

export function createUserCard ({uuid, username, professional_level, kind_of_work, department_name}) {
  const card = document.createElement("li");
  const usernameTitle = document.createElement("h3");
  const levelSpan = document.createElement("span");
  const departmentSpan = document.createElement("span");
  const buttonGroup = document.createElement("div");
  const buttonEdit = document.createElement("button");
  const buttonEditIcon = document.createElement("img");
  const buttonDelete = document.createElement("button");
  const buttonDeleteIcon = document.createElement("img");

  card.classList = "d-flex flex-column full-width organization-card";
  usernameTitle.classList = "title-4";
  levelSpan.classList = "text-4";
  departmentSpan.classList = "text-4";
  buttonGroup.classList = "d-flex full-width justify-center button-group";
  buttonEdit.classList = "button-icon";
  buttonDelete.classList = "button-icon";

  buttonEdit.setAttribute("aria-label", "editar usuário")
  buttonDelete.setAttribute("aria-label", "deletar usuário")

  usernameTitle.innerText = username;
  levelSpan.innerText = professional_level;
  departmentSpan.innerText = department_name || "";
  
  card.setAttribute("data-id", uuid);

  buttonEditIcon.src = "../../assets/imgs/purple-pencil.svg";
  buttonDeleteIcon.src = "../../assets/imgs/black-trash.svg";
  
  buttonEditIcon.alt = "ícone de lápis roxo";
  buttonDeleteIcon.alt = "ícone de lixeira preta";

  buttonEdit.appendChild(buttonEditIcon);
  buttonDelete.appendChild(buttonDeleteIcon);

  buttonEdit.addEventListener("click", () => {
    editUserModal(professional_level, kind_of_work, uuid);
  });

  buttonDelete.addEventListener("click", () => {
    deleteUserModal(uuid, username);
    
    const usersList = document.getElementById("users-list");

    if (usersList.querySelector(".organization-card") == null) {
    
      usersList.innerHTML = `
      <div class="align-center d-flex justify-center full-height full-width">
        <h2 class="title-1">Nenhum usuário cadastrado.</h2>
      </div>`;
    }
  });

  buttonGroup.append(buttonEdit, buttonDelete);

  card.append(usernameTitle, levelSpan, departmentSpan, buttonGroup);

  return card;
}

export function createHiredCard ({uuid, username, professional_level, company_name, department_uuid: id_before}) {
  const card = document.createElement("li");
  const usernameTitle = document.createElement("h3");
  const levelSpan = document.createElement("span");
  const companySpan = document.createElement("span");
  const buttonGroup = document.createElement("div");
  const buttonFire = document.createElement("button");
  
  card.classList = "d-flex flex-column full-width organization-card";
  usernameTitle.classList = "title-4";
  levelSpan.classList = "text-4";
  companySpan.classList = "text-4";
  buttonGroup.classList = "d-flex full-width justify-center button-group";
  buttonFire.classList = "button button-outline";
  
  usernameTitle.innerText = username;
  levelSpan.innerText = professional_level;
  companySpan.innerText = company_name;
  buttonFire.innerText = "Desligar";

  buttonFire.setAttribute("type", "button");
  
  buttonFire.addEventListener("click", async () => {
    const response = await fireUser(uuid);
    let toast;
    
    if (response.ok) {
      const notHiredSection = document.querySelector(".hired-section");
      const selectNotHired = document.getElementById("select-not-hired");
      const companyName = document.getElementById("company-name").innerText;

      const notHiredUsers = await getNotHiredUsers();

      let employees = await getAllUsers();
      
      employees = employees.filter(({department_uuid}) => department_uuid == id_before);
      employees = employees.map(employee => {
        return {
          ...employee, 
          company_name: companyName
        }
      });

      toast = createToast("Funcionário demitido com sucesso", "sucess");
      
      renderAllCards(employees, ".hired-section", createHiredCard);

      selectNotHired.innerHTML = "";

      notHiredUsers.forEach( ({username, uuid}) => {
        selectNotHired.insertAdjacentHTML("beforeend", `<option data-id=${uuid}>${username}</option>`);
      });

      if (notHiredSection.querySelector(".organization-card") == null) {
        notHiredSection.insertAdjacentHTML("beforeend", `
        <div class="align-center d-flex full-height full-width justify-center">
          <h3 class="title-4">Nenhum funcionário contratado</h3>
        </div>
        `);
      }
    } else {
      toast = createToast("Não foi possível demitir o funcionário", "alert");
    }

    document.body.insertAdjacentElement("afterbegin", toast);
    
    setTimeout(() => {
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 5000);
  });
  
  buttonGroup.append(buttonFire);
  
  card.append(usernameTitle, levelSpan, companySpan, buttonGroup);
  
  return card;
}

export function removeModalWithAnimation (modalClass) {
  const modal = document.querySelector(modalClass);

  const modalWrapper = document.querySelector(".modal-wrapper");

  modal.style.animationName = "drop-reverse";

  modalWrapper.style.animationName = "hide";

  modal.addEventListener("animationend", () => {
    modalWrapper.remove();
  });
}