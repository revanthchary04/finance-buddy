import * as React from "react";
import { DocPage } from "./index";
import { CodeBlock } from "@/components/docs/code-block";

// Reusable component for section headers to ensure consistency and provide the hover anchor (#) effect
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4 group flex items-center -ml-6 pl-6">
    <a 
      href={`#${typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : ''}`}
      className="absolute -ml-6 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity text-xl hover:text-foreground no-underline"
    >
      #
    </a>
    {children}
  </h2>
);

export const docsData: Record<string, DocPage> = {
  "getting-started": {
    title: "The Beginning of Financial Clarity",
    description: "Welcome to Finance Buddy.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "Every rupee you earn has a story. Finance Buddy is where those stories are told."
        </p>
        <p>
          Finance Buddy isn't just another tracker. It is a philosophy of wealth, built for those who treat their financial data with the respect it deserves. Because of our focus on privacy and data integrity, you cannot simply sign up and enter. Finance Buddy operates on an invite-only philosophy—quality over quantity.
        </p>
        <SectionHeading>The Journey Inside</SectionHeading>
        <p>
          Your journey begins when you sign up. You will wait in a pending state until a super admin reviews your profile and grants you access. This gatekeeping ensures our system remains pure. Once approved, you'll complete an onboarding flow. Finally, the gates open to your Dashboard—a real-time command center that tracks your True Net Worth, your Lifetime Savings, and every rupee that flows through your life.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">Pro Tip</h4>
          <p className="text-foreground">
            Complete your onboarding profile fully — your designation and company help you contextualize your financial decisions against your career stage.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Ledger of Your Life", href: "/docs/features/transactions" },
      { title: "The Gatekeeper Philosophy", href: "/docs/admin/approving-users" },
      { title: "How Finance Buddy Thinks", href: "/docs/tech/architecture" }
    ]
  },
  "features/transactions": {
    title: "The Ledger of Your Life",
    description: "Track your income and expenses seamlessly.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "Ancient merchants kept ledgers. You have something better."
        </p>
        <p>
          Every rupee moving in or out of your life is a transaction. Think of your income as the fuel and your expenses as the engine. To master your cash flow, you must record the truth without hesitation.
        </p>
        <SectionHeading>The Anatomy of a Record</SectionHeading>
        <p>
          When you log a transaction, some fields are non-negotiable because they form the spine of your financial history:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Amount (₹):</strong> The absolute truth of the transaction.</li>
          <li><strong>Description:</strong> The memory attached to the number.</li>
          <li><strong>Date:</strong> The exact point on your financial timeline.</li>
          <li><strong>Category:</strong> The chapter this transaction belongs to (e.g., Food, Travel).</li>
        </ul>
        <p className="mt-4">
          Optional fields like <strong>Location</strong> and <strong>Time</strong> provide the context and patterns you'll analyze months from now. These transactions feed every other calculation in the app—from your budgets to your True Net Worth.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">The Genius Move</h4>
          <p className="text-foreground">
            Describe your transactions like you are writing to your future self — not just "Food" but "Dinner with client at Hyatt". The description becomes your financial diary.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Art of Spending Intentionally", href: "/docs/features/budgets" },
      { title: "The Mirror That Does Not Lie", href: "/docs/features/reports" },
      { title: "The Number That Does Not Lie", href: "/docs/calculations/lifetime-savings" }
    ]
  },
  "features/budgets": {
    title: "The Art of Spending Intentionally",
    description: "Set spending limits and track your progress.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "A budget is not a restriction. It is a decision made in advance."
        </p>
        <p>
          Most people view budgets as handcuffs. In reality, they are blueprints. When you create a budget in Finance Buddy, you are deciding exactly how you want your money to behave for the month before the month even begins.
        </p>
        <SectionHeading>Commanding Your Capital</SectionHeading>
        <p>
          You set limits per category. As you log transactions, Finance Buddy tracks your actual spending against these intentional limits. The progress bars will fill up. When you approach the limit, the system warns you. This visual friction forces you to pause and evaluate: Is this purchase aligned with the decision I made on the first of the month?
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">Pro Tip</h4>
          <p className="text-foreground">
            Set your budget 20% lower than you think you need. The discomfort teaches you more than the number.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Ledger of Your Life", href: "/docs/features/transactions" },
      { title: "The Dream Ledger", href: "/docs/features/wishlist" },
      { title: "When the System Speaks, Listen", href: "/docs/calculations/financial-warnings" }
    ]
  },
  "features/savings-accounts": {
    title: "The Vault Within",
    description: "Protect and grow your wealth pools.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "The difference between people who build wealth and those who do not is one habit — paying themselves first."
        </p>
        <p>
          Savings accounts exist separately from your raw income because they serve a higher purpose. This is the philosophy of intentional saving versus leftover saving. If you wait to see what is left at the end of the month, there will be nothing.
        </p>
        <SectionHeading>Structuring Your Vault</SectionHeading>
        <p>
          You create named accounts—like your Emergency Fund, an FD, or a House Down Payment. Every time you add a contribution, you are actively reducing your spendable Lifetime Savings and increasing your secure savings pool asset. The history sheet inside every account stands as indisputable proof of your discipline over time.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">The Genius Move</h4>
          <p className="text-foreground">
            Name your savings account after the emotion it protects — not "Emergency Fund" but "Peace of Mind Fund". Names matter.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Number That Does Not Lie", href: "/docs/calculations/lifetime-savings" },
      { title: "Your Complete Financial Portrait", href: "/docs/calculations/true-net-worth" },
      { title: "The Dream Ledger", href: "/docs/features/wishlist" }
    ]
  },
  "features/debts": {
    title: "The Weight You Carry and How to Set It Down",
    description: "Manage your outstanding liabilities.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "Debt is not the enemy. Ignored debt is."
        </p>
        <p>
          Debt is financial gravity. It pulls on your net worth every second of every day. To overcome it, you must first acknowledge its exact weight.
        </p>
        <SectionHeading>Classifying the Burden</SectionHeading>
        <p>
          We classify debts into three distinct types: <strong>Loans</strong> for heavy, structured purchases; <strong>Credit Cards</strong> for high-interest revolving credit; and <strong>Other</strong> for informal borrowings.
        </p>
        <p>
          You track your EMI schedules here. When you mark a payment as paid, the integrity of the system kicks in—it automatically creates a matching expense transaction to keep your cash flow perfectly balanced. Overdue payments are detected immediately, because unpaid debt drastically reduces your True Net Worth.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">Pro Tip</h4>
          <p className="text-foreground">
            Add every debt — even the ₹5,000 you borrowed from a friend. What gets tracked gets paid.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Mathematics of Borrowed Time", href: "/docs/calculations/emi" },
      { title: "Your Complete Financial Portrait", href: "/docs/calculations/true-net-worth" },
      { title: "When the System Speaks, Listen", href: "/docs/calculations/financial-warnings" }
    ]
  },
  "features/wishlist": {
    title: "The Dream Ledger",
    description: "Save for the things you want.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "Every purchase you have ever made started as a thought. The Wishlist is where disciplined thoughts live before they become reality."
        </p>
        <p>
          Do not confuse your Wishlist with your Savings Accounts. Savings are open-ended vaults; Wishlist items are highly specific goals with absolute targets and priorities (High, Medium, Low). 
        </p>
        <SectionHeading>The Journey of a Goal</SectionHeading>
        <p>
          You log contributions toward your wishlist items over time. Once the target is reached, the status flips to <strong>Funded</strong>. Until you actually spend the money (marking it <strong>Purchased</strong>), all your wishlist contributions act as liquid assets, bolstering your True Net Worth calculation.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">The Genius Move</h4>
          <p className="text-foreground">
            Add the price + 15% to every wishlist item. Prices rise. Your goal should absorb that.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Vault Within", href: "/docs/features/savings-accounts" },
      { title: "Your Complete Financial Portrait", href: "/docs/calculations/true-net-worth" },
      { title: "The Art of Spending Intentionally", href: "/docs/features/budgets" }
    ]
  },
  "features/reports": {
    title: "The Mirror That Does Not Lie",
    description: "Visualize your financial health.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "Data does not judge. It simply shows you who you have been."
        </p>
        <p>
          You can lie to yourself about your spending, but the Reports section will not. It strips away your justifications and presents the cold, hard mathematics of your lifestyle.
        </p>
        <SectionHeading>Decoding the Reflection</SectionHeading>
        <p>
          The dashboard gives you four critical views: the Income vs Expense trend, the Category breakdown donut chart, the raw Monthly summary table, and your Top spending categories. While it is tempting to look at the last 30 days, the "All Time" date range matters infinitely more because it reveals your entrenched behavioral patterns.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">Pro Tip</h4>
          <p className="text-foreground">
            Look at your top spending category first. It will tell you more about your values than any personality test.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Ledger of Your Life", href: "/docs/features/transactions" },
      { title: "The Number That Does Not Lie", href: "/docs/calculations/lifetime-savings" },
      { title: "When the System Speaks, Listen", href: "/docs/calculations/financial-warnings" }
    ]
  },
  "calculations/lifetime-savings": {
    title: "The Number That Does Not Lie",
    description: "Understanding your spendable accumulated wealth.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "Strip away everything — investments, debts, goals — and one number remains. This is it."
        </p>
        <CodeBlock>
          Lifetime Savings = All Time Income − All Time Expenses − Savings Contributions
        </CodeBlock>
        <p className="mt-6">
          This is the primary metric of Finance Buddy. It represents the raw, unallocated cash you have generated and retained since you began tracking. Every single transaction affects it in real time. If this number is negative, you are literally spending beyond your means and surviving on debt or past reserves.
        </p>
        <p>
          <strong>Example:</strong> If you earned ₹12,00,000 over 3 years, spent ₹8,00,000 on expenses, and put ₹2,00,000 into savings accounts — your Lifetime Savings is ₹2,00,000. That is your spendable accumulated wealth. Monthly snapshots are secondary; this number is your true financial pulse.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">The Genius Move</h4>
          <p className="text-foreground">
            Watch this number like a hawk. If your income goes up but your Lifetime Savings stays flat, you are suffering from lifestyle inflation.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "Your Complete Financial Portrait", href: "/docs/calculations/true-net-worth" },
      { title: "The Vault Within", href: "/docs/features/savings-accounts" },
      { title: "The Ledger of Your Life", href: "/docs/features/transactions" }
    ]
  },
  "calculations/true-net-worth": {
    title: "Your Complete Financial Portrait",
    description: "How your True Net Worth is calculated.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "Net worth is not what you earn. It is what remains after all the math is done."
        </p>
        <CodeBlock>
          True Net Worth = Lifetime Savings + Savings Pool + Wishlist Contributions − Total Debt
        </CodeBlock>
        <p className="mt-6">
          While Lifetime Savings shows your liquid cash, True Net Worth is the ultimate scorecard. It absorbs your entire financial existence. We add your Savings Pool and Wishlist Contributions because they are assets you control. We aggressively subtract your Total Debt because it is a liability dragging you down.
        </p>
        <p>
          Your True Net Worth can actually be positive even if your Lifetime Savings is low—provided you have heavily funded your savings pool. The ultimate goal is simple: ensure your True Net Worth grows month over month.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">Pro Tip</h4>
          <p className="text-foreground">
            A high income means nothing if your True Net Worth is negative. Focus on the equation, not just the income variable.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Number That Does Not Lie", href: "/docs/calculations/lifetime-savings" },
      { title: "The Weight You Carry and How to Set It Down", href: "/docs/features/debts" },
      { title: "The Dream Ledger", href: "/docs/features/wishlist" }
    ]
  },
  "calculations/emi": {
    title: "The Mathematics of Borrowed Time",
    description: "How loan EMIs are calculated.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "When you borrow money, you are borrowing from your future self. Know the cost."
        </p>
        <CodeBlock>
{`EMI = P × r × (1+r)^n / ((1+r)^n − 1)

Where:
P = Principal loan amount
r = Monthly interest rate (Annual rate ÷ 12 ÷ 100)
n = Loan tenure in months`}
        </CodeBlock>
        <p className="mt-6">
          <strong>Example:</strong> A ₹5,00,000 loan at 10% annual interest for 3 years (36 months):<br/>
          r = 10/12/100 = 0.00833<br/>
          EMI = ₹16,133/month.<br/>
          Total paid = ₹5,80,788. Cost of borrowing = ₹80,788.
        </p>
        <p>
          Finance Buddy auto-calculates this ruthless mathematics for you. Marking payments updates your debt balance immediately. If you miss payments, your financial risk score escalates because overdue debt destroys wealth compounding.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">The Genius Move</h4>
          <p className="text-foreground">
            Always round up your EMI payment by 10%. The math of compounding works in reverse when you pay off principal early.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Weight You Carry and How to Set It Down", href: "/docs/features/debts" },
      { title: "Your Complete Financial Portrait", href: "/docs/calculations/true-net-worth" },
      { title: "When the System Speaks, Listen", href: "/docs/calculations/financial-warnings" }
    ]
  },
  "calculations/financial-warnings": {
    title: "When the System Speaks, Listen",
    description: "Understanding the financial risk warning system.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "The best financial advisor is one that warns you before the crisis, not after."
        </p>
        <p>
          Finance Buddy does not just passively record your actions; it evaluates them. The Financial Risk Warning System constantly analyzes your ratios and triggers alerts based on exact mathematical conditions.
        </p>
        <ul className="space-y-4 mt-6">
          <li className="p-4 border border-yellow-500/50 bg-yellow-500/10 rounded-xl">
            <strong className="text-yellow-500">🟡 Caution:</strong> Triggered when your monthly expenses exceed 70% of your monthly income.
          </li>
          <li className="p-4 border border-orange-500/50 bg-orange-500/10 rounded-xl">
            <strong className="text-orange-500">🟠 Warning:</strong> Triggered when monthly expenses exceed 90% OR your lifetime savings drop below your savings pool (meaning you are dipping into reserved funds).
          </li>
          <li className="p-4 border border-red-500/50 bg-red-500/10 rounded-xl">
            <strong className="text-red-500">🔴 Critical:</strong> Triggered when your lifetime savings turn negative OR your debt exceeds 50% of your all-time income.
          </li>
        </ul>
        <p className="mt-4">
          These warnings intercept your behavior in three places: the dashboard banner, a badge on the notification bell, and most importantly, directly inside the Add Transaction form to stop you <em>before</em> you make a mistake. They reset daily to keep you accountable.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">Pro Tip</h4>
          <p className="text-foreground">
            Never dismiss a critical warning without taking one concrete action to fix it that same day.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Number That Does Not Lie", href: "/docs/calculations/lifetime-savings" },
      { title: "The Ledger of Your Life", href: "/docs/features/transactions" },
      { title: "The Weight You Carry and How to Set It Down", href: "/docs/features/debts" }
    ]
  },
  "admin/approving-users": {
    title: "The Gatekeeper Philosophy",
    description: "Managing user access in the invite-only system.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "Not everyone who knocks deserves to enter. The super admin decides."
        </p>
        <p>
          Finance Buddy is a fortress. We prioritize data integrity and serious users over vanity metrics. When a user creates an account, they are placed in a holding pattern—a <code>pending</code> status. They see nothing and can do nothing.
        </p>
        <SectionHeading>The Protocol of Entry</SectionHeading>
        <p>
          An Admin or Super Admin navigates to the Admin Overview to review pending approvals. Only upon explicit approval is the status updated to <code>approved</code>, triggering a welcome protocol. If rejected, they remain locked out permanently.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">The Genius Move</h4>
          <p className="text-foreground">
            Review pending users daily. A secure system relies on active gatekeepers, not passive walls.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Hierarchy of Trust", href: "/docs/admin/roles" },
      { title: "The Audit Trail", href: "/docs/admin/logs" },
      { title: "The Architecture of Trust", href: "/docs/tech/auth-security" }
    ]
  },
  "admin/roles": {
    title: "The Hierarchy of Trust",
    description: "Understanding the role hierarchy.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "In every system of value, there is a hierarchy of responsibility."
        </p>
        <p>
          Permissions are not handed out lightly. Finance Buddy utilizes a strict Role-Based Access Control (RBAC) architecture embedded directly into the authentication JWTs.
        </p>
        <ul className="list-disc pl-6 space-y-4 mt-6">
          <li><strong>User:</strong> The foundation. They have absolute sovereignty over their own data but cannot see beyond their own walls.</li>
          <li><strong>Admin:</strong> The managers. They can approve new entrants, review the global audit logs, and curate the master taxonomy of categories.</li>
          <li><strong>Super Admin:</strong> The architects. They manage the admins. A super admin cannot delete themselves—the system refuses to be left leaderless.</li>
        </ul>
        <p className="mt-4">
          Because these roles are injected into the JWT claims, promoting a user requires them to re-login to re-mint their cryptographic proof of authority.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">Pro Tip</h4>
          <p className="text-foreground">
            Keep the number of Admins small and Super Admins even smaller. Trust does not scale.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Gatekeeper Philosophy", href: "/docs/admin/approving-users" },
      { title: "The Architecture of Trust", href: "/docs/tech/auth-security" },
      { title: "How Finance Buddy Thinks", href: "/docs/tech/architecture" }
    ]
  },
  "admin/logs": {
    title: "The Audit Trail",
    description: "Monitoring authentication events.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "Every action leaves a trace. The logs are the conscience of the system."
        </p>
        <p>
          In a finance application, accountability is non-negotiable. The system meticulously logs every <code>SIGNED_IN</code>, <code>SIGNED_OUT</code>, <code>USER_DELETED</code>, and approval event. 
        </p>
        <p>
          Our session pairing logic intelligently matches a sign-in with its subsequent sign-out to calculate the exact session duration. If a user crashes or leaves abruptly without signing out, the system marks them as an "Active" session until a definitive end is recorded. Admins can filter these logs to ensure the integrity of platform access.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">The Genius Move</h4>
          <p className="text-foreground">
            Filter the audit logs for administrative roles weekly. Watch the watchers.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Gatekeeper Philosophy", href: "/docs/admin/approving-users" },
      { title: "The Hierarchy of Trust", href: "/docs/admin/roles" },
      { title: "The Blueprint of Your Financial World", href: "/docs/tech/database-schema" }
    ]
  },
  "tech/architecture": {
    title: "How Finance Buddy Thinks",
    description: "The technology stack behind Finance Buddy.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "Great software is not built. It is designed — layer by layer, decision by decision."
        </p>
        <p>
          Finance Buddy employs a strict Feature-Based Domain-Driven Architecture on top of Next.js 15 App Router. 
        </p>
        <p>
          We separate concerns aggressively. The <code>app/</code> layer only orchestrates routes. The <code>features/</code> layer encapsulates domain logic (actions, components, utils). Features never import directly from other features' internal files—they communicate through barrel exports. This structural discipline ensures that as the codebase scales, it remains elegant and predictable. Server Components handle the heavy lifting of data fetching securely, while minimal Client Components handle interaction.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">Pro Tip</h4>
          <p className="text-foreground">
            Respect the architectural boundaries. A messy import today is a circular dependency nightmare tomorrow.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Blueprint of Your Financial World", href: "/docs/tech/database-schema" },
      { title: "The Architecture of Trust", href: "/docs/tech/auth-security" },
      { title: "The Audit Trail", href: "/docs/admin/logs" }
    ]
  },
  "tech/database-schema": {
    title: "The Blueprint of Your Financial World",
    description: "Understanding the data models.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "Every number you see on your dashboard began its life as a row in a table."
        </p>
        <p>
          The schema is the skeletal system of Finance Buddy, hosted on robust PostgreSQL via Supabase. Everything is tied hierarchically to the <code>profiles</code> table using strict foreign keys with <code>CASCADE</code> deletions, meaning a user's digital footprint can be wiped flawlessly.
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-6">
          <li><strong>transactions & categories:</strong> The heartbeat of the cash flow engine.</li>
          <li><strong>debts & debt_payments:</strong> Relational models tracking your liabilities.</li>
          <li><strong>savings_accounts & savings_contributions:</strong> The vaults holding your intentional wealth.</li>
          <li><strong>wishlist:</strong> Goals tracked with precision.</li>
          <li><strong>audit_log:</strong> The unalterable history of system events.</li>
        </ul>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">The Genius Move</h4>
          <p className="text-foreground">
            Study the schema before writing a line of code. Data structures dictate the algorithm, not the other way around.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "How Finance Buddy Thinks", href: "/docs/tech/architecture" },
      { title: "The Architecture of Trust", href: "/docs/tech/auth-security" },
      { title: "The Ledger of Your Life", href: "/docs/features/transactions" }
    ]
  },
  "tech/auth-security": {
    title: "The Architecture of Trust",
    description: "How data is protected.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "Your financial data is the most personal data you own. It deserves the strongest protection."
        </p>
        <p>
          Security in Finance Buddy is pushed down to the absolute lowest layer: the database. Through Supabase GoTrue Auth and PostgreSQL Row Level Security (RLS), your data is cryptographically isolated.
        </p>
        <p>
          A user can only query rows where the <code>user_id</code> matches their active JWT. The frontend client has zero power to bypass this. Even when the server needs to perform administrative actions, it uses an isolated Service Role Client completely detached from the browser environment. OAuth flows (like Google sign-in) and secure password resets are handled with the same paranoid level of security.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">Pro Tip</h4>
          <p className="text-foreground">
            Never expose the Service Role key to the client. The moment the server relinquishes control, the fortress falls.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "How Finance Buddy Thinks", href: "/docs/tech/architecture" },
      { title: "The Blueprint of Your Financial World", href: "/docs/tech/database-schema" },
      { title: "The Hierarchy of Trust", href: "/docs/admin/roles" }
    ]
  },
  "changelog/v1.0.0": {
    title: "Version 1.0.0",
    description: "The genesis release of Finance Buddy.",
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4">
          "Every great system starts with a single, undeniable truth."
        </p>
        <p>
          Welcome to Finance Buddy v1.0.0. This release establishes the foundational mechanics of the platform, transforming raw transactional data into a philosophical wealth engine.
        </p>
        
        <SectionHeading>Core Foundations</SectionHeading>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Invite-Only Auth:</strong> Secured entry through a strict Admin approval gatekeeper process.</li>
          <li><strong>Transactions Engine:</strong> Full logging of income and expenses, strictly tied to categorical chapters.</li>
          <li><strong>Budgets:</strong> Intentional spending limits with proactive progress tracking.</li>
        </ul>

        <SectionHeading>Advanced Modules</SectionHeading>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Savings Vaults:</strong> Atomic balance additions ensuring flawless tracking of dedicated wealth pools.</li>
          <li><strong>Debt Tracking:</strong> EMI calculation engine and liability subtraction from Net Worth.</li>
          <li><strong>Wishlist Ledger:</strong> Targeted goal tracking for future aspirations.</li>
          <li><strong>Intelligent Reporting:</strong> "All Time" metrics, trend analysis, and behavioral visualizations.</li>
        </ul>

        <SectionHeading>Risk & Intelligence</SectionHeading>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Live Formulas:</strong> Real-time recalculation of Lifetime Savings and True Net Worth on every transaction.</li>
          <li><strong>Financial Risk Warnings:</strong> Pre-transaction simulated alerts (Caution/Warning/Critical) intercepting dangerous financial behavior before it's logged.</li>
          <li><strong>GitBook-Style Documentation:</strong> The implementation of this very documentation system, built with a narrative-driven focus on financial philosophy.</li>
        </ul>
        
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <h4 className="text-primary font-bold mb-2 uppercase text-sm tracking-wider">The Path Forward</h4>
          <p className="text-foreground">
            Version 1.0.0 is just the beginning. Future iterations will focus on advanced integrations, automated intelligence, and deeper predictive analytics.
          </p>
        </div>
      </div>
    ),
    relatedTopics: [
      { title: "The Beginning of Financial Clarity", href: "/docs/getting-started" },
      { title: "How Finance Buddy Thinks", href: "/docs/tech/architecture" }
    ]
  }
};
