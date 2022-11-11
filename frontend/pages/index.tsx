import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSave = async () => {
    // base64(email:password)

    const base64 = Buffer.from(`${password}:${email}`).toString("base64");

    localStorage.setItem("auth", base64);

    console.log(base64);
  };

  const handleSend = async () => {
    const base64 = localStorage.getItem("auth");

    if (!base64) return;

    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64}`,
      },
    });

    const data = await response.json();

    console.log(data);
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

        <button onClick={handleSave}>Save</button>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
