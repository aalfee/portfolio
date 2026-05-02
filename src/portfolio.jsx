import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/* ---------------- CONFIG ---------------- */
const GITHUB_USERNAME = "aalfee";
const CACHE_KEY = "github_cache_v2";
const CACHE_TTL = 1000 * 60 * 10;

/* ---------------- MAIN ---------------- */
export default function Portfolio() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const featured = useMemo(() => {
    return repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 4);
  }, [repos]);

  /* ---------------- DATA ---------------- */
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        setRepos(parsed.data);
        setLoading(false);
        return;
      }
    }

    async function load() {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos`
        );

        const data = await res.json();
        const cleaned = data.filter(r => !r.fork);

        setRepos(cleaned);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: cleaned, timestamp: Date.now() })
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="bg-black text-white">

      {/* ================= HERO (APPLE STYLE INTRO) ================= */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6">

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/50 text-sm tracking-widest uppercase"
        >
          Software Engineer
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-semibold mt-6 tracking-tight"
        >
          Alfiya Valitova
        </motion.h1>

        <p className="text-white/50 mt-6 max-w-xl text-lg">
          I build scalable systems, AI-driven tools, and modern web platforms.
        </p>

        <div className="mt-10 flex gap-6 text-sm text-white/40">
          <span>React</span>
          <span>Node</span>
          <span>Python</span>
          <span>AWS</span>
        </div>
      </section>

      {/* ================= PRODUCT STORY SECTION ================= */}
      <section className="min-h-screen flex items-center px-6 md:px-20 border-t border-white/10">
        <div className="max-w-4xl">

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-semibold tracking-tight"
          >
            Engineering systems that scale.
          </motion.h2>

          <p className="mt-8 text-white/60 text-lg leading-relaxed">
            From education platforms to AI-driven applications, I focus on
            building systems that handle complexity while staying elegant,
            maintainable, and fast.
          </p>

        </div>
      </section>

      {/* ================= EXPERIENCE (APPLE STYLE TIMELINE) ================= */}
      <section className="min-h-screen px-6 md:px-20 py-32 border-t border-white/10">

        <h2 className="text-4xl font-semibold mb-20">
          Experience
        </h2>

        <div className="space-y-16 max-w-3xl">

          {[
            ["Concorde Education", "Senior Software Developer"],
            ["Queens College", "Software Engineer"],
            ["Freelance", "Full Stack Developer"]
          ].map(([company, role]) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xl font-medium">{company}</p>
              <p className="text-white/50 mt-1">{role}</p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* ================= PROJECTS (APPLE GRID) ================= */}
      <section className="min-h-screen px-6 md:px-20 py-32 border-t border-white/10">

        <h2 className="text-4xl font-semibold mb-16">
          Selected Work
        </h2>

        {loading ? (
          <p className="text-white/40">Loading projects...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">

            {featured.map(repo => (
              <motion.div
                key={repo.id}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-8 rounded-2xl bg-white/[0.03] border border-white/10"
              >
                <p className="text-xl font-medium">{repo.name}</p>

                <p className="text-white/50 text-sm mt-2">
                  ⭐ {repo.stargazers_count} · {repo.language || "Code"}
                </p>

                <p className="text-white/60 mt-6 text-sm leading-relaxed">
                  {repo.description || "No description available."}
                </p>

                <a
                  href={repo.html_url}
                  target="_blank"
                  className="inline-block mt-6 text-sm text-white/80 hover:text-white"
                >
                  View Project →
                </a>
              </motion.div>
            ))}

          </div>
        )}
      </section>

      {/* ================= FINAL CTA SECTION ================= */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 border-t border-white/10">

        <h2 className="text-5xl font-semibold">
          Let’s build something great.
        </h2>

        <p className="text-white/50 mt-6 max-w-md">
          Open to software engineering roles, AI systems, and full-stack architecture work.
        </p>

        <div className="mt-10 text-white/40 text-sm">
          alfiyavcareers@gmail.com
        </div>

      </section>

    </div>
  );
}