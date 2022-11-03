import { createDepartment, deleteDepartment, deleteUser, editDepartment, editLoggedUser, editUser, getAllCompanies, getAllUsers, getNotHiredUsers, hireUser } from "./requests.js";
import { createToast } from "./popups.js";
import { createHiredCard, createUserCard, hideToast, removeModalWithAnimation, renderAllCards, renderByOption, setUserInfo } from "./render.js";

export async function createModal (modalContent) {
  const modalWrapper = document.createElement("div");
  const modal = document.createElement("article");
  const closeButton = document.createElement("button");
  const buttonIcon = document.createElement("img");

  modalWrapper.classList = "align-center d-flex full-width full-height justify-center modal-wrapper";
  modal.classList = "align-center d-flex flex-column full-width justify-center modal";
  closeButton.classList = "close-modal self-end";
  buttonIcon.classList = "button-icon";

  closeButton.setAttribute("aria-label", "fechar modal");

  buttonIcon.src = "../../assets/imgs/close.svg";
  buttonIcon.alt = "desenho de 'x'";

  closeButton.appendChild(buttonIcon);

  closeButton.addEventListener("click", () => {
    removeModalWithAnimation(".modal");
  });

  modal.append(closeButton, modalContent);

  modalWrapper.appendChild(modal);

  document.body.insertAdjacentElement("afterbegin", modalWrapper);
}

export async function createHiredModal (departmentName, departmentDescription, departmentId, companyName) {
  const modalWrapper = document.createElement("div");
  const modal = document.createElement("article");
  const closeButton = document.createElement("button");
  const buttonIcon = document.createElement("img");

  const modalContentContainer = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const modalText = document.createElement("div");
  const modalInfo = document.createElement("div");
  const descriptionTitle = document.createElement("h3");
  const companyParagraph = document.createElement("p");
  const selectWrapper = document.createElement("form");
  const selectUser = document.createElement("select");
  const hireButton = document.createElement("button");
  const usersSection = document.createElement("section");

  const notHiredUsers = await getNotHiredUsers();

  notHiredUsers.unshift({username: "Selecionar usuário", uuid: null});

  notHiredUsers.forEach( ({username, uuid}) => {
    selectUser.insertAdjacentHTML("beforeend", `<option data-id=${uuid}>${username}</option>`);
  });

  modalTitle.innerText = departmentName;
  descriptionTitle.innerText = departmentDescription;
  companyParagraph.innerText = companyName;
  hireButton.innerText = "Contratar";

  modalWrapper.classList = "align-center d-flex full-width full-height justify-center modal-wrapper";
  modal.classList = "align-center d-flex flex-column full-width full-height justify-center modal-2";
  closeButton.classList = "close-modal self-end";
  buttonIcon.classList = "button-icon";

  modalContentContainer.classList = "d-flex flex-column modal-content-2 full-width form-1 full-width";
  modalTitle.classList = "title-1";
  modalText.classList = "align-center d-flex flex-column full-width modal-text justify-between";
  descriptionTitle.classList = "title-4";
  companyParagraph.classList = "text-4";
  selectWrapper.classList = "align-end d-flex flex-column form-group full-width";
  selectUser.classList = "full-width input-1";
  hireButton.classList = "button button-sucess full-width self-end";
  usersSection.classList = "d-flex hired-section";

  closeButton.setAttribute("aria-label", "fechar modal");
  selectUser.setAttribute("required", "true");
  selectUser.setAttribute("name", "user_uuid");
  selectUser.setAttribute("id", "select-not-hired");
  companyParagraph.setAttribute("id", "company-name");

  buttonIcon.src = "../../assets/imgs/close.svg";
  buttonIcon.alt = "desenho de 'x'";

  closeButton.appendChild(buttonIcon);

  closeButton.addEventListener("click", () => {
    removeModalWithAnimation(".modal-2");
  });

  selectWrapper.addEventListener("submit", async event => {
    event.preventDefault();

    const selectedOption = selectUser.options[selectUser.selectedIndex];

    if (selectedOption.innerText != "Selecionar usuário") {
      const userId = selectedOption.getAttribute("data-id");
  
      const response = await hireUser(userId, departmentId);
      let toast;
  
      if (response.ok) {
        let employees = await getAllUsers();
        employees = employees.filter(({department_uuid}) => department_uuid == departmentId);
        employees = employees.map(employee => {
          return {
            ...employee, 
            company_name: companyName
          }
        });
    
        toast = createToast("Funcionário contratado com sucesso", "sucess");
  
        selectUser.options.remove(selectUser.selectedIndex);
  
        renderAllCards(employees, ".hired-section", createHiredCard)
      } else {
        toast = createToast("Não foi possível contratar o funcionário", "alert");
      }
  
      document.body.insertAdjacentElement("afterbegin", toast);
      
      hideToast();
    }
  });

  modalInfo.append(descriptionTitle, companyParagraph);
  selectWrapper.append(selectUser, hireButton);
  modalText.append(modalInfo, selectWrapper);

  modalContentContainer.append(modalTitle, modalText, usersSection);

  modal.append(closeButton, modalContentContainer);

  modalWrapper.appendChild(modal);

  document.body.insertAdjacentElement("afterbegin", modalWrapper);

  let employees = await getAllUsers();
  employees = employees.filter(({department_uuid}) => department_uuid == departmentId);
  employees = employees.map(employee => {
    return {
      ...employee, 
      company_name: companyName
    }
  });

  renderAllCards(employees, ".hired-section", createHiredCard);

  if(employees.length == 0) {
    const notHiredSection = document.querySelector(".hired-section");
    
    notHiredSection.insertAdjacentHTML("beforeend", `
    <div class="align-center d-flex full-height full-width justify-center">
      <h3 class="title-4">Nenhum funcionário contratado</h3>
    </div>
    `);
  }
}

export async function editLoggetUserModal ({username, email}) {
  const modalContentContainer = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const inputUsername = document.createElement("input");
  const inputEmail = document.createElement("input");
  const inputPassword = document.createElement("input");
  const editButton = document.createElement("button");

  const oldValues = [username, email];

  modalContentContainer.classList = "d-flex flex-column modal-content full-width form-1";
  modalTitle.classList = "title-1";
  inputEmail.classList = "full-width input-1";
  inputUsername.classList = "full-width input-1";
  inputPassword.classList = "full-width input-1";
  editButton.classList = "button button-brand";

  modalTitle.innerText = "Editar Usuário";
  editButton.innerText = "Editar";

  inputUsername.placeholder = "Nome de usuário";
  inputEmail.placeholder = "Email";
  inputPassword.placeholder = "Senha";

  inputUsername.name = "username";
  inputEmail.name = "email";
  inputPassword.name = "password";

  inputUsername.value = username;
  inputEmail.value = email;

  modalContentContainer.addEventListener("submit", async event => {
    event.preventDefault();

    const fields = document.querySelectorAll("input");

    let data = {};

    fields.forEach(({name, value}, index) => {
      if (value && value != oldValues[index]) {
        data = {
          ...data,
          [name]: value
        }
      } 
    })

    if (Object.keys(data).length != 0) {
      const response = await editLoggedUser(data);
      let toast;
  
      if (response.ok) {
        toast = createToast("Usuário editado com sucesso", "sucess");
  
        await setUserInfo();
  
        removeModalWithAnimation(".modal");
      } else {
        toast = createToast("Dados já pertencentes a outro usuário", "alert");
      }
  
      document.body.insertAdjacentElement("afterbegin", toast);
      
      hideToast();
    }
  });

  modalContentContainer.append(modalTitle, inputUsername, inputEmail, inputPassword, editButton);

  createModal(modalContentContainer);
}

export async function createCompanyModal () {
  const modalContentContainer = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const inputName = document.createElement("input");
  const inputDescription = document.createElement("input");
  const selectCompany = document.createElement("select");
  const createButton = document.createElement("button");

  modalContentContainer.classList = "d-flex flex-column modal-content full-width form-1";
  modalTitle.classList = "title-1";
  inputDescription.classList = "full-width input-1";
  inputName.classList = "full-width input-1";
  selectCompany.classList = "full-width input-1";
  createButton.classList = "button button-brand";

  modalTitle.innerText = "Criar departamento";
  createButton.innerText = "Criar o departamento";

  inputName.placeholder = "Nome do departamento";
  inputDescription.placeholder = "Descrição";
  selectCompany.insertAdjacentHTML("afterbegin", "<option disabled selected>Selecionar empresa</option>");

  inputName.name = "name";
  inputDescription.name = "description";
  selectCompany.name = "company_uuid";

  inputName.setAttribute("required", "true");
  inputDescription.setAttribute("required", "true");
  selectCompany.setAttribute("required", "true");

  const companies = await getAllCompanies();

  companies.forEach(({name, uuid}) => {
    selectCompany.insertAdjacentHTML("beforeend", `<option value="${name}" data-id="${uuid}">${name}</option>`);
  });

  modalContentContainer.addEventListener("submit", async event => {
    event.preventDefault();

    const fields = modalContentContainer.querySelectorAll("input, select");

    let data = {};

    fields.forEach((field) => {
      const {name, value} = field;

      if (name != "company_uuid") {
        data = {
          ...data,
          [name]: value
        }
      } else {
        const selectedOption = field.options[field.selectedIndex];

        const companyId = selectedOption.getAttribute("data-id");

        data = {
          ...data,
          [name]: companyId
        }
      }
    })

    if (data.company_uuid) {
      const response = await createDepartment(data);
      let toast;
  
      if (response.ok) {
        toast = createToast("Departamento criado com sucesso", "sucess");
  
        await renderByOption();
  
        removeModalWithAnimation(".modal");
      } else {
        toast = createToast("O departamento já pertence a essa empresa", "alert");
      }
  
      document.body.insertAdjacentElement("afterbegin", toast);
      
      hideToast();
    }
  });

  modalContentContainer.append(modalTitle, inputName, inputDescription, selectCompany, createButton);

  createModal(modalContentContainer);
}

export async function editDepartmentModal (description, id) {
  const modalContentContainer = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const textareaDescription = document.createElement("textarea");
  const editButton = document.createElement("button");

  modalContentContainer.classList = "align-start d-flex flex-column modal-content full-width form-1";
  modalTitle.classList = "title-1";
  textareaDescription.classList = "full-width input-1 text-4";
  editButton.classList = "button button-brand full-width";

  modalTitle.innerText = "Editar departamento";
  editButton.innerText = "Editar";

  textareaDescription.value = description;

  textareaDescription.name = "description";

  textareaDescription.setAttribute("required", "true");

  modalContentContainer.addEventListener("submit", async event => {
    event.preventDefault();

    const { name, value } = modalContentContainer.querySelector("textarea");

    let data = { [name]: value };

    const response = await editDepartment(data, id);
    let toast;

    if (response.ok) {
      toast = createToast("Departamento editado com sucesso", "sucess");

      await renderByOption();

      removeModalWithAnimation(".modal");
    } else {
      toast = createToast("Não foi possível editar o departamento", "alert");
    }

    document.body.insertAdjacentElement("afterbegin", toast);
    
    hideToast();
  });

  modalContentContainer.append(modalTitle, textareaDescription, editButton);

  createModal(modalContentContainer);
}

export async function deleteDepartmentModal (id, name) {
  const modalContentContainer = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const deleteButton = document.createElement("button");

  modalContentContainer.classList = "align-start d-flex flex-column modal-content full-width form-1 fit-content";
  modalTitle.classList = "title-3";
  deleteButton.classList = "button button-sucess full-width";

  modalTitle.innerText = `Realmente deseja deletar o departamento ${name} e demitir seus funcionários?`;
  deleteButton.innerText = "Confirmar";

  modalContentContainer.addEventListener("submit", async event => {
    event.preventDefault();

    const response = await deleteDepartment(id);

    let toast;

    if (response.ok) {
      toast = createToast("Departamento excluído com sucesso", "sucess");

      await renderByOption();

      removeModalWithAnimation(".modal");
    } else {
      toast = createToast("Não foi possível excluir o departamento", "alert");
    }

    document.body.insertAdjacentElement("afterbegin", toast);
    
    hideToast();
  });

  modalContentContainer.append(modalTitle, deleteButton);

  createModal(modalContentContainer);

  document.querySelector(".modal").classList.add("modal-alert");
}

export async function editUserModal (professional_level, kind_of_work, id) {
  const modalContentContainer = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const selectWork = document.createElement("select");
  const selectLevel = document.createElement("select");
  const editButton = document.createElement("button");

  const typeOfWork = ["Selecionar modalidade de trabalho ", "home office", "presencial", "hibrido"];
  const levels = ["Selecionar nível profissional", "estágio", "júnior", "pleno", "sênior"];

  createSelectOptions(selectWork, typeOfWork);
  createSelectOptions(selectLevel, levels);

  modalContentContainer.classList = "align-start d-flex flex-column modal-content full-width form-1";
  modalTitle.classList = "title-1";
  selectWork.classList = "full-width input-1";
  selectLevel.classList = "full-width input-1";
  editButton.classList = "button button-brand full-width";

  modalTitle.innerText = "Editar Usuário";
  editButton.innerText = "Editar";

  selectWork.selectedIndex = typeOfWork.findIndex( work => work == kind_of_work) != -1 ? typeOfWork.findIndex( work => work == kind_of_work) != -1 : 0;
  selectLevel.selectedIndex = levels.findIndex( level => level == professional_level) != -1 ? levels.findIndex( level => level == professional_level) : 0;

  selectWork.name = "kind_of_work";

  selectLevel.name = "professional_level";

  modalContentContainer.addEventListener("submit", async event => {
    event.preventDefault();

    const selects = modalContentContainer.querySelectorAll("select");

    let data = {};

    selects.forEach( ({name, value}) => {
      if (value) {
        data = {
          ...data,
          [name]: value
        }
      }
    });
    let toast;

    if (Object.keys(data).length != 0) {
      const response = await editUser(id, data);
  
      if (response.ok) {
        const users = await getAllUsers();
  
        toast = createToast("Usuário editado com sucesso", "sucess");
  
        renderAllCards(users, "#users-list", createUserCard);
  
        removeModalWithAnimation(".modal");
      } else {
        toast = createToast("Não foi possível editar o usuário", "alert");
      }
  
    } else {
      toast = createToast("Selecione uma opção em pelo menos um campo", "alert");
    }
    
    document.body.insertAdjacentElement("afterbegin", toast);

    hideToast();
  });

  modalContentContainer.append(modalTitle, selectWork, selectLevel, editButton);

  createModal(modalContentContainer);

}

function createSelectOptions (select, list) {
  list.forEach( (info, index) => {
    const option = `<option value="${index != 0 ? info : ""}">${info}</option>`;

    select.insertAdjacentHTML("beforeend", option);
  });
}

export async function deleteUserModal (id, username) {
  const modalContentContainer = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const deleteButton = document.createElement("button");

  modalContentContainer.classList = "align-start d-flex flex-column modal-content full-width form-1 fit-content";
  modalTitle.classList = "title-3";
  deleteButton.classList = "button button-sucess full-width";

  modalTitle.innerText = `Realmente deseja deletar o usuário ${username}?`;
  deleteButton.innerText = "Confirmar";

  modalContentContainer.addEventListener("submit", async event => {
    event.preventDefault();

    const response = await deleteUser(id);

    let toast;

    if (response.ok) {
      const usersList = document.getElementById("users-list");
          
      const users = await getAllUsers();
      
      toast = createToast("Usuário excluído com sucesso", "sucess");
      
      removeModalWithAnimation(".modal");
      
      renderAllCards(users, "#users-list", createUserCard);

      if (usersList.querySelector(".organization-card") == null) {
        usersList.innerHTML = `
        <div class="align-center d-flex justify-center full-height full-width">
          <h2 class="title-1">Nenhum usuário cadastrado.</h2>
        </div>`;
      }
    } else {
      toast = createToast("Não foi possível excluir o usuário", "alert");
    }

    document.body.insertAdjacentElement("afterbegin", toast);
    
    hideToast();
  });

  modalContentContainer.append(modalTitle, deleteButton);

  createModal(modalContentContainer);

  document.querySelector(".modal").classList.add("modal-alert");
}



