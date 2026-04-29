const form = document.getElementById("book-a-table-form");
const successText = document.getElementById("success-text");

if (form && successText) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    successText.textContent = "Thank You! You have successfully booked a table!";

    form.reset();
  });
}
