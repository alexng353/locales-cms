import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleSend = async () => {
    const response = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${password}:${email}`).toString(
          "base64"
        )}`,
      },
      body: JSON.stringify({ inviteKey: inviteCode }),
    });
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
        <input
          className="border p-2 rounded-lg border-black"
          type="text"
          placeholder="Invite Code"
          onChange={(e) => {
            setInviteCode(e.target.value);
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
