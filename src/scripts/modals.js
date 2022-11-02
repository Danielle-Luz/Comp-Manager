import { createDepartment, deleteDepartment, editDepartment, editLoggedUser, editUser, getAllCompanies } from "./requests.js";
import { createToast } from "./popups.js";
import { renderByOption, setUserInfo } from "./render.js";

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
  
        document.body.removeChild(document.querySelector(".modal-wrapper"));
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
  
        document.body.removeChild(document.querySelector(".modal-wrapper"));
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
  
        document.body.removeChild(document.querySelector(".modal-wrapper"));
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
  
        document.body.removeChild(document.querySelector(".modal-wrapper"));
      }, 500);
    }, 5000);
  });

  modalContentContainer.append(modalTitle, deleteButton);

  createModal(modalContentContainer);
}


export async function editUserModal (professional_level, kind_of_work) {
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
      toast = createToast("Usuário editado com sucesso", "sucess");

      await renderByOption();
    } else {
      toast = createToast("Não foi possível editar o usuário", "alert");
    }

    document.body.insertAdjacentElement("afterbegin", toast);
    
    setTimeout(() => {
      setTimeout(() => {
        toast.remove();
  
        document.body.removeChild(document.querySelector(".modal-wrapper"));
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

export async function deleteUserModal (id, name) {
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
  
        document.body.removeChild(document.querySelector(".modal-wrapper"));
      }, 500);
    }, 5000);
  });

  modalContentContainer.append(modalTitle, deleteButton);

  createModal(modalContentContainer);
}



