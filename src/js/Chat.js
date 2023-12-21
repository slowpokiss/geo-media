import AddForm from "./AddForm";

export default class Chat {
  constructor() {
    this.audioBtn = document.querySelector(".audio-btn");
    this.chat = document.querySelector(".chat");
    this.form = document.querySelector(".send-area");
    this.audioBtn = document.querySelector(".audio-btn");
    this.alertPopup = document.querySelector(".alert");
    this.sendButtons = document.querySelector(".buttons");
  }

  init() {
    this.addFormClass = new AddForm();
    this.addFormClass.init();

    const addCallBack = (ev) => {
      ev.preventDefault();
      this.addFormClass.actual.forEach((id) =>
        this.addFormClass.popoverClass.closeElem(id)
      );
      this.addFormClass.actual = [];
      if (
        this.addFormClass.checkFormValidity(
          this.addFormClass.popoverForm.elements
        )
      ) {
        const geoInputValue =
          this.addFormClass.popoverForm.querySelector(
            ".popup-input-value"
          ).value;

        if (this.audioPlayer) {
          this.sendAudio(
            this.audioPlayer,
            this.getCurrentDate(),
            geoInputValue
          );
        } else {
          this.sendMessage(
            this.formInput.value,
            this.getCurrentDate(),
            `[${geoInputValue}]`
          );
        }
        this.addFormClass.closeForm();
      }
    };
    this.addFormClass.popoverForm.addEventListener("submit", addCallBack);
    this.form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      this.formInput = document.querySelector(".form-input");

      if (this.formInput.value.trim()) {
        const response = await this.getCurrentGeo();
        let modifiedResponse = `[${response[0]}, ${response[1]}]`;
        this.sendMessage(
          this.formInput.value,
          this.getCurrentDate(),
          modifiedResponse
        );
        this.formInput.value = "";
      }
    });

    this.audioBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      this.startAudio();
    });

    this.alertPopup
      .querySelector(".alert-cancel")
      .addEventListener("click", (ev) => {
        ev.preventDefault();
        this.closeAlert();
      });
  }

  sendMessage(text, time, coords) {
    const messageTemplate = `
    <div class="message">
    <div class="message-data">
      <div class="message-text">
        ${text}
      </div>
      <div class="message-coords">${coords}</div>
    </div>
    <div class="message-time">${time}</div>
    </div>`;
    this.chat.insertAdjacentHTML("beforeend", messageTemplate);
  }

  sendAudio(audio, time, coords) {
    let modifiedGeo;
    if (typeof coords === "string") {
      modifiedGeo = `[${coords.split(", ")}]`;
    } else {
      modifiedGeo = `[${coords[0]}, ${coords[1]}]`;
    }
    const messageTemplate = document.createElement("div");
    messageTemplate.classList.add("message");
    messageTemplate.insertAdjacentHTML(
      "beforeend",
      `
    <div class="message-data">
      <div class="message-text"></div>
      <div class="message-coords">${modifiedGeo}</div>
    </div>
    <div class="message-time">${time}</div>`
    );
    messageTemplate.querySelector(".message-text").appendChild(audio);
    this.chat.appendChild(messageTemplate);
  }

  getCurrentDate() {
    const date = new Date();
    const formattedTime = `${
      date.getHours() < 10 ? "0" : ""
    }${date.getHours()}:${
      date.getMinutes() < 10 ? "0" : ""
    }${date.getMinutes()}`;
    const formattedDate = `${date.getFullYear()}.${
      date.getMonth() + 1 < 10 ? "0" : ""
    }${date.getMonth() + 1}.${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;
    return `${formattedDate} ${formattedTime}`;
  }

  getCurrentGeo() {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (data) => {
            const { latitude, longitude } = data.coords;
            resolve([latitude, longitude]);
          },
          (error) => {
            this.addFormClass.showForm();
          }
        );
      }
    });
  }

  getAudioTime(time) {
    let min = Math.floor(time / 60, 1);
    let sec = Math.floor(time % 60, 1);
    return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
  }

  showAlert() {
    this.alertPopup.classList.add("active");
    this.alertPopup.querySelector(".alert-popup").classList.add("active");
  }

  closeAlert() {
    this.alertPopup.classList.remove("active");
    this.alertPopup.querySelector(".alert-popup").classList.remove("active");
  }

  startAudio() {
    this.audioPlayer = document.createElement("audio");
    this.audioPlayer.controls = true;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        this.showAudioStats();
        let audioSeconds = 0;
        const audioRecorder = new MediaRecorder(stream);
        const chunks = [];

        audioRecorder.addEventListener("start", (ev) => {
          this.timerInterval = setInterval(() => {
            audioSeconds++;
            this.timerFolder.textContent = this.getAudioTime(audioSeconds);
          }, 1000);
        });

        audioRecorder.addEventListener("dataavailable", (ev) => {
          chunks.push(ev.data);
        });

        audioRecorder.addEventListener("stop", () => {
          const blob = new Blob(chunks);
          this.audioPlayer.src = URL.createObjectURL(blob);
        });

        audioRecorder.start();

        this.sendButtons
          .querySelector(".apply-audio-btn")
          .addEventListener("click", (ev) => {
            ev.preventDefault();
            audioRecorder.stop();
            stream.getTracks().forEach((track) => track.stop());
            this.sendButtons.removeChild(this.audioStats);
            this.audioBtn.style.display = "block";
            clearInterval(this.timerInterval);

            this.getCurrentGeo().then((data) => {
              if (data) {
                this.sendAudio(this.audioPlayer, this.getCurrentDate(), data);
              }
            });
          });

        this.sendButtons
          .querySelector(".cancel-audio-btn")
          .addEventListener("click", (ev) => {
            ev.preventDefault();
            audioRecorder.stop();
            stream.getTracks().forEach((track) => track.stop());
            this.sendButtons.removeChild(this.audioStats);
            this.audioBtn.style.display = "block";
            clearInterval(this.timerInterval);
          });
      } catch (error) {
        this.showAlert();
      }
    })();
  }

  showAudioStats() {
    this.audioStats = document.createElement("div");
    this.audioStats.classList.add("audio-stats");
    this.audioStats.insertAdjacentHTML(
      "beforeend",
      `
    <button class="type-btn apply-audio-btn"><strong>&#10003;</strong></button>
    <div class="send-form-timer">00:00</div>
    <button class="type-btn cancel-audio-btn"><strong>&#10007;</strong></button>`
    );
    this.audioBtn.style.display = "none";
    this.sendButtons.appendChild(this.audioStats);
    this.timerFolder = document.querySelector(".send-form-timer");
  }
}
