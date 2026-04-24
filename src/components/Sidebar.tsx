import { siteConfig } from '../config/site';
import {
  FaEnvelope,
  FaGraduationCap,
  FaOrcid,
  FaInstagram,
} from 'react-icons/fa6';
import { SiResearchgate } from 'react-icons/si';

const socialLinks = [
  {
    href: `mailto:${siteConfig.author.email}`,
    icon: FaEnvelope,
    label: 'Email',
  },
  {
    href: siteConfig.author.googlescholar,
    icon: FaGraduationCap,
    label: 'Google Scholar',
  },
  {
    href: siteConfig.author.researchgate,
    icon: SiResearchgate,
    label: 'ResearchGate',
  },
  {
    href: siteConfig.author.orcid,
    icon: FaOrcid,
    label: 'ORCID',
  },
  {
    href: `https://instagram.com/${siteConfig.author.instagram}`,
    icon: FaInstagram,
    label: 'Instagram',
  },
];

export default function Sidebar() {
  const { author } = siteConfig;

  return (
    <aside className="w-72 shrink-0">
      <div className="sticky top-20">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-40 h-40 rounded-full object-cover mb-4 shadow-md"
          />
          <h3 className="text-lg font-semibold text-gray-900 whitespace-pre-line">
            {author.name}
          </h3>
          {author.bio && (
            <p className="text-sm text-gray-500 mt-1">{author.bio}</p>
          )}
        </div>

        {siteConfig.description && (
          <p className="text-sm text-gray-500 mb-4 text-center">
            {siteConfig.description}
          </p>
        )}

        <div className="flex flex-col items-center gap-1 text-sm text-gray-500 mb-4">
          {author.location && (
            <span>
              <span className="inline-block w-4 text-center mr-1">📍</span>
              {author.location}
            </span>
          )}
        </div>

        <div className="flex justify-center gap-3">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              title={label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
