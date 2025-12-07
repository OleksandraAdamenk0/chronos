import {useEffect, useState} from "react";
import type {CategoryType} from "@/types";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from "@/components/ui/context-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

import { ImageDown, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useCalendar } from "@/hooks/useCalendar";
import { toast } from "sonner";
import { DELETE, PATCH } from "@/utils/api";
import ColorPicker from "@/components/colorPicker.tsx";

const CategoriesList = () => {
  const { getCategories, getCalendarId, deleteCategory, updateCategory } = useCalendar();

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryType | null>(null);
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    if (editing) setColor(editing.color);
  }, [editing]);

  const handleDeleteCategory = async (category: CategoryType) => {
    try {
      const result = await DELETE(`calendar/${getCalendarId()}/categories/${category.id}`);
      if (!result.success) return toast.error(result.error || "Something went wrong");
      deleteCategory(category.id);
      toast.success("Category deleted");
    } catch (error: any) {
      console.log(error);
      if (error.status === 403) toast.warning("You dont have permission to delete the category");
      else toast.error("Something went wrong");
    }
  };

  const handleEditSave = async () => {
    if (!editing) return;
    try {
      const result = await PATCH(`calendar/${getCalendarId()}/categories/${editing.id}`,
        {
          name: editing.name,
          description: editing.description,
          color: color,
        },
      );

      if (!result.success) return toast.error(result.error || "Failed to update");

      updateCategory(result.data);
      toast.success("Category updated");
      setEditOpen(false);
    } catch (error: any) {
      console.log(error);
      if (error.status === 403) toast.warning("You dont have permission to update the category");
      else toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
            <DialogDescription>
              Change the name, description and color of this category.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editing.description || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  placeholder="Description"
                />
              </div>

              <ColorPicker value={color} onChange={setColor} />

            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-2 pb-2">
        {getCategories().map((category: CategoryType, index) => {
          return (
            <div className="flex flex-col gap-2" key={category.id}>
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <div
                    className="relative font-bold py-2 pl-6 pr-4 flex cursor-pointer items-center rounded-md justify-start"
                    style={{ transition: "background 0.3s" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget as HTMLDivElement).style.background =
                        category.color
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget as HTMLDivElement).style.background =
                        "transparent"
                    }
                  >
                    <div
                      style={{ backgroundColor: category.color }}
                      className="absolute left-0 top-0 h-full w-1 rounded-l-md"
                    />

                    <span className="text-primary">{category.name}</span>
                  </div>
                </ContextMenuTrigger>

                <ContextMenuContent className="w-40">
                  <div className="p-2 border-b mb-2">
                    <p className="text-sm text-muted-foreground">
                      {category.description || "No description"}
                    </p>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <ContextMenuItem
                        onClick={() => {
                          setEditing(category);
                          setEditOpen(true);
                        }}
                      >
                        <ImageDown className="mr-2 h-4 w-4" />
                        Edit
                      </ContextMenuItem>
                    </DialogTrigger>
                  </Dialog>

                  <ContextMenuSeparator />

                  <ContextMenuItem onClick={() => handleDeleteCategory(category)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>

              {index < getCategories().length - 1 && <Separator />}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CategoriesList;
