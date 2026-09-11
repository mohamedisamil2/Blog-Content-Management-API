import { Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { FaLinkedin } from "react-icons/fa6";
import { IoLogoGithub } from "react-icons/io";

function Footer() {
    return (
        <footer className="bg-linear-to-br from-rose-200 via-rose-50 to-rose-100 text-rose-600">
            <div className="mx-auto max-w-7xl px-6 py-10">

                {/* Main Footer */}
                <div className="grid gap-10 md:grid-cols-3 ">

                    {/* Brand */}
                    <div>
                        <h2 className="text-2xl font-bold">
                            DevBlog
                        </h2>

                        <p className="mt-3 text-sm">
                            Learn. Build. Share.
                        </p>

                        <p className="mt-3 max-w-sm text-sm leading-6">
                            A technical blog for developers to learn,
                            share knowledge, and build better software.
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="text-xl font-semibold">
                            Explore
                        </h3>

                        <nav className="mt-4 flex flex-col gap-3 text-sm">
                            <Link
                                to="/"
                                className="w-fit transition hover:underline"
                            >
                                Home
                            </Link>

                            <Link
                                to="/post"
                                className="w-fit transition hover:underline"
                            >
                                All Posts
                            </Link>

                            <Link
                                to="/categories"
                                className="w-fit transition hover:underline"
                            >
                                Categories
                            </Link>
                        </nav>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-xl font-semibold">
                            Social Media
                        </h3>

                        <div className="mt-4 flex flex-col gap-4">

                            <a
                                href="https://github.com/mohamedisamil2"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-fit items-center gap-2 transition hover:underline"
                            >
                                <IoLogoGithub size={18} />
                                Github
                            </a>

                            <a
                                href="https://www.linkedin.com/in/mohamed-ismail-7253ba372/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-fit items-center gap-2 transition hover:underline"
                            >
                                <FaLinkedin size={18} />
                                LinkedIn
                            </a>

                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-pink-300 pt-5 text-sm md:flex-row">

                    <p>
                        Copyright © {new Date().getFullYear()} - All rights reserved by{" "}
                        <span className="font-semibold text-slate-800">
                            DevBlog
                        </span>
                    </p>

                    <p className="flex items-center gap-1">
                        Built with
                        <Heart
                            size={18}
                            className="fill-rose-500 text-rose-500"
                        />
                    </p>

                </div>
            </div>
        </footer>
    );
}

export default Footer
