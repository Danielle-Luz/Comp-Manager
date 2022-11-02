import { createDepartment, deleteDepartment, deleteUser, editDepartment, editLoggedUser, editUser, getAllCompanies, getAllUsers, getNotHiredUsers, hireUser } from "./requests.js";
import { createToast } from "./popups.js";
import { createHiredCard, createUserCard, renderAllCards, renderByOption, setUserInfo } from "./render.js";

export async function createModal (modalContent) {
  const modalWrapper = document.createElement("div");
  const modal = document.createElement("article");
  const closeButton = document.createElement("button");
  const buttonIcon = document.createElement("img");

  modalWrapper.classList = "align-center d-flex full-width full-height justify-center modal-wrapper";
  modal.classList = "align-center d-flex flex-column justify-center modal";
  closeButton.classList = "close-modal self-end";
  buttonIcon.classList = "button-icon";

  closeButton.setAttribute("aria-label", "fechar modal");

  buttonIcon.src = "../../assets/imgs/close.svg";
  buttonIcon.alt = "desenho de 'x'";

  closeButton.appendChild(buttonIcon);

  closeButton.addEventListener("click", () => {
    modalWrapper.remove();
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

  notHiredUsers.forEach( ({username, uuid}) => {
    selectUser.insertAdjacentHTML("beforeend", `<option data-id=${uuid}>${username}</option>`);
  });

  modalTitle.innerText = departmentName;
  descriptionTitle.innerText = departmentDescription;
  companyParagraph = companyName;

  modalWrapper.classList = "align-center d-flex full-width full-height justify-center modal-wrapper";
  modal.classList = "align-center d-flex flex-column full-width full-height justify-center modal-2";
  closeButton.classList = "close-modal self-end";
  buttonIcon.classList = "button-icon";

  modalContentContainer.classList = "d-flex flex-column modal-content full-width form-1";
  modalTitle.classList = "title-1";
  modalText.classList = "align-center d-flex flex-column full-width modal-text justify-between";
  descriptionTitle.classList = "title-4";
  companyParagraph.classList = "text-4";
  selectWrapper.classList = "align-end d-flex flex-column form-group full-width";
  selectUser.classList = "full-width input-1";
  hireButton.classList = "button button-sucess fit-width self-end";
  usersSection.classList = "d-flex hired-section";

  closeButton.setAttribute("aria-label", "fechar modal");
  selectUser.setAttribute("required", "true");
  selectUser.setAttribute("name", "user_uuid");

  buttonIcon.src = "../../assets/imgs/close.svg";
  buttonIcon.alt = "desenho de 'x'";

  closeButton.appendChild(buttonIcon);

  closeButton.addEventListener("click", () => {
    modalWrapper.remove();
  });

  selectWrapper.addEventListener("submit", async event => {
    event.preventDefault();

    const selectedOption = selectUser.options[selectUser.selectedIndex];
    const userId = selectedOption.getAttribute("data-id");

    const response = await hireUser(userId, departmentId);
    let toast;

    if (response.ok) {
      let employees = await getAllUsers();
      employees = employees.filter(({department_uuid}) => department_uuid == departmentId);
  
      toast = createToast("Funcionário contratado com sucesso", "sucess");

      selectUser.options.remove(selectUser.selectedIndex);

      renderAllCards(employees, ".hired-section", createHiredCard)
    } else {
      toast = createToast("Não foi possível contratar o funcionário", "alert");
    }

    document.body.insertAdjacentElement("afterbegin", toast);
    
    setTimeout(() => {
      setTimeout(() => {
        toast.remove();
  
        if (document.querySelector(".modal-wrapper")) {
          document.body.removeChild(document.querySelector(".modal-wrapper"));
        }
      }, 500);
    }, 5000);
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

  renderAllCards(employees, ".hired-section", createHiredCard);
}

export async function editLoggetUserModal ({username, email}) {
  const modalContentContainer = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const inputUsername = document.createElement("input");
  const inputEmail = document.createElement("input");
  const inputPassword = document.createElement("input");
  const editButton = document.createElement("button");

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

    fields.forEach(({name, value}) => {
      if (value) {
        data = {
          ...data,
          [name]: value
        }
      } 
    })

    const response = await editLoggedUser(data);
    let toast;

    if (response.ok) {
      toast = createToast("Usuário editado com sucesso", "sucess");

      await setUserInfo();
    } else {
      toast = createToast("Dados já pertencentes a outro usuário", "alert");
    }

    document.body.insertAdjacentElement("afterbegin", toast);
    
    setTimeout(() => {
      setTimeout(() => {
        toast.remove();
  
        if (document.querySelector(".modal-wrapper")) {
          document.body.removeChild(document.querySelector(".modal-wrapper"));
        }
      }, 500);
    }, 5000);
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
  const editButton = document.createElement("button");

  modalContentContainer.classList = "d-flex flex-column modal-content full-width form-1";
  modalTitle.classList = "title-1";
  inputDescription.classList = "full-width input-1";
  inputName.classList = "full-width input-1";
  selectCompany.classList = "full-width input-1";
  editButton.classList = "button button-brand";

  modalTitle.innerText = "Criar departamento";
  editButton.innerText = "Editar";

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

    const response = await createDepartment(data);
    let toast;

    if (response.ok) {
      toast = createToast("Departamento criado com sucesso", "sucess");

      await renderByOption();
    } else {
      toast = createToast("O departamento já pertence a essa empresa", "alert");
    }

    document.body.insertAdjacentElement("afterbegin", toast);
    
    setTimeout(() => {
      setTimeout(() => {
        toast.remove();
  
        if (document.querySelector(".modal-wrapper")) {
          document.body.removeChild(document.querySelector(".modal-wrapper"));
        }
      }, 500);
    }, 5000);
  });

  modalContentContainer.append(modalTitle, inputName, inputDescription, selectCompany, editButton);

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
    } else {
      toast = createToast("Não foi possível editar o departamento", "alert");
    }

    document.body.insertAdjacentElement("afterbegin", toast);
    
    setTimeout(() => {
      setTimeout(() => {
        toast.remove();
  
        if (document.querySelector(".modal-wrapper")) {
          document.body.removeChild(document.querySelector(".modal-wrapper"));
        }
      }, 500);
    }, 5000);
  });

  modalContentContainer.append(modalTitle, textareaDescription, editButton);

  createModal(modalContentContainer);
}

export async function deleteDepartmentModal (id, name) {
  const modalContentContainer = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const deleteButton = document.createElement("button");

  modalContentContainer.classList = "align-start d-flex flex-column modal-content full-width form-1";
  modalTitle.classList = "title-3";
  deleteButton.classList = "button button-brand full-width toast-sucess";

  modalTitle.innerText = `Realmente deseja deletar o departamento ${name} e demitir seus funcionários?`;
  deleteButton.innerText = "Confirmar";

  modalContentContainer.addEventListener("submit", async event => {
    event.preventDefault();

    const response = await deleteDepartment(id);

    let toast;

    if (response.ok) {
      toast = createToast("Departamento excluído com sucesso", "sucess");

      await renderByOption();
    } else {
      toast = createToast("Não foi possível excluir o departamento", "alert");
    }

    document.body.insertAdjacentElement("afterbegin", toast);
    
    setTimeout(() => {
      setTimeout(() => {
        toast.remove();
  
        if (document.querySelector(".modal-wrapper")) {
          document.body.removeChild(document.querySelector(".modal-wrapper"));
        }
      }, 500);
    }, 5000);
  });

  modalContentContainer.append(modalTitle, deleteButton);

  createModal(modalContentContainer);
}

export async function editUserModal (professional_level, kind_of_work, id) {
  const modalContentContainer = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const selectWork = document.createElement("select");
  const selectLevel = document.createElement("select");
  const editButton = document.createElement("button");

  const typeOfWork = ["home office", "presencial", "hibrido"];
  const levels = ["estágio", "júnior", "pleno", "sênior"];

  createSelectOptions(selectWork, typeOfWork);
  createSelectOptions(selectLevel, levels);

  modalContentContainer.classList = "align-start d-flex flex-column modal-content full-width form-1";
  modalTitle.classList = "title-1";
  selectWork.classList = "full-width input-1 text-4";
  selectLevel.classList = "full-width input-1 text-4";
  editButton.classList = "button button-brand full-width";

  modalTitle.innerText = "Editar Usuário";
  editButton.innerText = "Editar";

  selectWork.selectedIndex = typeOfWork.findIndex( work => work == kind_of_work);

  selectLevel.selectedIndex = levels.findIndex( level => level == professional_level);

  selectWork.name = "kind_of_work";

  selectLevel.name = "professional_level";

  selectWork.setAttribute("required", "true");

  selectLevel.setAttribute("required", "true");

  modalContentContainer.addEventListener("submit", async event => {
    event.preventDefault();

    const selects = modalContentContainer.querySelectorAll("select");

    let data = {};

    selects.forEach( ({name, value}) => {
      data = {
        ...data,
        [name]: value
      }
    });

    const response = await editUser(id, data);
    let toast;

    if (response.ok) {
      const users = await getAllUsers();

      toast = createToast("Usuário editado com sucesso", "sucess");

      renderAllCards(users, "#users-list", createUserCard);
    } else {
      toast = createToast("Não foi possível editar o usuário", "alert");
    }

    document.body.insertAdjacentElement("afterbegin", toast);
    
    setTimeout(() => {
      setTimeout(() => {
        toast.remove();
  
        if (document.querySelector(".modal-wrapper")) {
          document.body.removeChild(document.querySelector(".modal-wrapper"));
        }
      }, 500);
    }, 5000);
  });

  modalContentContainer.append(modalTitle, selectWork, selectLevel, editButton);

  createModal(modalContentContainer);
}

function createSelectOptions (select, list) {
  list.forEach( info => {
    const option = `<option value="${info}">${info}</option>`;

    select.insertAdjacentHTML("beforeend", option);
  });
}

export async function deleteUserModal (id, username) {
  const modalContentContainer = document.createElement("form");
  const modalTitle = document.createElement("h2");
  const deleteButton = document.createElement("button");

  modalContentContainer.classList = "align-start d-flex flex-column modal-content full-width form-1";
  modalTitle.classList = "title-3";
  deleteButton.classList = "button button-brand full-width toast-sucess";

  modalTitle.innerText = `Realmente deseja deletar o usuário ${username}?`;
  deleteButton.innerText = "Confirmar";

  modalContentContainer.addEventListener("submit", async event => {
    event.preventDefault();

    const response = await deleteUser(id);

    let toast;

    if (response.ok) {
      const users = await getAllUsers();
      
      toast = createToast("Usuário excluído com sucesso", "sucess");

      renderAllCards(users, "#users-list", createUserCard);
    } else {
      toast = createToast("Não foi possível excluir o usuário", "alert");
    }

    document.body.insertAdjacentElement("afterbegin", toast);
    
    setTimeout(() => {
      setTimeout(() => {
        toast.remove();
  
        if (document.querySelector(".modal-wrapper")) {
          document.body.removeChild(document.querySelector(".modal-wrapper"));
        }
      }, 500);
    }, 5000);
  });

  modalContentContainer.append(modalTitle, deleteButton);

  createModal(modalContentContainer);
}



