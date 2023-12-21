import Popover from "./Popover";

export default class AddForm {
  constructor() {
    this.popoverForm = document.querySelector(".list-popup");
    this.popoverClass = new Popover(this.popoverForm);
    this.actual = [];
    this.formErrors = {
      value: {
        valueMissing: "Введите координаты",
        patternMismatch: "Неверный формат координат",
      },
    };
  }

  init() {
    this.popoverForm
      .querySelector(".popup-cancel")
      .addEventListener("click", (ev) => {
        ev.preventDefault();
        if (this.popoverClass._tooltips.length > 0) {
          this.popoverClass.closeElem(this.popoverClass._tooltips[0].id);
          this.actual = [];
        }
        this.closeForm();
      });
  }

  checkFormValidity(elements) {
    console.log(elements);
    return ![...elements].some((el) => {
      return Object.keys(ValidityState.prototype).some((key) => {
        if (!el.name) return;
        if (key === "valid") return;
        if (el.validity[key]) {
          this.actual.push(
            this.popoverClass.showElem(this.formErrors[el.name][key], el)
          );
          return true;
        }
      });
    });
  }

  showForm() {
    this.popoverForm.parentElement.classList.add("active");
    this.popoverForm.classList.add("active");
  }

  closeForm() {
    this.popoverForm.parentElement.classList.remove("active");
    this.popoverForm.classList.remove("active");
    this.clearForm();
  }

  clearForm() {
    const inputValue = this.popoverForm.querySelector(".popup-input-value");
    inputValue.value = "";
    inputValue.classList.remove("valid");
    inputValue.classList.remove("invalid");
    this.popoverForm.classList.remove("was-validated");
  }
}
