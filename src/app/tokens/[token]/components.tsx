"use client";

import {
  TextareaHTMLAttributes,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import useSWR from "swr";
import ky from "ky";
import { to } from "await-to-js";

const api = ky.create({
  retry: 0,
});

export function LogEditor({
  value: initialValue,
  token,
  logId,
}: {
  value: string;
  token: string;
  logId: string;
}) {
  const [value, setValue] = useState<string>(initialValue);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust to fit content
    }
  }, [value]); // Adjust whenever value changes

  return (
    <>
      <button
        className="p-2 bg-slate-800 rounded-lg m-4"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          let payload: Record<string, unknown> = {};
          try {
            payload = JSON.parse(value);
          } catch (e) {
            alert("invalid json");
            setLoading(false);
            return;
          }

          const [err] = await to(
            api
              .put(`/api/tokens/${token}/logs/${logId}`, {
                json: payload,
              })
              .json()
          );
          if (err) {
            alert(err.message);
          }

          setLoading(false);
        }}
      >
        Update
      </button>
      <Textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={loading}
        className={`text-sm bg-transparent w-full px-4 py-2 shadow-sm border-none outline-none resize-none overflow-hidden`}
      />
    </>
  );
}

const Textarea = ({
  value,
  onChange,
  ...rest
}: Pick<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange" | "className" | "disabled"
>) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to match content
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      {...rest}
      ref={textareaRef}
      value={value}
      onChange={onChange}
      rows={1}
      style={{
        overflow: "hidden",
        resize: "none",
      }}
    />
  );
};
