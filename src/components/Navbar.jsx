import { FaInstagram, FaThreads, FaTiktok } from 'react-icons/fa6';

function Navbar() {
    const socials = [
    {
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://www.instagram.com/uma.bloemist', 
      color: 'hover:text-pink-600',
    },
    {
      name: 'Threads',
      icon: FaThreads,
      url: 'https://www.threads.net/@uma.bloemist', 
      color: 'hover:text-gray-900', 
    },
    {
      name: 'TikTok',
      icon: FaTiktok,
      url: 'https://www.tiktok.com/@uma.bloemist', 
      color: 'hover:text-black', 
    },
  ];
    return (
        <div className="flex justify-between items-center mx-10 my-5">
            <p className="text-xl text-gray-500 font-bold">Uma Bloemist</p>
            <div className="flex items-center gap-4">
                {socials.map((social) => {
                    const Icon = social.icon;
                    return (
                    <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-gray-500 transition-colors duration-300 ${social.color}`}
                        aria-label={social.name}
                    >
                        <Icon className="w-6 h-6" />
                    </a>
                    );
                })}
            </div>
        </div>
    )
}

export default Navbar;