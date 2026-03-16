import { FadeInSection } from "@/components/landing/FadeInSection";
import { SectionIntro } from "@/components/landing/SectionIntro";
import { TextAction } from "@/components/landing/TextAction";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import styles from "@/components/landing/landing.module.css";

const stats = [
  {
    value: "42 min",
    label: "Average deep-work block",
    text: "Long enough to build momentum, short enough to repeat tomorrow.",
  },
  {
    value: "3 views",
    label: "One lesson, many angles",
    text: "Outline, recall prompts, and timed drills stay in the same flow.",
  },
  {
    value: "0 clutter",
    label: "No ornamental UI",
    text: "Every screen is trimmed until the task is the only thing left.",
  },
  {
    value: "7 days",
    label: "Weekly study rhythm",
    text: "A cadence that turns revision into a routine instead of a rescue.",
  },
];

const principles = [
  {
    title: "Build around the headline",
    text: "Each study session starts with the one idea worth remembering, not a wall of chrome.",
  },
  {
    title: "Cut visual excuses",
    text: "No soft cards, no decorative gradients fighting for attention, no filler interactions.",
  },
  {
    title: "Keep the rhythm visible",
    text: "Progress, review windows, and next actions are always in view and always legible.",
  },
];

const features = [
  {
    index: "01",
    title: "Focus Set",
    text: "Turn any topic into a tight learning block with a lead statement, a sequence of prompts, and a final recall test.",
    note: "Structured for concentration, not browsing.",
  },
  {
    index: "02",
    title: "Recall Drill",
    text: "Force the answer before revealing the notes. The system privileges active memory over passive review.",
    note: "Fast checks with no wasted motion.",
  },
  {
    index: "03",
    title: "Progress Ledger",
    text: "Track the score that matters: what was difficult, what was forgotten, and what needs another pass.",
    note: "A record built for iteration.",
  },
  {
    index: "04",
    title: "Revision Rhythm",
    text: "Schedule sharp re-encounters with material before it fades, keeping pressure where learning actually happens.",
    note: "Repeats without becoming noise.",
  },
  {
    index: "05",
    title: "Session Notes",
    text: "Capture concise reflections after each block so your next session starts with context instead of guesswork.",
    note: "Short writing, high leverage.",
  },
  {
    index: "06",
    title: "Shared Standards",
    text: "Teams, tutors, and peers can align on one clear workflow instead of passing around disconnected docs and screenshots.",
    note: "Designed for solo use and shared accountability.",
  },
];

const steps = [
  {
    number: "01",
    title: "Frame the target",
    text: "Start with the concept that deserves attention right now. The system narrows the scope before you begin, which keeps motivation from leaking into indecision.",
  },
  {
    number: "02",
    title: "Study under tension",
    text: "Use prompts, timed reviews, and deliberate pauses to keep recall active. The interface stays quiet so the material stays loud.",
  },
  {
    number: "03",
    title: "Return with intent",
    text: "Review windows are scheduled from evidence, not vibes. Weak spots reappear until they stop being weak.",
  },
];

const proof = [
  {
    label: "Retention lift",
    value: "31%",
    text: "Average recall improvement after two weeks of structured review cycles.",
  },
  {
    label: "Setup time",
    value: "8 min",
    text: "Enough time to define a plan before the first focused block starts.",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <main>
        <header className={styles.navbar}>
          <div className={styles.container}>
            <div className={styles.navbarInner}>
              <a className={styles.brand} href='#top'>
                Study App
              </a>
              <nav className={styles.navLinks} aria-label='Primary navigation'>
                <a className={styles.navLink} href='#features'>
                  Features
                </a>
                <a className={styles.navLink} href='#pricing'>
                  Pricing
                </a>
                <a className={styles.navLink} href='#about'>
                  About
                </a>
              </nav>
              <div className={styles.navActions}>
                <ThemeToggle
                  className={styles.navThemeToggle}
                  ariaLabel='Landing page theme'
                />
                <a className={styles.navLogin} href='/login'>
                  Start Now
                </a>
              </div>
            </div>
          </div>
        </header>

        <FadeInSection className={styles.hero} id='top'>
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                {/* <p className={styles.eyebrow}>Studyapp1 / Focus by design</p> */}
                <h1 className={styles.heroTitle}>
                  All your classes.
                  <span className={styles.heroTitleAccent}>
                    {" "}
                    turn into a study system.
                  </span>
                </h1>
                <p className={styles.heroDescription}>
                  Studyapp1 turns revision into an editorial flow: one idea at a
                  time, one sharp decision per screen, one system for building
                  recall instead of collecting tabs.
                </p>
                <div className={styles.heroActions}>
                  <TextAction href='#features'>Explore the system</TextAction>
                  <TextAction href='#method' variant='secondary'>
                    See the method
                  </TextAction>
                  <TextAction href='#proof' variant='ghost'>
                    Read the evidence
                  </TextAction>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.heroNumber} aria-hidden='true'>
            01
          </div>
        </FadeInSection>

        <FadeInSection className={styles.stats}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              {stats.map((stat) => (
                <article className={styles.stat} key={stat.label}>
                  <p className={styles.statValue}>{stat.value}</p>
                  <p className={styles.statLabel}>{stat.label}</p>
                  <p className={styles.statText}>{stat.text}</p>
                </article>
              ))}
            </div>
          </div>
        </FadeInSection>

        <FadeInSection className={styles.section} id='about'>
          <div className={styles.container}>
            <SectionIntro
              eyebrow='Manifesto'
              title='The interface should feel like a study desk, not a dashboard.'
              description='The product direction is simple: remove decorative friction, amplify hierarchy, and make every action read like a clear editorial instruction.'
              align='split'
            />
            <div className={styles.manifestoGrid}>
              <p className={styles.manifestoLead}>
                Strong learning systems do not whisper. They tell you what
                matters, what comes next, and what deserves another pass.
              </p>
              <div className={styles.manifestoText}>
                <p>
                  This landing page is built to mirror the product idea. Large
                  type creates urgency. Negative space frames the task. Accent
                  color is saved for moments that need to cut through.
                </p>
                <p>
                  The result is a study brand that feels confident instead of
                  crowded, and practical instead of ornamental.
                </p>
                <div className={styles.manifestoList}>
                  {principles.map((item) => (
                    <div className={styles.manifestoItem} key={item.title}>
                      <p className={styles.manifestoItemTitle}>{item.title}</p>
                      <p className={styles.manifestoItemText}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection
          className={`${styles.section} ${styles.sectionMuted}`}
          id='features'
        >
          <div className={styles.container}>
            <SectionIntro
              eyebrow='System'
              title='A study flow built from typography, tempo, and clear consequence.'
              description='Each feature supports one behavior: focus, retrieval, review, or reflection. Nothing else gets promoted into the interface.'
            />
            <div className={styles.featureGrid}>
              {features.map((feature) => (
                <article className={styles.featureCard} key={feature.index}>
                  <p className={styles.featureIndex}>{feature.index}</p>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureText}>{feature.text}</p>
                  <p className={styles.featureNote}>{feature.note}</p>
                </article>
              ))}
            </div>
          </div>
        </FadeInSection>

        <FadeInSection className={styles.section} id='pricing'>
          <div className={styles.container}>
            <SectionIntro
              eyebrow='Pricing'
              title='One clear plan for people who want momentum, not menu fatigue.'
              description='The pricing model follows the product philosophy: one strong default, one higher-touch option, and no clutter in the decision.'
            />
            <div className={styles.pricingGrid}>
              <article className={styles.pricingCard}>
                <p className={styles.pricingLabel}>Core</p>
                <p className={styles.pricingPrice}>
                  $12<span className={styles.pricingUnit}> / month</span>
                </p>
                <p className={styles.pricingText}>
                  For individual learners building a repeatable study rhythm.
                </p>
                <ul className={styles.pricingList}>
                  <li>Unlimited focus sets and recall drills</li>
                  <li>Revision scheduling and progress ledger</li>
                  <li>Session notes with weekly review summaries</li>
                </ul>
                <TextAction href='/login'>Start now</TextAction>
              </article>
              <article
                className={`${styles.pricingCard} ${styles.pricingFeatured}`}
              >
                <p className={styles.pricingBadge}>Most selected</p>
                <p className={styles.pricingLabel}>Studio</p>
                <p className={styles.pricingPrice}>
                  $29<span className={styles.pricingUnit}> / month</span>
                </p>
                <p className={styles.pricingText}>
                  For tutors and small cohorts who want one shared standard for
                  prep, review, and accountability.
                </p>
                <ul className={styles.pricingList}>
                  <li>Everything in Core</li>
                  <li>Shared study spaces for teams and cohorts</li>
                  <li>Instructor visibility into weak-signal topics</li>
                </ul>
                <TextAction href='/login' variant='secondary'>
                  Start now
                </TextAction>
              </article>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection className={styles.section} id='method'>
          <div className={styles.container}>
            <SectionIntro
              eyebrow='Method'
              title='Three moves. Repeated until the subject finally sticks.'
              description='The product is opinionated about sequence. That is a feature, not a limitation.'
            />
            <div className={styles.steps}>
              {steps.map((step) => (
                <article className={styles.step} key={step.number}>
                  <p className={styles.stepNumber}>{step.number}</p>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepText}>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </FadeInSection>

        <FadeInSection
          className={`${styles.section} ${styles.sectionMuted}`}
          id='proof'
        >
          <div className={styles.container}>
            <SectionIntro
              eyebrow='Proof'
              title='Sharper language. Stronger recall. A calmer way to study.'
              description='The visual system is intentionally forceful, but the actual experience is simpler: clearer decisions, fewer distractions, better return sessions.'
            />
            <div className={styles.proofGrid}>
              <article className={styles.quoteCard}>
                <p className={styles.quoteText}>
                  “It feels less like an app asking for attention and more like
                  a study routine already in motion.”
                </p>
                <p className={styles.quoteAuthor}>
                  Beta learner / Pre-med cohort
                </p>
              </article>
              {proof.map((item) => (
                <article className={styles.proofCard} key={item.label}>
                  <p className={styles.proofLabel}>{item.label}</p>
                  <p className={styles.proofValue}>{item.value}</p>
                  <p className={styles.proofText}>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </FadeInSection>

        <FadeInSection className={styles.section}>
          <div className={styles.container}>
            <div className={styles.ctaPanel}>
              <div>
                <p className={styles.eyebrow}>Ready to launch</p>
                <h2 className={styles.ctaTitle}>
                  Bring the same discipline to the product as the learner.
                </h2>
              </div>
              <div>
                <p className={styles.ctaDescription}>
                  This foundation gives the app a real point of view: central
                  tokens, reusable section patterns, responsive type hierarchy,
                  and interaction details that feel crisp instead of generic.
                </p>
                <div className={styles.ctaActions}>
                  <TextAction href='#about'>Review the manifesto</TextAction>
                  <TextAction href='#features' variant='secondary'>
                    Browse features
                  </TextAction>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.footerGrid}>
              <p className={styles.footerMark}>Studyapp1</p>
              <p className={styles.footerText}>
                Editorial study flows for people who want their interface to be
                as focused as their revision plan.
              </p>
              <div className={styles.footerLinks}>
                <TextAction href='#features' variant='ghost'>
                  Features
                </TextAction>
                <TextAction href='#method' variant='ghost'>
                  Method
                </TextAction>
                <TextAction href='#proof' variant='ghost'>
                  Proof
                </TextAction>
              </div>
            </div>
          </div>
        </FadeInSection>
      </main>
    </div>
  );
}
