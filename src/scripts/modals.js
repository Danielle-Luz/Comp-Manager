import { setUserInfo } from "../pages/user-dashboard/index.js";
import { editLoggedUser } from "./requests.js";
import { createToast } from "./popups.js";

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