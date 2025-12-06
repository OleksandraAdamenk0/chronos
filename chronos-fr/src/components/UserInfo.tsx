import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser.ts";
import CountrySelect from "@/components/CountrySelect";
import AvatarUpload from "@/components/AvatarUpload";
import {uploadAvatar} from "@/utils/upload.ts";
import {PATCH} from "@/utils/api.ts";
import {toast} from "sonner";
import {validateEmail} from "@/utils/validation.ts";

export const UserInfo: React.FC = () => {
  const { user, deleteUser, logout, setUser } = useUser();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(editedUser?.avatar || "https://avatar.iran.liara.run/public/48");

  if (!user) return null;

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editedUser) {
      try {
        validateEmail(editedUser.email);
        const formatedFullName = (editedUser.fullName && editedUser.fullName.trim().length > 0)? editedUser.fullName.trim() : undefined;
        const photoAddress = avatarFile? (await uploadAvatar(avatarFile)): undefined;
        // API request
        const dataToSend = {avatar: photoAddress, email: editedUser.email, fullName: formatedFullName, country: editedUser.country};
        const data = await PATCH("account/me", dataToSend);
        if (!(data?.success)) throw new Error(data.error);
        setUser({ ...editedUser, avatar: avatarPreview });
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      }
    }

    setEditDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 pr-4 border rounded-[50px] cursor-pointer">
            <Avatar className="w-8 h-8">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.login} />
              ) : (
                <AvatarFallback>{user.login[0].toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <span>{user.login}</span>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <div className="p-2 border-b mb-2">
            <p className="font-semibold">{user.fullName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">{user.country}</p>
          </div>
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            Edit Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
            Delete Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Account Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                console.log("Account deleted");
                deleteUser();
                setDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialogs */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleEditSubmit}
            className="flex flex-col gap-4"
          >
            {/* 🔥 Avatar Upload */}
            <div className="flex flex-col items-center gap-2">
              <AvatarUpload
                preview={avatarPreview}
                setPreview={(url) => {
                  setAvatarPreview(url);
                  setEditedUser(prev => prev ? { ...prev, avatar: url } : null);
                }}
                setFile={(file) => setAvatarFile(file)}
                variant="all"
              />
            </div>

            <Input
              placeholder="Full Name"
              value={editedUser?.fullName || ""}
              onChange={(e) =>
                setEditedUser((prev) =>
                  prev ? { ...prev, fullName: e.target.value } : null
                )
              }
            />

            <Input
              placeholder="Email"
              type="email"
              value={editedUser?.email || ""}
              onChange={(e) =>
                setEditedUser((prev) =>
                  prev ? { ...prev, email: e.target.value } : null
                )
              }
            />

            <CountrySelect
              value={editedUser?.country || ""}
              onChange={(value) =>
                setEditedUser((prev) =>
                  prev ? { ...prev, country: value } : null
                )
              }
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
