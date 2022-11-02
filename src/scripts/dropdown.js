export function toggleOptions () {
  const hamburguerButton = document.querySelector(".header-content .button-icon");
  const options = document.getElementById("options-header");

  hamburguerButton.addEventListener("click", () => {
    options.classList.toggle("d-none");
  });
}