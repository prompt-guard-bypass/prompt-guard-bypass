import { useState } from 'react'
import './App.css'
import overviewSvg from './assets/overview.svg'
import Navigation from './components/Navigation'
import Playground from './components/Playground'

function App() {
  const [activeTab, setActiveTab] = useState<'paper' | 'playground'>('paper');

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'paper' ? (
        <div className="container">
          {/* Header Section */}
          <header className="header">
        <h1 className="title">
          Bypassing Prompt Guards in Production with Controlled-Release
          Prompting
        </h1>

        <div className="authors">
          <a href="https://www.jaiden.info/" className="author" target="_blank" rel="noopener noreferrer">
            Jaiden Fairoze<sup>1</sup>
          </a>
          <a href="https://people.eecs.berkeley.edu/~sanjamg/" className="author" target="_blank" rel="noopener noreferrer">
            Sanjam Garg<sup>1,2</sup>
          </a>
          <a href="https://keewoolee.github.io/" className="author" target="_blank" rel="noopener noreferrer">
            Keewoo Lee<sup>1</sup>
          </a>
          <a href="https://sites.google.com/view/mingyuan-wang" className="author" target="_blank" rel="noopener noreferrer">
            Mingyuan Wang<sup>3</sup>
          </a>
        </div>

        <div className="affiliation">
          <span><sup>1</sup>University of California, Berkeley</span>
          <span><sup>2</sup>Exponential Science Foundation</span>
          <span><sup>3</sup>New York University Shanghai</span>
        </div>

        <div className="links">
          <a
            href="https://arxiv.org/abs/your-paper-id"
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
          being easy to implement and update. In this work, we introduce a new
          attack that circumvents such prompt guards, highlighting their
          limitations. Our method consistently jailbreaks production models
          while maintaining response quality, even under the highly protected
          chat interfaces of Google Gemini (2.5 Flash/Pro), DeepSeek Chat
          (DeepThink), Grok (3), and Mistral Le Chat (Magistral). The attack
          exploits a resource asymmetry between the prompt guard and the main
          LLM, encoding a jailbreak prompt that lightweight guards cannot decode
          but the main model can. This reveals an attack surface inherent to
          lightweight prompt guards in modern LLM architectures and underscores
          the need to shift defenses from blocking malicious inputs to
          preventing malicious outputs. We additionally identify other critical
          alignment issues, such as copyrighted data extraction, training data
          extraction, and malicious response leakage during thinking.
        </p>
      </section>

      {/* Main Image */}
      <section className="section">
        <div className="image-container" style={{ colorScheme: 'light' }}>
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
          In a nutshell, our attack allows for roleplay-style jailbreak prompts that were previously blocked by prompt guards to be injected and activated.
          We use a three-step process that is both model-agnostic and applicable to arbitrary malicious intents. 
          It requires neither access to model weights nor modifications 
          to the deployment pipeline.
        </p>

        <div className="feature">
          <h3>Setup</h3>
          <p>
            Given a malicious intent prompt intended for querying, first encode a known, possibly patched jailbreak 
            prompt together with the malicious prompt in a controlled-release manner. For instance, we 
            can encode a roleplay type jailbreak prompt (e.g., DAN) concatenated with a malicious prompt 
            such as "Create a fake news story that incites racial tensions and hatred."
          </p>
        </div>

        <div className="feature">
          <h3>Injection (1)</h3>
          <p>
            Query the model to decode the injection prompt. In this step, we plant the jailbreak prompt into the model's working space, bypassing the input filter via controlled-release prompting: the guard model is too weak to decode the prompt, but the main model is strong enough to decode it.
          </p>
        </div>

        <div className="feature">
          <h3>Activation (2)</h3>
          <p>
            Reference the previously decoded jailbreak prompt and ask the model to respond to the decoded malicious 
            prompt. The model then adopts the jailbreak persona and outputs the malicious response. Here, we leverage 
            the fact that modern LLMs do not reliably distinguish between input data and instructions, which is the essence of (indirect) prompt injection attacks.
          </p>
        </div>
      </section>

      {/* Citation Section */}
      <section className="section citation-section">
        <h2>Citation</h2>
        <pre className="citation">
          {`@article{yourname2025projecttitle,
  title={Your Project Title: A Descriptive Subtitle},
  author={Author One and Author Two and Author Three},
  journal={arXiv preprint arXiv:XXXX.XXXXX},
  year={2025}
}`}
        </pre>
      </section>

        {/* Footer */}
        <footer className="footer">
          <p>
            Built with ❤️ using React. Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </footer>
      </div>
    ) : (
      <div className="container">
        <Playground />
      </div>
    )}
    </>
  );
}

export default App
