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

  function deleteChat(id) {
    console.log("Delete", id);
    db.collection("Chat")
      .doc(id)
      .delete()
      .then(() => console.log("Document successfully deleted"))
      .catch(() => console.log("Error deleting the document"));
  }

  function updateChat(id, msg) {
    db.collection("Chat").doc(id).update({
      message: msg,
    });
  }

  function init() {
    // setTimeout(() => {
    //   updateChat("NOIRNnevtMY7JCezJYXo", "Bye");
    // }, 5000);
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
          padding: 10px 50px 10px 30px;
          margin: 10px 0;
          line-height: 50px;
          width: fit-content;
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
          right: 20px;
          color: #d31616;
          cursor:pointer;
          margin-left:20px
          `;
          span.addEventListener("click", () => deleteChat(doc.id));
          li.appendChild(span);
          list.appendChild(li);
        });
      });
  }

  init();
});
