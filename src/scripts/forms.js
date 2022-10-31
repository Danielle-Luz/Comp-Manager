export function getFormData (id, foo) {
  const form = document.getElementById(id);

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const fields = form.querySelectorAll("input, select");

    let fieldsData = {};

    fields.forEach(({id, value}) => {
      if (value) {
        fieldsData = {
          ...fieldsData,
          [id]: value
        }
      }
    });

    await foo(fieldsData);
  });
}