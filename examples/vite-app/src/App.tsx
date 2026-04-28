import { imagePath } from "@typest/vite";

function App() {
  return (
    <div>
      <img src={imagePath("favicon.svg")} alt="img" />
      <img src={imagePath("react.svg")} alt="img" />
    </div>
  );
}

export default App;
