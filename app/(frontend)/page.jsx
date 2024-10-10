import Header from "../components/Header";
import FooterComponent from "../components/Footer";
import Linkbox from "../components/Linkbox";

export default function Home() {
  return (
    <div className="container">
      <Header />
      <main className="main">
        <div>
          <h1 className="title">Lorem, ipsum dolor.</h1>
          <h2 className="subtitle">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique vitae reprehenderit maxime porro corporis, laborum fugit laboriosam earum nesciunt itaque modi architecto distinctio, rem, pariatur sunt natus esse. Recusandae, autem?</h2>
        </div>
        <Linkbox
          title="Share overlay / widget"
          description="Generate a code to share your overlay / widget"
          link="/login"
        />

        <Linkbox
          title="Install overlay / widget"
          description="Install the overlay into your account using a code"
          link="/install"
        />
      </main>
      <FooterComponent />
    </div>
  );
}

