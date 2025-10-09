import { useState } from 'react'
import './App.css'
import overviewSvg from './assets/overview.svg'
import timeSpaceSvg from './assets/time_space_relationship.svg'
import bookExtractionSvg from './assets/book_extraction_success_pro.svg'
import Navigation from './components/Navigation'
import Explorer from './components/Explorer'

function App() {
  const [activeTab, setActiveTab] = useState<'paper' | 'explorer'>('paper');

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "paper" ? (
        <div className="container">
          {/* Header Section */}
          <header className="header">
            <h1 className="title">
              Bypassing Prompt Guards in Production with Controlled-Release
              Prompting
            </h1>

            <div className="authors">
              <a
                href="https://www.jaiden.info/"
                className="author"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jaiden Fairoze<sup>1</sup>
              </a>
              <a
                href="https://people.eecs.berkeley.edu/~sanjamg/"
                className="author"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sanjam Garg<sup>1,2</sup>
              </a>
              <a
                href="https://keewoolee.github.io/"
                className="author"
                target="_blank"
                rel="noopener noreferrer"
              >
                Keewoo Lee<sup>1</sup>
              </a>
              <a
                href="https://sites.google.com/view/mingyuan-wang"
                className="author"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mingyuan Wang<sup>3</sup>
              </a>
            </div>

            <div className="affiliation">
              <span>
                <sup>1</sup>University of California, Berkeley
              </span>
              <span>
                <sup>2</sup>Exponential Science Foundation
              </span>
              <span>
                <sup>3</sup>New York University Shanghai
              </span>
            </div>

            <div className="links">
              <a
                href="https://arxiv.org/abs/2510.01529"
                className="link-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 arXiv
              </a>
              <a href="mailto:fairoze@berkeley.edu" className="link-button">
                ✉️ Contact
              </a>
            </div>
          </header>

          {/* Abstract Section */}
          <section className="section">
            <h2>Abstract</h2>
            <p className="abstract">
              As large language models (LLMs) advance, ensuring AI safety and
              alignment is paramount. One popular approach is prompt guards,
              lightweight mechanisms designed to filter malicious queries while
              being easy to implement and update. In this work, we introduce a
              new attack that circumvents such prompt guards, highlighting their
              limitations. Our method consistently jailbreaks production models
              while maintaining response quality, even under the highly
              protected chat interfaces of Google Gemini (2.5 Flash/Pro),
              DeepSeek Chat (DeepThink), Grok (3), and Mistral Le Chat
              (Magistral). The attack exploits a resource asymmetry between the
              prompt guard and the main LLM, encoding a jailbreak prompt that
              lightweight guards cannot decode but the main model can. This
              reveals an attack surface inherent to lightweight prompt guards in
              modern LLM architectures and underscores the need to shift
              defenses from blocking malicious inputs to preventing malicious
              outputs. We additionally identify other critical alignment issues,
              such as copyrighted data extraction, training data extraction, and
              malicious response leakage during thinking.
            </p>
          </section>

          {/* Main Image */}
          <section className="section">
            <div className="image-container" style={{ colorScheme: "light" }}>
              <img
                src={overviewSvg}
                alt="Controlled-Release Prompting Overview"
                className="main-image"
              />
              <p className="image-caption">
                Graphical overview of our controlled-release prompting attack.
              </p>
            </div>
          </section>

          {/* Attack Overview Section */}
          <section className="section">
            <h2>Attack Overview</h2>
            <p>
              In a nutshell, our attack allows for roleplay-style jailbreak
              prompts that were previously blocked by prompt guards to be
              injected and activated. We use a three-step process that is both
              model-agnostic and applicable to arbitrary malicious intents. It
              requires neither access to model weights nor modifications to the
              deployment pipeline.
            </p>

            <div className="feature">
              <h3>Step 0: Setup</h3>
              <p>
                Given a malicious intent prompt intended for querying, first
                encode a known, possibly patched jailbreak prompt together with
                the malicious prompt in a controlled-release manner. For
                instance, we can encode a roleplay type jailbreak prompt (e.g.,
                DAN) concatenated with a malicious prompt such as "Create a fake
                news story that incites racial tensions and hatred."
              </p>
            </div>

            <div className="feature">
              <h3>Step 1: Injection</h3>
              <p>
                Query the model to decode the injection prompt. In this step, we
                plant the jailbreak prompt into the model's working space,
                bypassing the input filter via controlled-release prompting: the
                guard model is too weak to decode the prompt, but the main model
                is strong enough to decode it.
              </p>
            </div>

            <div className="feature">
              <h3>Step 2: Activation</h3>
              <p>
                Reference the previously decoded jailbreak prompt and ask the
                model to respond to the decoded malicious prompt. The model then
                adopts the jailbreak persona and outputs the malicious response.
                Here, we leverage the fact that modern LLMs do not reliably
                distinguish between input data and instructions, which is the
                essence of (indirect) prompt injection attacks.
              </p>
            </div>

            <h3 style={{ marginTop: "2rem" }}>
              Instantiating Controlled-Release Attacks
            </h3>
            <p>
              We implement two variants of controlled-release prompting that
              exploit different resource constraints:
            </p>

            <p>
              <strong>Timed-Release Attack:</strong> Applies a substitution
              cipher to each alphabetical character in the prompt, creating an
              encoding that requires the model to systematically decrypt each
              character via multi-step reasoning. This forces sequential
              computation that exceeds the inference time budget of lightweight
              guard models.
            </p>

            <p>
              <strong>Spaced-Release Attack:</strong> Replaces each character
              with verbose descriptive sentences, dramatically expanding the
              prompt length to exploit context window limitations in guard
              models. Both methods ensure that input filters with stricter
              resource constraints cannot decode the malicious content, while
              the main LLM can recover the original jailbreak prompt through its
              superior capacity.
            </p>
          </section>

          {/* Call to Action */}
          <div className="cta-section">
            <p className="cta-text">
              Explore real jailbreak examples in the{" "}
              <span
                className="cta-link"
                onClick={() => setActiveTab("explorer")}
              >
                Explorer
              </span>
              , or check out the{" "}
              <a
                href="https://arxiv.org/abs/2510.01529"
                className="cta-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                paper
              </a>{" "}
              for attack performance details. TLDR; controlled-release attacks re-enable roleplay jailbreaks on Google Gemini, DeepSeek Chat, xAI Grok, and Mistral Le Chat.
            </p>
          </div>

          {/* Analysis Section */}
          <section className="section">
            <h2>Analysis</h2>

            <h3>Validating Resource Asymmetry Thresholds</h3>
            <div className="image-container" style={{ colorScheme: "light" }}>
              <img
                src={timeSpaceSvg}
                alt="Resource thresholds for controlled-release attack success"
                className="main-image"
              />
              <p className="image-caption">
                Resource thresholds for controlled-release attack success on
                Gemini 2.5 Flash over API.
              </p>
            </div>

            <p>
              The figure above demonstrates clear thresholds where
              controlled-release attacks succeed. We evaluated 720 attack
              combinations on Gemini 2.5 Flash where baseline jailbreaks failed
              but the model could decode our encodings—precisely the scenarios
              where our controlled-release mechanism provides a non-trivial
              advantage. For timed-release attacks, success becomes more likely
              than failure above approximately 800 prompt tokens, while below
              600 tokens the opposite holds. Spaced-release attacks require
              significantly more resources, showing success thresholds above
              approximately 10,000 prompt tokens or 12,500 response tokens. The
              majority of spaced-release data points exhibit a linear
              correlation between prompt and response length, reflecting the
              structured decoding procedure that scales with input size. These
              empirical thresholds help validate our assumption that lightweight
              guardrails operate under tighter resource constraints than the
              models they protect, creating exploitable asymmetries in
              computational budgets that enable controlled-release prompting
              attacks.
            </p>

            <h3>An Application: Copyrighted Data Extraction</h3>
            <div className="image-container" style={{ colorScheme: "light" }}>
              <img
                src={bookExtractionSvg}
                alt="Copyright extraction success rates"
                className="main-image"
              />
              <p className="image-caption">
                Copyright extraction success rates for Gemini 2.5 Pro using
                roleplay jailbreak, timed-release, and spaced-release attacks.
                Similarity scores represent sentence containment and TF-IDF
                semantic similarity. Gray bars show normalized book length.
              </p>
            </div>

            <p>
              Our analysis across 60 extraction attempts reveals significant
              vulnerabilities in copyright protection mechanisms. Gemini 2.5 Pro
              demonstrates the highest susceptibility with mean extraction rates
              of 93.7% sentence containment and 90.4% TF-IDF similarity using
              timed-release attacks. Timed-release attacks prove most effective
              overall, achieving 89.5% average containment and 91.2% TF-IDF
              similarity across all tests. Most concerning, however, is that
              basic roleplay jailbreak prompts achieve extraction success rates
              of 91.2% averaged score—only 2.3 percentage points below
              controlled-release techniques. This small performance gap reveals
              a critical blind spot: Gemini 2.5 Flash/Pro alignment appears to
              inadequately protect intellectual property relative to preventing
              overtly harmful content generation. The high success rates across
              multiple attack methods suggest that memorized copyrighted content
              remains easily accessible through jailbreaking, posing serious
              threats to intellectual property rights and highlighting the need
              for more robust defenses against targeted data extraction.
            </p>
          </section>

          {/* Citation Section */}
          <section className="section citation-section">
            <h2>Citation</h2>
            <pre className="citation">
              {`@misc{fairoze2025bypassingpromptguardsproduction,
  title={Bypassing Prompt Guards in Production with Controlled-Release Prompting}, 
  author={Jaiden Fairoze and Sanjam Garg and Keewoo Lee and Mingyuan Wang},
  year={2025},
  eprint={2510.01529},
  archivePrefix={arXiv},
  primaryClass={cs.LG},
  url={https://arxiv.org/abs/2510.01529}
}`}
            </pre>
          </section>

          {/* Footer */}
          <footer className="footer">
            <p>
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </footer>
        </div>
      ) : (
        <div className="container">
          <Explorer />
        </div>
      )}
    </>
  );
}

export default App
