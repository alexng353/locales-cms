import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSend = async () => {
    const basic = Buffer.from(`${password}:${email}`).toString("base64");
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basic}`,
      },
    });
    const data = await response.json();
    console.log(data);

    if (data.message === "success") {
      localStorage.setItem("token", basic);
    }
  };

  return (
    <div className="min-h-screen w-full p-4 flex gap-4">
      <div className="inline-flex gap-4 h-min">
        <input
          className="border p-2 rounded-lg border-black"
          type="text"
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className="border p-2 rounded-lg border-black"
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
