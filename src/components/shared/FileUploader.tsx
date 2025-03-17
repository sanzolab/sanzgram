import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
  type?: "profile" | "normal";
};

const FileUploader = ({ fieldChange, mediaUrl, type }: FileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const [file, setFile] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  });

  return (
    <div
      className={`flex ${
        type && type === "profile"
          ? "flex-row items-center"
          : "flex-col flex-center bg-dark-3 rounded-xl"
      } cursor-pointer `}
      {...getRootProps()}
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {type && type === "profile" ? (
        fileUrl ? (
          <>
            <img
              className="profile_file_uploader-img p-2"
              src={fileUrl}
              alt="image"
            />

            <p className="profile_file_uploader-label">
              Click or drag photo to replace{" "}
            </p>
          </>
        ) : (
          <div className="profile_file_uploader-box">
            <img
              src="/public/assets/icons/file-upload.svg"
              width={96}
              height={77}
              alt="upload a photo"
            />
            <h3 className="base-medium text-light-2 mb-2 mt-6">
              Drag a photo here
            </h3>
            <p className="text-light-4 small-regular mb-2">SVG, PNG, JPG</p>
            <p className="text-light-4 text-xs mb-6 italic">(Max Size 40MB)</p>
            <Button className="shad-button_dark_4">Select from computer</Button>
          </div>
        )
      ) : fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img className="file_uploader-img" src={fileUrl} alt="image" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace </p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/public/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="upload a photo"
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag a photo here
          </h3>
          <p className="text-light-4 small-regular mb-2">SVG, PNG, JPG</p>
          <p className="text-light-4 text-xs mb-6 italic">(Max Size 40MB)</p>
          <Button className="shad-button_dark_4">Select from computer</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
