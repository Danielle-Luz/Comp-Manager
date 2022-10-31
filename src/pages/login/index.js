import { getFormData } from "../../scripts/forms.js";
import { clearStoredData, login } from "../../scripts/requests.js";

clearStoredData();

getFormData("login", login);