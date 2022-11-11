function login() {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  // get value from input
  const emailValue = email.value;
  const passwordValue = password.value;
  // check if email and password is empty

  if (emailValue && passwordValue) {
    fetch("/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailValue,
        password: passwordValue,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // if (data.status === "success") {
        //   window.location.href = "/admin/dashboard";
        // } else {
        //   alert("username or password is incorrect");
        // }
      });
  }
}
