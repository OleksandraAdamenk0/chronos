import {CreateEventForm} from "@/components/CreateEventForm.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";


function CreateEventPage () {
  const navigate = useNavigate();
  const location = useLocation();
  const date = location.state?.date;
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col justify-center items-center w-full gap-6 p-6">
      <div className="flex justify-end gap-12 items-center w-full">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Close
        </Button>
        <Button
          type="button"
          onClick={() => formRef.current?.requestSubmit()}
        >
          Create
        </Button>
      </div>

      <CreateEventForm ref={formRef} date={date instanceof Date? date: undefined} onExit={() => navigate(-1)}/>
    </div>
  )
}

export default CreateEventPage;