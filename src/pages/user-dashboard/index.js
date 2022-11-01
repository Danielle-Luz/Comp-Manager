import { editLoggetUserModal } from "../../scripts/modals.js";
import { setCoworkers, setUserInfo } from "../../scripts/render.js";
import { getUserInfo } from "../../scripts/requests.js";


await setUserInfo();

await setCoworkers();

async function addEditUserEvent () {
  const editButton = document.getElementById("edit-user");
  
  editButton.addEventListener("click", async () => {
    const userInfo = await getUserInfo();

    await editLoggetUserModal(userInfo);
  })
}

addEditUserEvent();