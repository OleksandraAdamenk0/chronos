// AvatarUpload.tsx
import React, {useState} from "react";

interface Props {
  preview: string;
  setPreview: (photo: string) => void;
  setFile: (file: File) => void;
  size?: number;
  variant?: "small" | "large" | "all";
}

const AvatarUpload = ({ setFile, preview, setPreview, size, variant = "small" }: Props) => {
  const [defaultAvatar, setDefaultAvatar] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
    setDefaultAvatar(false);
  };

  if (variant === "large") {
    return (

      <label htmlFor="avatar-upload" className="bg-muted relative hidden lg:block overflow-hidden group">
        <div
          className={"absolute" + (defaultAvatar ? " top-1/2 left-1/2" : "")}
          style={{
            width: defaultAvatar ? "150%" : "100%",
            height: defaultAvatar ? "150%" : "100%",
            transform: defaultAvatar ? "translate(-50%, -50%)" : "none",
          }}
        >
          <img
            src={preview}
            alt="Image"
            className="object-cover w-auto h-auto min-w-full min-h-full transition duration-200 group-hover:brightness-50"
          />
        </div>

        <div className="absolute w-full h-full flex items-center justify-center rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="font-medium text-white">Click here to upload avatar</span>
        </div>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="absolute top-0 left-0 w-full h-full hidden"
          onChange={handleChange}
        />
      </label>
    );
  }

  // small
  if (variant === "small") {
    return (
      <div className="bg-muted relative lg:hidden h-fit overflow-hidden rounded-full aspect-square">
        <img
          src={preview}
          alt="Avatar"
          style={{ width: size ?? "100%"}}
          className="object-cover"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    );
  }

  if (variant === "all") {
    return (
      <div
        className="bg-muted relative overflow-hidden rounded-full aspect-square"
        style={{ width: size ?? "60%" }}
      >
        <img
          src={preview}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

    )
  }

};

export default AvatarUpload;
