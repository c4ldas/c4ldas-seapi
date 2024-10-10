import Link from 'next/link';
import Image from 'next/image';

export default function FooterComponent() {
  return (
    <footer className="footer">
      <nav className="navigation">
        <Link href="/">
          <Image className="icons" src="/images/home.svg" width={20} height={20} alt="home" />
        </Link>
        <Link href="https://twitch.tv/c4ldas" target="_blank">
          <Image className="icons" src="/images/twitch.svg" width={20} height={20} alt="twitch" />
        </Link>
        <Link href="https://youtube.com/c4ldas" target="_blank">
          <Image className="icons" src="/images/youtube.svg" width={20} height={20} alt="youtube" />
        </Link>
        <Link href="https://instagram.com/c4ldas" target="_blank">
          <Image className="icons" src="/images/instagram.svg" width={20} height={20} alt="instagram" />
        </Link>
        <Link href="https://github.com/c4ldas" target="_blank">
          <Image className="icons" src="/images/github.svg" width={20} height={20} alt="github" />
        </Link>
      </nav>
    </footer>
  )
}
