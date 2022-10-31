import { getFormData } from "../../scripts/forms.js";
import { clearToken, createUser } from "../../scripts/requests.js";

clearToken();

getFormData("signup", createUser);