import Image from "next/image";
import Link from "next/link";

import Logo from "../img/logos/logo.png";


const Footer = () => {
    const resources = [
        {
            id: 1,
            label: "Whitepaper",
            link: "https://renec.foundation/renec-whitepaper.pdf",
        },
        {
            id: 2,
            label: "Terms",
            link: "https://renec.foundation/terms-of-service",
        },
    ];

    const connecteds = [
        {
            id: 1,
            label: "About us",
            link: "https://renec.foundation/about-us",
        },
        {
            id: 2,
            label: "Twitter",
            link: "https://twitter.com/RenecBlockchain",
        },
        {
            id: 3,
            label: "Telegram",
            link: "https://t.me/renecblockchain",
        },
        {
            id: 4,
            label: "Reddit",
            link: "https://www.reddit.com/r/renecblockchain",
        },
        {
            id: 5,
            label: "Discord",
            link: "https://discord.gg/3DcncaVwxR",
        },
    ];

    return (
        <div className="footer">
            <div className="container">
                <div className="font-weight-light">
                    <Image className="footer__logo" src={Logo} alt="logo" height={32}/>
                    <div>© RENEC Foundation</div>
                    <div>All rights reserved</div>
                </div>
                <div className="d-flex footer--resources">
                    <div className="footer--resources__item">
                        <div className="text-primary">Resources</div>
                        {resources.map((it) => (
                            <div className="footer--resources__item--link" key={it.id}>
                                <a target="_blank" rel="noreferrer" href={it.link}>
                                    {it.label}
                                </a>
                            </div>
                        ))}
                        <div className="footer--resources__item--link">
                            <Link href="/tx/inspector">Inspector</Link>
                        </div>
                    </div>
                    <div className="footer--resources__item">
                        <div className="text-primary">Get connected</div>
                        {connecteds.map((it) => (
                            <div className="footer--resources__item--link" key={it.id}>
                                <a target="_blank" rel="noreferrer" href={it.link}>
                                    {it.label}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
