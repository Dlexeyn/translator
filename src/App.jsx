import React, { useEffect, useState } from "react";
import axios from "axios";

const KEY = import.meta.env.VITE_YANDEX_KEY;
console.log("KEY:", KEY);

const translate = async (text, signal) => {
  const { data } = await axios.get(
    "https://dictionary.yandex.net/api/v1/dicservice.json/lookup",
    { params: { key: KEY, lang: "ru-en", text }, signal }
  );
  return data.def?.[0]?.tr?.[0]?.text ?? "";
};

export default function App() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");

  useEffect(() => {
    const word = text.trim();
    if (!word) {
      setTranslated("");
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      translate(word, controller.signal)
        .then(setTranslated)
        .catch((err) => {
          if (!axios.isCancel(err)) setTranslated("");
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [text]);

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <h1>{translated}</h1>
    </>
  );
}