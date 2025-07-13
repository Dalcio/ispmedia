function showUploadModal() {
  fetch("components/modal-upload.html")
    .then((res) => res.text())
    .then((html) => {
      let modalDiv = document.createElement("div");
      modalDiv.innerHTML = html;
      document.body.appendChild(modalDiv);
      const modal = new bootstrap.Modal(modalDiv.querySelector("#modalUpload"));
      modal.show();
      const form = modalDiv.querySelector("#uploadMusicForm");
      const fileInput = modalDiv.querySelector("#musicFile");
      const btnUpload = modalDiv.querySelector("#btnUpload");
      const btnText = modalDiv.querySelector("#btnUploadText");
      const btnSpinner = modalDiv.querySelector("#btnUploadSpinner");
      const msg = modalDiv.querySelector("#uploadMessage");
      const progressBar = modalDiv.querySelector(".progress-bar");
      form.addEventListener("submit", async function(e) {
        e.preventDefault();
        msg.textContent = "";
        progressBar.style.width = "0%";
        modalDiv.querySelector("#uploadProgress").style.display = "block";
        const file = fileInput.files[0];
        if (!file) {
          msg.textContent = "Selecione um ficheiro.";
          modalDiv.querySelector("#uploadProgress").style.display = "none";
          return;
        }
        if (!/\.(mp3|wav|ogg)$/i.test(file.name)) {
          msg.textContent = "Apenas ficheiros de áudio (.mp3, .wav, .ogg) são permitidos.";
          modalDiv.querySelector("#uploadProgress").style.display = "none";
          return;
        }
        btnUpload.disabled = true;
        btnText.style.display = "none";
        btnSpinner.style.display = "inline-block";
        try {
          const result = await uploadMusic(file, percent => {
            progressBar.style.width = percent + "%";
          });
          progressBar.style.width = "100%";
          msg.textContent = result.message || "Upload realizado com sucesso!";
          setTimeout(() => {
            modal.hide();
            renderAlert("Upload realizado com sucesso!", "success");
            modalDiv.remove();
          }, 1200);
        } catch (err) {
          progressBar.style.width = "0%";
          msg.textContent = err.message || "Erro ao enviar. Tente novamente.";
          btnUpload.disabled = false;
          btnText.style.display = "";
          btnSpinner.style.display = "none";
        }
      });
      modalDiv.querySelector('[data-bs-dismiss="modal"]').onclick = () => {
        modal.hide();
        modalDiv.remove();
      };
    });
}