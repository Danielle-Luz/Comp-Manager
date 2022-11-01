export async function createModal (modalContent) {
  const modalWrapper = document.createElement("div");
  const modal = document.createElement("article");
  const closeButton = document.createElement("button");
  const buttonIcon = document.createElement("img");

  modalWrapper.classList = "align-center d-flex full-width full-height justify-center modal-wrapper";
  modal.classList = "align-center d-flex flex-column justify-center modal";
  button.classList = "close-modal self-end";
  buttonIcon.classList = "button-icon";

  button.setAttribute("aria-label", "fechar modal");

  buttonIcon.src = "../../assets/imgs/close.svg";
  buttonIcon.alt = "desenho de 'x'";

  closeButton.appendChild(buttonIcon);

  closeButton.addEventListener("click", () => {
    modalWrapper.remove();
  });

  modal.append(closeButton, modalContent);

  modalWrapper.appendChild(modal);

  document.body.appendChild(modalWrapper);
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

  modalContentContainer.addEventListener("submit", () => {
    const fields = document.querySelectorAll("input");

    const data = {};

    fields.forEach(({name, value}) => {
      if (value) {
        data = {
          ...data,
          [name]: value
        }
      } 
    })

    
  });

  modalContentContainer.append(modalTitle, inputUsername, inputEmail, inputPassword, editButton);
}
<div class="align-center d-flex full-width full-height justify-center modal-wrapper">
      <article class="align-center d-flex flex-column justify-center modal">
        <button class="close-modal self-end" aria-label="fechar modal">
          <img class="button-icon" src="../../assets/imgs/close.svg" alt="desenho de 'x'">
        </button>
        <article class="d-flex flex-column modal-content full-width form-1">
          <h2 class="title-1">Editar Usuário</h2>
          <input class="full-width input-1" placeholder="Username">
          <input class="full-width input-1" placeholder="Email">
          <input class="full-width input-1" placeholder="Senha">
          <button class="button button-brand">Editar</button>
        </article>
      </article>
    </div>