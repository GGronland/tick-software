import "./styles/Main.scss";
import Header from "./Header";
import Footer from "./Footer";
import CatQuiz from "CatQuiz";

function App() {
  return (
    <div className="Main">
      <Header />
      <div className="Content WidthControl HeightControl">
        <CatQuiz />
      </div>
      <Footer />
    </div>
  );
}

export default App;
