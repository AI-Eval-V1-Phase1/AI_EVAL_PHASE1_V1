import { useEffect } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CardContainerOnBoarding from "./CardContainerOnBoarding";
// css is in card.css

interface CardConfirmationProps {
  /** Link text shown to the user */
  pageNavigateLink?: string;
  /** Route path to navigate to when the link is clicked (e.g. /vendorSelfAttestation/:token). If omitted, uses "/" */
  navigateTo?: string;
  /** Optional sign-in link text (e.g. "Sign in") */
  signinLinkText?: string;
  /** Optional sign-in route (e.g. "/login") – shown when signinLinkText is set */
  signinLinkTo?: string;
  /** When set, redirect to this path after delay (e.g. for admin after vendor onboarding → sign in) */
  redirectTo?: string;
  /** Delay in ms before redirect (default 5000) */
  redirectAfterMs?: number;
}

const CardConfirmation = ({
  pageNavigateLink,
  navigateTo,
  signinLinkText,
  signinLinkTo,
  redirectTo,
  redirectAfterMs = 5000,
}: CardConfirmationProps) => {
  const navigate = useNavigate();
  const linkTo = navigateTo && navigateTo.trim() !== "" ? navigateTo : "/";
  const linkText = pageNavigateLink ?? "Continue";

  useEffect(() => {
    if (!redirectTo || redirectTo.trim() === "") return;
    const t = setTimeout(() => navigate(redirectTo, { replace: true }), redirectAfterMs);
    return () => clearTimeout(t);
  }, [redirectTo, redirectAfterMs, navigate]);

  return (
    <CardContainerOnBoarding>
      <div className="onboarding_setup_card">
        <CheckCircle className="confirm_onboarding" />
        <h2>You're all set!</h2>
        <p>
          Your profile has been configured. This information will be used to
          pre-fill assessment fields and personalize your experience on the
          platform.
        </p>
        <Link to={linkTo}>
          {linkText} <ArrowRight />
        </Link>
        {signinLinkText && signinLinkTo && signinLinkTo.trim() !== "" && (
          <p style={{ marginTop: "1rem" }}>
            <Link to={signinLinkTo}>{signinLinkText}</Link>
          </p>
        )}
        {redirectTo && redirectTo.trim() !== "" && (
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
            Redirecting to sign in in a few seconds…
          </p>
        )}
      </div>
    </CardContainerOnBoarding>
  );
};

export default CardConfirmation;
