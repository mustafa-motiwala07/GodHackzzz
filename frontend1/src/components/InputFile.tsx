"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


import { useState, ChangeEvent, FormEvent } from "react";

export default function InputFile() {
  // State to hold the selected file
  const [file, setFile] = useState<File | null>(null);

  // Handle file input change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/uploadfile/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
    <form onSubmit={handleSubmit}>
      <Label htmlFor="picture">Upload File</Label>
      <Input id="file" type="file" onChange={handleFileChange}/>
      <Button type="submit">Upload</Button>
    </form>
    </div>
  );
}
