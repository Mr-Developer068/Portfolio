// this is dummy page





import React from "react";
import {
    ArrowLeft,
    ArrowUpRight,
    ExternalLink,
    Layers3,
    CalendarDays,
    Code2,
    GitBranch,
} from "lucide-react"; 
import { Link } from "react-router-dom";

const project = {
    title: "DevLinker",
    subtitle: "A space where developers build, share, and grow together.",
    description:
        "DevLinker is a developer-focused social platform designed to showcase projects, share progress, connect with other developers, and build a public record of your coding journey.",
    category: "Full-Stack Development",
    year: "2026",
    status: "In Development",
    techStack: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB", "JWT"],
    liveUrl: "#",
    githubUrl: "#",
};

const Project_Details = () => {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#08080b] text-white">
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[130px]" />
                <div className="absolute right-0 top-[45%] h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
                {/* Navigation */}
                <nav className="flex items-center justify-between border-b border-white/10 pb-6">
                    <Link
                        to="/"
                        className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
                    >
                        <ArrowLeft
                            size={16}
                            className="transition-transform group-hover:-translate-x-1"
                        />
                        Back to projects
                    </Link>

                    <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                        Project Archive / 001
                    </span>
                </nav>

                {/* Project heading */}
                <section className="grid gap-12 pb-20 pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:pt-24">
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/5 px-4 py-2 text-xs tracking-wide text-violet-300">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
                            {project.status}
                        </div>

                        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-zinc-500">
                            {project.category}
                        </p>

                        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
                            {project.title}
                            <span className="text-violet-400">.</span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
                            {project.subtitle}
                        </p>

                        <div className="mt-9 flex flex-wrap gap-3">
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-violet-200"
                            >
                                Live Preview
                                <ArrowUpRight size={17} />
                            </a>

                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white transition hover:border-white/40 hover:bg-white/5"
                            >
                                <GitBranch size={17} />
                                Source Code
                            </a>
                        </div>
                    </div>

                    {/* Project metadata */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                            <CalendarDays className="mb-8 text-violet-300" size={22} />
                            <p className="text-xs uppercase tracking-widest text-zinc-500">
                                Year
                            </p>
                            <p className="mt-2 text-xl font-medium">{project.year}</p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                            <Layers3 className="mb-8 text-cyan-300" size={22} />
                            <p className="text-xs uppercase tracking-widest text-zinc-500">
                                Category
                            </p>
                            <p className="mt-2 text-xl font-medium">Full-Stack</p>
                        </div>
                    </div>
                </section>

                {/* Project visual */}
                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101015]">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-cyan-500/10" />

                    <div className="relative flex min-h-[300px] flex-col items-center justify-center px-6 py-16 text-center sm:min-h-[460px]">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/5 shadow-2xl shadow-violet-500/20">
                            <Code2 size={36} className="text-violet-300" />
                        </div>

                        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                            Featured Project
                        </p>

                        <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">
                            Built for builders.
                        </h2>

                        <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">
                            Replace this showcase with your project screenshot,
                            video, or interactive 3D preview.
                        </p>
                    </div>
                </section>

                {/* Description and technologies */}
                <section className="grid gap-12 py-20 lg:grid-cols-[1fr_0.7fr]">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">
                            01 / Overview
                        </p>

                        <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">
                            The idea behind it.
                        </h2>

                        <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400">
                            {project.description}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">
                            02 / Tech Stack
                        </p>

                        <h2 className="mt-5 text-3xl font-semibold">
                            Tools used.
                        </h2>

                        <div className="mt-7 flex flex-wrap gap-3">
                            {project.techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-300 transition hover:border-violet-400/50 hover:bg-violet-400/10 hover:text-white"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="flex flex-col justify-between gap-4 border-t border-white/10 py-8 text-sm text-zinc-500 sm:flex-row">
                    <p>Designed and developed with curiosity.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 transition hover:text-white"
                    >
                        Explore more projects
                        <ExternalLink size={14} />
                    </Link>
                </footer>
            </div>
        </main>
    );
};

export default Project_Details;