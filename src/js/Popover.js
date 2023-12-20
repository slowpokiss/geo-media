export default class Popover {
  constructor(form) {
    this.form = form;
    this.popupInputName = this.form.querySelector(".popup-input-name");
    this.popupInputValue = this.form.querySelector(".popup-input-value");
    this._tooltips = [];
  }

  showElem(text, elemToPop) {
    const tooltipElem = document.createElement("div");
    tooltipElem.classList.add("arrow");
    tooltipElem.textContent = text;

    const id = performance.now();
    this._tooltips.push({
      id,
      element: tooltipElem,
    });

    document.body.appendChild(tooltipElem);

    const popParams = elemToPop.getBoundingClientRect();
    tooltipElem.style.left =
      popParams.left +
      popParams.width / 2 -
      tooltipElem.getBoundingClientRect().width / 2 +
      "px";

    tooltipElem.style.top =
      popParams.top - tooltipElem.getBoundingClientRect().bottom + "px";

    return id;
  }

  closeElem(id) {
    const elemToDel = this._tooltips.find((el) => el.id === id);
    elemToDel.element.remove();
    this._tooltips = this._tooltips.filter((el) => el.id !== id);
  }
}
