import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import CreateCategory from "@/components/dialogs/CreateCategory.tsx";
import CategoriesList from "@/components/layout/CategoriesList.tsx";

function CategoriesSection() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="w-full">
      <Button variant="outline" className="w-full mb-2" onClick={() => setOpen(!open)}>
        Categories
      </Button>
      {open && (
        <div className="w-full bg-accent rounded-md">
          <CreateCategory />
          <CategoriesList />
        </div>
      )}
    </div>
  )
}

export default CategoriesSection;