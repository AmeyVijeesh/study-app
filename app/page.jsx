import '@/styles/landing.css';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  fa0,
  faBook,
  faChartBar,
  faChartLine,
  faClock,
  faFire,
  faJournalWhills,
  faSmile,
} from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  return (
    <>
      <Head>
        <title>Stay Productive | All-in-one Productivity Solution</title>
        <meta
          name="description"
          content="All-in-one productivity solution to ensure that you meet those deadlines."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="landing-bg">
        <div className="landing-container">
          <div className="landing-content">
            <h1 className="landing-title">Looking to Stay Productive?</h1>
            <p className="landing-text">
              All-in-one productivity solution to ensure that you meet those
              deadlines.
            </p>
            <div className="landing-btns">
              <button className="landing-btn primary">Get Started</button>
              <button className="landing-btn secondary">View Features</button>
            </div>
          </div>
        </div>
      </div>
      <div className="features-bg">
        <div className="features-wrapper">
          <h2 className="features-title">Features</h2>
          <div className="features-container">
            <div className="features-feature">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <h3 className="feature-title">Minimalist Pomodoro</h3>
              <p className="feature-desc">
                A 100% customizable pomodoro timer to ensure fatigue doesn't
                take over your workflow.
              </p>
            </div>
            <div className="features-feature">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faChartBar} />
              </div>
              <h3 className="feature-title">Time-Based Statistics</h3>
              <p className="feature-desc">
                A wide array of statistics giving a bird's eye view of your
                productivity each day.
              </p>
            </div>
            <div className="features-feature">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faBook} />
              </div>
              <h3 className="feature-title">Daily Journal</h3>
              <p className="feature-desc">
                Detailed logging of each day for meaningful self-reflection and
                continuous improvement.
              </p>
            </div>
            <div className="features-feature">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faFire} />
              </div>
              <h3 className="feature-title">Streak System</h3>
              <p className="feature-desc">
                Subtle gamification to maintain motivation and interest while
                keeping the experience minimalist.
              </p>
            </div>
            <div className="features-feature">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <h3 className="feature-title">Charts and Graphs</h3>
              <p className="feature-desc">
                Detailed visualizations provide an at-a-glance view of your
                productivity metrics.
              </p>
            </div>
            <div className="features-feature">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faSmile} />
              </div>
              <h3 className="feature-title">Minimalist Theme</h3>
              <p className="feature-desc">
                A distraction-free, elegant interface ensures comfortable,
                focused work sessions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
