export function createToast (message) {
  const articleToast = document.createElement("article");
  const articleMessage = document.createElement("p");

  articleToast.classList = "full-width toast toast-sucess";
  articleMessage.classList = "text-4";

  articleMessage.innerText = message;

  articleToast.appendChild(articleMessage);

  return articleToast;
}