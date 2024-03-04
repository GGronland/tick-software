import "./styles/Footer.scss";

const Footer = () => {
  return (
    <footer className="Footer">
      <div className="Footer_SubContainer">
        <div className="Signature">
          Technical test for Tick Software by{" "}
          <a href="mailto:glen.gronland@gmail.com">Glen Gronland</a>. All
          feedback is welcome!{" "}
        </div>
        <div className="Credit">
          Icons by{" "}
          <a target="_blank" href="https://icons8.com" rel="noreferrer">
            Icons8
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
