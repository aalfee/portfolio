import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
const Card = ({ children }) => (
  <div className="border border-gray-700 rounded-xl p-4">{children}</div>
);

const CardContent = ({ children }) => (
  <div>{children}</div>
);

const Button = ({ children }) => (
  <button className="bg-white text-black px-4 py-2 rounded">
    {children}
  </button>
);
const GITHUB_USERNAME = "aalfee";
const CACHE_KEY = "github_repos_cache_v1";
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

export default function Portfolio() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const featuredRepos = useMemo(() => {
    return repos
      .filter(r => !r.fork)
      .slice(0, 6);
  }, [repos]);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          setRepos(parsed.data);
          setLoading(false);
          return;
        }
      } catch (e) {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    const controller = new AbortController();

    async function fetchRepos() {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("GitHub API error");

        const data = await res.json();

        const sorted = data
          .filter(repo => !repo.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count);

        setRepos(sorted);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: sorted, timestamp: Date.now() })
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Failed to load GitHub projects.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();

    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-20 py-10">

      {/* HERO */}
      <section className="text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold"
        >
          Alfiya Valitova
        </motion.h1>

        <p className="text-gray-400 mt-4 text-lg">
          Senior Software Developer / Lead Developer
        </p>

        <div className="flex justify-center gap-6 mt-6 flex-wrap text-sm text-gray-300">
          <div>📞 (347) 409-4267</div>
          <div>✉️ alfiyavcareers@gmail.com</div>
          <div>🐙 github.com/aalfee</div>
        </div>

        <Button className="mt-8">Download Resume</Button>
      </section>

      {/* ABOUT */}
      <section className="max-w-4xl mx-auto py-10">
        <h2 className="text-2xl font-semibold mb-4">About Me</h2>
        <p className="text-gray-300 leading-relaxed">
          Senior Software Developer specializing in full-stack systems, cloud architecture,
          and AI-driven applications with experience across React, Node.js, Python, and AWS.
        </p>
      </section>

      {/* EXPERIENCE */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">Experience</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["Concorde Education", "Senior Software Developer", "Scalable education platforms using React, Node.js, AWS"],
            ["Queens College", "Software Associate", "Java systems, debugging, and architecture support"],
            ["Freelance", "Web Developer", "E-commerce systems with JS, PHP, MySQL"]
          ].map(([title, role, desc]) => (
            <Card key={title}>
              <CardContent className="p-6">
                <h3 className="font-bold">{title}</h3>
                <p className="text-sm text-gray-400">{role}</p>
                <p className="mt-3 text-gray-300 text-sm">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Featured GitHub Projects
        </h2>

        {loading && (
          <p className="text-center text-gray-400">Loading repositories...</p>
        )}

        {error && (
          <p className="text-center text-red-400">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 gap-6">
            {featuredRepos.map(repo => (
              <Card key={repo.id}>
                <CardContent className="p-6">
                  <h3 className="font-bold">{repo.name}</h3>
                  <p className="text-sm text-gray-400">
                    ⭐ {repo.stargazers_count} • {repo.language || "Various"}
                  </p>
                  <p className="mt-3 text-gray-300 text-sm">
                    {repo.description || "No description provided."}
                  </p>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 text-sm mt-3 inline-block"
                  >
                    View →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* SKILLS */}
      <section className="py-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">Technical Skills</h2>
        <p className="text-gray-300">
          React • Node.js • Python • Java • AWS • Docker • SQL • Microservices • AI Systems
        </p>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 py-10">
        © 2026 Alfiya Valitova — Production Portfolio
      </footer>

    </div>
  );
}
