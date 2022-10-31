export function createToast (message, type) {
  const articleToast = document.createElement("article");
  const articleMessage = document.createElement("p");

  articleToast.classList = `full-width toast toast-${type}`;
  articleMessage.classList = "text-4";

  articleMessage.innerHTML = message;

  articleToast.appendChild(articleMessage);

  return articleToast;
}