"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import Navbar from "@/components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Test = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  const allowedFileTypes = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/getFiles/");
        setFiles(response.data.files);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    if (!allowedFileTypes.includes(file.type)) {
      alert("Please upload a PDF, PPT, or DOCX file.");
      return;
    }

    setFilename(file.name);

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
        setFileSelected(true);
        setSelectedFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/uploadfile/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      toast.success("File uploaded successfully!", {
        style: {
          backgroundColor: '#28282B',
          color: '#fff'
        }
      });

      // Refresh the list of files after upload
      const fetchFiles = async () => {
        const response = await axios.get("http://127.0.0.1:8000/getFiles/");
        setFiles(response.data.files);
      };
      fetchFiles();
    } catch (error: any) {
      console.error(error);
      alert("Error uploading file.");
    }
    setLoading(false);
  };

  const handleDelete = async (filename: string) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/deletefile/${filename}`);
      // Refresh the list of files after deletion
      setFiles(files.filter((file) => file !== filename)); 
      toast.success("File deleted successfully!", {
        style: {
          backgroundColor: '#28282B',
          color: '#fff'
        }
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file.");
    }
  };

  return (
    <div className="h-[90vh] flex flex-col items-center justify-center gap-4 m-20 overflow-y-auto">
      <ToastContainer />
      <div className="h-[70vh] w-4/5 border rounded-xl p-8 backdrop-blur-[1px] flex flex-col justify-between">
        {fileSelected ? (
          <div className="relative h-full w-full flex flex-col justify-center items-center">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <HashLoader color="#ffffff" className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                <div className="bg-black opacity-[0.5] h-full w-full flex items-center">
                  <iframe
                    src={previewUrl || ""}
                    className="opacity-50 mx-auto"
                    width="100%"
                    height="100%"
                  ></iframe>
                </div>
              </div>
            ) : (
              <iframe
                src={previewUrl || ""}
                className="w-full h-full"
                width="100%"
                height="100%"
              ></iframe>
            )}
          </div>
        ) : (
          <div className="relative flex items-center justify-center h-full w-full">
            <label htmlFor="fileUpload" className="cursor-pointer">
              <p className="text-neutral-600 text-2xl text-center">
                Click to add <br /> your file here!
              </p>
            </label>
          </div>
        )}
        <input
          id="fileUpload"
          type="file"
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      <div className="w-1/6">
        <button
          onClick={handleUpload}
          className="w-full gradient-button py-2 px-4 text-neutral-100 border-2 rounded-xl"
        >
          Upload
        </button>
      </div>
      <div className="w-full flex flex-col items-center mt-4 border-t-2 pt-4">
        <h2 className="text-xl mb-4">Uploaded Files</h2>
        <div className="w-full flex flex-wrap gap-4 justify-center">
          {files.map((file, index) => (
            <div key={index} className="w-1/4 border p-4 rounded-lg">
              <p className="truncate">{file}</p>
              <button
                onClick={() => handleDelete(file)}
                className="mt-2 bg-red-500 text-white py-1 px-2 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Test;
