import SettingsModal from "./SettingsModal";

const Footer = () => {
  return (
    <footer className="py-6 border-t relative">
      <SettingsModal />
      <div className="container text-center text-sm text-muted-foreground">
        Created by{" "}
        <a
          href="https://jakub.buciuto.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          jakub.buciuto.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;