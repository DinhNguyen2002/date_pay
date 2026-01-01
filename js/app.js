const API_URL = "https://script.google.com/macros/s/AKfycbxBOfm459vKkJqfvB53k7w_g1wKrCXUTx7xwTc-svMaJWwrwYUNQfpfZUoX0_fRWr8Q/exec";

function save() {
  const detail = document.getElementById("detail").value;
  const money = document.getElementById("money").value;
  const msg = document.getElementById("msg");

  if (!detail || !money) {
    msg.innerText = "Thiếu dữ liệu!";
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      detail: detail,
      money: money
    })
  })
  .then(r => r.json())
  .then(() => {
    msg.innerText = "Đã lưu!";
    document.getElementById("detail").value = "";
    document.getElementById("money").value = "";
  })
  .catch(() => msg.innerText = "Lỗi kết nối!");
}
