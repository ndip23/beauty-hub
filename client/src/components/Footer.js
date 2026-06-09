// src/components/Footer.js
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-dark-footer text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About & Socials */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-extrabold mb-4">
              {t("footer.title")}
            </h3>
            <p className="text-gray-400 max-w-md mb-6">
              {t("footer.description")}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="hover:text-white">
                  {t("footer.addBusiness")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
               {/* <Link to="/blog" className="hover:text-white">
                  {t("footer.beautyTips")}
                </Link>*/}
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="font-bold text-lg mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/privacy" className="hover:text-white">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
               {/* <Link to="/cookie" className="hover:text-white">
                  {t("footer.cookies")}
                </Link> */}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {t("footer.title")}.{" "}
            {t("footer.copyright")}
          </p>
          <a
            href="mailto:support@BookerBeauty.site"
            target={"_blank"}
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-green-400 hover:text-white mt-4 sm:mt-0"
          >
            {/* <FaWhatsapp size={20} />
            <span>WhatsApp Support: +237 6XX XXX XXX</span> */}
            <FaEnvelope size={20} />
            <span>{t("footer.contactSupport")}</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
