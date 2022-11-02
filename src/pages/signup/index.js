import { toggleOptions } from "../../scripts/dropdown.js";
import { getFormData } from "../../scripts/forms.js";
import { clearStoredData, createUser } from "../../scripts/requests.js";

clearStoredData();

getFormData("signup", createUser);

toggleOptions();