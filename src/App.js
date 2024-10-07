import "./styles/App.css";
import "./styles/BlurredLoginModal.css";
import TestTuiEditor from "./components/TestTuiEditor";
import S3ImageCRUD from "./services/S3ImageCRUD";

function App() {
  return (
    <div className="app-container">
      <div className="pattern-overlay"></div>
      <div className="radial-gradient-1"></div>
      <div className="radial-gradient-2"></div>
      <div className="content-container">
        <TestTuiEditor />
      </div>
      <div className="App">
        <S3ImageCRUD />
      </div>
    </div>
  );
}

export default App;
