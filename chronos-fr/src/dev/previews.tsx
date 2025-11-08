import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import LoginPage from "@/pages/LoginPage.tsx";

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree/>}>
      <ComponentPreview path="/LoginPage">
        <LoginPage/>
      </ComponentPreview>
    </Previews>
  );
};

export default ComponentPreviews;