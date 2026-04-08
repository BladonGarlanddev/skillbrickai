import { Helmet } from 'react-helmet-async';
import styles from './TermsPage.module.scss';

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <Helmet>
        <title>Terms of Service | SkillBrick AI</title>
        <meta
          name="description"
          content="Terms of Service for SkillBrick AI — rules governing use of the platform, skill library, paid services, and CLAUDE.md writing service."
        />
        <link rel="canonical" href="https://skillbrickai.com/terms" />
        <meta property="og:title" content="Terms of Service | SkillBrick AI" />
        <meta property="og:url" content="https://skillbrickai.com/terms" />
      </Helmet>

      <div className={styles.header}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.subtitle}>
          Last updated: April 7, 2026
        </p>
      </div>

      <div className={styles.body}>
        <p className={styles.intro}>
          These Terms of Service ("Terms") govern your access to and use of the
          SkillBrick AI platform, including the website, API, MCP server, skill
          library, paid services, and all related tools (collectively, the
          "Platform"). By creating an account or using the Platform, you agree to
          these Terms in full. If you do not agree, do not use the Platform.
        </p>

        {/* ───── 1. Definitions ───── */}
        <section className={styles.section}>
          <h2>1. Definitions</h2>
          <ul>
            <li>
              <strong>"Skill"</strong> — A reusable system prompt published on
              the Platform.
            </li>
            <li>
              <strong>"Service"</strong> — A paid, non-credit-based offering
              provided by SkillBrick AI (e.g., the CLAUDE.md Writing Service).
            </li>
            <li>
              <strong>"Credits"</strong> — The token-based currency used to
              install skills on the Platform.
            </li>
            <li>
              <strong>"Content"</strong> — Any text, code, prompts, files, or
              other material uploaded to or generated through the Platform.
            </li>
            <li>
              <strong>"CLAUDE.md file"</strong> — A project instruction file
              written for use with Claude Code or similar AI coding tools.
            </li>
          </ul>
        </section>

        {/* ───── 2. Accounts ───── */}
        <section className={styles.section}>
          <h2>2. Accounts</h2>
          <ol>
            <li>
              You must provide accurate information when creating an account.
            </li>
            <li>
              One person or entity may operate one account. Creating multiple
              accounts to circumvent limits, earn extra credits, or evade bans is
              prohibited.
            </li>
            <li>
              You are responsible for all activity under your account. Keep your
              credentials secure.
            </li>
            <li>
              We may suspend or terminate accounts that violate these Terms,
              with or without prior notice.
            </li>
          </ol>
        </section>

        {/* ───── 3. Acceptable Use ───── */}
        <section className={styles.section}>
          <h2>3. Acceptable Use</h2>
          <p>You agree not to use the Platform to:</p>
          <ol>
            <li>
              Violate any applicable law, regulation, or third-party right.
            </li>
            <li>
              Upload, publish, or distribute Content that is defamatory,
              obscene, harassing, threatening, or that promotes violence or
              discrimination.
            </li>
            <li>
              Distribute malware, viruses, or any code designed to interfere
              with the operation of any software or hardware.
            </li>
            <li>
              Scrape, crawl, or use automated tools to bulk-download skills,
              research items, or other Platform content beyond what is permitted
              by the API rate limits and these Terms.
            </li>
            <li>
              Reverse-engineer, decompile, or otherwise attempt to extract the
              source code of the Platform (except where permitted by applicable
              law).
            </li>
            <li>
              Impersonate any person or entity, or misrepresent your
              affiliation with any person or entity.
            </li>
            <li>
              Interfere with or disrupt the Platform's infrastructure,
              including via denial-of-service attacks, rate-limit evasion, or
              injection attacks.
            </li>
          </ol>
        </section>

        {/* ───── 4. Skill Library Rules ───── */}
        <section className={styles.section}>
          <h2>4. Skill Library Rules</h2>
          <ol>
            <li>
              <strong>Quality standard.</strong> Skills must provide genuine,
              useful instructions. Publishing empty, placeholder, low-effort, or
              intentionally misleading skills is prohibited.
            </li>
            <li>
              <strong>No credit farming.</strong> Publishing bulk low-quality or
              duplicate skills solely to earn credits is prohibited. We reserve
              the right to revoke credits earned through abuse and remove
              offending skills without notice.
            </li>
            <li>
              <strong>No prompt injection.</strong> Skills must not contain
              hidden instructions designed to override, exfiltrate data from, or
              manipulate the behavior of an AI model in ways not apparent to the
              user installing the skill. This includes instructions that attempt
              to make the model ignore its safety guidelines, leak conversation
              history, or execute unintended actions.
            </li>
            <li>
              <strong>No harmful content.</strong> Skills must not instruct AI
              models to generate illegal content, facilitate real-world harm,
              bypass safety filters, or produce content that violates the
              acceptable-use policies of major AI providers.
            </li>
            <li>
              <strong>Attribution.</strong> If your skill is derived from
              someone else's work, provide proper attribution. Claiming
              authorship of skills you did not write is prohibited.
            </li>
            <li>
              <strong>No spam or SEO manipulation.</strong> Keyword-stuffing
              skill names, descriptions, or tags to game search results is
              prohibited.
            </li>
          </ol>
        </section>

        {/* ───── 5. CLAUDE.md Writing Service ───── */}
        <section className={styles.section}>
          <h2>5. CLAUDE.md Writing Service — Additional Terms</h2>
          <p>
            The following additional rules apply specifically to the CLAUDE.md
            Writing Service and any other paid service involving the generation
            or maintenance of CLAUDE.md files.
          </p>
          <ol>
            <li>
              <strong>Repository ownership.</strong> You must have legitimate
              access to any repository you submit for CLAUDE.md generation. You
              may not submit repositories you do not own, maintain, or have
              written authorization to act on behalf of.
            </li>
            <li>
              <strong>No adversarial or weaponized instructions.</strong> You may
              not use the service to create CLAUDE.md files that contain prompt
              injections, hidden instructions, social engineering payloads, or
              any content designed to manipulate AI model behavior in malicious,
              deceptive, or harmful ways. This includes but is not limited to:
              <ul>
                <li>
                  Instructions that cause an AI to exfiltrate data, secrets, or
                  environment variables
                </li>
                <li>
                  Instructions that suppress or override an AI model's safety
                  guidelines
                </li>
                <li>
                  Instructions that cause an AI to perform destructive actions
                  (deleting files, dropping databases, force-pushing) without
                  explicit user confirmation
                </li>
                <li>
                  Instructions designed to make an AI appear to be a different
                  entity or misrepresent its capabilities
                </li>
                <li>
                  Instructions that attempt to exploit other users, services, or
                  systems when the AI follows them
                </li>
              </ul>
            </li>
            <li>
              <strong>No resale or redistribution.</strong> CLAUDE.md files
              produced by our service are for your use within the repositories
              they were written for. You may not resell, redistribute, or
              white-label them as your own commercial product or service.
            </li>
            <li>
              <strong>Fair use of the subscription.</strong> The subscription
              provides unlimited CLAUDE.md files for your own repositories and
              projects. It is not a license to operate a competing CLAUDE.md
              writing service. Patterns that indicate abuse include but are not
              limited to:
              <ul>
                <li>
                  Submitting repositories on behalf of third parties who are not
                  on your team or organization
                </li>
                <li>
                  Bulk-submitting dozens of unrelated repositories in a short
                  period with no reasonable development relationship between them
                </li>
                <li>
                  Using the output to build or train a competing product or
                  service
                </li>
              </ul>
            </li>
            <li>
              <strong>Confidentiality.</strong> We treat your repository contents
              as confidential. We will not share, publish, or use your code for
              any purpose other than fulfilling your service request. However, we
              cannot guarantee security of information transmitted over the
              internet.
            </li>
            <li>
              <strong>Delivery and revisions.</strong> We aim to deliver within a
              reasonable timeframe. Revision requests are included in your
              subscription. We reserve the right to decline revision requests
              that are abusive, contradictory, or made in bad faith.
            </li>
            <li>
              <strong>Right to refuse.</strong> We reserve the right to refuse
              service for any repository that contains illegal content, violates
              third-party rights, or where fulfilling the request would require
              us to produce content that violates these Terms.
            </li>
          </ol>
        </section>

        {/* ───── 6. Credits and Payments ───── */}
        <section className={styles.section}>
          <h2>6. Credits and Payments</h2>
          <ol>
            <li>
              Credits are a Platform currency, not a stored-value instrument.
              They have no cash value and cannot be exchanged for money.
            </li>
            <li>
              We reserve the right to adjust credit balances, pricing, or
              earning rates at any time. Material changes will be communicated in
              advance.
            </li>
            <li>
              Paid services (such as the CLAUDE.md Writing Service) are billed
              separately from the credit system. Subscription fees are charged
              monthly. You may cancel at any time; cancellation takes effect at
              the end of the current billing period.
            </li>
            <li>
              Refunds for paid services are handled on a case-by-case basis. If
              we fail to deliver on a service, you are entitled to a full refund.
            </li>
          </ol>
        </section>

        {/* ───── 7. Intellectual Property ───── */}
        <section className={styles.section}>
          <h2>7. Intellectual Property</h2>
          <ol>
            <li>
              <strong>Your content.</strong> You retain ownership of Content you
              upload to the Platform. By publishing a skill, you grant SkillBrick
              AI a non-exclusive, worldwide, royalty-free license to host,
              display, distribute, and make it available to other users through
              the Platform.
            </li>
            <li>
              <strong>Service output.</strong> CLAUDE.md files and other
              deliverables produced through paid services are owned by you upon
              delivery and payment.
            </li>
            <li>
              <strong>Platform IP.</strong> The Platform itself — including its
              design, code, branding, and documentation — is owned by SkillBrick
              AI. These Terms do not grant you any right to use our trademarks,
              logos, or branding.
            </li>
          </ol>
        </section>

        {/* ───── 8. Content Moderation ───── */}
        <section className={styles.section}>
          <h2>8. Content Moderation and Enforcement</h2>
          <ol>
            <li>
              We may review, flag, or remove any Content that violates these
              Terms.
            </li>
            <li>
              We may suspend or terminate accounts that engage in abuse, with
              or without prior warning depending on severity.
            </li>
            <li>
              Enforcement actions may include: content removal, credit
              revocation, temporary suspension, permanent ban, or referral to
              law enforcement.
            </li>
            <li>
              If you believe content on the Platform violates these Terms or
              infringes your rights, contact us at{' '}
              <a href="mailto:abuse@skillbrickai.com" className={styles.link}>
                abuse@skillbrickai.com
              </a>.
            </li>
          </ol>
        </section>

        {/* ───── 9. API and Automated Access ───── */}
        <section className={styles.section}>
          <h2>9. API and Automated Access</h2>
          <ol>
            <li>
              API access is subject to rate limits. Exceeding rate limits or
              attempting to circumvent them (via multiple accounts, rotating IPs,
              or other means) is prohibited.
            </li>
            <li>
              Automated access must identify itself with a valid API key or
              authentication token. Unauthenticated scraping is prohibited.
            </li>
            <li>
              We reserve the right to throttle, restrict, or revoke API access
              for any account that degrades Platform performance or violates
              these Terms.
            </li>
          </ol>
        </section>

        {/* ───── 10. Disclaimers ───── */}
        <section className={styles.section}>
          <h2>10. Disclaimers</h2>
          <ol>
            <li>
              The Platform is provided "as is" and "as available" without
              warranties of any kind, express or implied.
            </li>
            <li>
              Skills are community-contributed. We do not guarantee that any
              skill is accurate, safe, effective, or free from harmful
              instructions. Use skills at your own risk.
            </li>
            <li>
              CLAUDE.md files produced by our service are best-effort
              deliverables. We do not guarantee they will produce specific AI
              behavior or outcomes.
            </li>
          </ol>
        </section>

        {/* ───── 11. Limitation of Liability ───── */}
        <section className={styles.section}>
          <h2>11. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, SkillBrick AI shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages arising from your use of the Platform or any
            service, including but not limited to loss of data, loss of
            profits, or damage caused by Content obtained through the Platform.
          </p>
        </section>

        {/* ───── 12. Changes to Terms ───── */}
        <section className={styles.section}>
          <h2>12. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will
            be communicated via the Platform or email. Continued use of the
            Platform after changes take effect constitutes acceptance of the
            revised Terms.
          </p>
        </section>

        {/* ───── 13. Contact ───── */}
        <section className={styles.section}>
          <h2>13. Contact</h2>
          <p>
            Questions about these Terms? Contact us at{' '}
            <a href="mailto:legal@skillbrickai.com" className={styles.link}>
              legal@skillbrickai.com
            </a>.
          </p>
          <p>
            To report abuse or content violations:{' '}
            <a href="mailto:abuse@skillbrickai.com" className={styles.link}>
              abuse@skillbrickai.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
