import type { Metadata } from 'next'
import { LegalPage } from '@/components/Legal'

export const metadata: Metadata = {
  title: 'Terms and conditions',
  description: 'The terms for using RouteLab.',
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and conditions"
      intro="By using RouteLab you agree to these terms. They are short because the site is a small free tool. Last updated October 30, 2026."
    >
      <section>
        <h2>What RouteLab is</h2>
        <p>
          RouteLab is a free, independent community project for testing RPC endpoints, estimating costs and generating
          configuration files. It is not made by, affiliated with, or endorsed by dRPC or any provider it mentions. Product and
          company names belong to their owners.
        </p>
      </section>

      <section>
        <h2>No warranty</h2>
        <p>
          The site and its output are provided as is, without warranties of any kind. Latency figures reflect your own network at the
          moment of the test. Prices are published rates as reported for October 2026 and may be out of date or wrong. Generated
          configuration files are starting points and may contain mistakes.
        </p>
        <p>
          Nothing here is financial, legal or engineering advice. Verify prices on vendor pages and test configurations before you use
          them in production. You are responsible for decisions you make based on this site.
        </p>
      </section>

      <section>
        <h2>Limit of liability</h2>
        <p>
          To the extent the law allows, the author is not liable for any loss or damage arising from using the site or relying on its
          output, including downtime, incorrect estimates or misconfigured infrastructure.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <ul>
          <li>Do not use the site to send abusive volumes of requests to dRPC&rsquo;s public endpoints or to anyone else&rsquo;s.</li>
          <li>Do not attempt to disrupt the site or its hosting.</li>
          <li>Respect the terms and rate limits of every endpoint you test.</li>
        </ul>
      </section>

      <section>
        <h2>Third-party services</h2>
        <p>
          The site calls third-party endpoints and links to third-party sites. Their availability and terms are outside our control.
        </p>
      </section>

      <section>
        <h2>Changes and contact</h2>
        <p>
          These terms may change, and the date above will change with them. Continued use means you accept the current version.
          Questions can go to <a href="https://x.com/Oh_Jay0" target="_blank" rel="noopener noreferrer">@Oh_Jay0</a> on X.
        </p>
      </section>
    </LegalPage>
  )
}
