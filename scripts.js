window.addEventListener("DOMContentLoaded", function () {
  console.log("Ready!");
  const form = document.getElementById("form");
  const nickname = document.getElementById("nickname");
  const message = document.getElementById("message");
  const list = document.getElementById("list");
  const db = firebase.firestore();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Submit");

    if (nickname.value && message.value) {
      addChat(nickname.value, message.value);
      message.value = "";
    }
  });

  //   add chat
  function addChat(nickname, msg) {
    db.collection("Chat")
      .add({
        nickname,
        message: msg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        console.log("Document successfully added, ID:", docRef.id);
      })
      .catch((err) => console.log("Error", err));
  }

  function deleteChat() {
    console.log("Delete");
  }
  function init() {
    db.collection("Chat")
      .orderBy("timestamp", "asc")
      .onSnapshot(function (querySnapshot) {
        list.innerHTML = "";
        querySnapshot.forEach((doc) => {
          const { nickname, message } = doc.data();
          const li = document.createElement("li");
          li.style = `
          background-color: #dfdfdf;
          font-size: 17px;
          padding: 10px 30px;
          margin: 10px 0;
          line-height: 50px;
          width: 300px;
          border-radius: 40px;
          position: relative;
        display: flex;
        align-items: center;
          `;
          li.innerHTML = `${nickname}: ${message}`;

          const span = document.createElement("span");
          span.innerHTML = "&#10005;";
          span.style = `
          position: absolute;
          right: 30px;
          color: #d31616;
          cursor:pointer
          `;
          span.addEventListener("click", deleteChat);
          li.appendChild(span);
          list.appendChild(li);
        });
      });
  }

  init();
});
