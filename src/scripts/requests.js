import { createToast } from "./popups.js";
import { hideToast } from "./render.js";

const baseUrl = "http://localhost:6278";

export function clearStoredData () {
  if (localStorage.getItem("token")) {
    localStorage.removeItem("token");
  }
}

export async function redirectUser (level, folder) {
  if (!localStorage.getItem("token")) {
    window.location.replace("../homepage/index.html");
  } else {
    await verifyUserLevel (level, folder);
  }
}

async function verifyUserLevel (level, folder) {
 const isAdmin = (await getPermissionByToken(localStorage.getItem("token"))).is_admin;

 if (isAdmin != level) {
  window.location.replace(`../${folder}/index.html`);
 }
}

async function getPermissionByToken (token) {
  const request = await fetch(`${baseUrl}/auth/validate_user`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const permission = await request.json();

  return permission;
}

async function sendData (endpoint, data) {
  const request = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return request;
}

async function sendDataWithToken (endpoint, data) {
  const token = localStorage.getItem("token");

  const request = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return request;
}

export async function createUser (data) {
  let toast;
  const response = await sendData("/auth/register", data);

  if (response.ok) {
    toast = createToast("Criação de usuário<br>bem-sucedida", "sucess");

    toast.addEventListener("animationend", () => {
      window.location.assign("../login/index.html");
    })
  } else {
    toast = createToast("E-mail já cadastrado", "alert");
  }

  document.body.appendChild(toast);
  
}


export async function login (data) {
  let toast;
  const response = await sendData("/auth/login", data);
  const token = (await response.json()).token;

  if (response.ok) {
    const permission = await getPermissionByToken(token);
    
    localStorage.setItem("token", token);

    if (permission.is_admin) {
      window.location.assign("../admin-dashboard/index.html");
    } else {
      window.location.assign("../user-dashboard/index.html");
    }
  } else {
    toast = createToast("E-mail ou senha inválidos", "alert");
    
    document.body.appendChild(toast);
    
    hideToast();
  }
}

export async function getAllCompanies () {
  const request = await fetch(`${baseUrl}/companies`, {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  });

  const companies = await request.json();

  return companies;
}

export async function getAllCompaniesBySector (sector) {
  const request = await fetch(`${baseUrl}/companies/${sector}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  });

  const companies = request.json();

  return companies;
}

export async function getAllSectors () {
  const token = localStorage.getItem("token");

  const request = await fetch(`${baseUrl}/sectors`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const sectors = await request.json();

  return sectors;
}

export async function getAllDepartments () {
  const token = localStorage.getItem("token");

  const request = await fetch(`${baseUrl}/departments`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const departments = await request.json();

  return departments;
}

export async function getUserInfo () {
  const token = localStorage.getItem("token");

  const request = await fetch(`${baseUrl}/users/profile`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const userData = await request.json();

  return userData;
}

export async function getCoworkers () {
  const token = localStorage.getItem("token");

  const response = await fetch(`${baseUrl}/users/departments/coworkers`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const coworkers = await response.json();

  return coworkers;
}

export async function editLoggedUser (data) {
  const token = localStorage.getItem("token");

  const response =  await fetch(`${baseUrl}/users`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return response;
}

export async function createDepartment (data) {
  const response = await sendDataWithToken("/departments", data);

  return response;
}

export async function editDepartment (data, id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${baseUrl}/departments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return response;
}

export async function deleteDepartment (id) {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${baseUrl}/departments/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  return response;
}

export async function getCompanySectors (id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${baseUrl}/departments/${id}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })

  const sectors = await response.json();

  return sectors;
}

export async function getAllUsers () {
  const token = localStorage.getItem("token");

  const response = await fetch(`${baseUrl}/users`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  let users = await response.json();

  const departaments = await getAllDepartments();

  users = users.map( user => {
    const {department_uuid} = user;
    let newUser = user;

    if (department_uuid != null) {

      const {name} = departaments.find( ({uuid}) => uuid == department_uuid);

      newUser = {
        ...user,
        department_name: name
      }
    }

    return newUser;
  });

  users = users.filter( ({email}) => email != "admin@mail.com");

  return users;
}

export async function editUser (id, data) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${baseUrl}/admin/update_user/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return response;
}

export async function deleteUser (id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${baseUrl}/admin/delete_user/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  return response;
}

export async function getNotHiredUsers () {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${baseUrl}/admin/out_of_work`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const users = await response.json();

  return users;
}

export async function hireUser (userId, departmentId) {
  const token = localStorage.getItem("token");

  const data = {
    "user_uuid": userId,
    "department_uuid": departmentId
  };

  const response = await fetch(`${baseUrl}/departments/hire/`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  return response;
}

export async function fireUser (userId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${baseUrl}/departments/dismiss/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })

  return response;
}