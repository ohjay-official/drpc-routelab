import type { Metadata } from 'next'
import { LegalPage } from '@/components/Legal'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'What RouteLab does and does not collect.',
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="RouteLab is a static site with no accounts and no backend of its own. This page explains what that means in practice. Last updated October 30, 2026."
    >
      <section>
        <h2>What we collect</h2>
        <p>
          RouteLab does not collect personal data. There are no accounts, forms, cookies set by the site, advertising or analytics
          scripts, and no database. We do not receive the RPC URLs you type or the results of your tests.
        </p>
      </section>

      <section>
        <h2>Where requests go</h2>
        <p>
          When you run a benchmark, your browser sends JSON-RPC requests directly to dRPC&rsquo;s public endpoints and to any URLs you
          enter. Those services see your IP address and request details, as any website you call would, and handle them under their
          own policies. RouteLab&rsquo;s own pages never see that traffic.
        </p>
        <p>
          The configuration generator never asks for an API key. The files it produces read your key from an environment variable.
          If you paste an RPC URL that contains a key into the benchmark, the key is used only for the requests you start. It is held
          in the page&rsquo;s memory and cleared when you close or reload the tab.
        </p>
      </section>

      <section>
        <h2>Storage in your browser</h2>
        <p>
          The site writes one value to session storage, a flag that lets the opening animation skip itself on repeat visits during the
          same browser session. It contains no personal data and is removed when the session ends.
        </p>
      </section>

      <section>
        <h2>Hosting and fonts</h2>
        <p>
          The site is hosted on Vercel, which may log standard request data such as IP address and user agent for security and
          operations, under its own privacy policy. Fonts are served from this site, so your browser makes no request to a font
          provider.
        </p>
      </section>

      <section>
        <h2>Links to other sites</h2>
        <p>
          Pages link to dRPC, GitHub, viem and X. Those sites have their own privacy practices, which we do not control.
        </p>
      </section>

      <section>
        <h2>Changes and contact</h2>
        <p>
          If this changes, the date above changes. Questions can go to <a href="https://x.com/Oh_Jay0" target="_blank" rel="noopener noreferrer">@Oh_Jay0</a> on X.
        </p>
      </section>
    </LegalPage>
  )
}
