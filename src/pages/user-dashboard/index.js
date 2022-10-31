import { getUserInfo, redirectUser, verifyUserLevel } from "../../scripts/requests.js";

redirectUser();

await verifyUserLevel(false);

await setUserInfo();

async function setUserInfo () {
  const userInfo = await getUserInfo();

  const email = document.getElementById("user-email");
  const professionalLevel = document.getElementById("user-level");
  const typeOfWork = document.getElementById("user-work");

  email.innerText = userInfo.email;
  professionalLevel.innerText = userInfo.professional_level || "";
  typeOfWork.innerText = userInfo.kind_of_work || "";
}

