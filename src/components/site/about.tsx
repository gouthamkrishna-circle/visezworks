import { motion } from "motion/react";

const SERVICES = [
  {
    no: "01",
    title: "Web Development",
    copy: "Modern, responsive websites built for performance and usability.",
  },
  {
    no: "02",
    title: "Video Editing",
    copy: "Engaging edits, motion, pacing, and visual storytelling for digital content.",
  },
  {
    no: "03",
    title: "Digital Experience",
    copy: "A balance of design, technology, and content that makes brands memorable.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="eyebrow"
        >
          Who we are
        </motion.p>

        <div className="mt-3 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[13vw] uppercase leading-[0.86] tracking-[-0.04em] text-foreground sm:text-[5.5rem]"
          >
            Small team.
            <span className="block text-primary">Big ideas.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-[15px] leading-relaxed text-muted-foreground"
          >
            VisezWorks is a small creative studio focused on building modern websites and editing
            compelling video content. We combine clean design, solid development, and visual
            storytelling to help businesses and creators build a stronger digital presence.
          </motion.p>
        </div>

        <div className="mt-16 grid border-y border-border sm:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.no}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative py-8 sm:px-7 sm:first:pl-0 sm:last:pr-0 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-border"
            >
              <span className="font-bebas text-sm sm:text-base tracking-wider text-primary">
                {s.no} —
              </span>
              <h3 className="mt-3 font-display text-xl uppercase tracking-[-0.01em] text-foreground transition-colors duration-300 group-hover:text-primary">
                {s.title}
              </h3>
              <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-muted-foreground">
                {s.copy}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
